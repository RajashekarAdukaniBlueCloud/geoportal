import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RestService } from './rest/rest.service';
import { MapService } from './map/map.service';
import { LayersService } from './layers/layers.service';
import { HttpModule } from '@angular/http';
import { BlackscreenService } from './blackscreen/blackscreen.service';
import { CartografiaService } from './cartografia/cartografia.service';
import { ArbolService } from './arbol/arbol.service';
import { CumplimientoService } from './data/cumplimiento.service';
import { EjecucionService } from './data/ejecucion.service';
import { FuncionariosService } from './data/funcionarios.service';
import { AuditoriaService } from './data/auditoria.service';
import { HallazgosService } from './data/hallazgos.service';

/**
* Especificamos el modulo
*/

@NgModule({
	imports: [CommonModule, RouterModule],
	declarations: [],
	providers:[RestService, MapService, CartografiaService, BlackscreenService,LayersService,ArbolService, CumplimientoService, EjecucionService, 
		FuncionariosService, AuditoriaService, HallazgosService],
	exports: [CommonModule, FormsModule, RouterModule]

})
export class ServicesModule {
}