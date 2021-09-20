import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MbscModule } from '@mobiscroll/angular';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxsFormsModule } from '@app/modules/ngxs-forms/ngxs-forms.module';
import { I18NextModule } from 'angular-i18next';

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
		NgxsFormsModule,
	],
	declarations: [],
	providers: [],
	exports: [
		BrowserModule,
		HttpClientModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MbscModule,
		NgxsFormsModule,
		I18NextModule,
	],
})
export class SharedModule {}
