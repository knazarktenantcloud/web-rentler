import { InjectionToken } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';
import { HttpService } from '@app/core/services/http.service';

export const TodoService = new InjectionToken<string>('TodoService');

export const TodoFactory = (apiService: ApiService) => {
	return new HttpService(apiService, '/todos');
};

export const TodoServiceProvider = {
	provide: TodoService,
	useFactory: TodoFactory,
	deps: [ApiService],
};
