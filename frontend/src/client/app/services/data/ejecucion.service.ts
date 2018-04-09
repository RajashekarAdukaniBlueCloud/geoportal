import { Injectable, Inject} from '@angular/core';
import { Config } from '../../shared/config/env.config';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../rest/rest.service';
import { BlackscreenService } from '../blackscreen/blackscreen.service';
import { ITimeline } from '../../classes/itimeline';
import { TimelineService } from '../../shared/timeline/timeline.service';

@Injectable()
export class EjecucionService implements ITimeline{
	private ejecucion_nacional:any;
	private ejecucion_region:any = {};
	public year: string;
	//construimos los metodos
	constructor(
		http: Http,
		private router: Router,
		@Inject(RestService) private rest:RestService,
		private blackscreen:BlackscreenService,
		@Inject(TimelineService) private timeline:TimelineService
	) {
		let today = new Date();
		today.setMonth(today.getMonth() - 1);
		// this.year = today.getFullYear().toString();
		this.year = "2017";
	}
	public getMetadataNacional(){
		var id = 'ejecucion-service-'+Math.random();
		this.blackscreen.show('Cargando...', id);
		if(this.ejecucion_nacional == null){
			return this.rest.getMap('/contabilidad/regiones/ejecucion?year=' + this.year).map((res:Response) => {
				let response = res.json();
				this.ejecucion_nacional = response;
				this.blackscreen.hide(id);
				return response;
			});
		}
		return new Observable(observer => {
			observer.next(this.ejecucion_nacional);
	        observer.complete();
			this.blackscreen.hide(id);
	    });
	}
	public getMetadataRegional(region:string){
		var id = 'ejecucion-service-'+Math.random();
		this.blackscreen.show('Cargando...', id);
		var region_num:number = parseInt(region);
		if(this.ejecucion_region[region] == null){
			return this.rest.getMap('/contabilidad/regiones/' + region_num + '/ejecucion?year=' + this.year).map((res:Response) => {
				let response = res.json();
				this.ejecucion_region[region] = response;
				this.blackscreen.hide(id);
				return response;
			});
		}
		return new Observable(observer => {
	        observer.next(this.ejecucion_region[region]);
			observer.complete();
			this.blackscreen.hide(id);
	    });
	}

	public onTimeLineChange(event: any): void {
	}
	public hideTimeline(){
		this.timeline.hideTimeline();
	}
	public regService(){
		this.timeline.registerService(this);
	}
}
