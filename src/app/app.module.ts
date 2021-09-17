import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { fakeBackendProvider } from './helpers/fake-backend';
import { NgxsTutorialModule } from './modules/ngxs-tutorial/ngxs-tutorial.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';

@NgModule({
	declarations: [AppComponent],
	imports: [AppRoutingModule, CoreModule, SharedModule, NgxsTutorialModule],
	providers: [
		// provider used to create fake backend
		fakeBackendProvider,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
