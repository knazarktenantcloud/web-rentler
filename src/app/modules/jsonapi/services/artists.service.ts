import { Inject, Injectable } from '@angular/core';
import { AppCollection } from '../collections/app.collection';
import { APP_COLLECTION } from '../injection-tokens';
import { Artist } from '../models/artist';
import { CollectionService } from './collection.service';

@Injectable()
export class ArtistsService extends CollectionService<Artist> {
	protected ctor = Artist;

	constructor(@Inject(APP_COLLECTION) protected readonly collection: AppCollection) {
		super(collection);
	}
}
