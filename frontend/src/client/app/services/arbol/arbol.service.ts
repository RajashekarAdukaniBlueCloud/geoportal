import { Injectable } from '@angular/core';
import { ArbolComponent } from '../../shared/arbol/arbol.component';
import { ILayer } from './layer.interface';

@Injectable()
export class ArbolService {
	//construimos los metodos
	private arbol:ArbolComponent;
	register(arbol:ArbolComponent){
		this.arbol = arbol;
	}
	registerLayer(layer:ILayer){
		this.arbol.registerLayer(layer)
	}
	checklayers(link:string){
		this.arbol.checklayers(link);
	}
}
