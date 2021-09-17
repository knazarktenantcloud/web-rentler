import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AddTutorial } from '../../actions/tutorial.actions';
import { NgControl, NgForm } from '@angular/forms';

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

	constructor(private store: Store) {}

	addTutorial(f: NgForm): void {
		this.store.dispatch(new AddTutorial(f.value)).subscribe(() => {
			f.reset();
		});
	}

	ngOnInit(): void {}
}
