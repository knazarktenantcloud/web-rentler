import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationExComponent } from './pages/validation-ex/validation-ex.component';
import { ValidationModule } from '@app/core/modules/validation/validation.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
	imports: [CommonModule, ValidationModule, SharedModule],
	declarations: [ValidationExComponent],
	exports: [ValidationExComponent],
})
export class ValidationExModule {}
