import { IType, Model } from '@datx/core';
import { jsonapiAngular } from '@datx/jsonapi-angular';

export class BaseModel extends jsonapiAngular(Model) {
	public get id(): IType {
		return this.meta.id;
	}
}
