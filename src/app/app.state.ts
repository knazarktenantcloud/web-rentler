import { State, Selector, Action, StateContext } from '@ngxs/store';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

export class HandledFormError {
	static readonly type = 'HandledFormError';

	constructor(public formGroup: FormGroup, public errors: ValidationErrors) {}
}

@State<ValidationErrors>({
	name: 'validationErrors',
	defaults: {},
})
export class AppState {
	@Selector()
	static getErrors(state: ValidationErrors) {
		return state.errors;
	}

	@Action(HandledFormError)
	handledFormError(
		{ getState, patchState }: StateContext<ValidationErrors>,
		{ formGroup, errors }: ValidationErrors
	) {
		const state = getState();
		// const _errors = {
		// 	...state.errors,
		// 	errors,
		// };

		this.setErrors(formGroup, errors);
		// patchState(_errors);
	}

	setErrors(formGroup: FormGroup, errors: ValidationErrors) {
		for (const prop in errors) {
			if (Object.prototype.hasOwnProperty.call(errors, prop)) {
				if (errors[prop]) {
					const formControl = formGroup.get(prop);

					if (formControl) {
						console.log(errors[prop], 'errors[prop]');
						// this.errors[prop] = errors[prop];
						formControl.setErrors({ invalid: true });
					}
				}
			}
		}

		const invalid = <FormControl[]>Object.keys(formGroup.controls)
			.map((key) => formGroup.controls[key])
			.filter((ctl) => ctl.invalid);

		if (invalid.length > 0) {
			const invalidElem: any = invalid[0];
			invalidElem.nativeElement.focus();
		}
	}
}
