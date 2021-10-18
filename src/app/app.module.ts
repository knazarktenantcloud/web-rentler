import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { fakeBackendProvider } from './helpers/fake-backend';
import { NgxsTutorialModule } from './modules/ngxs-tutorial/ngxs-tutorial.module';
import { CoreModule } from './core/core.module';
import { MbscModule, mobiscroll } from '@mobiscroll/angular';

import { HomeModule } from '@app/modules/home/home.module';
import { ValidationExModule } from '@app/modules/validation-ex/validation-ex.module';

mobiscroll.settings = {
	theme: 'ios',
	themeVariant: 'light',
};

@NgModule({
	declarations: [AppComponent],
	imports: [AppRoutingModule, MbscModule, CoreModule, NgxsTutorialModule, HomeModule, ValidationExModule],
	providers: [
		// provider used to create fake backend
		fakeBackendProvider,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
