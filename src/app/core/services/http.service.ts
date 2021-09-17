import { Observable } from 'rxjs';
import { ApiService } from '@app/core/services/api.service';

export class HttpService {
	constructor(private ApiService: ApiService, private api: string = '') {}

	get<T>(): Observable<T> {
		return this.ApiService.get<T>(this.api);
	}

	post<T>(payload: T): Observable<T> {
		return this.ApiService.post<T>(this.api, payload);
	}

	put<T>(payload: T): Observable<T> {
		return this.ApiService.put<T>(this.api, payload);
	}

	delete<T>(id: number): Observable<T> {
		return this.ApiService.delete<T>(this.api, id);
	}
}
