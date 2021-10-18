import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ErrorMessageHelper } from '@app/helpers/error-message.helper';

@Injectable({
	providedIn: 'root',
})
export class ErrorHandler {
	private form: FormGroup;
	private serverError: any;
	private errorObject: any;
	private message: string;

	private static hasError(control: AbstractControl): boolean {
		return control.invalid && (control.dirty || control.touched);
	}

	public getError(field: string): string {
		return this.errorObject[field];
	}

	/**
	 * Takes server error obj and set errors to appropriate fields at form given.
	 */
	public organizeServerErrors(serverError: any, form: FormGroup) {
		if (serverError && typeof serverError === 'object') {
			this.form = form;
			this.serverError = serverError;
			this.setErrorToFormFields();
			this.findErrors(form.controls);
		}
	}

	/**
	 * Listen's for invalid status of the form given and find's it's errors.
	 */
	public handleErrors(form: FormGroup, errorObject: any = {}) {
		this.form = form;
		this.errorObject = errorObject;
		form.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
			if (form.invalid) {
				this.findErrors(form.controls);
			}
		});
	}

	/** Used to call when an invalid form has been submit
	 *  By setting error we emit a status changed event for the form.
	 */
	public invalidFormHasSubmit() {
		// fixme: changed the listener to value changes so setErrors() wouldn't trigger it
		// fixme: look up for another method to trigger value changes
		this.form?.markAllAsTouched();
		this.form?.setErrors({});
	}

	/** Finds appropriate fields on form and set's the server error. */
	private setErrorToFormFields() {
		Object.keys(this.serverError).forEach((field) => {
			if (!Array.isArray(this.serverError[field])) {
				this.setErrorsToNestedFields(field);
			} else {
				const errorMessages: any[] = this.serverError[field];
				this.form.get(field)?.setErrors({ serverError: errorMessages[0] });
			}
		});
	}

	/**
	 * Takes nested field name and set's server error to appropriate nested field.
	 * @param nestedFieldName       Usually formControlName of a FormArray.
	 */
	private setErrorsToNestedFields(nestedFieldName: string) {
		const nestedFormErrors = this.serverError[nestedFieldName];
		Object.keys(nestedFormErrors).forEach((field) => {
			const formControl = this.form.get(field);
			if (formControl) {
				formControl.setErrors({ serverError: nestedFormErrors[field] });
			} else {
				const nestedForm = this.form.get(nestedFieldName);
				if (nestedForm) {
					const nestedField = nestedForm.get(field);
					if (nestedField) {
						nestedField.setErrors({ serverError: nestedFormErrors[field] });
					}
				}
			}
		});
	}

	/**
	 * Find which control contains the error and set required { control -> error message } combination
	 * into the errorObject given previously.
	 *
	 * @param controls      Abstract Controls of the form which contains errors.
	 */
	private findErrors(controls: { [key: string]: AbstractControl }) {
		Object.keys(controls).forEach((control: string) => {
			if (controls[control] instanceof FormArray) {
				Object.defineProperty(this.errorObject, control, { value: [], writable: true });
				this.findErrorsOnFormArrays(controls[control] as FormArray, control);
			} else if (controls[control] instanceof FormControl) {
				this.findErrorsOnFormControls(controls, control);
			}
		});
	}

	private findErrorsOnFormArrays(formArray: FormArray, formArrayName: string) {
		let i = 0;
		for (const formGroup of formArray.controls as FormGroup[]) {
			const controls = formGroup.controls;
			const formArrayErrors: any[] = this.errorObject[formArrayName];
			formArrayErrors.push({});
			Object.keys(controls).forEach((control) => {
				if (ErrorHandler.hasError(controls[control])) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					this.setErrorMessage(controls[control].errors);
					Object.defineProperty(formArrayErrors[i], control, { value: this.message, writable: true });
				}
			});
			i++;
		}
	}

	private findErrorsOnFormControls(controls: { [key: string]: AbstractControl }, control: string) {
		if (ErrorHandler.hasError(controls[control])) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this.setErrorMessage(controls[control].errors);
			this.setErrorToErrorObject(control);
		}
	}

	/**
	 * Find's error type and set's a message value for this type.
	 */
	private setErrorMessage(errors: ValidationErrors) {
		if (errors.serverError) {
			this.message = errors.serverError;
		} else {
			this.message = ErrorMessageHelper.getErrorMessage(errors);
		}
	}

	/**
	 * Set's a new property to errorObject with key from the field's name and error message as a value.
	 * @param field         Field which contains error.
	 */
	private setErrorToErrorObject(field: string) {
		Object.defineProperty(this.errorObject, field, { value: this.message, writable: true });
	}
}
