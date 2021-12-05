import { CachingStrategy, config } from '@datx/jsonapi';
import { FetchType } from '@datx/jsonapi/dist/NetworkUtils';
import { CustomFetchService } from '../services/custom-fetch.service';

export function initDatx(customFetch: CustomFetchService): () => Promise<void> {
	return async () => {
		config.baseFetch = customFetch.fetch.bind(customFetch) as FetchType;

		config.defaultFetchOptions = {
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/vnd.api+json',
			},
		};

		config.baseUrl = 'http://localhost:3000/';
		config.cache = CachingStrategy.NetworkOnly;
	};
}
