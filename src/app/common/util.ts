import { Observable } from 'rxjs';

export function createHttpObservable(url: string) {
  return Observable.create(observer => {

    // fetch can also be called as an api
    // fetch is also a promise
    fetch(url)
      .then(response => {
        return response.json();
        // .json() method returns a "Promise".
      })
      .then(body => {
        // We are using here then since we are getting a "Promise" from "response.json()".
        observer.next(body);
        // .next() is the method used to emit the values in the observable
        // By writing the below statement we respect the observers agreement
        observer.complete();
      })
      .catch(err => {
        observer.error(err);
      });
      // Note - Please follow the observable contract if creating the custom observable
  // fetch('../.../...') is a type of promise
  // Now promises are not like observables
  // They start to emit values after as soon as they are created

  });
  // Observable.create() is a method that helps us to create observables from scratch
  // Now the custom observable created dosen't emit values on its own.
  // We need to make an observer for it that helps us to get the values from the observable
  // Here the custom observable created is just a blue-print that creates a stream of values.
  // We just like before need to subscribe to the observable to get the values from the observer.

}
