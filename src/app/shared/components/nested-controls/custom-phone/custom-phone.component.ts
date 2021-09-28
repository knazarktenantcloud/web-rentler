import {
	Component,
	Input,
	ViewChild,
	ElementRef,
	Renderer2,
	forwardRef,
	OnDestroy,
	AfterViewInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import IMask from 'imask';
import i18next from 'i18next';

@Component({
	selector: 'custom-phone',
	templateUrl: './custom-phone.component.html',
	styleUrls: ['./custom-phone.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CustomPhoneComponent),
			multi: true,
		},
	],
})
export class CustomPhoneComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
	@Input() type: string;
	@Input() name: string;
	@Input() placeholder: string = '';
	@Input() label: string;
	@Input() errors: ValidationErrors;

	@ViewChild('inputElement') private _inputElement: ElementRef;

	value: string;

	// tslint:disable-next-line:no-any
	private mask: IMask.InputMask<any>;

	/** Subject that emits when the component has been destroyed. */
	_onDestroy = new Subject<void>();

	// private controlContainer: ControlContainer
	constructor(private renderer: Renderer2) {}

	get inputElement(): ElementRef {
		return this._inputElement;
	}

	private _onChange = (_: any) => {};
	private _onTouched = () => {};

	writeValue(obj: any): void {
		this.value = obj;
	}

	registerOnChange(fn: any): void {
		this._onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this._onTouched = fn;
	}

	onChange(event: any) {
		this._onChange(event.target.value);
	}

	onKeyup(event: any) {
		this._onChange(event.target.value);
	}

	onBlur(event: any) {
		this._onTouched();
	}

	public ngAfterViewInit() {
		const maskOptions = {
			mask: i18next.t('general:countries', { returnObjects: true }),
			dispatch: (appended: any, dynamicMasked: { value: any; compiledMasks: any[] }) => {
				const number = (dynamicMasked.value + appended).replace(/\D/g, '');

				return dynamicMasked.compiledMasks.find((m) => {
					return number.indexOf(m.startsWith) === 0;
				});
			},
		};

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.mask = IMask(this.inputElement.element, maskOptions);
	}

	ngOnDestroy() {
		this._onDestroy.next();
		this._onDestroy.complete();
	}
}
