import { HttpParameterCodec } from '@angular/common/http';
import { isArray, isNull, mapValues, isString, isObject } from 'lodash-es';

export class ParamsTrimmerHelper {
	static trimParams(value: any | null): any {
		if (isString(value)) {
			return value.trim();
		} else if (isArray(value)) {
			return value.map((item) => this.trimParams(item));
		} else if (!isNull(value) && isObject(value)) {
			return mapValues(value, (item) => this.trimParams(item));
		}

		return value;
	}
}

export class CustomQueryEncoderHelper implements HttpParameterCodec {
	encodeKey(key: string): string {
		return encodeURIComponent(key);
	}

	encodeValue(value: string): string {
		return encodeURIComponent(value);
	}

	decodeKey(key: string): string {
		return decodeURIComponent(key);
	}

	decodeValue(value: string): string {
		return decodeURIComponent(value);
	}
}
