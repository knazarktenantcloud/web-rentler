import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MbscModule } from '@mobiscroll/angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { I18NextModule } from 'angular-i18next';
import { NativeElementInjectorDirective } from '@app/shared/directives/native-element-injector.directive';

@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MbscModule,
		RouterModule,
		I18NextModule,
	],
	declarations: [NativeElementInjectorDirective],
	providers: [],
	exports: [
		BrowserModule,
		HttpClientModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MbscModule,
		I18NextModule,
		NativeElementInjectorDirective,
	],
})
export class SharedModule {}
