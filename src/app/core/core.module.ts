import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderService, ProgressBarService } from './services';
import { ErrorInterceptor, LoaderInterceptor, ProgressInterceptor, TimingInterceptor } from './interceptors';
import { I18NextModule } from 'angular-i18next';
import { I18N_PROVIDERS } from '@app/core/providers/i18next.service.provider';

@NgModule({
	imports: [
		I18NextModule
			.forRoot
			// errorHandlingStrategy: StrictErrorHandlingStrategy
			(),
	],
	exports: [],
	providers: [
		LoaderService,
		I18N_PROVIDERS,
		{ provide: HTTP_INTERCEPTORS, useClass: ProgressInterceptor, multi: true, deps: [ProgressBarService] },
		{ provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
	],
	declarations: [],
})
export class CoreModule {
	constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
		if (parentModule) {
			throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
		}
	}
}
