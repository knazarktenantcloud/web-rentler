import { Component, OnInit, ContentChild, AfterContentInit } from '@angular/core';
import { MbscInput, MbscRadioGroup } from '@mobiscroll/angular';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { head } from 'lodash';

import { ValidationState } from '../../states/validation.state';
import { ErrorMessageHelper } from '@app/helpers/error-message.helper';
import { ValidationErrorModel } from '../../models/validation.model';
import { FormControl, FormControlDirective } from '@angular/forms';

@Component({
	selector: 'validation-field',
	template: '<ng-content></ng-content> <ul></ul>',
	styleUrls: ['./validation-field.component.scss'],
})
export class ValidationFieldComponent implements OnInit, AfterContentInit {
	@ContentChild(MbscInput) private input?: MbscInput;
	@ContentChild(FormControlDirective) private control?: FormControl;

	@Select(ValidationState) private validation$: Observable<ValidationErrorModel>;

	public isShowError = false;

	private field?: MbscInput;

	constructor() {}

	public ngOnInit(): void {
		this.validation$.subscribe((data) => {
			if (this.field?.name) {
				this.isShowError = !!head(data[this.field.name]);
				this.setError(head(data[this.field.name]) || '');
			}
		});
	}

	public ngAfterContentInit(): void {
		this.field = this.input;

		this.control?.valueChanges.subscribe(() => {
			if (!this.control) {
				return;
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
