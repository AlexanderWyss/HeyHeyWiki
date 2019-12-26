import {Observable, Subscriber, Subscription} from 'rxjs';

export class ReemittingObserver<T> {

    private value: T;
    private observable: Observable<T>;
    private supplier: Subscriber<T>;

    constructor(observable: Observable<T>) {
        this.observable = new Observable(supplier => {
            this.supplier = supplier;
            return observable.subscribe(value => {
                supplier.next(value);
                this.value = value;
            });
        });
    }

    subscribe(observer?: (value: T) => void): Subscription {
        const subscription = this.observable.subscribe(observer);
        if (this.value) {
            this.supplier.next(this.value);
        }
        return subscription;
    }

    getValue(): T {
        return this.value;
    }
}
