import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { CommonHttpOptions, CommonHttpParams } from '@app/core/interfaces/common-http-options.interface';
import { CustomQueryEncoderHelper, ParamsTrimmerHelper } from '@app/helpers';

import { clone } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class ApiService {
	defaultOptions: CommonHttpOptions = {
		withCredentials: true,
		headers: {
			'X-Requested-With': 'XMLHttpRequest',
		},
	};

	constructor(private http: HttpClient) {}

	private formatErrors(error: any | null) {
		return throwError(error);
	}

	get<T>(path: string, params?: CommonHttpParams): Observable<T> {
		const options = clone(this.defaultOptions);

		options.params = new HttpParams({
			encoder: new CustomQueryEncoderHelper(),
			fromObject: params || {},
		});

		return this.http.get<T>(`${environment.api_url}${path}`, options).pipe(catchError(this.formatErrors));
	}

	put<T>(path: string, body: any | null): Observable<T> {
		const prepData = ParamsTrimmerHelper.trimParams(body);

		return this.http
			.put<T>(`${environment.api_url}${path}`, prepData, this.defaultOptions)
			.pipe(catchError(this.formatErrors));
	}

	post<T>(path: string, body: any | null): Observable<T> {
		const isFormData = body instanceof FormData;
		const prepData = isFormData ? body : ParamsTrimmerHelper.trimParams(body);

		return this.http
			.post<T>(`${environment.api_url}${path}`, prepData, this.defaultOptions)
			.pipe(catchError(this.formatErrors));
	}

	delete<T>(path: string, id: number): Observable<T> {
		return this.http
			.delete<T>(`${environment.api_url}${path}/${id}`, this.defaultOptions)
			.pipe(catchError(this.formatErrors));
	}
}
