import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TodoState } from '@app/modules/ngxs-tutorial/modules/todo/state/todo.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Todo } from '@app/modules/ngxs-tutorial/modules/todo/models/todo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AddTodo, SetSelectedTodo, UpdateTodo } from '@app/modules/ngxs-tutorial/modules/todo/actions/todo.actions';

@Component({
	selector: 'app-todo-form',
	templateUrl: './app-todo-form.component.html',
})
export class AppTodoFormComponent implements OnInit, OnDestroy {
	@Select(TodoState.getSelectedTodo) selectedTodo: Observable<Todo>;
	@Select(TodoState.formErrors) errors$: Observable<any>;
	todoForm: FormGroup;
	editTodo = false;

	private subscription = new Subscription();

	constructor(private fb: FormBuilder, private store: Store, private route: ActivatedRoute, private router: Router) {
		this.todoForm = this.fb.group({
			id: [''],
			userId: ['', Validators.required],
			title: ['', Validators.required],
		});
	}

	ngOnInit() {
		this.subscription.add(
			this.selectedTodo.subscribe((todo) => {
				if (todo) {
					this.todoForm.patchValue({
						id: todo.id,
						userId: todo.userId,
						title: todo.title,
					});
					this.editTodo = true;
				} else {
					this.editTodo = false;
				}
			})
		);

		// this.subscription.add(
		// 	this.errors$.subscribe((err) => {
		// 		if (err?.errors) {
		// 			this.setErrors(err.errors);
		// 		}
		// 	})
		// );
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	get f() {
		return this.todoForm.controls;
	}

	onSubmit() {
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
