import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { AuthenticationService } from '@app/core/services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor() {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((err) => {
				const error = err.error || err.message;

				if (err.status === 401) {
					// auto logout if 401 response returned from api
					// this.authenticationService.logout();
					location.reload();
				}

				// if (err.status === 403) {
				// 	location.href = '/';
				// }

				// this.snackBar.open(error.message, 'close');
				return throwError(error);
			})
		);
	}
}
