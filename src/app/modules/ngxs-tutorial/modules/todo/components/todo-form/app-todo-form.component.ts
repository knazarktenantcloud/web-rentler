import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TodoState } from '@app/modules/ngxs-tutorial/modules/todo/state/todo.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Todo } from '@app/modules/ngxs-tutorial/modules/todo/models/todo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AddTodo, SetSelectedTodo, UpdateTodo } from '@app/modules/ngxs-tutorial/modules/todo/actions/todo.actions';
import { ErrorHandler } from '@app/helpers/error-handler';

@Component({
	selector: 'app-todo-form',
	templateUrl: './app-todo-form.component.html',
})
export class AppTodoFormComponent implements OnInit, OnDestroy {
	@Select(TodoState.getSelectedTodo) selectedTodo: Observable<Todo>;
	@Select(TodoState.formErrors) errors$: Observable<any>;
	todoForm: FormGroup;
	editTodo = false;

	mask = '+{7}(000)000-00-00';

	private subscription = new Subscription();

	constructor(
		private fb: FormBuilder,
		private store: Store,
		private route: ActivatedRoute,
		private router: Router,
		public errorHandler: ErrorHandler
	) {
		this.todoForm = this.fb.group({
			id: [''],
			userId: ['', Validators.required],
			title: [''],
			phone: [''],
		});

		this.errorHandler.handleErrors(this.todoForm);
	}

	ngOnInit() {
		this.subscription.add(
			this.selectedTodo.subscribe((todo) => {
				if (todo) {
					this.todoForm.patchValue({
						id: todo.id,
						userId: todo.userId,
						title: todo.title,
						phone: todo.phone,
					});
					this.editTodo = true;
				} else {
					this.editTodo = false;
				}
			})
		);

		this.subscription.add(
			this.errors$.subscribe((err) => {
				if (err?.errors) {
					this.errorHandler.organizeServerErrors(err.errors, this.todoForm);
				}
			})
		);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get f() {
		return this.todoForm.controls;
	}

	onSubmit() {
		console.log(this.todoForm.value);
		if (this.editTodo) {
			this.store.dispatch(new UpdateTodo(this.todoForm.value, this.todoForm.value.id)).subscribe(() => {
				this.clearForm();
			});
		} else {
			this.store.dispatch(new AddTodo(this.todoForm.value)).subscribe(() => {
				this.clearForm();
			});
		}
	}

	clearForm() {
		this.todoForm.reset();
		this.store.dispatch(new SetSelectedTodo(null));
	}
}
