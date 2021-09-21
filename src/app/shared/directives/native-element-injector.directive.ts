import { AfterContentInit, Directive, ElementRef, OnInit } from '@angular/core';
import { FormControlDirective, FormControlName, NgControl } from '@angular/forms';

@Directive({
	selector: '[formControlName]',
})
export class NativeElementInjectorDirective implements OnInit, AfterContentInit {
	constructor(private el: ElementRef, private control: NgControl) {}

	ngOnInit() {
		(this.control.control as any).nativeElement = this.el.nativeElement;
	}

	ngAfterContentInit(): void {
		const originFormControlNgOnChanges = FormControlDirective.prototype.ngOnChanges;
		FormControlDirective.prototype.ngOnChanges = function () {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			this.form.nativeElement = this.valueAccessor._elementRef && this.valueAccessor._elementRef.nativeElement;
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			// eslint-disable-next-line prefer-rest-params
			return originFormControlNgOnChanges.apply(this, arguments);
		};
	}
}
