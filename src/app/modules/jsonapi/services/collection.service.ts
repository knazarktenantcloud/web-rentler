import { Inject } from '@angular/core';
import { IModelConstructor, IRawModel, IType } from '@datx/core';
import { IRequestOptions, modelToJsonApi } from '@datx/jsonapi';
import { IJsonapiModel, Response } from '@datx/jsonapi-angular';
import { IRecord } from '@datx/jsonapi/dist/interfaces/JsonApi';
import { Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { AppCollection } from '../collections/app.collection';
import { APP_COLLECTION } from '../injection-tokens';
import { BaseModel } from '../models/base-model';

export abstract class CollectionService<TModel extends IJsonapiModel> {
	protected abstract readonly ctor: IModelConstructor<TModel>;
	private readonly maxPageSize = 1000;

	public static modelToJsonApi(model: BaseModel): IRecord {
		// tslint:disable-next-line: no-any
		const jsonApiModel = modelToJsonApi(model as any);

		if (model.id !== undefined && model.id !== null && model.id !== '') {
			jsonApiModel.id = model.id.toString();
		}

		return jsonApiModel;
	}

	constructor(@Inject(APP_COLLECTION) protected readonly collection: AppCollection) {}

	// tslint:disable-next-line: no-any
	public setData(data: Array<IRawModel | Record<string, any>>): Array<TModel> {
		this.collection.removeAll(this.ctor);
		return this.collection.add(data, this.ctor);
	}

	// tslint:disable-next-line: no-any
	public create(rawModel: IRawModel | Record<string, any>): TModel {
		if (rawModel.id === null || rawModel.id === undefined || rawModel.id === '') {
			delete rawModel.id;
		}

		return this.collection.add(rawModel, this.ctor);
	}

	// tslint:disable-next-line: no-any
	public createAndSave(rawModel: IRawModel | Record<string, any>): Observable<TModel> {
		const model = this.create(rawModel);
		return this.update(model);
	}

	public findAll(): Array<TModel> {
		return this.collection.findAll<TModel>(this.ctor);
	}

	public getAllModels(options?: IRequestOptions, pageSize: number = this.maxPageSize): Observable<Array<TModel>> {
		return this.getMany({
			...options,
			queryParams: {
				...options?.queryParams,
				custom: (options?.queryParams?.custom || []).concat([`page[size]=${pageSize}`]),
			},
		}).pipe(map(({ data }: Response<TModel>) => data));
	}

	public getMany(options?: IRequestOptions): Observable<Response<TModel>> {
		return this.collection.getMany<TModel>(this.ctor, options);
	}

	public getManyModels(options?: IRequestOptions): Observable<Array<TModel>> {
		return this.getMany(options).pipe(map(({ data }: Response<TModel>) => data));
	}

	public getOne(id: IType, options?: IRequestOptions): Observable<Response<TModel>> {
		return this.collection.getOne(this.ctor, id.toString(), options);
	}

	public findOne(id: IType): TModel | null {
		return this.collection.findOne(this.ctor, id);
	}

	public getOneModel(id: IType, options?: IRequestOptions): Observable<TModel | null> {
		return this.getOne(id, options).pipe(map(({ data }: Response<TModel>) => data));
	}

	public update(model: TModel): Observable<TModel> {
		return model.save().pipe(mapTo(model));
	}

	protected request(
		url: string,
		method?: string,
		data?: Record<string, unknown>,
		options?: IRequestOptions
	): Observable<Response<TModel>> {
		return this.collection.request(url, method, data, options);
	}
}
