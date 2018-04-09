import { Component, OnInit } from '@angular/core';
import { CartografiaService } from '../../services/cartografia/cartografia.service';
import { MapService } from '../../services/map/map.service';
import { RestService } from '../../services/rest/rest.service';
import { ArbolService } from '../../services/arbol/arbol.service';
import { ILayer } from '../../services/arbol/layer.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ChartDef } from '../../classes/chartdef';
import { Commune } from '../../classes/commune';
import { ObservacionAuditoria } from '../../classes/observacionAuditoria';
import { InformeAuditoria } from '../../classes/informeAuditoria';
import { HashTable } from '../../classes/hashtable';
import { AuditoriaService } from '../../services/data/auditoria.service';
import { fade, move } from '../../animations';
import { HallazgosService } from '../../services/data/hallazgos.service';

declare var ol:any; // DECLARACIÓN DE VARIABLE GLOBAL DE OPEN LAYERS 4
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-hallazgos',
  templateUrl: 'hallazgos.component.html',
  styleUrls: ['hallazgos.component.css'],
  animations: [fade, move]
})
export class HallazgosComponent implements OnInit, ILayer {
  private showme:boolean = false;
  private cartografia:any;
  private cartografia_comunal:any = {};
  private carto_status:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private escala:string[] = ["#CEECFC","#AEBEF2","#8C97E8","#6A70DE","#484AB9"];
  private meta_data_regional:any;
  private meta_data_comunal:any;
  private escalas_informes:any[] = [];
  private poligonos_regionales:any[] = [];
  private poligonos_comunales:any[] = [];
  private selected_regional:any = null;
  private selected_comunal:any = null;
  private Math:any;
  private list_auditorias:any[];
  private title_auditoria:string;
  private pool_observations:any[];
  private paginator_observations:any[];
  private pages:any[] = [];
  private actual_page:number = 1;
  private pagination_config:number = 10;
  private borde_poligono:any = [140,140,140,1];
  private estadistica_total:any = {};
  public name = "Observaciones de Auditoría";
  public date = "2014 a la fecha";
  public doughnut_data:ChartDef;
  public doughnutChartType:string = 'doughnut';
  private lock_status = false;
  private auditoria_view:boolean = false;
  private view_communes:Commune[] = [];
  private list_observaciones: ObservacionAuditoria[];
  private current_observation: ObservacionAuditoria;
  //CONSTRUCTOR
  constructor(
    private carto: CartografiaService,
    private map: MapService,
    private rest: RestService,
    private arbol: ArbolService,
    private hallazgosService: HallazgosService
  ) {
    this.arbol.registerLayer(this);
  }
  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.hallazgosService.showTimeline();
    this.hallazgosService.regService();
    this.map.clear();
    this.map.setLatLng(-70.00,-33.00);
    this.map.setZoom(4);
    this.getCartografiRegional();
    this.fetchDataRegional();
  }
  private getCartografiRegional(){
    this.carto.getRegional().subscribe(
        data => { 
            this.cartografia = data;
            this.carto_status.next(true);
        },
        err => console.error(err)
    );
  }
  private getCartografiaComunal(region:string){
    this.carto.getComunal(region).subscribe(
        data => {
            this.cartografia_comunal[region] = data;
            this.drawPolygonComunal(data,region);
        },
        err => console.error(err)
    );
  }
  private fetchDataRegional(){
    this.hallazgosService.getMetadataRegional().subscribe(
        data => {
          this.carto_status.subscribe((value) => {
            if(value){
              this.meta_data_regional = data;
              this.makeLeyenda(this.hallazgosService.getMaxRegional());
              this.drawPolygonsRegional(data.REGIONES);
            }
          });
          
        },
        err => console.error(err)
    );
  }
  private makeLeyenda(total:number){
    this.escalas_informes = [];
    let quintil = total/5;
    if(total == 0){
      this.escalas_informes.push({
        COLOR: this.escala[0],
        MIN: 0,
        MAX: " - " + 0
      });
      return;
    }
    for(let i=0;i<5;i++){
      this.escalas_informes.push({
        COLOR: this.escala[i],
        MIN: Math.floor(i*quintil)+1,
        MAX: (i == (4)) ? "+" : " - " + Math.floor((i + 1) * quintil)
      });
    }  
  }
  private getColorByTotal(total:number, max:number){
    let quintil = max/5;
    if(Math.floor(total/quintil) == 5) return this.escala[4];
    return this.escala[Math.floor(total/quintil)]; 
  }
  private drawPolygonsRegional(data:any){
    var self = this;
    var bounds:any = [];
    this.clearRegionalPolygons();
    for(let i=0; i<this.cartografia.length;i++){
      if(this.cartografia[i].FIT == 1) bounds.push(JSON.parse(this.cartografia[i].GEOMREGIONAL).coordinates);
      var poly = this.map.setMultiPolygonHSL(JSON.parse(this.cartografia[i].GEOMREGIONAL),{
        strokecolor: this.borde_poligono,
        stroke: 1,
        fillcolor: this.getColor(data[this.cartografia[i].C_REG].TOTAL_HALLAZGOS, this.hallazgosService.getMaxRegional()),
        hovercolor: [226,139,46,0.7],
        click: function(e:any,layer:any){
          for(let l=0;l<self.poligonos_regionales.length;l++){
            self.map.getMap().getMap().removeLayer(self.poligonos_regionales[l]);
          }
          let centroide = JSON.parse(self.cartografia[i].CENTROIDE);
          self.map.setLatLng(parseFloat(centroide.lng),parseFloat(centroide.lat));
          self.map.setZoom(9);
          self.getCartografiaComunal(self.cartografia[i].C_REG);
        },
        mouseenter: function(e:any,layer:any){
          self.selected_regional = self.cartografia[i];
        },
        mouseout: function(e:any,layer:any){
          self.selected_regional = null;
        }
      });
      this.poligonos_regionales.push(poly);
    }
    this.map.fitToGeometry(this.map.getExentMultiPolygon(bounds));
  }
  private drawPolygonComunal(datas:any, region:string){
    var self = this;
    this.hallazgosService.getMetadataComunal(region).subscribe(
        data => {
          this.meta_data_comunal = data;
          this.makeLeyenda(this.hallazgosService.getMaxComunal());
          // Desde aca dibujamos los poligonos comunales
          var self = this;
          var bounds:any = [];
          this.clearComunalPolygons();
          for(let i=0; i<datas.length;i++){
            if(datas[i].FIT == 1) bounds.push(JSON.parse(datas[i].GEOMCOMUNAL).coordinates);
            var total = data.COMUNAS[datas[i].CINE_COM];
            var poly = this.map.setMultiPolygonHSL(JSON.parse(datas[i].GEOMCOMUNAL),{
              strokecolor: self.borde_poligono,
              stroke: 1,
              fillcolor: this.getColor(((typeof total != "undefined")? total.TOTAL_HALLAZGOS:0),this.hallazgosService.getMaxComunal()),
              hovercolor: [226,139,46,0.7],
              click: function(e:any,layer:any){
                 // ACA SE DESPLIEGA LA VENTANA DE INFORMES DE AUDITORIA
                  self.lock_status = true;
                  self.auditoria_view= true;
                  self.hallazgosService.getHallazgosComuna(datas[i].CINE_COM).subscribe(
                    data_inf => {
                      var estadistica:any = {};
                      self.estadistica_total = {
                        PRODUCTOS: {
                          value: 0,
                          label: "Total Informes"
                        },
                        observaciones: {
                          ALTAS: {
                            value: 0,
                            label: "Altamente Complejas"
                          },
                          COMPLEJAS: {
                            value: 0,
                            label: "Complejas"
                          },
                          MEDIAS: {
                            value: 0,
                            label: "Medias"
                          },
                          LEVES: {
                            value: 0,
                            label: "leves"
                          }
                        },
                        SUBSANADAS: {
                          value: 0,
                          label: "Subsanados"
                        },
                        TOTAL: {
                          value: 0,
                          label: "Total Observaciones"
                        }
                      };
                      for(let i=0; i<data_inf.length;i++){
                        if(typeof estadistica[data_inf[i].AREASERVICIO] == "undefined") estadistica[data_inf[i].AREASERVICIO] = {
                          PRODUCTOS: [],
                          observaciones: [],
                          ALTAS: 0,
                          COMPLEJAS: 0,
                          MEDIAS: 0,
                          LEVES: 0,
                          TOTAL: 0,
                          SUBSANADAS: 0
                        };

                        if(estadistica[data_inf[i].AREASERVICIO].PRODUCTOS.indexOf(data_inf[i].IDACTIVIDAD) == -1) {
                          estadistica[data_inf[i].AREASERVICIO].PRODUCTOS.push(data_inf[i].IDACTIVIDAD);
                          self.estadistica_total.PRODUCTOS.value++;
                        }
                        if(data_inf[i].COMPLEJIDADSERVICIO == "LEVEMENTE_COMPLEJA") { 
                          estadistica[data_inf[i].AREASERVICIO].LEVES++;
                          self.estadistica_total.observaciones.LEVES.value++;
                        }
                        else if(data_inf[i].COMPLEJIDADSERVICIO == "COMPLEJA"){
                          estadistica[data_inf[i].AREASERVICIO].COMPLEJAS++;
                          self.estadistica_total.observaciones.COMPLEJAS.value++;
                        } 
                        else if(data_inf[i].COMPLEJIDADSERVICIO == "MEDIANAMENTE_COMPLEJA"){
                          estadistica[data_inf[i].AREASERVICIO].MEDIAS++;
                          self.estadistica_total.observaciones.MEDIAS.value++;
                        }
                        else if(data_inf[i].COMPLEJIDADSERVICIO == "ALTAMENTE_COMPLEJA"){ 
                          estadistica[data_inf[i].AREASERVICIO].ALTAS++;
                          self.estadistica_total.observaciones.ALTAS.value++;
                        }
                        
                        if(typeof data_inf[i].ESTADOSUBSANACION != "undefined" && data_inf[i].ESTADOSUBSANACION == "SUBSANADA"){ 
                          estadistica[data_inf[i].AREASERVICIO].SUBSANADAS++;
                          self.estadistica_total.SUBSANADAS.value++;
                        }
                        
                        estadistica[data_inf[i].AREASERVICIO].observaciones.push(data_inf[i]);
                        estadistica[data_inf[i].AREASERVICIO].TOTAL++;
                        self.estadistica_total.TOTAL.value++;
                      }
                      self.map.clearMouseInteraction();
                      self.title_auditoria = datas[i].COMUNA;
                      self.list_auditorias = estadistica;
                      // self.setPoolAndPages(data_inf);
                      self.doughnut_data = new ChartDef();
                      self.doughnut_data.setOption("legend", {position: 'bottom'});
                      self.doughnut_data.setColors(["#c70039", "#ff7e33", "#ffc30f", "#b0dd33"]);
                      for (let element in self.estadistica_total.observaciones) {
                        self.doughnut_data.setElement(
                          self.estadistica_total.observaciones[element].label, 
                          self.estadistica_total.observaciones[element].value
                        );
                      }
                      
                    },
                    err => {
                      console.error(err)
                      self.lock_status = false;
                    }
                  );
              },
              mouseenter: function(e:any,layer:any){
                if(!self.lock_status){
                  self.selected_comunal = datas[i];
                }
              },
              mouseout: function(e:any,layer:any){
                if(!self.lock_status){
                  self.selected_comunal = null;
                }
              }
            });
            self.view_communes.push(new Commune(datas[i].COMUNA, poly,datas[i]));
            this.poligonos_comunales.push(poly);
          }
          this.map.fitToGeometry(this.map.getExentMultiPolygon(bounds));
        },
        err => console.error(err)
    );
  }
  private setCommune(commune:any){
    if(!this.lock_status){
      this.selected_comunal = commune;
    }
  }
  private clearComunalPolygons(){
    for(let l=0;l<this.poligonos_comunales.length;l++){
      this.map.getMap().getMap().removeLayer(this.poligonos_comunales[l]);
    }
    this.poligonos_comunales = [];
  }
  private clearRegionalPolygons(){
    for(let l=0;l< this.poligonos_regionales.length;l++){
      this.map.getMap().getMap().removeLayer( this.poligonos_regionales[l]);
    }
     this.poligonos_regionales = [];
  }
  private setPoolAndPages(data:any[]){
    this.pool_observations = data;
    var auditorias:any[] = [];
    for(let i=0; i<this.pagination_config;i++){
      if(typeof this.pool_observations[i] != "undefined") auditorias.push(this.pool_observations[i]);
    }
    this.paginator_observations = auditorias;
    this.actual_page = 1;
    let i=0;
    this.pages = Array(Math.ceil(this.pool_observations.length/this.pagination_config)).fill(i++).map((x:any,i:any)=>i+1);
  }
  private paginator(page:number){
    this.actual_page = page;
    var auditorias:any[] = [];
    for(let i=((page-1)*this.pagination_config); i<(page)*this.pagination_config;i++){
      if(typeof this.pool_observations[i] != "undefined") auditorias.push(this.pool_observations[i]);
    }
    this.paginator_observations = auditorias;
  }
  private filter(type:number){
    var pool:any[] = [];
    switch(type){
      case 1:
        pool = this.pool_observations.sort(function(a, b){
          return a.IDACTIVIDAD-b.IDACTIVIDAD;
        });
        break;
      case 2:
        pool = this.pool_observations.sort(function(a, b){
          return a.IDACTIVIDAD-b.IDACTIVIDAD;
        });
        break;
      case 3:
        pool = this.pool_observations.sort(function(a, b){
          return a.IDOBSERVACION-b.IDOBSERVACION;
        });
        break;
      case 4:
        pool = this.pool_observations.sort(function(a, b){
          return a.PERIODOACTIVIDAD.charCodeAt(0)-b.PERIODOACTIVIDAD.charCodeAt(0);
        });
        
        break;
      case 5:
        pool = this.pool_observations.sort(function(a, b){
          return a.NOMBRESERVICIO.charCodeAt(0)-b.NOMBRESERVICIO.charCodeAt(0);
        });
        break;
      case 6:
        pool = this.pool_observations.sort(function(a, b){
          return a.AREASERVICIO.charCodeAt(0)-b.AREASERVICIO.charCodeAt(0);
        });
        break;
      case 7:
        pool = this.pool_observations.sort(function(a, b){
          return a.COMPLEJIDADSERVICIO.charCodeAt(0)-b.COMPLEJIDADSERVICIO.charCodeAt(0);
        });
        break;
    }
    this.setPoolAndPages(pool);
  }
  private backRegional(){
    for(let l=0;l<this.poligonos_comunales.length;l++){
      this.map.getMap().getMap().removeLayer(this.poligonos_comunales[l]);
    }
    this.poligonos_comunales = [];
    this.map.setLatLng(-70.00,-33.00);
    this.map.setZoom(4);
    this.selected_regional = null;
    this.fetchDataRegional();
    this.makeLeyenda(this.hallazgosService.getMaxRegional());
    this.map.removeZoomChanged();
    this.view_communes = [];
  }
  private closeInformes(){
    this.list_auditorias=null;
    this.selected_comunal = null;
    this.lock_status = false;
    this.auditoria_view = false;
    this.list_observaciones = null;
    this.current_observation = null;
    this.paginator_observations = null;
    this.hallazgosService.setDetail(1);
  }
  public show(){
    this.showme = true;
  }
  public hide(){
    this.showme = false;
  }

  private showDetails(auditoria: any, filter: string = null) {
    this.hallazgosService.getInformesHallazgosComuna(this.selected_comunal.CINE_COM).subscribe(data => {
      this.list_observaciones = [];

      auditoria.value.observaciones.forEach((element: any) => {
        if (filter != null && element.COMPLEJIDADSERVICIO != filter) {
          return;
        }
        var observacion = new ObservacionAuditoria(element);
        observacion.informe = data.get(observacion.IDACTIVIDAD.toString());
        this.list_observaciones.push(observacion);
      });

      this.list_observaciones.sort((a: any, b: any) => {
        return a.IDOBSERVACION - b.IDOBSERVACION;
      });
      this.list_observaciones.sort((a: any, b: any) => {
        return a.IDACTIVIDAD - b.IDACTIVIDAD;
      });
      this.list_observaciones.sort((a: any, b: any) => {
        return b.PERIODOACTIVIDAD - a.PERIODOACTIVIDAD;
      });
      this.setPoolAndPages(this.list_observaciones);
    });
  }

  public showObservation(observation: ObservacionAuditoria) {
    this.current_observation = observation;
  }

  public backResumen() {
    this.list_observaciones = null;
    this.paginator_observations = null;
  }

  public backObservations() {
    this.current_observation = null;
  }
  private getDate(){
    return "Ene "+this.hallazgosService.getYearMin()+" a Dic "+(this.hallazgosService.getYearMax()-1);
  }
  private getColor(total:number, max:number){
    if(max === 0) max = 1;
    var porcentaje = total/max*100;
    var color = 99.28994 - 0.79882*porcentaje;
    return [241, 65, color];
  }
}
