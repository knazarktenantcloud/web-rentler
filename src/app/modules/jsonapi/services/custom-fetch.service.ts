import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config, IResponseObject } from '@datx/jsonapi';
// import { IResponseHeaders } from '@datx/utils';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CustomFetchService {
	constructor(private readonly httpClient: HttpClient) {}

	public async fetch(
		method: string,
		url: string,
		body?: unknown,
		headers: Record<string, string> = {},
		fetchOptions?: { takeUntil$?: Observable<void> }
	): Promise<IResponseObject> {
		const takeUntil$: Observable<void> | undefined = fetchOptions?.takeUntil$;

		const requestHeaders = {
			...config.defaultFetchOptions.headers,
			...headers,
		};

		let request$ = this.httpClient
			.request(method, url, {
				observe: 'response',
				responseType: 'json',
				headers: requestHeaders,
				body,
			})
			.pipe(
				map((response) => ({
					data: response.body,
					headers: response.headers as unknown,
					requestHeaders,
					status: response.status,
				}))
			);

		if (takeUntil$) {
			request$ = request$.pipe(takeUntil(takeUntil$));
		}

		try {
			const d = await request$.toPromise();

			if (d === undefined) {
				return { status: -1 }; // Signal to DatX that it shouldn't fail, but shouldn't cache either
			}

			// tslint:disable-next-line: no-any
			return d as any;
		} catch (e) {
			console.error(e);
			throw e;
		}
	}
}
