import { Component, Input, ViewChild, ElementRef, Renderer2, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ValidationErrors } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

@Component({
	selector: 'custom-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => InputComponent),
			multi: true,
		},
	],
})
export class InputComponent implements ControlValueAccessor, OnDestroy {
	@Input() type: string = 'text';
	@Input() name: string;
	@Input() placeholder: string = '';
	@Input() label: string;
	@Input() errors: ValidationErrors;

	@ViewChild('inputElement') private _inputElement: ElementRef;

	errors$: Observable<any>;

	val = '';

	/** Subject that emits when the component has been destroyed. */
	_onDestroy = new Subject<void>();

	// private controlContainer: ControlContainer
	constructor(private renderer: Renderer2) {}

	get inputElement(): ElementRef {
		return this._inputElement;
	}

	set value(val: string) {
		if (val !== undefined && this.val !== val) {
			this.val = val;
			this._onChange(val);
			this._onTouched();
		}
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

	ngOnDestroy() {
		this._onDestroy.next();
		this._onDestroy.complete();
	}
}
