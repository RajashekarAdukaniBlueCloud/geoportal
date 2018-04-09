import { Injectable, Inject} from '@angular/core';
import { Config } from '../../shared/config/env.config';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../rest/rest.service';
import { BlackscreenService } from '../blackscreen/blackscreen.service';
import { Subscriber } from 'rxjs/Subscriber';
import { HashTable } from '../../classes/hashtable';
import { InformeAuditoria } from '../../classes/informeAuditoria';
import { TimelineService } from '../../shared/timeline/timeline.service';
import { ITimeline } from '../../classes/itimeline';

@Injectable()
export class AuditoriaService implements ITimeline{
	private auditoria_est_region: any = {};
	private auditoria_region: any = null;
	private auditoria_est_comunal: any = {};
	private auditoria_comunal: any = {};
	private informes_comuna: any = {};
	private observe_regional: Subscriber<any>;
	private observe_comunal: Subscriber<any>;
	private observe_informes: Subscriber<any>;
	private informes: HashTable<number, InformeAuditoria>;
	private year_min: number = 2014;
	private year_max: number = 2019;
	private selected_region: string;
	private selected_comuna: string;
	private temp_regional: any = {};
	private detail = 0; // 0: NACIONAL, 1: REGIONAL, 2: COMUNAL
	//construimos los metodos
	constructor(
		http: Http, 
		private router: Router, 
		@Inject(RestService) private rest:RestService, 
		private blackscreen:BlackscreenService,
		@Inject(TimelineService) private timeline:TimelineService
	) {
		
		this.informes = new HashTable<number, InformeAuditoria>();
	}

	public getMetadataRegional():Observable<any>{
		this.updateDate();
		this.setDetail(0);
		return new Observable(observer => {
            this.observe_regional = observer;
            var id = 'auditoria-service-'+Math.random();
            this.blackscreen.show('Cargando...', id);
            if(this.auditoria_region == null){
               this.rest.get('/auditoria/regiones/informes?year=').subscribe((res) => {
					this.auditoria_region = res;
					var regiones = this.calculeMaxMinRegional();
                    this.blackscreen.hide(id);
					observer.next(regiones);
                });
            } else {
				var regiones = this.calculeMaxMinRegional();
                observer.next(regiones);
                this.blackscreen.hide(id);
            }
        });
	}
	public calculeMaxMinRegional(){
		let max = 0;
		let min = null;
		let total = 0;
		let regiones: any = {};
		for(let region in this.auditoria_region){
			let local = 0;
			for(let anio in this.auditoria_region[region]){
				if(parseInt(anio) >= this.year_min && parseInt(anio) < this.year_max){
					local += this.auditoria_region[region][anio]['TOTAL_INFORMES'];
				}
			}
			if(local > max) max = local;
			if(!local || local < min) min = local;
			total += local;
			regiones[region] = {  
				TOTAL_INFORMES: local,
				C_REG_SUBDERE: region
			};
		}
		this.auditoria_est_region['MAX'] = max;
		this.auditoria_est_region['MIN'] = min;
		this.auditoria_est_region['TOTAL'] = total;
		this.temp_regional = regiones;
		return {
			REGIONES: regiones
		}
	}
	public getMaxRegional(){
		return this.auditoria_est_region['MAX'];
	}
	public getMinRegional(){
		return this.auditoria_est_region['MIN'];
	}
	public getTotalRegional(region: string = null){
		if(region){
			return this.temp_regional[region].TOTAL_INFORMES;
		}
		return this.auditoria_est_region['TOTAL'];
	}
	public getMetadataComunal(region:string):Observable<any>{
		var id = 'auditoria-service-'+Math.random();
		this.blackscreen.show('Cargando...', id);
		this.setDetail(1);
		return new Observable(observer => {
			this.observe_comunal = observer;
			if(!this.auditoria_comunal[region]){
				this.rest.get('/auditoria/regiones/'+region+'/comunas/informes').subscribe(data => {
					this.auditoria_comunal[region] = data;
					let comunas = this.calculeMaxMinComunal(region);
					this.blackscreen.hide(id);
					observer.next(comunas);
				});
			}
			else{
				let comunas = this.calculeMaxMinComunal(region);
				observer.next(comunas);
				this.blackscreen.hide(id);
			}
		});
	}
	public calculeMaxMinComunal(region: string){
		let max = 0;
		let min = null;
		let total = 0;
		this.selected_region = region;
		let comunas: any = {};
		for(let comuna in this.auditoria_comunal[region]){
			let local = 0;
			for(let anio in this.auditoria_comunal[region][comuna]){
				if(parseInt(anio) >= this.year_min && parseInt(anio) < this.year_max){
					local += this.auditoria_comunal[region][comuna][anio]['TOTAL_INFORMES'];
				}
			}
			if(local > max) max = local;
			if(!local || local < min) min = local;
			total += local;
			comunas[comuna] = {  
				TOTAL_INFORMES: local,
				CODIGOSUBDERE: comuna
			};
		}
		this.auditoria_est_comunal['MAX'] = max;
		this.auditoria_est_comunal['MIN'] = min;
		this.auditoria_est_comunal['TOTAL'] = total;
		return {
			COMUNAS: comunas
		}
	}
	public getMaxComunal(){
		return this.auditoria_est_comunal['MAX'];
	}
	public getMinComunal(){
		return this.auditoria_est_comunal['MIN'];
	}
	public getTotalComunal(){
		return this.auditoria_est_comunal['TOTAL'];
	}
	public getInformesComuna(comuna:string):Observable<any>{
		var id = 'auditoria-service-'+Math.random();
		this.blackscreen.show('Cargando...', id);
		this.setDetail(2);
		this.selected_comuna = comuna;
		return new Observable(observer => {
			this.observe_informes = observer;
			if(!this.informes_comuna[comuna]){
				this.rest.get('/auditoria/comunas/'+comuna+'/informes').subscribe(data => {
					this.informes_comuna[comuna] = data;
					let informes = this.calculeInformes(comuna);
					this.blackscreen.hide(id);
					observer.next(informes);
				});
			}
			else{
				let informes = this.calculeInformes(comuna);
				observer.next(informes);
				this.blackscreen.hide(id);
			}
		});
	}
	public calculeInformes(comuna: string){
		this.selected_comuna = comuna;
		let informes: any[] = [];
		for(let index in this.informes_comuna[comuna]){
			if(parseInt(this.informes_comuna[comuna][index].ANOINFORME) >= this.year_min && parseInt(this.informes_comuna[comuna][index].ANOINFORME) < this.year_max){
				informes.push(this.informes_comuna[comuna][index])
			}
		}
		return informes
	}
	public getInforme(id_actividad: number) : Observable <InformeAuditoria> {
		return new Observable(observe => {
			if (this.informes.has(id_actividad)) {
				observe.next(this.informes.get(id_actividad));
				observe.complete();
				return;
			}

			this.rest.get('/auditoria/actividades/' + id_actividad + '/informe').subscribe(
				res => {
					let informe = new InformeAuditoria(res[0]);
					this.informes.put(id_actividad, informe);
					observe.next(informe);
					observe.complete();
				},
				err => {
					console.error(err)
				}
			);
		});
	}

