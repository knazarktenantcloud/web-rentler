import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Todo } from '@app/modules/ngxs-tutorial/modules/todo/models/todo.model';
import {
	GetTodos,
	AddTodo,
	UpdateTodo,
	DeleteTodo,
	SetSelectedTodo,
} from '@app/modules/ngxs-tutorial/modules/todo/actions/todo.actions';
import { Inject, Injectable } from '@angular/core';
import { HttpService } from '@app/core/services/http.service';
import { TodoService } from '@app/modules/ngxs-tutorial/modules/todo/providers/todo.service.provider';

export interface TodoStateModel {
	todos: Todo[];
	selectedTodo: Todo | null;
}

@State<TodoStateModel>({
	name: 'todos',
	defaults: {
		todos: [],
		selectedTodo: null,
	},
})
@Injectable()
export class TodoState {
	constructor(@Inject(TodoService) private todoService: HttpService) {}

	@Selector()
	static getTodoList(state: TodoStateModel) {
		return state.todos;
	}

	@Selector()
	static getSelectedTodo(state: TodoStateModel) {
		return state.selectedTodo;
	}

	@Action(GetTodos)
	getTodos({ getState, setState }: StateContext<TodoStateModel>) {
		return this.todoService.get<Todo[]>().pipe(
			tap((result: Todo[]) => {
				const state = getState();
				setState({
					...state,
					todos: result,
				});
			})
		);
	}

	@Action(AddTodo)
	addTodo({ getState, patchState }: StateContext<TodoStateModel>, { payload }: AddTodo) {
		return this.todoService.post(payload).pipe(
			tap((result: Todo) => {
				const state = getState();
				patchState({
					todos: [...state.todos, result],
				});
			})
		);
	}

	@Action(UpdateTodo)
	updateTodo({ getState, setState }: StateContext<TodoStateModel>, { id, payload }: UpdateTodo) {
		return this.todoService.put<Todo>(payload, id).pipe(
			tap((result: Todo) => {
				const state = getState();
				const todoList = [...state.todos];
				const todoIndex = todoList.findIndex((item) => item.id === id);
				todoList[todoIndex] = result;
				setState({
					...state,
					todos: todoList,
				});
			})
		);
	}

	@Action(DeleteTodo)
	deleteTodo({ getState, setState }: StateContext<TodoStateModel>, { id }: DeleteTodo) {
		return this.todoService.delete(id).pipe(
			tap(() => {
				const state = getState();
				const filteredArray = state.todos.filter((item) => item.id !== id);
				setState({
					...state,
					todos: filteredArray,
				});
			})
		);
	}

	@Action(SetSelectedTodo)
	setSelectedTodoId({ getState, setState }: StateContext<TodoStateModel>, { payload }: SetSelectedTodo) {
		const state = getState();
		setState({
			...state,
			selectedTodo: payload,
		});
	}
}
