import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { IndexComponent } from './index/index.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { DirectivesModule } from '../directives/directives.module';
import { MapModule } from './map/map.module';
import { AuditoriaComponent } from './auditoria/auditoria.component';
import { CumplimientoComponent } from './cumplimiento/cumplimiento.component';
import { EjecucionComponent } from './ejecucion/ejecucion.component';
import { FuncionariosComponent } from  './funcionarios/funcionarios.component';
import { HallazgosComponent } from './hallazgos/hallazgos.component';
import { ScreenComponent } from './screen/screen.component';
import { ChartModule } from 'angular2-chartjs';
import { NgPipesModule } from 'ngx-pipes';
/**
* Especificamos el modulo
*/

@NgModule({
	imports: [CommonModule, RouterModule, SharedModule, PipesModule, DirectivesModule, SharedModule, ChartModule, NgPipesModule, MapModule],
	declarations:[HomeComponent, IndexComponent, AuditoriaComponent,CumplimientoComponent,EjecucionComponent,ScreenComponent,FuncionariosComponent,HallazgosComponent],
	exports: [CommonModule, FormsModule, RouterModule, HomeComponent, IndexComponent,MapModule, AuditoriaComponent,CumplimientoComponent,EjecucionComponent,ScreenComponent,FuncionariosComponent,
  HallazgosComponent]

})
export class FeaturesModule {
}