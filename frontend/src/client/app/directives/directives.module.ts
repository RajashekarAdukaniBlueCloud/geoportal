import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
/**
* Especificamos el modulo
*/

@NgModule({
	imports: [CommonModule, RouterModule, SharedModule],
	declarations: [],
	exports: [CommonModule, FormsModule, RouterModule]

})
export class DirectivesModule {
}