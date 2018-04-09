import { Component, OnInit } from '@angular/core';
import { CartografiaService } from '../../services/cartografia/cartografia.service';
import { MapService } from '../../services/map/map.service';
import { RestService } from '../../services/rest/rest.service';
import { Router,ActivatedRoute } from '@angular/router';
import { LayersService } from '../../services/layers/layers.service';
import { ArbolService } from '../../services/arbol/arbol.service';
declare var ol:any; // DECLARACIÓN DE VARIABLE GLOBAL DE OPEN LAYERS 3
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-screen',
  templateUrl: 'screen.component.html',
  styleUrls: ['screen.component.css'],
})
export class ScreenComponent implements OnInit {
  private groups:any[] = [
  {
    name: 'Capas de Auditoria',
    icon: '<i class="fa fa-file-text-o" aria-hidden="true"></i>',
    layers: [{
      name: 'Informes de Auditoria',
      link: '/auditoria'
    }]
  },
  {
    name: 'Capas de Contabilidad',
    icon: '<i class="fa fa-money" aria-hidden="true"></i>',
    layers: [{
      name: 'Semaforo Municipal',
      link: '/contabilidad'
    }, {
      name: 'Presupuesto Municipal',
      link: '/presupuesto'
    }]
  }];
  constructor(private carto:CartografiaService, private map:MapService, private rest:RestService, private layers:LayersService, 
    private route: ActivatedRoute, private router: Router, private arbol:ArbolService) {}
  /**
   * Get the names OnInit
   */
  ngOnInit() {
    
  }
  change(capa:any){
     this.router.navigate([capa.layers[0].link]);
     this.arbol.checklayers(capa.layers[0].link);
  }
}
