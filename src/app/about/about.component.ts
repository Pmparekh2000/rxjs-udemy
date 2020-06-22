import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { interval, timer, Observable, noop, of, concat, merge } from 'rxjs';
import { createHttpObservable } from '../common/util';
import { map } from 'rxjs/operators';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {

// -------------------------------------------------------------------------------------------------------------------
    // Below are the examples of streams.

    // The first two below are multi-valued streams as they continue to emit values infinitely
    // So they can never be completed hence called multi-valued streams
    // An important notion about streams is that 1.)Can they be completed and 2.)When will they be copleted.
    // 1. The below one is an infinte stream which will keep on going.
// --------------------------------------------------------------------------------------------------------------------

    // document.addEventListener('click', (evt) => {
    //   console.log(evt);
    // });


    // let c = 0;
    // setInterval(() => {
    //   console.log(c);
    //   c = c + 1;
    // }, 1000);

// -------------------------------------------------------------------------------------------------------------------

  // The below stream will emit a value and will be completed but the above ones will emit multiple values and will never be completed.

// -------------------------------------------------------------------------------------------------------------------

  //   setTimeout(() => {
  //     console.log('Timeout has elapsed');
  //   }, 3000);
  // }

// -------------------------------------------------------------------------------------------------------------------

  // Use of rxjs => "Reactive extensions for java-script"
  // Now if we want to combine all the above streams together then its a complex task
  // sometimes called as "call-back hell"
  // So to solve the above problem rxjs is introduced.
  // Its a library which makes it very simple to combine streams and values together in a maintainable way.

// -------------------------------------------------------------------------------------------------------------------

// -------------------------------------------------------------------------------------------------------------------

    // Now creating a blue print or a defination or a declaration of streams

// -------------------------------------------------------------------------------------------------------------------

    // const interval$ = interval(1000);

// -------------------------------------------------------------------------------------------------------------------

    // The above line has created a stream blue-print called interval$ of the type number
    // and to access those streams of number we need to subscribe to it.
    // Note - The interval$ is of the type Observable
    // We always need to subscribe to an observable to access its values.

// -------------------------------------------------------------------------------------------------------------------

    // interval$.subscribe(val => {
    //   console.log('stream 1 ' + val);
    // });

// -------------------------------------------------------------------------------------------------------------------

    // On subscribing the stream starts emitting values to the one who has subscribed to it. Which can now be accessed.

// -------------------------------------------------------------------------------------------------------------------

    // interval$.subscribe(val => {
    //   console.log('stream 2 ' + val);
    // });

// -------------------------------------------------------------------------------------------------------------------

    // Another type of stream creation

// -------------------------------------------------------------------------------------------------------------------

    // const interval1$ = timer(3000, 2000);

// -------------------------------------------------------------------------------------------------------------------

  // Timer is another type of stream that emits value after a starting delay of x seconds and then continously emits values
  // after every y seconds.

// -------------------------------------------------------------------------------------------------------------------

    //   interval1$.subscribe(val => {
    //     console.log('stream 3 ' + val);
    //   });
    // }

// -------------------------------------------------------------------------------------------------------------------

  // Now using the click stream using the from event

// -------------------------------------------------------------------------------------------------------------------

    // const click$ = fromEvent(document, 'click');
    // click$.subscribe(evt => {
    //   console.log(evt);
    // });

// -------------------------------------------------------------------------------------------------------------------

  // Protocols that subscribe follow
  // 1.) They will never emit values from stream after completion or after getting error or after getting unsbscribed
  // This is called as subscriber's aggrement
  // We can ubscribe from the subscriber at any moment of time.
  // An example of unscription is below.

// -------------------------------------------------------------------------------------------------------------------


    // const interval2$ = timer(3000, 1000);
    // const x = interval2$.subscribe(
    //   evt => console.log(evt),
    //   err => console.log(err),
    //   () => console.log('completed')
    // );
    // setTimeout(() => {
    //   x.unsubscribe();
    // }, 8000);

    // const source1$ = of(1, 2, 3);
    // of function is used for defining any type of observables
    // const source2$ = of(4, 5, 6);
    // Now after decalring two observables we would like to combine those values emmited by them
    // But only after the first observable completes we would like to emit the values from the second obsevable
    // const source3$ = of(7, 8, 9);

    // const result$ = concat(source1$, source2$, source3$);
    // result$.subscribe(console.log);
    // So the key notion of concatination is the concept of completion
    // So if the observable is never completed no new observable would be subscribed
    // So here if instead of "of" we would have used interval stream which keeps on emitting values continously
    // Then source1$ and source3$ would never be subscribed and hence would never be used

    // merge example - ideal for performing long running operations in parallel and then getting the results combined
    // const interval1$ = interval(1000);
    // const interval2$ = interval1$.pipe(map(val => 10 * val));

    // const result$ = merge(interval1$, interval2$);

    // result$.subscribe(console.log);

    // const interval1$ = interval(1000);
    // const sub = interval1$.subscribe(console.log);
    // setTimeout(() => {
    //   sub.unsubscribe();
    // }
    //   , 5000);

    const http$ = createHttpObservable('/api/courses');
    const sub = http$.subscribe(console.log);
    setTimeout(() => {
      sub.unsubscribe();
    }, 0);
  }

}
