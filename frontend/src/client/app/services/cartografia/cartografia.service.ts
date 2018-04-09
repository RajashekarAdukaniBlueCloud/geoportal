import { Injectable, Inject} from '@angular/core';
import { Config } from '../../shared/config/env.config';
import { MapComponent } from '../../features/map/map.component';
import { Router } from '@angular/router';
import { RestService } from '../rest/rest.service';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
declare var ol:any; // DECLARACIÓN DE VARIABLE GLOBAL DE OPEN LAYERS 3

@Injectable()
export class CartografiaService {
	private regional:any[] = null;
	private comunal:any = {};
	private rest:RestService;
	//declaramos el constructor
	constructor(@Inject(RestService) rest: RestService){
		this.rest = rest;
	}
	private fetchRegional(){
		return this.rest.get('/cartografia/regiones');
	}
	private fetchComunal(region:string){
		return this.rest.get('/cartografia/regiones/'+region+'/comunas');
	}
	public getRegional(){
		let data = new Observable(observer => {
		    if(this.regional != null){
		    	observer.next(this.regional);
		    	observer.complete();
		    }
		    else{
		    	let cartografia = localStorage.getItem('CARTOGRAFIA_REGIONAL');
		    	if(cartografia){
		    		this.regional = JSON.parse(cartografia);
		    		observer.next(JSON.parse(cartografia));
			    	observer.complete();
		    	}
		    	else{
		    		this.fetchRegional().subscribe(
				      	 data => {
					    	this.regional = data;
					    	observer.next(data);
			    			localStorage.setItem('CARTOGRAFIA_REGIONAL', JSON.stringify(data));
			    			observer.complete();
					    },
					    err => console.error(err)
					);
		    	}
		    	
		    }
	    });
	    return data;
	}
	public getComunal(region:string){
		let data = new Observable(observer => {
		    if(this.comunal != null && this.comunal[region] != null){
		    	observer.next(this.comunal[region]);
		    	observer.complete();
		    }
		    else{
		    	let cartografia = localStorage.getItem('CARTOGRAFIA_COMUNAL_'+region);
		    	if(cartografia){
		    		this.comunal[region] = JSON.parse(cartografia);
		    		observer.next(JSON.parse(cartografia));
			    	observer.complete();
		    	}
		    	else{
		    		this.fetchComunal(region).subscribe(
				      	 data => {
					    	this.comunal[region] = data;
					    	observer.next(data);
			    			localStorage.setItem('CARTOGRAFIA_REGIONAL_'+region, JSON.stringify(data));
			    			observer.complete();
					    },
					    err => console.error(err)
					);
		    	}
		    	
		    }
	    });
	    return data;
	}
}
