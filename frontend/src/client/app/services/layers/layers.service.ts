import { Injectable, Inject} from '@angular/core';
import { Config } from '../../shared/config/env.config';
import { MapService } from '../map/map.service';
import { Router } from '@angular/router';
import { Layer } from './layer';
import 'rxjs/add/operator/map';

@Injectable()
export class LayersService {
	private Layers:Layer[];
	// CONSTRUCTOR DEL SERVICIO
	constructor(private router: Router, @Inject(MapService) rest: MapService) {
		
	}
	public getListLayers():Layer[]{
		return this.Layers;
	}
	public getLayer(index:number):Layer{
		return this.Layers[index];
	}
	public createLayer(name:string){

	}
	public removeLayer(){

	}
}