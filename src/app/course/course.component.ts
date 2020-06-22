import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
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
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { createHttpObservable } from '../common/util';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId: string;

    course$: Observable<Course>;
    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);



    }

    ngAfterViewInit() {

      const searchLessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
      .pipe(
        map(event => event.target.value),
        debounceTime(400),
        // debounceTime(x) will wait for x milliseconds to validate a value
        // that is if in the x milliseconds it receives another values then it discards the original value
        // and starts a new timer for the new value for x milliseconds
        distinctUntilChanged(),
        // the above operator will check if the new value received is it same as the original in that period of time
        // like if we type shift and then press m to get capital "M" then we get two key ups but they are the same
        // we have just used shift to get capital M
        // So the operation is one but without distinctUntilChanged() it would be considered as two events
        // so with distinctUntilChanged() we prevent the duplication of events
        switchMap(search => this.loadLessons(search))
      );
      const initialLessons$ = this.loadLessons();
      this.lessons$ = concat(initialLessons$, searchLessons$);

    }

    loadLessons(search = ''): Observable<Lesson[]> {
      return createHttpObservable(`/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
      .pipe(
        map(res => res['payload'])
      );
    }




}
