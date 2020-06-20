import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {fromEvent} from 'rxjs';
import {concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    form: FormGroup;
    course:Course;

    @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

    @ViewChild('searchInput', { static: true }) searchInput : ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngOnInit() {
      // So for continous saving and drafting of values
      // from the form. The form provides an observable
      this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        concatMap(changes =>
          this.saveCourse(changes)
        )
        // concatMap is taking up all the changes in the form
        // converting them into an observable
        // subscribing to it
        // and at the end concating it the original observable
      )
      .subscribe(changes => {
        // fromPromise is an inbuilt rxjs method that takes a promise and creates an rxjs observable

        // snince now concatMap() has come hence we dont require below statements
        // const saveCourse$ = this.saveCourse(changes);

        // saveCourse$.subscribe();
      });
      // valueChanges observable is a good example of stream of values




    }

    saveCourse(changes) {
      return fromPromise(fetch(`/api/courses/${this.course.id}`, {
        method: 'PUT',
        body: JSON.stringify(changes),
        headers: {
          'Content-Type': 'application/json'
        }
      }));
    }



    ngAfterViewInit() {


    }



    close() {
        this.dialogRef.close();
    }

}
