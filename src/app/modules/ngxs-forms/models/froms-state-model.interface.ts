import { FormState } from '@app/modules/ngxs-forms/models/forms-state.interface';
import { TodoPageFormValue } from '@app/modules/ngxs-forms/models/todo-page-form-value.interface';

export interface FormsStateModel {
	todoForm: FormState<TodoPageFormValue>;
}
