import { APP_INITIALIZER, NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { APP_COLLECTION } from '@app/modules/jsonapi/injection-tokens';
import { AppCollection } from '@app/modules/jsonapi/collections/app.collection';
import { CustomFetchService } from '@app/modules/jsonapi/services/custom-fetch.service';
import { initDatx } from '@app/modules/jsonapi/helpers/init-datx.helper';
import { ArtistsService } from '@app/modules/jsonapi/services/artists.service';
import { ArtistsComponent } from '@app/modules/jsonapi/components/artists/artists.component';

@NgModule({
	declarations: [ArtistsComponent],
	imports: [SharedModule],
	providers: [
		ArtistsService,
		{
			provide: APP_INITIALIZER,
			useFactory: initDatx,
			multi: true,
			deps: [CustomFetchService],
		},
		{
			provide: APP_COLLECTION,
			useValue: new AppCollection(),
		},
	],
	exports: [ArtistsComponent],
})
export class JsonapiModule {}
