import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TodoState } from '@app/modules/ngxs-tutorial/modules/todo/state/todo.state';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Todo } from '@app/modules/ngxs-tutorial/modules/todo/models/todo.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AddTodo, SetSelectedTodo, UpdateTodo } from '@app/modules/ngxs-tutorial/modules/todo/actions/todo.actions';

@Component({
	selector: 'app-todo-form',
	templateUrl: './todo-form.component.html',
	styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent implements OnInit {
	@Select(TodoState.getSelectedTodo) selectedTodo: Observable<Todo>;
	todoForm: FormGroup;
	editTodo = false;

	constructor(private fb: FormBuilder, private store: Store, private route: ActivatedRoute, private router: Router) {
		this.todoForm = this.fb.group({
			id: [''],
			userId: ['', Validators.required],
			title: ['', Validators.required],
		});
	}

	ngOnInit() {
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
		});
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
