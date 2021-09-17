import { Injectable } from '@angular/core';
import {
	HttpErrorResponse,
	HttpResponse,
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { LoaderService } from '@app/core/services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
	private requests: HttpRequest<any>[] = [];

	constructor(private loaderService: LoaderService) {}

	removeRequest(request: HttpRequest<any>) {
		const i = this.requests.indexOf(request);
		if (i >= 0) {
			this.requests.splice(i, 1);
		}
		this.loaderService.isLoading.next(this.requests.length > 0);
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.requests.push(request);
		this.loaderService.isLoading.next(true);
		return new Observable((observer: Observer<any>) => {
			const subscription = next.handle(request).subscribe(
				(event) => {
					if (event instanceof HttpResponse) {
						this.removeRequest(request);
						observer.next(event);
					}
				},
				(err) => {
					this.removeRequest(request);
					observer.error(err);
				},
				() => {
					this.removeRequest(request);
					observer.complete();
				}
			);
			// teardown logic in case of cancelled requests
			return () => {
				this.removeRequest(request);
				subscription.unsubscribe();
			};
		});
	}
}
