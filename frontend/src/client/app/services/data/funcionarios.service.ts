import { Injectable, Inject} from '@angular/core';
import { Config } from '../../shared/config/env.config';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { RestService } from '../rest/rest.service';
import { BlackscreenService } from '../blackscreen/blackscreen.service';
import { ContratosSiaper } from '../../classes/contratossiaper';
import { FuncionariosSiaper } from '../../classes/funcionariossiaper';
import { Funcionario } from '../../classes/funcionario';
import { FuncionarioStatSiaper } from '../../classes/funcionarios_stat';
import { FuncionarioRegion } from '../../classes/funcionarioregion';
import { FuncionarioCalidad } from '../../classes/funcionariocalidad';
import { FuncionarioComuna } from '../../classes/funcionariocomuna';
import { HashTable } from '../../classes/hashtable';
import { ITimeline } from '../../classes/itimeline';
import { TimelineService } from '../../shared/timeline/timeline.service';
import { Subscriber } from 'rxjs/Subscriber';

@Injectable()
export class FuncionariosService implements ITimeline{
    private funcionarios_nacional: HashTable<number,HashTable<number,FuncionarioRegion>> = null;
    private max_nacional: number = 0;
    private max_regional: HashTable<number,HashTable<number,number>>;
    private total_nacional: number = 0;
    private total_regional: HashTable<number,HashTable<number,number>>;
    private total_comunal: HashTable<number,HashTable<number,number>>;
    private resumenes_contratos: HashTable<number,HashTable<number,FuncionarioStatSiaper[]>>;
    //private funcionarios_region: HashTable<number,HashTable<number,FuncionarioStatSiaper[]>> = null;
    private servidores_cca: HashTable<number,HashTable<string,Funcionario[]>>;
    private contratos_run: HashTable<number,HashTable<string,Funcionario[]>>;
    private funcionarios_region: HashTable<number,HashTable<number,HashTable<number,FuncionarioComuna>>> = null;
    private detalle_comunal:any = {};
    private region_selected: number;
    private comuna_selected: string;
    private area:number;
    private contract_frame:number;
    private run: string;
    // Observers
    private detail: number = 1;
    private observe_regional: Subscriber<any>;
    private observe_comunal: Subscriber<any>;
    private observe_metadata_comunal: Subscriber<any>;
    private observe_detail_comunal: Subscriber<any>;
    private observe_servidores_publicos_comunal: Subscriber<any>;
    private observe_servidores_run_comunal: Subscriber<any>;

