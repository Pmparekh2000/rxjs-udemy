import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  throttle,
  throttleTime,
} from 'rxjs/operators';
import { merge, Observable, concat, interval, fromEvent, forkJoin } from 'rxjs';
import { Lesson } from '../model/lesson';
import { createHttpObservable } from '../common/util';
import { debug, setrxJsLogginLevel } from '../common/debug';
import { RxJsLoggingLevel } from './../common/debug';

@Component({
  selector: "course",
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
})
export class CourseComponent implements OnInit, AfterViewInit {
  courseId: string;

  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params['id'];

    const course$ = createHttpObservable(`/api/courses/${this.courseId}`)

    // this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
    // .pipe(
    //   debug(RxJsLoggingLevel.INFO, 'course '),
    // );

    // setrxJsLogginLevel(RxJsLoggingLevel.DEBUG);

    const lesson$ = this.loadLessons();
    // So here the backend request is made togehter by lessons and course
    // but only when both of them return with the results
    // they get subscribed
    // this is possible using forkJoin
    // Now if multiple values are emitted then the last value is considered
    forkJoin(course$, lesson$)
    .pipe(
      tap(([course, lessons]) => {
        console.log('course', course);
        console.log('lessons', lessons);
      })
    )
    .subscribe();
  }

  ngAfterViewInit() {
    // const searchLessons$ = fromEvent<any>(
    //   this.input.nativeElement,
    //   'keyup'
    // ).pipe(
    //   map((event) => event.target.value),
    //   debounceTime(400),
    //   // debounceTime(x) will wait for x milliseconds to validate a value
    //   // that is if in the x milliseconds it receives another values then it discards the original value
    //   // and starts a new timer for the new value for x milliseconds
    //   distinctUntilChanged(),
    //   // the above operator will check if the new value received is it same as the original in that period of time
    //   // like if we type shift and then press m to get capital "M" then we get two key ups but they are the same
    //   // we have just used shift to get capital M
    //   // So the operation is one but without distinctUntilChanged() it would be considered as two events
    //   // so with distinctUntilChanged() we prevent the duplication of events
    //   switchMap((search) => this.loadLessons(search))
    // );



    // const initialLessons$ = this.loadLessons();

    fromEvent<any>(
      this.input.nativeElement,
      'keyup'
    ).pipe(
      map((event) => event.target.value),
      startWith(''),
      // debug( RxJsLoggingLevel.INFO, 'search '),
      debounceTime(500),
      // debounceTime(x) will wait for x milliseconds to validate a value
      // that is if in the x milliseconds it receives another values then it discards the original value
      // and starts a new timer for the new value for x milliseconds
      distinctUntilChanged(),
      // the above operator will check if the new value received is it same as the original in that period of time
      // like if we type shift and then press m to get capital "M" then we get two key ups but they are the same
      // we have just used shift to get capital M
      // So the operation is one but without distinctUntilChanged() it would be considered as two events
      // so with distinctUntilChanged() we prevent the duplication of events
      switchMap((search) => this.loadLessons(search)),
      // debug(RxJsLoggingLevel.INFO, 'lessons value')
    );
  }

  loadLessons(search = ''): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map((res) => res['payload']));
  }
}
