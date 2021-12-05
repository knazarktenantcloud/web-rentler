import { Collection } from '@datx/core';
import { jsonapiAngular } from '@datx/jsonapi-angular';
import { Artist } from '../models/artist';

export class AppCollection extends jsonapiAngular(Collection) {
	public static readonly types = [Artist];
}
