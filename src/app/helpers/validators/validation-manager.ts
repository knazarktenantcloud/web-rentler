import { FormGroup, FormControl, FormArray, FormBuilder, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Validators } from './validators';
import { VALIDATION_MESSAGES } from './messages';
import { FormStatus } from '@app/helpers/validators/enums/form-status.enum';
import { FormRule } from '@app/helpers/validators/enums/form-rule.enum';

export class ValidationManager {
	private controls: any = {};

	formGroup: FormGroup;
	errors: any = {};
	children: any = {};
	submitted = false;

	private _fb: FormBuilder;

	constructor(
		formValidations: Record<string, any>,
		private displayError: Array<string> = [FormStatus.invalid, FormStatus.dirty, FormStatus.submitted]
	) {
		this.formGroup = new FormGroup({});
		this._fb = new FormBuilder();
		for (const key in formValidations) {
			if (typeof formValidations[key] === 'string') {
				this.controls[key] = this.buildControl(key, formValidations[key]);
			} else if (formValidations[key] instanceof ValidationManager) {
				this.children[key] = formValidations[key];
				this.controls[key] = { control: formValidations[key].getForm(), messages: {} };
			} else if (formValidations[key] instanceof Array) {
				this.children[key] = [];
				const formArray = <FormArray>this._fb.array([]);

				for (const group of formValidations[key]) {
					if (group instanceof ValidationManager) {
						formArray.push(group.getForm());
						this.children[key].push(group);
					} else {
						formArray.push(new FormControl(group));
					}
				}

				this.controls[key] = { control: formArray, messages: {} };
			} else if (typeof formValidations[key] === 'object') {
				if (!formValidations[key].value) {
					formValidations[key].value = '';
				}
				this.controls[key] = this.buildControl(key, formValidations[key].rules, formValidations[key].value);
			}

			this.formGroup.addControl(key, this.controls[key].control);

			this.errors[key] = '';
		}

		this.formGroup.valueChanges.subscribe(() => this.onValueChanged());
	}

	getForm() {
		return this.formGroup;
	}

	getChildGroup(field: string, index: number | null = null) {
		if (index !== null) {
			return this.children[field][index];
		}
		return this.children[field];
	}

	getChildren(field: string) {
		return this.children[field];
	}

	addChildGroup(field: string, mgr: ValidationManager | any) {
		if (this.formGroup.controls[field] && this.formGroup.controls[field] instanceof FormArray) {
			const control = <FormArray>this.formGroup.controls[field];
			if (mgr instanceof ValidationManager) {
				control.push(mgr.getForm());
				this.children[field].push(mgr);
			} else {
				control.push(new FormControl(mgr));
			}

			return control.length - 1;
		} else {
			this.children[field] = mgr;
			this.formGroup.addControl(field, mgr.getForm());
			return -1;
		}
	}

	removeChildGroup(field: string, index: number | null = null) {
		if (!this.formGroup.controls[field]) {
			return;
		}

		if (index !== null) {
			const control = <FormArray>this.formGroup.controls[field];
			control.removeAt(index);
			this.children[field].splice(index, 1);
		} else {
			this.formGroup.removeControl(field);
			delete this.children[field];
		}
	}

	isValid() {
		this.submitted = true;
		this.__setOnChild(FormStatus.submitted, true);
		this.onValueChanged();
		return !this.formGroup.invalid;
	}

	hasError(field: string) {
		return !!this.errors[field];
	}

	getError(field: string) {
		return this.errors[field];
	}

	getErrors() {
		for (const child in this.children) {
			if (this.children[child] instanceof Array) {
				this.errors[child] = {};
				for (const subChild in this.children[child]) {
					this.errors[child][subChild] = this.children[child][subChild].errors;
				}
			} else {
				this.errors[child] = this.children[child].errors;
			}
		}
		return this.errors;
	}

	reset() {
		this.submitted = false;
		this.formGroup.reset();
		this.__setOnChild(FormStatus.submitted, false);
		for (const fld in this.children) {
			for (const child of this.children[fld]) {
				child.formGroup.reset();
			}
		}
	}

	onValueChanged(displayError: Array<string> | null = null) {
		if (!this.formGroup) {
			return;
		}

		const form = this.formGroup;
		for (const field in this.errors) {
			const control = form.get(field);
			this.errors[field] = '';

			if (displayError === null) {
				displayError = this.displayError;
			}

			if (
				control &&
				displayError.length &&
				(displayError.every((element: string) => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					return element === FormStatus.submitted ? true : control[element];
				}) ||
					this.submitted)
			) {
				for (const rule in control.errors) {
					this.errors[field] = this.getErrorMessage(field, rule);
				}
			}
		}

