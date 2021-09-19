import { Observable } from 'rxjs';
import { ApiService } from '@app/core/services/api.service';

export class HttpService {
	constructor(private apiService: ApiService, private api: string = '') {}

	get<T>(): Observable<T> {
		return this.apiService.get<T>(this.api);
	}

	post<T>(payload: T) {
		return this.apiService.post<T>(this.api, payload);
	}

	put<T>(payload: T, id: number): Observable<T> {
		return this.apiService.put<T>(this.api, id, payload);
	}

	delete<T>(id: number): Observable<T> {
		return this.apiService.delete<T>(this.api, id);
	}
}
