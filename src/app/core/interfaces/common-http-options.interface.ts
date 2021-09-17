import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface CommonHttpOptions {
	headers?:
		| HttpHeaders
		| {
				[header: string]: string | string[];
		  };
	observe?: 'body';
	params?:
		| HttpParams
		| {
				[param: string]: string | string[];
		  };
	reportProgress?: boolean;
	responseType?: 'json';
	withCredentials?: boolean;
}

export interface CommonHttpParams {
	[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
}