	public getInformesHallazgosComuna(id_comuna: number) : Observable <HashTable<string, InformeAuditoria>> {
		return new Observable(observe => {
			this.rest.get('/auditoria/comunas/' + id_comuna + '/informes').subscribe(
				res => {
					var informes = new HashTable<string, InformeAuditoria>();
					res.forEach((element:any) => {
						let informe = new InformeAuditoria(element);
						informes.put(informe.IDACTIVIDAD, informe);
					});
					observe.next(informes);
					observe.complete();
				},
				err => {
					console.error(err)
				}
			);
		});
	}
	public onTimeLineChange(event: any): void {
		this.year_min = event[0];
		this.year_max = event[1];
		if(this.detail == 0){
			var id = 'auditoria-service-'+Math.random();
            this.blackscreen.show('Cargando...', id);
			var regiones = this.calculeMaxMinRegional();
			this.observe_regional.next(regiones);
			this.blackscreen.hide(id);
		}
		else if(this.detail == 1){
			var id = 'auditoria-service-'+Math.random();
			this.blackscreen.show('Cargando...', id);
			this.calculeMaxMinRegional();
			var comunas = this.calculeMaxMinComunal(this.selected_region);
			this.observe_comunal.next(comunas);
			this.blackscreen.hide(id);
		}
		else if(this.detail == 2){
			var id = 'auditoria-service-'+Math.random();
			this.blackscreen.show('Cargando...', id);
			this.calculeMaxMinRegional();
			var comunas = this.calculeMaxMinComunal(this.selected_region);
			this.observe_comunal.next(comunas);
			let informes = this.calculeInformes(this.selected_comuna);
			this.observe_informes.next(informes);
			this.blackscreen.hide(id);
		}
	}
	public setDetail(status: number){
		this.detail = status;
	}
	public getYearMin(){
		return this.year_min;
	}
	public getYearMax(){
		return this.year_max;
	}
	public showTimeline(){
		this.timeline.changeToDouble(2014, (new Date()).getUTCFullYear()+1);
		this.timeline.showTimeline();
	}
	public regService(){
		this.timeline.registerService(this);
	}
	private updateDate() {
		this.year_min = this.timeline.getMin();
		this.year_max = this.timeline.getMax();
	}
}
