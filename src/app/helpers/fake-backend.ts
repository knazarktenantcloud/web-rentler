import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpResponse,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
	constructor() {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// array in local storage for registered users
		const users: any[] = JSON.parse(<string>localStorage.getItem('users')) || [
			{
				id: 1,
				email: 'knazark@rentler.com',
				first_name: 'Nazar',
				last_name: 'Test',
			},
		];

		// wrap in delayed observable to simulate server api call
		return (
			of(null)
				.pipe(
					mergeMap(() => {
						// welcome
						if (request.url.endsWith('/user') && request.method === 'GET') {
							if (users.length) {
								// if login details are valid return 200 OK with user details and fake jwt token
								const body = {
									id: 1,
									email: 'knazark@tenantcloud.com',
									first_name: 'Nazar',
									last_name: 'Test',
									role: 'pro',
									welcome: false,
								};

								return of(new HttpResponse({ status: 200, body: body }));
							} else {
								// else return 400 bad request
								return throwError({ error: { message: 'Email or password is incorrect' } });
							}
						}

						if (request.url.endsWith('/todos') && request.method === 'GET') {
							// check for fake auth token in header and return users if valid, this security is implemented server side in a real application
							return of(
								new HttpResponse({
									status: 200,
									body: [
										{
											userId: 1,
											id: 1,
											title: 'delectus aut autem',
											completed: false,
										},
										{
											userId: 1,
											id: 2,
											title: 'quis ut nam facilis et officia qui',
											completed: false,
										},
									],
								})
							);
						}

						// register user
						if (request.url.endsWith('/todos') && request.method === 'POST') {
							return throwError({
								error: {
									errors: {
										userId: ['Must be integer'],
										country: ['Required field'],
									},
									message: 'Ooops',
								},
							});
						}

						// get users
						if (request.url.endsWith('/users') && request.method === 'GET') {
							// check for fake auth token in header and return users if valid, this security is implemented server side in a real application
							if (
								request.headers.get('Authorization') ===
								'Bearer ' + JSON.parse(<string>localStorage.getItem('currentUser')).token
							) {
								return of(new HttpResponse({ status: 200, body: users }));
							} else {
								// return 401 not authorised if token is null or invalid
								return throwError({ status: 401, error: { message: 'Unauthorised' } });
							}
						}

						// get user by id
						if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
							// check for fake auth token in header and return user if valid, this security is implemented server side in a real application
							if (
								request.headers.get('Authorization') ===
								'Bearer ' + JSON.parse(<string>localStorage.getItem('currentUser')).token
							) {
								// find user by id in users array
								const urlParts = request.url.split('/');
								const id = parseInt(urlParts[urlParts.length - 1]);
								const matchedUsers = users.filter((user) => {
									return user.id === id;
								});
								const user = matchedUsers.length ? matchedUsers[0] : null;

								return of(new HttpResponse({ status: 200, body: user }));
							} else {
								// return 401 not authorised if token is null or invalid
								return throwError({ status: 401, error: { message: 'Unauthorised' } });
							}
						}

						// register user
						if (request.url.endsWith('/users/register') && request.method === 'POST') {
							// get new user object from post body
							const newUser = request.body;

							// validation
							const duplicateUser = users.filter((user) => {
								return user.email === newUser.email;
							}).length;

							if (duplicateUser) {
								return throwError({
									error: {
										errors: { email: 'Registered', password: '12345' },
										message: 'Email "' + newUser.email + '" is already taken',
									},
								});
							}

							// save new user
							newUser.id = users.length + 1;
							users.push(newUser);
							localStorage.setItem('users', JSON.stringify(users));
							// respond 200 OK
							return of(new HttpResponse({ status: 200 }));
						}

						// delete user
						if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
							// check for fake auth token in header and return user if valid, this security is implemented server side in a real application
							if (
								request.headers.get('Authorization') ===
								'Bearer ' + JSON.parse(<string>localStorage.getItem('currentUser')).token
							) {
								// find user by id in users array
								const urlParts = request.url.split('/');
								const id = parseInt(urlParts[urlParts.length - 1]);
								for (let i = 0; i < users.length; i++) {
									const user = users[i];
									if (user.id === id) {
										// delete user
										users.splice(i, 1);
										// localStorage.setItem('users', JSON.stringify(users));
										break;
									}
								}

								// respond 200 OK
								return of(new HttpResponse({ status: 200 }));
							} else {
								// return 401 not authorised if token is null or invalid
								return throwError({ status: 401, error: { message: 'Unauthorised' } });
							}
						}

						// pass through any requests not handled above
						return next.handle(request);
					})
				)

				// call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
				.pipe(materialize())
				.pipe(delay(500))
				.pipe(dematerialize())
		);
	}
}

export const fakeBackendProvider = {
	// use fake backend in place of Http service for backend-less development
	provide: HTTP_INTERCEPTORS,
	useClass: FakeBackendInterceptor,
	multi: true,
};
