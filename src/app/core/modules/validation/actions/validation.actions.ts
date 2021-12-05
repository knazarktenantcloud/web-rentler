import { ValidationErrorModel } from '@app/core/modules/validation/models/validation.model';

export class SetValidationErrors {
	static readonly type = '[Validation] set validation errors';

	constructor(public data: ValidationErrorModel) {}
}

export class ClearValidationError {
	static readonly type = '[Validation] clear validation error';

	constructor(public name: string) {}
}

export class ClearAllValidationErrors {
	static readonly type = '[Validation] clear all validation errors';
}
