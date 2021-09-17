import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { fakeBackendProvider } from './helpers/fake-backend';
import { NgxsTutorialModule } from './modules/ngxs-tutorial/ngxs-tutorial.module';
import { CoreModule } from './core/core.module';
import { mobiscroll } from '@mobiscroll/angular';

mobiscroll.settings = {
	theme: 'ios',
	themeVariant: 'light',
};

@NgModule({
	declarations: [AppComponent],
	imports: [AppRoutingModule, CoreModule, NgxsTutorialModule],
	providers: [
		// provider used to create fake backend
		fakeBackendProvider,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
