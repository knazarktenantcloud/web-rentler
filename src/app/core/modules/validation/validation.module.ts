import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ValidationState } from './states/validation.state';
import { ValidationInterceptor } from './interceptors';
import { ValidationFieldComponent } from './components/validation-field/validation-field.component';

@NgModule({
	imports: [CommonModule, NgxsModule.forFeature([ValidationState])],
	declarations: [ValidationFieldComponent],
	providers: [{ provide: HTTP_INTERCEPTORS, useClass: ValidationInterceptor, multi: true }],
	exports: [ValidationFieldComponent],
})
export class ValidationModule {}
