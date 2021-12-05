import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { NgxsTutorialModule } from '@app/modules/ngxs-tutorial/ngxs-tutorial.module';

@NgModule({
	imports: [CommonModule, NgxsTutorialModule],
	declarations: [HomeComponent],
	exports: [HomeComponent],
})
export class HomeModule {}
