import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'present',
})
export class PresentPipe<T> implements PipeTransform {
	transform(value: T | null | undefined): T {
		if (value === null || value === undefined) {
			throw new Error(`Expected value to be present`);
		}
		return value;
	}
}
