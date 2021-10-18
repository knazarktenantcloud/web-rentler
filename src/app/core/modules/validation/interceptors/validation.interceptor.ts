import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngxs/store';

import { SetValidationErrors } from '../actions/validation.actions';
import { ValidationErrorModel } from '../models/validation.model';

@Injectable()
export class ValidationInterceptor implements HttpInterceptor {
	constructor(private store: Store) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
			catchError((err) => {
				const errors: ValidationErrorModel = err.errors;

				this.store.dispatch(new SetValidationErrors(errors));

				return throwError(err);
			})
		);
	}
}
