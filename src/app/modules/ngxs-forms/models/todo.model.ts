import { FormsStateModel } from './froms-state-model.interface';
import { initFormState } from '@app/modules/ngxs-forms/models/forms-state-init.const';

export const initFormsStateModel: FormsStateModel = {
	todoForm: initFormState,
};
