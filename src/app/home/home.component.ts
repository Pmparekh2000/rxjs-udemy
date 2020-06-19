import {Component, OnInit} from '@angular/core';
import {Course} from "../model/course";
import {interval, Observable, of, timer, noop} from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap, filter } from 'rxjs/operators';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  begineersCourses: Course[];

  advanceCourses: Course[];


    constructor() {

    }

    ngOnInit() {

      const http$ = createHttpObservable('/api/courses');

      // To copy an observable into another observable, we need the pipe operator
      const courses$ = http$
      .pipe(
        map(res => Object.values(res['payload']))
        // Object.values(...) returns an array of a given object
      );
      // pipe(...) helps to link multiple operators together
      // The operators get executed in the sequence in which they are specified.

      courses$.subscribe(courses => {
        // The below filter operator is not an rxjs filter operator
        // Its a plain filter operator of js.
          this.begineersCourses = courses.filter(course => course.category === 'BEGINNER');
          this.advanceCourses = courses.filter(course => course.category === 'ADVANCED');
        },
        noop,
        // noop => No operations.
        () => console.log('completed')
      );

    }

}
