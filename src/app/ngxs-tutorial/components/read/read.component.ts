import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RemoveTutorial } from '../../actions/tutorial.actions';
import { Tutorial } from '../../models/tutorial.model';
import { TutorialState } from '../../state/tutorial.state';

@Component({
	selector: 'app-read',
	templateUrl: './read.component.html',
	styleUrls: ['./read.component.scss'],
})
export class ReadComponent implements OnInit {
	@Select(TutorialState.getTutorials) tutorials$: Observable<Tutorial> | undefined;

	constructor(private store: Store) {
		//this.tutorials$ = this.store.select(state => state.tutorials.tutorials)
	}

	delTutorial(name: string): void {
		// .subscribe(() => this.form.reset())
		this.store.dispatch(new RemoveTutorial(name));
	}

	ngOnInit() {}
}
