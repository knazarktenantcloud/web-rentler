import { Attribute } from '@datx/core';
import { BaseModel } from './base-model';

export class Artist extends BaseModel {
	public static endpoint = 'artists';
	public static type = 'project';

	@Attribute()
	public name!: string;
}
