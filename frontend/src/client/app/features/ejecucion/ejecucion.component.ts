import { Component, OnInit } from '@angular/core';
import { CartografiaService } from '../../services/cartografia/cartografia.service';
import { MapService } from '../../services/map/map.service';
import { RestService } from '../../services/rest/rest.service';
import { EjecucionService } from '../../services/data/ejecucion.service';
import { ArbolService } from '../../services/arbol/arbol.service';
import { ILayer } from '../../services/arbol/layer.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CumplimientoRegional } from '../../classes/cumplimientoregional';
import { EjecucionSicogen } from '../../classes/ejecucion';
import { Commune } from '../../classes/commune';
import { CumplimientoService } from '../../services/data/cumplimiento.service';
import { Cumplimiento } from '../../classes/cumplimiento';
import { fade, move } from '../../animations';
declare var ol: any; // DECLARACIÓN DE VARIABLE GLOBAL DE OPEN LAYERS 4
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId:  module.id,
  selector:  'sd-ejecucion',
  templateUrl:  'ejecucion.component.html',
  styleUrls:  ['ejecucion.component.css'],
  animations: [fade, move]
})
export class EjecucionComponent implements OnInit, ILayer {
  private showme: boolean = false;
  private cartografia: any;
  private cartografia_comunal: any = {};
  private carto_status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private meta_data_regional: any;
  private meta_data_comunal: any;
  private meta_data_comunas: any;
  private poligonos_regionales: any[] = [];
  private poligonos_comunales: any[] = [];
  private selected_regional: any = null;
  private selected_comunal: any = null;
  private Math: any;
  private list_contabilidads: any[];
  private title_contabilidad: string;
  private pool_contabilidads: any[];
  private paginator_contabilidads: any[];
  private pages: any[] = [];
  private actual_page: number = 1;
  private pagination_config: number = 15;
  private borde_poligono: any = [140,140,140,1];
  private max_regional: number = 0;
  private lock_status = false;
  private view_communes: Commune[] = [];
  /*CUMPLIMIENTO*/
  public name = "Ejecución Contable";
  public date = "";
  private cumplimiento_regional: any;
  private leyenda: string = "regional";
  /*SCORE BOARD*/
  private ejecucion_por_nacional: any = { EJECUCION:  0, PRESUPUESTO_ACT:  0};
  private ejecucion_por_regional: any = { EJECUCION:  0, PRESUPUESTO_ACT:  0};
  private ejecucion_por_comunal: any = { EJECUCION:  0, PRESUPUESTO_ACT:  0};
  /* SEMAFORO MUNICIPAL */
  private evaluacion: Cumplimiento[] = [];
  private presupuestario: Cumplimiento[] = [];
  private contable: Cumplimiento[] = [];
  private semaforo_view: boolean = false;
  private ultimo_periodo: number;
  private ultimo_periodo_txt: string;
  private cumplimiento_data: any;
  //CONSTRUCTOR
  constructor(private carto: CartografiaService, private map: MapService, private rest: RestService, private arbol: ArbolService,
    private ejecucion: EjecucionService, private cumplimiento: CumplimientoService) {
    this.arbol.registerLayer(this);
  }
  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.cumplimiento.regService();
    this.cumplimiento.hideTimeline();
    this.map.clear();
    this.map.setLatLng(-70.00,-33.00);
    this.map.setZoom(4);
    this.getCartografiRegional();
    this.fetchDataRegional();
    this.date = this.ejecucion.year;
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
  private getCartografiaComunal(region: string){
    this.carto.getComunal(region).subscribe(
        data => {
            this.cartografia_comunal[region] = data;
            this.drawPolygonComunal(data,region);
        },
        err => console.error(err)
    );
  }
  /*VISTA REGIONAL PRIMERO CAPTAMOS LOS DATOS Y LUEGO DIBUJAMOS EL POLIGONO*/
  private fetchDataRegional(){
    this.ejecucion.getMetadataNacional().subscribe(
      data => {
        this.carto_status.subscribe((value) => {
          if(value){
            this.cumplimiento_regional = data;
            this.leyenda = 'regional';
            this.drawPolygonsRegional(data);
          }
        });
      }
    )
  }
  private getColor(ejecucion: EjecucionSicogen){
    let porcentaje = ejecucion.EJECUCION/ejecucion.PRESUPUESTO_ACT;
    if(porcentaje >= 0 && porcentaje < 0.2){
      return "#CCFFFF";
    }
    else if(porcentaje >= 0.2 && porcentaje < 0.4){
      return "#33CCFF";
    }
    else if(porcentaje >= 0.4 && porcentaje < 0.6){
      return "#0066FF";
    }
    else if(porcentaje >= 0.6 && porcentaje < 0.8){
      return "#0000FF";
    }
    else if(porcentaje >= 0.8 && porcentaje < 1){
      return "#002060";
    }
    else if(porcentaje >= 1){
      return "#FF0000";
    }
    return null;
  }
  private drawPolygonsRegional(data: any){
    var self = this;
    var bounds:any = [];
    for(let i=0; i<this.cartografia.length;i++){
      if(this.cartografia[i].FIT == 1) bounds.push(JSON.parse(this.cartografia[i].GEOMREGIONAL).coordinates);
      let ejecucion = <EjecucionSicogen> this.cumplimiento_regional[this.cartografia[i].C_REG];
      this.ejecucion_por_nacional.EJECUCION += ejecucion.EJECUCION;
      this.ejecucion_por_nacional.PRESUPUESTO_ACT += ejecucion.PRESUPUESTO_ACT
      var poly = this.map.setMultiPolygon(JSON.parse(this.cartografia[i].GEOMREGIONAL),{
        strokecolor:  this.borde_poligono,
        stroke:  1,
        fillcolor:  this.getColor(ejecucion),
        hovercolor:  [226,139,46,0.7],
        click:  function(e: any,layer: any){
          for(let l=0;l<self.poligonos_regionales.length;l++){
            self.map.getMap().getMap().removeLayer(self.poligonos_regionales[l]);
            
            // this.map.setLatLng(-70,-33)
            // self.poligonos_regionales[l].getSource().clear();
          }
          let centroide = JSON.parse(self.cartografia[i].CENTROIDE);
          self.map.setLatLng(parseFloat(centroide.lng),parseFloat(centroide.lat));
          self.map.setZoom(9);
          self.getCartografiaComunal(self.cartografia[i].C_REG);
        },
        mouseenter:  function(e: any,layer: any){
          self.selected_regional = self.cartografia[i];
        },
        mouseout:  function(e: any,layer: any){
          self.selected_regional = null;
        }
      });
      this.poligonos_regionales.push(poly);
    }
    this.map.fitToGeometry(this.map.getExentMultiPolygon(bounds));
  }
  
