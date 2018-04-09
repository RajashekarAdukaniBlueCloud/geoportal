import { Component, OnInit } from '@angular/core';
import { CartografiaService } from '../../services/cartografia/cartografia.service';
import { MapService } from '../../services/map/map.service';
import { RestService } from '../../services/rest/rest.service';
import { CumplimientoService } from '../../services/data/cumplimiento.service';
import { ArbolService } from '../../services/arbol/arbol.service';
import { ILayer } from '../../services/arbol/layer.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CumplimientoRegional } from '../../classes/cumplimientoregional';
import { CumplimientoComunal } from '../../classes/cumplimientocomunal';
import { Commune } from '../../classes/commune';
import { CumplimientoDetalle } from '../../classes/cumplimientodetalle';
import { Cumplimiento } from '../../classes/cumplimiento';
import { LineChart } from '../../classes/linechart';
import { fade, move } from '../../animations';
declare var ol:any; // DECLARACIÓN DE VARIABLE GLOBAL DE OPEN LAYERS 4
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-cumplimiento',
  templateUrl: 'cumplimiento.component.html',
  styleUrls: ['cumplimiento.component.css'],
  animations: [fade, move]
})
export class CumplimientoComponent implements OnInit, ILayer {
  private showme:boolean = false;
  private cartografia:any;
  private cartografia_comunal:any = {};
  private carto_status:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private escala:string[] = ["#CEECFC","#AEBEF2","#8C97E8","#6A70DE","#484AB9"];
  private meta_data_regional:any;
  private meta_data_comunal:any;
  private meta_data_comunas:any;
  private poligonos_regionales:any[] = [];
  private poligonos_comunales:any[] = [];
  private selected_regional:any = null;
  private selected_comunal:any = null;
  private Math:any;
  private list_contabilidads:any[];
  private title_contabilidad:string;
  private pool_contabilidads:any[];
  private paginator_contabilidads:any[];
  private pages:any[] = [];
  private actual_page:number = 1;
  private pagination_config:number = 15;
  private borde_poligono:any = [140,140,140,1];
  private max_regional:number = 0;
  /*CUMPLIMIENTO*/
  public name = "Cumplimiento Contable";
  public date = "";
  private cumplimiento_regional:any;
  private leyenda:string = "nacional";
  /*SCORE BOARD*/
  private cumplimiento_por_nacional:any = { CUMPLIDO : 0, TOTAL: 0};
  private cumplimiento_por_regional:any = { CUMPLIDO : 0, TOTAL: 0};
  private cumplimiento_por_comunal:any = { CUMPLIDO : 0, TOTAL: 0};
  /* SEMAFORO MUNICIPAL */
  private evaluacion: Cumplimiento[] = [];
  private presupuestario: Cumplimiento[] = [];
  private contable: Cumplimiento[] = [];
  private semaforo_view:boolean = false;
  private ultimo_periodo:number;
  private lock_status = false;
  private view_communes:Commune[] = [];
  private reports: CumplimientoDetalle[];
 
  public chart_data: LineChart;
  public chart_type: string = "line";

