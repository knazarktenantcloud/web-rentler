import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorialState } from './state/tutorial.state';

import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import { CreateComponent } from './components/create/create.component';
import { ReadComponent } from './components/read/read.component';
import { PresentPipe } from '@app/shared/pipes/present.pipe';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
	declarations: [CreateComponent, ReadComponent, PresentPipe],
	imports: [
		SharedModule,
		NgxsModule.forRoot([TutorialState]),
		NgxsReduxDevtoolsPluginModule.forRoot(),
		NgxsLoggerPluginModule.forRoot(),
	],
	exports: [CreateComponent, ReadComponent],
})
export class NgxsTutorialModule {}
