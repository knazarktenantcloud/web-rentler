import { ValidationErrors } from '@angular/forms';

export interface FormState<T> {
	model: T;
	dirty: boolean;
	message: string;
	status: string;
	errors: ValidationErrors | null;
}
