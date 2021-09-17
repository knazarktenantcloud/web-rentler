import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Tutorial } from './../models/tutorial.model';
import { AddTutorial, RemoveTutorial } from './../actions/tutorial.actions';
import { Injectable } from '@angular/core';

export interface TutorialStateModel {
	tutorials: Tutorial[];
}

@State<TutorialStateModel>({
	name: 'tutorials',
	defaults: {
		tutorials: [],
	},
})
@Injectable()
export class TutorialState {
	@Selector()
	static getTutorials(state: TutorialStateModel) {
		return state.tutorials;
	}

	@Action(AddTutorial)
	add(ctx: StateContext<TutorialStateModel>, { payload }: AddTutorial) {
		const state = ctx.getState();
		ctx.patchState({
			tutorials: [...state.tutorials, payload],
		});
	}

	@Action(RemoveTutorial)
	remove(ctx: StateContext<TutorialStateModel>, { payload }: RemoveTutorial) {
		ctx.patchState({
			tutorials: ctx.getState().tutorials.filter((a) => a.name != payload),
		});
	}
}