  constructor(
    private carto:CartografiaService,
    private map:MapService,
    private rest:RestService,
    private arbol:ArbolService,
    private cumplimiento:CumplimientoService
  ) {
    this.arbol.registerLayer(this);
  }
  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.cumplimiento.regService();
    this.cumplimiento.showTimeLine();
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
  /*VISTA REGIONAL PRIMERO CAPTAMOS LOS DATOS Y LUEGO DIBUJAMOS EL POLIGONO*/
  private fetchDataRegional(){
    this.cumplimiento.getMetadataNacional().subscribe(
      data => {
        this.date = (Object.keys(data).length > 0)?data[13].UPERIODO+'/'+this.cumplimiento.year:'';
        this.carto_status.subscribe((value) => {
          if(value){
            this.cumplimiento_regional = data;
            this.leyenda = 'nacional';
            this.drawPolygonsRegional(data);
          }
        });
      }
    )
  }
  private getColor(cumplimiento:CumplimientoRegional){
    let porcentaje = (cumplimiento.CUMPLIDO)/(cumplimiento.CUMPLIDO+cumplimiento.PARCIAL+cumplimiento.INCUMPLIDO);
    if(porcentaje > 0.75){
      return "#26b54c";
    }
    else if(porcentaje > 0.5 && porcentaje <=0.75){
      return "#F9E43D";
    }
    else{
      return "#E52424";
    }
  }
  private getColorMunicipal(cumplimiento:CumplimientoComunal){
    if(cumplimiento.ESTADO == 100){
      return "#26b54c";
    }
    else if(cumplimiento.ESTADO == 50){
      return "#F9E43D";
    }
    else{
      return "#E52424";
    }
  }
  private drawPolygonsRegional(data:any){
    var self = this;
    var bounds:any = [];
    for(let i=0; i<this.cartografia.length;i++){
      if(this.cartografia[i].FIT == 1) bounds.push(JSON.parse(this.cartografia[i].GEOMREGIONAL).coordinates);
      var cumplimiento = <CumplimientoRegional> this.cumplimiento_regional[this.cartografia[i].C_REG];
      this.cumplimiento_por_nacional.CUMPLIDO += cumplimiento.CUMPLIDO;
      this.cumplimiento_por_nacional.TOTAL += cumplimiento.CUMPLIDO + cumplimiento.PARCIAL + cumplimiento.INCUMPLIDO;
      var poly = this.map.setMultiPolygon(JSON.parse(this.cartografia[i].GEOMREGIONAL),{
        strokecolor: this.borde_poligono,
        stroke: 1,
        // fillcolor: this.getColorByTotal((data[this.cartografia[i].C_REG].ROJO+data[this.cartografia[i].C_REG].AMARILLO), this.max_regional),
        fillcolor: this.getColor(cumplimiento),
        hovercolor: [226,139,46,0.7],
        click: function(e:any,layer:any){
          self.lock_status = false;
          for(let l=0;l<self.poligonos_regionales.length;l++){
            self.map.getMap().getMap().removeLayer(self.poligonos_regionales[l]);
            
            // this.map.setLatLng(-70,-33)
            // self.poligonos_regionales[l].getSource().clear();
          }
          let centroide = JSON.parse(self.cartografia[i].CENTROIDE);
          self.map.setLatLng(parseFloat(centroide.lng),parseFloat(centroide.lat));
          self.map.setZoom(9);
          self.getCartografiaComunal(self.cartografia[i].C_REG);
          self.leyenda = 'regional';
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
  
  private drawPolygonComunal(comunas:any, region:string){
    var self = this;
    // console.log('comunas: ', comunas);
    this.cumplimiento.getMetadataRegional(region).subscribe(
        data => {
          // console.log('data: ', data);
          if(!this.meta_data_comunal) this.meta_data_comunal = {};
          this.meta_data_comunal[region] = data;
          // Desde aca dibujamos los poligonos comunales
          var self = this;
          var bounds:any = [];
          for(let i=0; i<comunas.length;i++){
            if(comunas[i].FIT == 1) bounds.push(JSON.parse(comunas[i].GEOMCOMUNAL).coordinates);
            let cumplimiento = (typeof data[comunas[i].CINE_COM] != "undefined") ? <CumplimientoComunal> data[comunas[i].CINE_COM] : new CumplimientoComunal(); 
            this.meta_data_comunal[region][comunas[i].CINE_COM] = cumplimiento;
            var poly = this.map.setMultiPolygon(JSON.parse(comunas[i].GEOMCOMUNAL),{
              strokecolor: self.borde_poligono,
              stroke: 1,
              fillcolor: this.getColorMunicipal(cumplimiento),
              hovercolor: [226,139,46,0.7],
              click: function(e:any,layer:any){
                 // ACA SE DESPLIEGA LA VENTANA DE INFORMES DE AUDITORIA
                 self.lock_status = true;
                 self.selected_comunal = comunas[i];
                 self.makeTable(comunas[i].CINE_COM);
                 
              },
              mouseenter: function(e:any,layer:any){
                if(!self.lock_status){
                  self.selected_comunal = comunas[i];
                }
              },
              mouseout: function(e:any,layer:any){
                if(!self.lock_status){
                  self.selected_comunal = null;
                }
              }
            });
            self.view_communes.push(new Commune(comunas[i].COMUNA, poly,comunas[i]));
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
  private makeTable(com:string){
    this.leyenda = 'comunal';
    this.cumplimiento.getMetadataComunal(com).subscribe(data => {
        this.ultimo_periodo = 0;
        var labels: string[] = [];
        var fuera_plazo: number[] = Array(14).fill(0);

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

          // Construcción data para el gráfico
          element.reports.forEach(report => {
            if(report.getFechaCorte() && report.getFechaEnvio() > report.getFechaCorte()) {
              fuera_plazo[element.CODPERIODO]++;
            }
          });
          if(labels.indexOf(element.PERIODO.substring(0, 3)) == -1) {
            labels.push(element.PERIODO.substring(0, 3));
          }
        });
        
        // Casos de borde. Contable no tiene apertura y presupuestario no tiene cierre.
        this.contable[0] = new Cumplimiento();
        this.presupuestario[this.ultimo_periodo] = new Cumplimiento();

        this.semaforo_view = true;
        this.makeChart(labels, fuera_plazo);
      },
      error => {}
    )
  }
  private makeChart(labels: string[], data: number[]) {
    this.chart_data = new LineChart();
    this.chart_data.setLabels(labels);
    this.chart_data.setValues(
        [data],
        ["Informes entregados fuera de plazo"],
        ["#e52424"]
    );
    this.chart_data.setSeries(["Informes entregados fuera de plazo"]);
    this.chart_data.setOption('scales', {
      yAxes: [{
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          beginAtZero: true
        }
      }]
    });
    this.chart_data.setOption("legend", {
      position: 'bottom'
    })
  }

  private closeSemaforo(){
    this.leyenda = 'regional';
    this.cumplimiento.setDetail(2);
    this.semaforo_view = false;
    this.selected_comunal = null;
    this.reports = null;
    this.lock_status = false;
  }
  private lastPeriodo(periodo:number){
    if(periodo == 0) return "Apertura "+(new Date()).getFullYear();
    if(periodo == 1) return "Enero "+(new Date()).getFullYear();
    if(periodo == 2) return "Febrero "+(new Date()).getFullYear();
    if(periodo == 3) return "Marzo "+(new Date()).getFullYear();
    if(periodo == 4) return "Abril "+(new Date()).getFullYear();
    if(periodo == 5) return "Mayo "+(new Date()).getFullYear();
    if(periodo == 6) return "Junio "+(new Date()).getFullYear();
    if(periodo == 7) return "Julio "+(new Date()).getFullYear();
    if(periodo == 8) return "Agosto "+(new Date()).getFullYear();
    if(periodo == 9) return "Septiembre "+(new Date()).getFullYear();
    if(periodo == 10) return "Octubre "+(new Date()).getFullYear();
    if(periodo == 11) return "Noviembre "+(new Date()).getFullYear();
    if(periodo == 12) return "Diciembre "+(new Date()).getFullYear();
    return null;
  }

  private showDetails(reports: CumplimientoDetalle[]) {
    this.reports = [];
    reports.forEach(element => {
      this.reports.push(element);
    });
  }

  private backResumen() {
    this.reports = null;
  }

  private backRegional(){
    this.cumplimiento.setDetail(1);
    for(let l=0;l<this.poligonos_comunales.length;l++){
      this.map.getMap().getMap().removeLayer(this.poligonos_comunales[l]);
    }
    this.poligonos_comunales = [];
    this.map.setLatLng(-70.00,-33.00);
    this.map.setZoom(4);
    this.selected_regional = null;
    this.meta_data_comunal = null;
    this.leyenda = 'nacional';
    this.semaforo_view = false;
    this.selected_comunal = null;
    this.drawPolygonsRegional(this.meta_data_regional);
    this.map.removeZoomChanged();
    this.view_communes = [];
    this.lock_status = false;
  }
  public show(){
    this.showme = true;
  }
  public hide(){
    this.showme = false;
  }
}
