import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MbscModule } from '@mobiscroll/angular';

@NgModule({
	imports: [CommonModule, FormsModule, ReactiveFormsModule, MbscModule, RouterModule],
	declarations: [],
	providers: [],
	exports: [CommonModule, FormsModule, ReactiveFormsModule, MbscModule],
})
export class SharedModule {}