    //TODO: Al implementar la línea de tiempo eliminar este horrible hardcode
    private year: string = "2017";
    //construimos los metodos
    constructor(http: Http, private router: Router, @Inject(RestService) private rest:RestService, 
    private blackscreen:BlackscreenService, @Inject(TimelineService) private timeline:TimelineService) {
        //this.funcionarios_region = new HashTable<number,HashTable<number,FuncionarioStatSiaper[]>>();
        this.funcionarios_nacional = new HashTable<number,HashTable<number,FuncionarioRegion>>("funcionarios_nacionales");
        this.funcionarios_region = new HashTable<number,HashTable<number,HashTable<number,FuncionarioComuna>>>();
        this.resumenes_contratos = new HashTable<number,HashTable<number,FuncionarioStatSiaper[]>>();
        this.servidores_cca = new HashTable<number,HashTable<string,Funcionario[]>>();
        this.contratos_run = new HashTable<number,HashTable<string,Funcionario[]>>();
        this.total_regional = new HashTable<number,HashTable<number,number>>();
        this.max_regional = new HashTable<number,HashTable<number,number>>();
        this.total_comunal = new HashTable<number,HashTable<number,number>>();
    }
    public getMetadataNacional():Observable<HashTable<number,FuncionarioRegion>>{
        return new Observable(observe =>{
            this.detail = 1;
            this.observe_regional = observe;
            /*ToDo: Renovar por version nueva del fadebox*/
            var id = 'funcionarios-service-'+Math.random();
            this.blackscreen.show('Cargando...', id);
            this.getFuncionariosNacional(parseInt(this.year)).subscribe(data => {
                this.blackscreen.hide(id);
                observe.next(data);
            });
        });
    }
    private getFuncionariosNacional(year: number): Observable<HashTable<number,FuncionarioRegion>>{
        return new Observable(observe => {
            let total_nacional = 0;
            let max_nacional = 0;
            if(!this.funcionarios_nacional.has(year)){
                this.rest.get('/siaper/regions?type=servant&year='+year).subscribe(regiones => {
                    let servidores = new HashTable<number,FuncionarioRegion>();
                    for(let key in regiones){
                        let funcionarios_region = new FuncionarioRegion();
                        funcionarios_region.TOTAL = regiones[key].TOTAL;
                        total_nacional += funcionarios_region.TOTAL;    
                        max_nacional = (max_nacional < funcionarios_region.TOTAL) ? funcionarios_region.TOTAL : max_nacional;
                        servidores.put(parseInt(key),funcionarios_region);
                    }
                    this.total_nacional = total_nacional;
                    this.max_nacional = max_nacional;
                    this.funcionarios_nacional.put(year, servidores);
                    observe.next(servidores);
                    observe.complete();
                });
            } else {
                let servidores = this.funcionarios_nacional.get(year);
                servidores.forEach((key:any,data:any)=>{
                    total_nacional += data.TOTAL;   
                    max_nacional = (max_nacional < data.TOTAL) ? data.TOTAL : max_nacional;
                });
                this.total_nacional = total_nacional;
                this.max_nacional = max_nacional;
                observe.next(servidores);
                observe.complete();
            }   
        });
    }
    public getServidoresRegional(region:number): Observable<HashTable<number,FuncionarioComuna>>{
        return new Observable(observer => {
            this.detail = 2;
            this.observe_comunal = observer;
            this.region_selected = region;
            var id = 'funcionarios-service-'+Math.random();
            this.blackscreen.show('Cargando...', id);
            this.getServidoresRegionalData(region, parseInt(this.year)).subscribe(data => {
                this.blackscreen.hide(id);
                observer.next(data);
            });
        });
    }
    public getServidoresRegionalData(region: number, year: number): Observable<HashTable<number,FuncionarioComuna>>{
        return new Observable(observer => {
            if(!this.funcionarios_region.has(year)) this.funcionarios_region.put(year, new HashTable<number,HashTable<number,FuncionarioComuna>>());
            let datos: HashTable<number,HashTable<number,FuncionarioComuna>> = this.funcionarios_region.get(year);
            if(!datos.has(region)){
                this.rest.get('/siaper/regions/'+region+'/communes?type=servant&year='+year).subscribe(response => {
                    let max_regional = (this.max_regional.has(year)) ? this.max_regional.get(year) : new HashTable<number,number>();
                    let total_regional = (this.total_regional.has(year)) ? this.total_regional.get(year) : new HashTable<number,number>();
                    max_regional.put(region,0);
                    total_regional.put(region,0);
                    var comunas: HashTable<number,FuncionarioComuna> = new HashTable<number,FuncionarioComuna>();
                    for(let key_comuna in response){
                        let total_comunal = (this.total_comunal.has(year)) ? this.total_comunal.get(year) : new HashTable<number,number>();
                        total_comunal.put(parseInt(key_comuna),0);
                        let comuna = new FuncionarioComuna(response[key_comuna]);
                        max_regional.put(region, (max_regional.get(region) < comuna.TOTAL) ? comuna.TOTAL : max_regional.get(region));
                        total_regional.put(region,total_regional.get(region)+response[key_comuna].TOTAL);
                        total_comunal.put(parseInt(key_comuna),response[key_comuna].TOTAL);
                        comunas.put(parseInt(key_comuna), comuna);
                        this.total_comunal.put(year, total_comunal);
                    }
                    this.total_regional.put(year,total_regional);
                    this.max_regional.put(year,max_regional);
                    datos.put(region, comunas);
                    observer.next(comunas);
                });
            }
            else{
                observer.next(datos.get(region));
            }
        });
    }
    public getMetadataComunal(comuna:string):Observable<FuncionarioStatSiaper[]>{
        return new Observable(observer => {
            this.detail = 3;
            this.observe_metadata_comunal = observer;
            this.comuna_selected = comuna;
            var id = 'funcionarios-service-'+Math.random();
            this.blackscreen.show('Cargando...', id);
            this.getMetadataComunalData(comuna, parseInt(this.year)).subscribe(data => {
                this.blackscreen.hide(id);
                observer.next(data);
            });
        });
    }
    public getMetadataComunalData(comuna: string, year: number):Observable<FuncionarioStatSiaper[]>{
        var id = 'funcionarios-service-'+Math.random();
        this.blackscreen.show('Cargando...', id);
        return new Observable(observer => {
            if(!this.resumenes_contratos.has(year)) this.resumenes_contratos.put(year, new HashTable<number,FuncionarioStatSiaper[]>());
            let datos: HashTable<number,FuncionarioStatSiaper[]> = this.resumenes_contratos.get(year);
            if(datos.has(parseInt(comuna))) {
                this.blackscreen.hide(id);
                observer.next(datos.get(parseInt(comuna)));
                observer.complete();
            } else {
                this.rest.get('/siaper/communes/'+comuna+'/summary_contracts?year='+year).subscribe(data => {
                    let resumen_contratos: FuncionarioStatSiaper[] = []; 
                    for(let key in data){
                        resumen_contratos.push(new FuncionarioStatSiaper(data[key]));
                    }
                    datos.put(parseInt(comuna), resumen_contratos);
                    this.blackscreen.hide(id);
                    observer.next(resumen_contratos);
                    observer.complete();
                });
            }
        });
    }
    public getDetailComunal(comuna:string):Observable<ContratosSiaper[]>{
        return new Observable(observer => {
            var id = 'funcionarios-service-'+Math.random();
            this.blackscreen.show('Cargando...', id);
            this.detail = 4;
            this.observe_detail_comunal = observer;
            this.getDetailComunalData(comuna, parseInt(this.year)).subscribe(data => {
                this.blackscreen.hide(id);
                observer.next(data);
            });
        });
    }
    public getDetailComunalData (comuna: string, year: number):Observable<ContratosSiaper[]>{
        var id = 'funcionarios-service-'+Math.random();
        this.blackscreen.show('Cargando...', id);
        return new Observable(observer => {
            if(this.detalle_comunal[comuna] == null){
                this.rest.get('/siaper/communes/'+comuna+'/contracts?year='+this.year).subscribe(data => {
                    let response = <ContratosSiaper[]> data;
                    this.detalle_comunal[comuna] = response;
                    this.blackscreen.hide(id);
                    observer.next(data);
                    observer.complete();
                });
            } else {
                observer.next(this.detalle_comunal[comuna]);
                observer.complete();
                this.blackscreen.hide(id);
            }
        });
    }
    public getFuncionariosComunal(comuna:string): Observable<Funcionario[]> {
        var id = 'funcionarios-service-'+Math.random();
        this.blackscreen.show('Cargando...', id);
        if(this.detalle_comunal[comuna] == null) {
            return this.rest.getMap('/siaper/communes/'+comuna+'/public_servants?year='+this.year).map((res:Response) => {
                let response = <Funcionario[]> res.json();
                this.detalle_comunal[comuna] = response;
                this.blackscreen.hide(id);
                return response;
            });
        }
        return new Observable(observer => {
              observer.next(this.detalle_comunal[comuna]);
              this.blackscreen.hide(id);
        });
    }
    public getServidoresPublicos(commune:string, area:number, contract_frame:number): Observable<Funcionario[]>{
        var id = 'funcionarios-service-'+Math.random();
        this.blackscreen.show('Cargando...', id);
        return new Observable(observer => {
            this.detail = 5;
            this.observe_servidores_publicos_comunal = observer;
            this.area = area;
            this.contract_frame = contract_frame;
            this.getServidoresPublicosData(commune, area, contract_frame, parseInt(this.year)).subscribe(data => {
                this.blackscreen.hide(id);
                observer.next(data);
            });
        });
       
    }
    public getServidoresPublicosData(commune:string, area:number, contract_frame:number, year: number): Observable<Funcionario[]>{
        var id = 'funcionarios-service-'+Math.random();
        this.blackscreen.show('Cargando...', id);
        return new Observable(observer => {
            if(!this.servidores_cca.has(year)) this.servidores_cca.put(year, new HashTable<string,Funcionario[]>());
            let datos: HashTable<string,Funcionario[]> = this.servidores_cca.get(year);
            let key = commune+"_"+area+"_"+contract_frame;
            if(datos.has(key)){
                this.blackscreen.hide(id);
                observer.next(datos.get(key));
                observer.complete();
            } else {
                this.rest.get('/siaper/communes/'+commune+'/public_servants?contract_frame='+contract_frame+'&area='+area+'&year='+year).subscribe(data =>{
                    let servidores: Funcionario[] = [];
                    let indices: string[] = [];
                    data.forEach((element:any) => {
                        if(indices.indexOf(element.RUN) == -1){
                            servidores.push(new Funcionario(element));
                            indices.push(element.RUN);
                        }
                    });
                    datos.put(key, servidores);
                    this.blackscreen.hide(id);
                    observer.next(servidores);
                    observer.complete();
                });
            }
        });
    }
    public getContratosRun(run:string, commune:string): Observable<Funcionario[]>{
        var id = 'funcionarios-service-'+Math.random();
        this.blackscreen.show('Cargando...', id);
        return new Observable(observer => {
            this.detail = 6;
            this.observe_servidores_run_comunal = observer;
            this.run = run;
            this.getContratosRunData(run, commune, parseInt(this.year)).subscribe(data => {
                this.blackscreen.hide(id);
                observer.next(data);
            });
        });
    }
    public getContratosRunData(run:string, commune:string, year: number): Observable<Funcionario[]>{
        var id = 'funcionarios-service-'+Math.random();
        this.blackscreen.show('Cargando...', id);
        return new Observable(observer => {
            if(!this.contratos_run.has(year)) this.contratos_run.put(year, new HashTable<string,Funcionario[]>());
            let datos: HashTable<string,Funcionario[]> = this.contratos_run.get(year);
            if(datos.has(run)){
                this.blackscreen.hide(id);
                observer.next(datos.get(run));
                observer.complete();
            } else {
                this.rest.get('/siaper/public_servants/'+run+'?commune='+commune+'&year='+this.year).subscribe(data =>{
                    let contratos: Funcionario[] = [];
                    data.forEach((element:any) => {
                        contratos.push(new Funcionario(element));
                    });
                    datos.put(run, contratos);
                    this.blackscreen.hide(id);
                    observer.next(contratos);
                    observer.complete();
                });
            }
        });
    }
    public getServidorPublico(run:string , commune:string = null){
        var id = 'funcionarios-service-'+Math.random();
        this.blackscreen.show('Cargando...', id);
    }

