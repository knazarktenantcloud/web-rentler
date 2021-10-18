import { NgModule } from '@angular/core';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';

import { CreateComponent } from './modules/tutorial/components/create/create.component';
import { ReadComponent } from './modules/tutorial/components/read/read.component';
import { PresentPipe } from '@app/shared/pipes/present.pipe';
import { SharedModule } from '@app/shared/shared.module';
import { TodoListComponent } from '@app/modules/ngxs-tutorial/modules/todo/components/todo-list/todo-list.component';
import { TodoFormComponent } from '@app/modules/ngxs-tutorial/modules/todo/components/todo-form/todo-form.component';
import { TodoState } from '@app/modules/ngxs-tutorial/modules/todo/state/todo.state';
import { TodoServiceProvider } from '@app/modules/ngxs-tutorial/modules/todo/providers/todo.service.provider';
import { environment } from '@env/environment';
import { AppTodoFormComponent } from '@app/modules/ngxs-tutorial/modules/todo/components/todo-form/app-todo-form.component';

@NgModule({
	declarations: [
		CreateComponent,
		ReadComponent,
		TodoListComponent,
		TodoFormComponent,
		AppTodoFormComponent,
		PresentPipe,
	],
	imports: [
		SharedModule,
		NgxsModule.forRoot([TodoState], { developmentMode: !environment.production }),
		NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
		NgxsFormPluginModule.forRoot(),
		// NgxsLoggerPluginModule.forRoot(),
		NgxsStoragePluginModule.forRoot({ key: ['forms'] }),
	],
	providers: [TodoServiceProvider],
	exports: [CreateComponent, ReadComponent, TodoListComponent, TodoFormComponent, AppTodoFormComponent],
})
export class NgxsTutorialModule {}
