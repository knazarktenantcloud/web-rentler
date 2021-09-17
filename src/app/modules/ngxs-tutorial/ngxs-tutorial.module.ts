import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorialState } from './modules/tutorial/state/tutorial.state';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import { CreateComponent } from './modules/tutorial/components/create/create.component';
import { ReadComponent } from './modules/tutorial/components/read/read.component';
import { PresentPipe } from '@app/shared/pipes/present.pipe';
import { SharedModule } from '@app/shared/shared.module';
import { TodoListComponent } from '@app/modules/ngxs-tutorial/modules/todo/components/todo-list/todo-list.component';
import { TodoFormComponent } from '@app/modules/ngxs-tutorial/modules/todo/components/todo-form/todo-form.component';
import { TodoService } from '@app/modules/ngxs-tutorial/modules/todo/services/todo.service';
import { TodoState } from '@app/modules/ngxs-tutorial/modules/todo/state/todo.state';

@NgModule({
	declarations: [CreateComponent, ReadComponent, TodoListComponent, TodoFormComponent, PresentPipe],
	imports: [
		SharedModule,
		NgxsModule.forRoot([TutorialState, TodoState]),
		NgxsReduxDevtoolsPluginModule.forRoot(),
		NgxsLoggerPluginModule.forRoot(),
	],
	providers: [TodoService],
	exports: [CreateComponent, ReadComponent, TodoListComponent, TodoFormComponent],
})
export class NgxsTutorialModule {}