  private drawPolygonComunal(datas: any, region: string){
    this.leyenda = 'comunal';
    var self = this;
    this.ejecucion.getMetadataRegional(region).subscribe(
        data => {
          if(!this.meta_data_comunal) this.meta_data_comunal = {};
          this.meta_data_comunal[region] = data;
          // Desde aca dibujamos los poligonos comunales
          var self = this;
          var bounds:any = [];
          for(let i=0; i<datas.length;i++){
            if(datas[i].FIT == 1) bounds.push(JSON.parse(datas[i].GEOMCOMUNAL).coordinates);
            let ejecucion = (typeof data[datas[i].CINE_COM] != "undefined") ? <EjecucionSicogen> data[datas[i].CINE_COM] : new EjecucionSicogen();
            this.meta_data_comunal[region][datas[i].CINE_COM] = ejecucion;
            var poly = this.map.setMultiPolygon(JSON.parse(datas[i].GEOMCOMUNAL),{
              strokecolor:  self.borde_poligono,
              stroke:  1,
              fillcolor:  this.getColor(ejecucion),
              hovercolor:  [226,139,46,0.7],
              click:  function(e: any,layer: any){
                 // ACA SE DESPLIEGA LA VENTANA DE INFORMES DE AUDITORIA
                 self.selected_comunal = datas[i];
                 self.semaforo_view = true;
                 self.lock_status = true;
                 self.makeTable(datas[i].CINE_COM);
              },
              mouseenter:  function(e: any,layer: any){
                if(!self.lock_status){
                  self.selected_comunal = datas[i];
                }
              },
              mouseout:  function(e: any,layer: any){
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
  private makeTable(com: string){
    this.leyenda = 'comunal';
    this.cumplimiento.getMetadataComunal(com).subscribe(
      data => {
        this.ultimo_periodo = 0;
        data.forEach(element => {
          if(this.ultimo_periodo < element.CODPERIODO) {
            this.ultimo_periodo = element.CODPERIODO;
          }
          if(element.TIPOARCHIVO == 0) {
            this.evaluacion[element.CODPERIODO] = element;
          } else if(element.TIPOARCHIVO == 1) {
            this.presupuestario[element.CODPERIODO] = element;
          } else if(element.TIPOARCHIVO == 2) {
            this.contable[element.CODPERIODO] = element;
          }
        });
        this.contable[0] = new Cumplimiento();
        this.presupuestario[this.ultimo_periodo] = new Cumplimiento();
        this.semaforo_view = true;
      },
      error => {}
    )
  }
  private setCommune(commune: any){
    if(!this.lock_status){
      this.selected_comunal = commune;
    }
  }
  private closeSemaforo(){
    this.leyenda = 'comunal';
    this.semaforo_view = false;
    this.selected_comunal = null;
    this.lock_status = false;
  }
  private lastPeriodo(){
    switch(this.ultimo_periodo){
      case 1: return "Enero";
      case 2: return "Febrero";
      case 3: return "Marzo";
      case 4: return "Abril";
      case 5: return "Mayo";
      case 6: return "Junio";
      case 7: return "Julio";
      case 8: return "Agosto";
      case 9: return "Septiembre";
      case 10: return "Octubre";
      case 11: return "Noviembre";
      case 12: return "Diciembre";
    };
    return "No registra";
  }
  private backRegional(){
    for(let l=0;l<this.poligonos_comunales.length;l++){
      this.map.getMap().getMap().removeLayer(this.poligonos_comunales[l]);
    }
    this.poligonos_comunales = [];
    this.map.setLatLng(-70.00,-33.00);
    this.map.setZoom(4);
    this.selected_regional = null;
    this.meta_data_comunal = null;
    this.leyenda = 'regional';
    this.semaforo_view = false;
    this.selected_comunal = null;
    this.drawPolygonsRegional(this.meta_data_regional);
    this.map.removeZoomChanged();
    this.view_communes = [];
  }
  private closeInformes(){
    this.list_contabilidads=null;
    this.selected_comunal = null;
    this.lock_status = false;
  }
  public show(){
    this.showme = true;
  }
  public hide(){
    this.showme = false;
  }
}