		this.__callOnChild('onValueChanged');
	}

	setValue(values: string | Record<string, any>, value: null | string = null) {
		if (typeof values === 'string') {
			const control = this.formGroup.get(values);
			if (!control || control instanceof FormArray) {
				return;
			}

			if (value !== null) {
				this.formGroup.get(values)?.setValue(value.toString());
				this.formGroup.get(values)?.markAsTouched();
				this.formGroup.get(values)?.markAsDirty();
			}
		}

		if (typeof values === 'object') {
			for (const key in values) {
				if (this.formGroup.get(key)) {
					this.setValue(key, values[key]);
				}
			}
		}
	}

	getValue(controlKey: string) {
		return this.formGroup.value[controlKey];
	}

	getData() {
		return this.formGroup.value;
	}

	getControl(controlName: string): any {
		if (!this.formGroup.controls[controlName]) {
			return;
		}
		return this.formGroup.controls[controlName];
	}

	buildControl(name: string, rules: string, value: null | string | Record<string, any> = null) {
		const controlRules: ValidatorFn[] = [];
		const messages: any = {};

		rules = rules.replace(/pattern:(\/.+\/)(\|?)/, function (a, b, c) {
			return 'pattern:' + btoa(b) + c;
		});

		rules.split('|').forEach((rule: string) => {
			if (rule) {
				const ruleSpilted = rule.split(':');
				const ruleName = ruleSpilted[0];

				let ruleVars: any = [];
				if (ruleSpilted[1]) {
					ruleVars = ruleSpilted[1].split(',');
				}

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				if (!Validators[ruleName]) {
					throw new TypeError('Validation rule [' + ruleName + '] does not exists.');
				}

				if (ruleVars.length > 1) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					controlRules.push(Validators[ruleName](ruleVars));
				} else if (ruleVars.length === 1) {
					if (ruleName === FormRule.pattern && isBase64(ruleVars[0])) {
						ruleVars[0] = atob(ruleVars[0]).slice(1, -1);
					}
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					controlRules.push(Validators[ruleName](ruleVars[0]));
				} else {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					controlRules.push(Validators[ruleName]);
				}

				messages[ruleName.toLowerCase()] = this.buildMessage(name, ruleName, ruleVars);
			}
		});

		const formControl = new FormControl(value, controlRules);

		return { control: formControl, messages: messages };
	}

	private getErrorMessage(field: string, rule: string) {
		if (!this.controls[field].messages[rule.toLowerCase()]) {
			throw Error('Message not found inside the control:' + field + ' message:' + rule.toLowerCase());
		}
		return this.controls[field].messages[rule.toLowerCase()];
	}

	setErrorMessage(field: string, rule: FormRule, message: string) {
		if (this.controls[field].messages[rule.toLowerCase()]) {
			this.controls[field].messages[rule.toLowerCase()] = message;
		}
	}

	setErrors(errors: ValidationErrors) {
		for (const prop in errors) {
			if (errors[prop]) {
				const formControl = this.formGroup.get(prop);

				if (formControl) {
					this.errors[prop] = errors[prop];
					this.setErrorMessage(prop, FormRule.invalid, errors[prop]);
					formControl.setErrors({ invalid: true });
				}
			}
		}

		const invalid = <FormControl[]>Object.keys(this.formGroup.controls)
			.map((key) => this.formGroup.controls[key])
			.filter((ctl) => ctl.invalid);

		if (invalid.length > 0) {
			const invalidElem: any = invalid[0];
			invalidElem.nativeElement.focus();
		}
	}

	private buildMessage(name: string, rule: string, arg = []) {
		if (!this.getMessage(rule)) {
			throw Error('Validation message is missing for: ' + rule);
		}

		let message = this.getMessage(rule);
		message = message.replace(/%n/g, ucFirst(name)).replace(/_/g, ' ');

		if (arg.length) {
			arg.forEach((item, key) => {
				message = message.replace('%' + key, item);
			});
		}

		return message;
	}

	private getMessage(rule: string): string {
		return VALIDATION_MESSAGES[rule.toLowerCase()];
	}

	private __callOnChild(funct: any) {
		for (const fld in this.children) {
			if (this.children[fld] instanceof Array) {
				for (const child of this.children[fld]) {
					// eslint-disable-next-line prefer-spread,prefer-rest-params
					child[funct].apply(child, Array.prototype.slice.call(arguments, 1));
				}
			} else {
				// eslint-disable-next-line prefer-spread,prefer-rest-params
				this.children[fld][funct].apply(this.children[fld], Array.prototype.slice.call(arguments, 1));
			}
		}
	}

	private __setOnChild(field: string, value: boolean) {
		for (const fld in this.children) {
			if (this.children[fld] instanceof Array) {
				for (const child of this.children[fld]) {
					child[field] = value;
				}
			} else {
				this.children[fld][field] = value;
			}
		}
	}
}

function ucFirst(str: string) {
	const firstLetter = str.substr(0, 1);
	return firstLetter.toUpperCase() + str.substr(1);
}

function isBase64(str: string) {
	try {
		return btoa(atob(str)) === str;
	} catch (err) {
		return false;
	}
}
