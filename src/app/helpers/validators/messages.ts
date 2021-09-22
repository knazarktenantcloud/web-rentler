import { FormRule } from '@app/helpers/validators/enums/form-rule.enum';

export const VALIDATION_MESSAGES: any = {
	[FormRule.required]: '%n is required',
	[FormRule.minlength]: '%n must be at least %0 characters long.',
	[FormRule.maxlength]: '%n cannot be more than %0 characters long.',
	[FormRule.url]: '%n is not valid url.',
	[FormRule.number]: '%n is not valid number.',
	[FormRule.email]: '%n is not valid email.',
	[FormRule.date]: '%n is not valid date.',
	[FormRule.equal]: '%n should be equal to %0',
	[FormRule.equalTo]: '%n must be equal to %0',
	[FormRule.pattern]: '%n does not match the pattern.',
	[FormRule.invalid]: 'Invalid',
};
