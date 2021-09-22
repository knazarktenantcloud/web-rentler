import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TodoState } from '@app/modules/ngxs-tutorial/modules/todo/state/todo.state';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Todo } from '@app/modules/ngxs-tutorial/modules/todo/models/todo.model';
import { AddTodo, SetSelectedTodo, UpdateTodo } from '@app/modules/ngxs-tutorial/modules/todo/actions/todo.actions';
import { ValidationManager } from '@app/helpers/validators/validation-manager';

@Component({
	selector: 'app-todo-form',
	templateUrl: './todo-form.component.html',
	styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent implements OnInit, OnDestroy {
	@Select(TodoState.getSelectedTodo) selectedTodo: Observable<Todo>;
	@Select(TodoState.formErrors) errors$: Observable<any>;
	editTodo = false;
	manager: ValidationManager;

	private subscription = new Subscription();

	constructor(private store: Store) {}

	get form(): FormGroup {
		return this.manager.getForm();
	}

	get value() {
		return this.manager.getData();
	}

	ngOnInit() {
		this.manager = new ValidationManager({
			userId: 'required',
			title: 'required',
		});

		this.form.valueChanges.subscribe(() => {
			console.log(this.manager.getErrors(), 'getErrors');
		});

		this.subscription.add(
			this.selectedTodo.subscribe((todo) => {
				if (todo) {
					this.form.patchValue({
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

		this.subscription.add(
			this.errors$.subscribe((err) => {
				if (err?.errors) {
					this.manager.setErrors(err?.errors);
				}
			})
		);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	onSubmit() {
		// stop here if form is invalid
		if (!this.manager.isValid()) {
			return;
		}

		if (this.editTodo) {
			this.store.dispatch(new UpdateTodo(this.value, this.value.id)).subscribe(() => {
				this.clearForm();
			});
		} else {
			this.store.dispatch(new AddTodo(this.value)).subscribe(() => {
				this.clearForm();
			});
		}
	}

	clearForm() {
		this.form.reset();
		this.store.dispatch(new SetSelectedTodo(null));
	}
}