    public getMaxNacional(){
        return this.max_nacional;
    }

    public getTotalNacional(){
        return this.total_nacional;
    }

    public getMaxRegional(region:number){
        if(this.max_regional.has(parseInt(this.year))){
            return this.max_regional.get(parseInt(this.year)).get(region);
        } else {
            return 1;
        }
    }

    public getTotalRegional(region:number){
        if(this.total_regional.has(parseInt(this.year))){
            return this.total_regional.get(parseInt(this.year)).get(region);
        } else {
            return 1;
        }
    }

    public getTotalComunal(comuna:number){
        if(this.total_comunal.has(parseInt(this.year))){
            return this.total_comunal.get(parseInt(this.year)).get(comuna);
        } else {
            return 1;
        }
    }

    onTimeLineChange(event: any): void {
        var id = 'funcionarios-service-'+Math.random();
        this.blackscreen.show('Cargando...', id);
        if(this.detail == 1){
            this.getFuncionariosNacional(parseInt(event)).subscribe(data => {
                this.observe_regional.next(data);
                this.year = event;
                this.blackscreen.hide(id);
            });
        } else if (this.detail == 2) {
            this.getFuncionariosNacional(parseInt(event)).subscribe(data_nacional => {
                this.getServidoresRegionalData(this.region_selected, parseInt(event)).subscribe(data_regional => {
                    this.year = event;
                    this.observe_comunal.next(data_regional);
                    this.blackscreen.hide(id);
                });
            });
           
        } else if (this.detail == 3) {
            this.getServidoresRegionalData(this.region_selected, parseInt(event)).subscribe(data_regional => {
                this.getMetadataComunalData(this.comuna_selected, parseInt(event)).subscribe(data_comunal => {
                    this.year = event;
                    this.observe_metadata_comunal.next(data_comunal);
                    this.observe_comunal.next(data_regional);
                    this.blackscreen.hide(id);
                });
            });
        } else if (this.detail == 4) {
            this.getServidoresRegionalData(this.region_selected, parseInt(event)).subscribe(data_regional => {
                this.getMetadataComunalData(this.comuna_selected, parseInt(event)).subscribe(data_comunal => {
                    this.year = event;
                    this.observe_metadata_comunal.next(data_comunal);
                    this.observe_comunal.next(data_regional);
                    this.blackscreen.hide(id);
                });
            });
        } else if (this.detail == 5) {
            this.getServidoresRegionalData(this.region_selected, parseInt(event)).subscribe(data_regional => {
                this.getMetadataComunalData(this.comuna_selected, parseInt(event)).subscribe(data_comunal => {
                    this.getServidoresPublicosData(this.comuna_selected, this.area, this.contract_frame, parseInt(event)).subscribe(data_servidores => {
                        this.year = event;
                        this.observe_metadata_comunal.next(data_comunal);
                        this.observe_comunal.next(data_regional);
                        this.observe_servidores_publicos_comunal.next(data_servidores);
                        this.blackscreen.hide(id);
                    });
                });
            });
        } else if (this.detail == 6) {
            this.getServidoresRegionalData(this.region_selected, parseInt(event)).subscribe(data_regional => {
                this.getMetadataComunalData(this.comuna_selected, parseInt(event)).subscribe(data_comunal => {
                    this.getServidoresPublicosData(this.comuna_selected, this.area, this.contract_frame, parseInt(event)).subscribe(data_servidores => {
                        this.getContratosRunData(this.run, this.comuna_selected, parseInt(event)).subscribe(data_contratos => {
                            this.year = event;
                            this.observe_metadata_comunal.next(data_comunal);
                            this.observe_comunal.next(data_regional);
                            this.observe_servidores_publicos_comunal.next(data_servidores);
                            this.observe_servidores_run_comunal.next(data_contratos);
                            this.blackscreen.hide(id);
                        });
                    });
                });
            });
        }
    }
    public showTimeLine(){
        this.timeline.hideTimeline();
        this.timeline.changeToSingle(2014, (new Date()).getUTCFullYear()-1);
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
