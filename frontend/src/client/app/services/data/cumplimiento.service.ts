import { Injectable, Inject} from '@angular/core';
import { Config } from '../../shared/config/env.config';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../rest/rest.service';
import { BlackscreenService } from '../blackscreen/blackscreen.service';
import { HashTable } from '../../classes/hashtable';
import { Cumplimiento } from '../../classes/cumplimiento';
import { ITimeline } from '../../classes/itimeline';
import { TimelineService } from '../../shared/timeline/timeline.service';
import { Subscriber } from 'rxjs/Subscriber';

@Injectable()
export class CumplimientoService implements ITimeline{
	private cumplimiento_nacional: HashTable<number, any>;
	private cumplimiento_region: HashTable<number, HashTable<string, any>>;
	private cumplimiento_comunal: HashTable<number, HashTable<string, Cumplimiento[]>>;
	private cumplimientos: HashTable<string, Cumplimiento[]>;
	public year: number;
	private detail: number;
	private region_selected: string;
	private comuna_selected: string;

	//Observables
	private observer_nacional: Subscriber<any>;
	private observer_regional: Subscriber<any>;
	private observer_comunal: Subscriber<any>;
	//construimos los metodos
	constructor(
		http: Http, 
		private router: Router, 
		@Inject(RestService) private rest:RestService, 
		private blackscreen:BlackscreenService,
		@Inject(TimelineService) private timeline:TimelineService
	) {
		// this.year = today.getFullYear().toString();
		this.year = timeline.getYearSingle();
		this.cumplimientos = new HashTable<string, Cumplimiento[]>();
		this.cumplimiento_nacional = new HashTable<number, any>();
		this.cumplimiento_region = new HashTable<number, HashTable<string, any>>();
		this.cumplimiento_comunal = new HashTable<number, HashTable<string, any>>();
	}
	public getMetadataNacional(): Observable<any>{
		var id = 'cumplimiento-service-'+Math.random();
		this.blackscreen.show('Cargando...', id);
		this.setDetail(1);
		return new Observable(observer => {
			this.observer_nacional = observer;
			this.getMetadataNacionalData(this.year).subscribe(data => {
				observer.next(data);
				this.blackscreen.hide(id);
			});
		});
	}
	private getMetadataNacionalData(year: number): Observable <any> {
		return new Observable(observer => {
			if(!this.cumplimiento_nacional.has(year)){
				this.rest.get('/contabilidad/regiones/cumplimiento?year=' + year).subscribe(data => {
					this.cumplimiento_nacional.put(year,data);
					observer.next(data);
				});
			} else {
				observer.next(this.cumplimiento_nacional.get(year));
			}
	    });
	}
	public getMetadataRegional(region:string): Observable<any>{
		var region_num:number = parseInt(region);
		this.region_selected = region;
		var id = 'cumplimiento-service-'+Math.random();
		this.blackscreen.show('Cargando...', id);
		this.setDetail(2);
		return new Observable(observer => {
			this.observer_regional = observer;
			this.getMetadataRegionalData(region, this.year).subscribe(data => {
				observer.next(data);
				this.blackscreen.hide(id);
			});
	    });
	}
	public getMetadataRegionalData(region:string, year: number): Observable<any>{
		return new Observable(observer => {
			let datos = (this.cumplimiento_region.has(year)) ? this.cumplimiento_region.get(year) : this.cumplimiento_region.put(year, new HashTable<string, any>()).get(year);
			if(!datos.has(region)){
				this.rest.get('/contabilidad/regiones/'+ region + '/cumplimiento?year=' + year).subscribe(data => {
					datos.put(region, data);
					observer.next(data);
				});
			} else {
				observer.next(datos.get(region));
			}
	    });
	}
	public getMetadataComunal(comuna: string) : Observable<Cumplimiento[]>{
		this.comuna_selected = comuna;
		var id = 'cumplimiento-service-'+Math.random;
		this.blackscreen.show('Cargando...', id);
		this.setDetail(3);
		return new Observable(observer => {
			this.observer_comunal = observer;
			this.getMetadataComunalData(comuna, this.year).subscribe(data => {
				observer.next(data);
				this.blackscreen.hide(id);
			});
		});
	}
	public getMetadataComunalData(comuna: string, year: number) : Observable<Cumplimiento[]>{
		return new Observable(observer => {
			let datos = (this.cumplimiento_comunal.has(year)) ? this.cumplimiento_comunal.get(year) : this.cumplimiento_comunal.put(year, new HashTable<string, any>()).get(year);
			if(datos.has(comuna)) {
				observer.next(datos.get(comuna));
				observer.complete();
			} else {
				this.rest.get('/contabilidad/comunas/'+ comuna + '/cumplimiento?year=' + year).subscribe(data =>{
					let cumplimientos: Cumplimiento[] = [];
					data.forEach((element: Cumplimiento) => {
						cumplimientos.push(new Cumplimiento(element));
					});
					datos.put(comuna, cumplimientos);
					observer.next(cumplimientos);
					observer.complete();
				});
			}
		});
	}
	public onTimeLineChange(event: any): void {
		if(this.detail == 1){
			this.getMetadataNacionalData(parseInt(event)).subscribe(data => {
				this.observer_nacional.next(data);
				this.year = event;
			});
		} else if(this.detail == 2){
			this.getMetadataRegionalData(this.region_selected, parseInt(event)).subscribe(data => {
				this.observer_regional.next(data);
				this.year = event;
			});
		} else if(this.detail == 3){
			this.getMetadataComunalData(this.comuna_selected, parseInt(event)).subscribe(data => {
				this.observer_comunal.next(data);
				this.year = event;
			});
		}
	}
	public showTimeLine(){
		this.timeline.hideTimeline();
        this.timeline.changeToSingle(2015, (new Date()).getUTCFullYear()-1);
        this.timeline.showTimeline();
    }
    public setDetail(status: number){
        this.detail = status;
    }
    public hideTimeline(){
        this.timeline.hideTimeline();
    }
    public regService(){
        this.timeline.registerService(this);
    }
}
