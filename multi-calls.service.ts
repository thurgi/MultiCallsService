import { Observable, Subject } from 'rxjs';

export class MultiCallsService {
  private errors: { [key: string]: any } = [];
  private results: { [key: string]: any } = [];
  private nbCall: number = 0;
  private readonly calls: Subject<{ [key: string]: any }> = new Subject<{ [p: string]: any }[]>();

  public getObservable(): Observable<{ [p: string]: any }> {
    return this.calls;
  }

  public add(observable: Observable<any>, name?: string): this {
    this.nbCall++;
    observable.subscribe({
      error: e => this.ifError(e, name),
      next: r => this.IsSuccess(r, name)
    });
    return this;
  }

  private ifError(err, name?: string) {
    const message: string = err.message;
    if (name) {
      this.errors[name] = message;
    } else {
      this.errors.push(message);
    }
    this.endOfCall();
  }

  private IsSuccess(res, name?: string) {
    if (name) {
      this.results[name] = res;
    } else {
      this.results.push(res);
    }
    this.endOfCall();
  }

  private endOfCall() {
    this.nbCall--;
    if (this.nbCall === 0) {
      if (this.errors.length === 0) {
        this.calls.next(this.results);
      } else {
        this.calls.error(this.errors);
      }
    }
  }
}
