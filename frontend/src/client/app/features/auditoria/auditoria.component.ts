import { Component, OnInit } from '@angular/core';
import { CartografiaService } from '../../services/cartografia/cartografia.service';
import { MapService } from '../../services/map/map.service';
import { RestService } from '../../services/rest/rest.service';
import { ArbolService } from '../../services/arbol/arbol.service';
import { ILayer } from '../../services/arbol/layer.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Commune } from '../../classes/commune';
import { fade, move } from '../../animations';
import { AuditoriaService } from '../../services/data/auditoria.service';
declare var ol:any; // DECLARACIÓN DE VARIABLE GLOBAL DE OPEN LAYERS 4
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-auditoria',
  templateUrl: 'auditoria.component.html',
  styleUrls: ['auditoria.component.css'],
  animations: [fade, move]
})
export class AuditoriaComponent implements OnInit, ILayer {
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
  private pool_auditorias:any[];
  private paginator_auditorias:any[];
  private pages:any[] = [];
  private actual_page:number = 1;
  private pagination_config:number = 15;
  private borde_poligono:any = [140,140,140,1];
  public name = "Informes de Auditoría";
  private auditoria_view:boolean = false;
  private lock_status = false;
  private view_communes:Commune[] = [];
  private test: string = "Region metropolitana";
  //CONSTRUCTOR
  constructor(private carto:CartografiaService, private map:MapService, private rest:RestService, private arbol:ArbolService, private auditoria:AuditoriaService) {
    this.arbol.registerLayer(this);
  }
  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.auditoria.showTimeline();
    this.auditoria.regService();
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
    this.auditoria.getMetadataRegional().subscribe(
        data => {
          this.carto_status.subscribe((value) => {
            if(value){
              this.meta_data_regional = data;
              this.makeLeyenda(this.auditoria.getMaxRegional());
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
        MIN: Math.floor(i * quintil),
        MAX: (i==(4)) ? "+ " : " - " + Math.floor((i+1) * quintil)
      });
    }  
  }
  private getColorByTotal(total:number, max:number){
    if(total == 0) return this.escala[0]; 
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
        fillcolor: this.getColor(data[this.cartografia[i].C_REG].TOTAL_INFORMES, this.auditoria.getMaxRegional()),
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
    this.view_communes = [];
    this.auditoria.getMetadataComunal(region).subscribe(
        data => {
          this.meta_data_comunal = data;
          this.makeLeyenda(this.auditoria.getMaxComunal());
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
              fillcolor: this.getColor(((typeof total != "undefined")? total.TOTAL_INFORMES:0),self.auditoria.getMaxComunal()),
              hovercolor: [226,139,46,0.7],
              click: function(e:any,layer:any){
                 // ACA SE DESPLIEGA LA VENTANA DE INFORMES DE AUDITORIA
                 self.lock_status = true;   
                  self.auditoria.getInformesComuna(datas[i].CINE_COM).subscribe(
                    data_inf => {
                      self.map.clearMouseInteraction();
                      self.title_auditoria = datas[i].COMUNA;
                      self.list_auditorias = data_inf;
                      self.list_auditorias.sort((a: any, b: any) => {
                        return b.ANOINFORME - a.ANOINFORME
                      });
                      self.setPoolAndPages(data_inf);
                      self.auditoria_view = true;
                      
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
            self.view_communes.push(new Commune(datas[i].COMUNA, poly, datas[i]));
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
  private buscador(patern:string){
    var auditorias:any[] = [];
    for(let i=0; i<this.list_auditorias.length;i++){
      if(this.list_auditorias[i].MATERIAINFORME.toUpperCase().indexOf(patern.toUpperCase()) != -1){
        auditorias.push(this.list_auditorias[i]);
      }
    }
    this.setPoolAndPages(auditorias);
  }
  private setPoolAndPages(data:any[]){
    this.pool_auditorias = data;
    this.paginator_auditorias = data;
    this.actual_page = 1;
    let i=0;
    this.pages = Array(Math.ceil(this.pool_auditorias.length/this.pagination_config)).fill(i++).map((x:any,i:any)=>i+1);
  }
  private paginator(page:number){
    this.actual_page = page;
    var auditorias:any[] = [];
    for(let i=((page-1)*this.pagination_config); i<(page)*this.pagination_config;i++){
      if(typeof this.pool_auditorias[i] != "undefined") auditorias.push(this.pool_auditorias[i]);
    }
    this.paginator_auditorias = auditorias;
  }
  private filter(type:number){
    var pool:any[] = [];
    switch(type){
      case 1:
        pool = this.pool_auditorias.sort(function(a, b){
          return a.IDINFORME-b.IDINgetColorByTotalFORME;
        });
        break;
      case 2:
        pool = this.pool_auditorias.sort(function(a, b){
          return a.ANOINFORME-b.ANOINFORME;
        });
        break;
      case 3:
        pool = this.pool_auditorias.sort(function(a, b){
          return a.MATERIAINFORME.charCodeAt(0)-b.MATERIAINFORME.charCodeAt(0);
        });
        
        break;
      case 4:
        pool = this.pool_auditorias.sort(function(a, b){
          return a.NOMBRESERVICIO.charCodeAt(0)-b.NOMBRESERVICIO.charCodeAt(0);
        });
        break;
      case 5:
        pool = this.pool_auditorias.sort(function(a, b){
          return a.TIPOINFORME.charCodeAt(0)-b.TIPOINFORME.charCodeAt(0);
        });
        break;
      case 6:
        pool = this.pool_auditorias.sort(function(a, b){

          return (new Date(a.FECHAINFORME)).getTime()-(new Date(b.FECHAINFORME)).getTime();
        });
        break;
    }
    this.setPoolAndPages(pool);
  }
  private clearComunalPolygons(){
    for(let l=0;l<this.poligonos_comunales.length;l++){
      this.map.getMap().getMap().removeLayer(this.poligonos_comunales[l]);
    }
    this.poligonos_comunales = [];
  }
  private clearRegionalPolygons(){
    for(let l=0;l<this.poligonos_regionales.length;l++){
      this.map.getMap().getMap().removeLayer(this.poligonos_regionales[l]);
    }
    this.poligonos_regionales = [];
  }
  private backRegional(){
    this.clearRegionalPolygons();
    this.map.setLatLng(-70.00,-33.00);
    this.map.setZoom(4);
    this.selected_regional = null;
    this.meta_data_comunal = null;
    this.fetchDataRegional();
    this.makeLeyenda(this.auditoria.getMaxRegional());
    this.map.removeZoomChanged();
    this.view_communes = [];
  }
  private closeInformes(){
    this.list_auditorias=null;
    this.selected_comunal = null;
    this.auditoria_view = false;
    this.lock_status = false;
    this.auditoria.setDetail(1);
  }
  public show(){
    this.showme = true;
  }
  public hide(){
    this.showme = false;
  }
  private getDate(){
    return "Ene "+this.auditoria.getYearMin()+" a Dic "+(this.auditoria.getYearMax()-1);
  }
  private getColor(total:number, max:number){
    if(max === 0) max = 1;
    var porcentaje = total/max*100;
    var color = 99.28994 - 0.79882*porcentaje;
    return [241, 65, color];
  }
}
