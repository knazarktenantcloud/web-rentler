import { AppStateModel } from '@app/modules/ngxs-forms/models/app-state-model';

export const formState = (appState: AppStateModel) => appState.forms;
export const todoForm = (appState: AppStateModel) => formState(appState).todoForm;
export const isTodoFormValid = (appState: AppStateModel) => todoForm(appState).status === 'VALID';
