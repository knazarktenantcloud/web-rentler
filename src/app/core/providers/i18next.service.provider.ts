import {
	defaultInterpolationFormat,
	I18NEXT_SERVICE,
	I18NextLoadResult,
	I18NextModule,
	ITranslationService,
} from 'angular-i18next';
import { APP_INITIALIZER, LOCALE_ID } from '@angular/core';

import LanguageDetector from 'i18next-browser-languagedetector';
// import Backend from 'i18next-http-backend';

const i18nextOptions = {
	whitelist: ['en'],
	fallbackLng: 'en',
	debug: true,
	returnEmptyString: false,
	ns: ['error'],
	interpolation: {
		format: I18NextModule.interpolationFormat(defaultInterpolationFormat),
	},
	// backend plugin options
	// backend: {
	// 	// for all available options read the backend's repository readme file
	// 	loadPath: '/locales/{{lng}}/{{ns}}.json',
	// },
};

export function appInit(i18next: ITranslationService) {
	return () => {
		const promise: Promise<I18NextLoadResult> = i18next
			// .use(Backend)
			.use<any>(LanguageDetector)
			.init(i18nextOptions);
		return promise;
	};
}

export const localeIdFactory = (i18next: ITranslationService) => {
	return i18next.language;
};

export const I18N_PROVIDERS = [
	{
		provide: APP_INITIALIZER,
		useFactory: appInit,
		deps: [I18NEXT_SERVICE],
		multi: true,
	},
	{
		provide: LOCALE_ID,
		deps: [I18NEXT_SERVICE],
		useFactory: localeIdFactory,
	},
];
