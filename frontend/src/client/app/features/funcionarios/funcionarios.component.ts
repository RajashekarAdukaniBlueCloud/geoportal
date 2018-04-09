import { Component, OnInit } from '@angular/core';
import { CartografiaService } from '../../services/cartografia/cartografia.service';
import { MapService } from '../../services/map/map.service';
import { RestService } from '../../services/rest/rest.service';
import { ArbolService } from '../../services/arbol/arbol.service';
import { ILayer } from '../../services/arbol/layer.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuncionarioStatSiaper } from '../../classes/funcionarios_stat';
import { FuncionariosService } from '../../services/data/funcionarios.service';
import { ContratosSiaper } from '../../classes/contratossiaper';
import { ChartDef } from '../../classes/chartdef';
import { Commune } from '../../classes/commune';
import { FuncionariosSiaper } from '../../classes/funcionariossiaper';
import { Funcionario } from '../../classes/funcionario';
import { HashTable } from '../../classes/hashtable';
import { FuncionarioRegion } from '../../classes/funcionarioregion';
import { FuncionarioComuna } from '../../classes/funcionariocomuna';
import { FuncionarioArea } from '../../classes/funcionarioarea';
import { FuncionarioCalidad } from '../../classes/funcionariocalidad';
import { CapitalizePipe } from '../../pipes/capitalize/capitalize.pipe';
import { GrammarcheckerPipe } from '../../pipes/grammarchecker/grammarchecker.pipe';
import { fade, move, drop } from '../../animations';
declare var ol:any; // DECLARACIÓN DE VARIABLE GLOBAL DE OPEN LAYERS 4
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-funcionarios',
  templateUrl: 'funcionarios.component.html',
  styleUrls: ['funcionarios.component.css'],
  animations: [fade, move, drop]
})
export class FuncionariosComponent implements OnInit, ILayer {
  private showme:boolean = false;
  private cartografia:any;
  private cartografia_comunal:any = {};
  private carto_status:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private poligonos_regionales:any[] = [];
  private poligonos_comunales:any[] = [];
  private selected_regional:any = null;
  private selected_comunal:any = null;
  
  private borde_poligono:any = [140,140,140,1];
  public name = "Servidores Públicos";
  public date = "Vigentes "+2017;
  /*FUNCIONARIOS MUNICIPALES*/
  private funcionarios_run_comuna:Funcionario[];
  private comuna_analisis:FuncionarioStatSiaper;
  private comuna_detail:FuncionarioArea[];
  private meta_data_regional:HashTable<number,FuncionarioRegion>;
  private meta_data_comunal:HashTable<number,FuncionarioComuna>;
  private view_contratos_run:Funcionario[];
  private view_contratos_run_agrupado: any;
  private codigo_calidad: number;
  private servidor_name: string;
  private servidor_run: string;
  /*GRAFICO*/
  public doughnut_data_comuna:ChartDef;
  public doughnut_data_detail_comuna:ChartDef;
  public doughnutChartType:string = 'doughnut';
  private lock_status = false;
  private view_communes:Commune[] = [];
  private comuna_view: any;
  private paginator_servidores: Funcionario[];
  private view_servidores: Funcionario[];
  private pagination_config:number = 7;
  private actual_page:number = 1;
  private pages:number[] = [];  
  private view_pages: number[] = [];

