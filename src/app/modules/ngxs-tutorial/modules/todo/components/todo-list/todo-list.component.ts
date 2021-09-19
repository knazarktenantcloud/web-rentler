import { Component, OnInit } from '@angular/core';
import { TodoState } from '@app/modules/ngxs-tutorial/modules/todo/state/todo.state';
import { Todo } from '@app/modules/ngxs-tutorial/modules/todo/models/todo.model';
import { Observable } from 'rxjs';
import { DeleteTodo, GetTodos, SetSelectedTodo } from '@app/modules/ngxs-tutorial/modules/todo/actions/todo.actions';
import { Select } from '@ngxs/store';
import { Store } from '@ngxs/store';

@Component({
	selector: 'app-todo-list',
	templateUrl: './todo-list.component.html',
	styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
	@Select(TodoState.getTodoList) todos$: Observable<Todo[]>;

	constructor(private store: Store) {}

	ngOnInit(): void {
		this.store.dispatch(new GetTodos());
	}

	deleteTodo(id: number) {
		this.store.dispatch(new DeleteTodo(id));
	}

	editTodo(payload: Todo) {
		this.store.dispatch(new SetSelectedTodo(payload));
	}
}
