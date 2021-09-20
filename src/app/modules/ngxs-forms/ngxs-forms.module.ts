import { NgModule } from '@angular/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsModule } from '@ngxs/store';
import { FormsState } from '@app/modules/ngxs-forms/store/forms.state';

@NgModule({
	declarations: [],
	imports: [NgxsModule.forFeature([FormsState]), NgxsFormPluginModule],
})
export class NgxsFormsModule {}
