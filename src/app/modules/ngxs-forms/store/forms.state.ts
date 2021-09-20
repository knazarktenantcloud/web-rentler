import { Injectable } from '@angular/core';
import { Selector, State, Store } from '@ngxs/store';
import { initFormsStateModel } from '@app/modules/ngxs-forms/models/todo.model';

@State({
	name: 'forms',
	defaults: initFormsStateModel,
})
@Injectable()
export class FormsState {
	constructor() {}

	@Selector()
	static todoForm(state: any) {
		return state.todoForm;
	}
}
