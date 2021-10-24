import { ValidationErrors } from '@angular/forms';

export class ErrorMessageHelper {
	public static getErrorMessage(errors: ValidationErrors): string {
		switch (true) {
			case !!errors.required:
				return 'Required field';
			case !!errors.minlength:
				return `Max length is ${errors.minlength.actualLength}/${errors.minlength.requiredLength}`;
			case !!errors.maxlength:
				return `Min length is ${errors.maxlength.actualLength}/${errors.maxlength.requiredLength}`;
			case !!errors.email:
				return 'Email is not valid';
			case !!errors.min:
				return `Min value is ${errors.min.min}, actual value is ${errors.min.actual}`;
			case !!errors.max:
				return `Max value is ${errors.max.max}, actual value is ${errors.max.actual}`;
			case !!errors.pattern:
				return 'Invalid value';
			case !!errors.passwordMismatch:
				return 'Passwords do not match';
			default:
				return '';
		}
	}
}
