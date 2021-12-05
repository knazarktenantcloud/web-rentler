import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { ValidationErrorModel } from '../models/validation.model';
import { ClearAllValidationErrors, ClearValidationError, SetValidationErrors } from '../actions/validation.actions';

@State<ValidationErrorModel>({
	name: 'validation',
	defaults: {},
})
@Injectable()
export class ValidationState {
	@Action(SetValidationErrors)
	public setErrors({ patchState }: StateContext<ValidationErrorModel>, action: SetValidationErrors): void {
		patchState(action.data);
	}

	@Action(ClearValidationError)
	public clearError({ setState, getState }: StateContext<ValidationErrorModel>, action: ClearValidationError): void {
		const currentState = getState();
		const newState = { ...currentState };

		delete newState[action.name];

		setState(newState);
	}

	@Action(ClearAllValidationErrors)
	public clearAllErrors({ setState }: StateContext<ValidationErrorModel>): void {
		setState({});
	}
}
