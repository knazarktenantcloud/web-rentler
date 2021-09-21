import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AddTutorial } from '../../actions/tutorial.actions';
import { NgControl, NgForm } from '@angular/forms';
import { has } from 'lodash-es';

@Component({
	selector: 'app-create',
	templateUrl: './create.component.html',
	styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
	user = {
		name: '',
		url: '',
	};

	errorMessages = {
		name: {
			required: 'Username required',
		},
	};

	constructor(private store: Store) {}

	addTutorial(f: NgForm): void {
		this.store.dispatch(new AddTutorial(f.value)).subscribe(() => {
			f.reset();
		});
	}

	getError(control: NgControl): string {
		let message = '';

		if (control?.errors) {
			for (const err in control.errors) {
				if (control.errors[err]) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					message = this.errorMessages[control.name][err];
				}
			}
		}

		return message;
	}

	ngOnInit(): void {}
}