  //CONSTRUCTOR
  constructor(
    private carto:CartografiaService, 
    private map:MapService, 
    private rest:RestService, 
    private arbol:ArbolService, 
    private funcionarios: FuncionariosService
  ) {
    this.arbol.registerLayer(this);
  }
  /**
   * Get the names OnInit
   * 
   */
  ngOnInit() {
    this.funcionarios.regService();
    this.funcionarios.showTimeLine();
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
    var self = this;
    this.funcionarios.getMetadataNacional().subscribe(
      data => {
        this.carto_status.subscribe((value) => {
          if(value){
            this.meta_data_regional = data;
            this.drawPolygonsRegional(data);
          }
        });
      }
    )
  }
  private getColor(total:number, max:number){
    var porcentaje = total/max*100;
    var color = 99.28994 - 0.79882*porcentaje;
    return [241, 65, color];
  }
  private drawPolygonsRegional(data:HashTable<number,FuncionarioRegion>){
    var self = this;
    var bounds:any = [];
    for(let i=0; i<this.cartografia.length;i++){
      if(this.cartografia[i].FIT == 1) bounds.push(JSON.parse(this.cartografia[i].GEOMREGIONAL).coordinates);
      var poly = this.map.setMultiPolygonHSL(JSON.parse(this.cartografia[i].GEOMREGIONAL),{
        strokecolor: this.borde_poligono,
        stroke: 1,
        fillcolor: this.getColor(data.get(parseInt(this.cartografia[i].C_REG)).TOTAL, this.funcionarios.getMaxNacional()),
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
  private drawPolygonComunal(poly_com:any, region:string){
    var self = this;
    this.funcionarios.getServidoresRegional(parseInt(region)).subscribe(
        data => {    
          this.meta_data_comunal = data;
          // Desde aca dibujamos los poligonos comunales
          var self = this;
          var bounds:any = [];
          for(let i=0; i<poly_com.length;i++){
            /* CREAMOS LOS VALORES PARA LA COMUNA*/
            if(poly_com[i].FIT == 1) bounds.push(JSON.parse(poly_com[i].GEOMCOMUNAL).coordinates);
            var total = 0;
            var comuna = (data.has(poly_com[i].CINE_COM)) ? data.get(poly_com[i].CINE_COM) : new FuncionarioComuna({ TOTAL: 0, COMCODGOBIERNO: poly_com[i].CINE_COM });
            if(!data.has(poly_com[i].CINE_COM)) data.put(poly_com[i].CINE_COM,comuna);
            this.funcionarios.getMaxRegional(parseInt(region));
            var poly = this.map.setMultiPolygonHSL(JSON.parse(poly_com[i].GEOMCOMUNAL),{
              strokecolor: self.borde_poligono,
              stroke: 1,
              fillcolor: this.getColor(comuna.TOTAL, this.funcionarios.getMaxRegional(parseInt(region))),
              hovercolor: [226,139,46,0.7],
              click: function(e:any,layer:any){
                 // ACA SE DESPLIEGA LA VENTANA DE INFORMES DE AUDITORIAstring
                self.lock_status = true;
                self.funcionarios.getMetadataComunal(poly_com[i].CINE_COM).subscribe(data =>{
                  self.comuna_view = data;
                  self.comuna_view.sort((a: any, b: any) => {
                    return b.TOTAL - a.TOTAL
                  });
                  var labels: string[] = [];
                  var values: number[] = [];
                  var methods: string[] = [];
                  var total: number = 0;
                  for (let element of self.comuna_view) {
                    // TIME LINE AREA FUNCTION
                    if(self.codigo_calidad != null && self.codigo_calidad == element.CODIGOCALIDAD) self.detailComunal(element);
                    //
                    let tipocalidad = new GrammarcheckerPipe().transform(element.TIPOCALIDAD, null);
                    labels.push(new CapitalizePipe().transform(tipocalidad));
                    values.push(element.TOTAL);
                    methods.push("self.detailComunal('" + element.CODIGOCALIDAD + "')");
                    total += element.TOTAL;
                  }
                  self.comuna_view.total = total;
                  self.doughnut_data_comuna = new ChartDef();
                  self.doughnut_data_comuna.setLabels(labels); 
                  self.doughnut_data_comuna.setValues(values);
                  self.doughnut_data_comuna.setmethods(methods);
                  self.doughnut_data_comuna.setOption("legend", {
                    position: 'bottom'
                  });
                  self.doughnut_data_comuna.setOption('onClick', function(e: any) {
                    var element = this.getElementAtEvent(e);
                    if (element.length) {
                       eval(self.doughnut_data_comuna.getMethodById(element[0]._index));
                    }
                  });
                  self.doughnut_data_comuna.setRandomColors();
                });
              },
              mouseenter: function(e:any,layer:any){
                if(!self.comuna_analisis &&  !self.lock_status) self.selected_comunal = poly_com[i];
              },
              mouseout: function(e:any,layer:any){
                if(!self.comuna_analisis  &&  !self.lock_status) self.selected_comunal = null;
              }
            });
            self.view_communes.push(new Commune(poly_com[i].COMUNA, poly,poly_com[i]));
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
  private detailComunal(resumen_contratos:FuncionarioStatSiaper){
    let areas = resumen_contratos.getAreas();
    this.codigo_calidad = resumen_contratos.CODIGOCALIDAD;
    this.comuna_detail = [];
    this.doughnut_data_detail_comuna = new ChartDef();
    this.doughnut_data_detail_comuna.setOption("legend", {
      position: 'bottom'
    })
    for(let i=0; i<areas.length; i++){
      this.comuna_detail.push(areas[i]);
      let area = new GrammarcheckerPipe().transform(areas[i].AREA, null);
      this.doughnut_data_detail_comuna.setElement(new CapitalizePipe().transform(area), areas[i].TOTAL);
    }
  }

  private showFuncionarios(area: FuncionarioArea, calidad: FuncionarioCalidad) {
    this.funcionarios.getServidoresPublicos(this.selected_comunal.CINE_COM,area.CODAREA,calidad.CODCALIDAD).subscribe(data => {
      this.setPoolAndPages(data);
    });
  }
  private getContratosRun(servidor:Funcionario){
    this.funcionarios.getContratosRun(servidor.RUN, this.selected_comunal.CINE_COM).subscribe(data => {
      if(typeof data[0] != "undefined"){
        this.servidor_name = data[0].NOMBRE;
        this.servidor_run = data[0].RUN;
      }
      this.view_contratos_run = data;
      this.setViewContratosRun();
    });
  }
  private setViewContratosRun():any{
    this.view_contratos_run_agrupado = {};
    for(let i=0; i<this.view_contratos_run.length; i++){
      if(typeof this.view_contratos_run_agrupado[this.view_contratos_run[i].CALIDAD] == "undefined"){
        this.view_contratos_run_agrupado[this.view_contratos_run[i].CALIDAD] = [];
      }

      this.view_contratos_run_agrupado[this.view_contratos_run[i].CALIDAD].push(this.view_contratos_run[i]);
    }
  }
  private setPoolAndPages(data:Funcionario[]){
    this.view_servidores = data;
    this.view_pages = Array.from(Array(11).keys());
    this.view_pages.splice(0, 1);
    let i=0;
    this.pages = Array(Math.ceil(this.view_servidores.length/this.pagination_config)).fill(i++).map((x:any,i:any)=>i+1);
    this.paginator(this.actual_page);
  }
  private paginator(page:number) {
    this.actual_page = page;
    if(this.pages.length >= 10) {
      if(this.actual_page == this.view_pages[this.view_pages.length-1] && this.actual_page <= this.pages.length+1) {
        let max = (this.actual_page+5 <= this.pages.length-1) ? this.actual_page+5 : this.pages.length+1;
        this.view_pages = Array.from(Array(max).keys());
        this.view_pages.splice(0, this.actual_page-5);
      }
      if(this.actual_page == this.view_pages[0] && this.actual_page != 1) {
        this.view_pages = (this.actual_page < 10) ? Array.from(Array(11).keys()) : Array.from(Array(this.actual_page+5).keys());
        this.view_pages.splice(0,  (this.actual_page < 10)? 1 : this.actual_page-5);
      }
    } else {
      this.view_pages = this.pages;
    }

    var servidores:any[] = [];
    for(let i=((page-1)*this.pagination_config); i<(page)*this.pagination_config;i++){
      if(typeof this.view_servidores[i] != "undefined") servidores.push(this.view_servidores[i]);
    }
    this.paginator_servidores = servidores;
  }

  private backAreas() {
    this.view_servidores = null;
    this.actual_page = 1;
    this.pages = [];
    this.paginator_servidores = [];
    this.funcionarios.setDetail(4);
  }
  private backResumen(){
    this.comuna_detail = null;
    this.doughnut_data_detail_comuna = null;
    this.funcionarios.setDetail(3);
    this.codigo_calidad = null;
  }
  private backServidores(){
    this.funcionarios.setDetail(5);
    this.servidor_name = null;
    this.servidor_run = null;
    this.view_contratos_run = null;
  }
  private closeInformes(){
    this.view_contratos_run = null;
    this.view_servidores = null;
    this.actual_page = 1;
    this.pages = [];
    this.paginator_servidores = [];
    this.comuna_view=null;
    this.selected_comunal = null;
    this.comuna_detail = null;
    this.doughnut_data_comuna = null;
    this.doughnut_data_detail_comuna = null;
    this.lock_status = false;
    this.funcionarios_run_comuna = null;
    this.funcionarios.setDetail(2);
  }
  public show(){
    this.showme = true;
  }
  public hide(){
    this.showme = false;
  }
  private backRegional(){
    for(let l=0;l<this.poligonos_comunales.length;l++){
      this.map.getMap().getMap().removeLayer(this.poligonos_comunales[l]);
    }
    this.funcionarios.setDetail(1);
    this.poligonos_comunales = [];
    this.map.setLatLng(-70.00,-33.00);
    this.map.setZoom(4);
    this.selected_regional = null;
    this.drawPolygonsRegional(this.meta_data_regional);
    this.map.removeZoomChanged();
    this.view_communes = [];
    this.meta_data_comunal = null;
  }
  private parseInt(num:string){
    return parseInt(num);
  }
}
