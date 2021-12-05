import { ExtendableError } from 'ts-error';

export class ValidationControlError extends ExtendableError {
	constructor() {
		super('There is no valid form element. Please check your view!');
	}
}
