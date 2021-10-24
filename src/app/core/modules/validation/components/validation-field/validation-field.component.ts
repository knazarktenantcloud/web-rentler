import { Component, OnInit, ContentChild, AfterContentInit } from '@angular/core';
import { FormControl, FormControlDirective, FormControlName } from '@angular/forms';
import { MbscInput, MbscSelectComponent } from '@mobiscroll/angular';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { head } from 'lodash';

import { ValidationState } from '../../states/validation.state';
import { ErrorMessageHelper } from '@app/helpers/error-message.helper';
import { ValidationErrorModel } from '../../models/validation.model';
import { ValidationControlError } from '@app/core/modules/validation/errors/validation-control.error';

@Component({
	selector: 'validation-field',
	template: '<ng-content></ng-content>',
})
export class ValidationFieldComponent implements OnInit, AfterContentInit {
	@ContentChild(MbscInput) private input?: MbscInput;
	@ContentChild(MbscSelectComponent) private select?: MbscSelectComponent;

	@ContentChild(FormControlDirective) private control?: FormControl;
	@ContentChild(FormControlName) private controlName?: FormControlName;

	@Select(ValidationState) private validation$: Observable<ValidationErrorModel>;

	public isShowError = false;

	private field?: MbscInput | MbscSelectComponent;

	constructor() {}

	public ngOnInit(): void {
		this.validation$.subscribe((data) => {
			const name = this.field?.name || this.controlName?.name;

			if (name) {
				this.isShowError = !!head(data[name]);
				this.setError(head(data[name]) || '');
			}
		});
	}

	public ngAfterContentInit(): void {
		this.field = this.input || this.select;
		this.control = this.control || this.controlName?.control;

		if (!this.control) {
			throw new ValidationControlError();
		}

		this.control.valueChanges.subscribe(() => {
			if (!this.control) {
				throw new ValidationControlError();
			}

			this.isShowError = this.control.invalid && (this.control.dirty || this.control.touched);

			if (this.field) {
				this.field.error = this.isShowError;
			}

			if (this.control.errors) {
				this.setError(ErrorMessageHelper.getErrorMessage(this.control.errors));
			}
		});
	}

	private setError(errorMessage: string): void {
		if (this.field) {
			this.field.error = this.isShowError;
			this.field.errorMessage = errorMessage;
		}
	}
}
