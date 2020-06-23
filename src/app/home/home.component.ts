import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, timer, noop, throwError } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
  finalize,
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  begineersCourses$: Observable<Course[]>;

  advanceCourses$: Observable<Course[]>;

  constructor() {}

  ngOnInit() {
    const http$ = createHttpObservable("/api/courses");

    // To copy an observable into another observable, we need the pipe operator
    const courses$: Observable<Course[]> = http$.pipe(
      // catchError(err => {
      //   console.log('Error occured ', err);
      //   return throwError(err);
      // }),
      // finalize(() => {
      //   console.log('Finalize executed');

      // }),

      tap(() => console.log("Http resquest executed")),
      // tap is an observables that helps to produce a side-effect in observable chain
      map((res) => Object.values(res["payload"])),
      // Here we have two different subscriptions to two different observables ($courses)
      // and both are derived from the same "http$" observable
      // So as to prevent the application to make multiple subscription to fetch same data again and again is not good
      // So to solve this problem by using shareReplay which plays the stream once and makes its result avaiblable
      // to each new subscriber.

      shareReplay(),
      // shareReplay is an operator which helps in sharing http requests
      // Object.values(...) returns an array of a given object

      retryWhen((errors) => errors.pipe(delayWhen(() => timer(2000))))
    );
    courses$.subscribe();
    // pipe(...) helps to link multiple operators together
    // The operators get executed in the sequence in which they are specified.

    this.begineersCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "BEGINNER")
      )
    );

    this.advanceCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category === "ADVANCED")
      )
    );

    // courses$.subscribe(courses => {

    // -------------------------------------------------------------------------------------------------------------------
    // The below filter operator is not an rxjs filter operator
    // Its a plain filter operator of js.
    // -------------------------------------------------------------------------------------------------------------------

    // this.begineersCourses = courses.filter(course => course.category === 'BEGINNER');
    // this.advanceCourses = courses.filter(course => course.category === 'ADVANCED');
    // },
    // noop,
    // noop => No operations.
    // () => console.log('completed')
    // );
  }
}
