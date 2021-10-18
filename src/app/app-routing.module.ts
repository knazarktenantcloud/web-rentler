import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '@app/modules/home/pages/home/home.component';
import { ValidationExComponent } from '@app/modules/validation-ex/pages/validation-ex/validation-ex.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'validation', component: ValidationExComponent },
	{ path: '**', redirectTo: '/' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
