import { AbstractControl, ValidatorFn, Validators as NativeValidators } from '@angular/forms';

export class Validators extends NativeValidators {
	/*** CUSTOM VALIDATIONS ***/

	/**
	 * Validator that requires controls to have a value to equal another value.
	 */
	static equal(val: any): ValidatorFn {
		return (control: AbstractControl): { [p: string]: any } | null => {
			if (isPresent(Validators.required(control))) {
				return null;
			}

			const v: any = control.value;

			return val === v ? null : { equal: true };
		};
	}

	/**
	 * Validator that requires controls to have a value to equal another control.
	 */
	static equalTo(equalControlName: string): ValidatorFn {
		return (control: AbstractControl): { [p: string]: any } | null => {
			if (!control['_parent']) {
				return null;
			}

			if (!control['_parent'].controls[equalControlName]) {
				throw new TypeError('Form Control ' + equalControlName + ' does not exists.');
			}

			const controlMatch = control['_parent'].controls[equalControlName];

			return controlMatch.value === control.value ? null : { equalTo: true };
		};
	}
}

export function isPresent(obj: any): boolean {
	return obj !== undefined && obj !== null;
}

export function isDate(obj: any): boolean {
	return !/Invalid|NaN/.test(new Date(obj).toString());
}
