import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map/map.service';
declare var ol:any; // DECLARACIÓN DE VARIABLE GLOBAL DE OPEN LAYERS 3
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css'],
})
export class MapComponent implements OnInit {
  private map:any;
  private map_service:MapService;
  //DECLARAMOS EL CONSTRUCTOR Y REGISTRAMOS EL MAPA EN EL SERVICIO
  constructor(map:MapService){
    this.map_service = map;
  }
  //CARGAMOS LAS RUTINAS DE OL3
  ngOnInit() {
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      controls: ol.control.defaults({
        zoom: true,
        attribution: false,
        rotate: true
      }),
      view: new ol.View({
        center: ol.proj.fromLonLat([-70.00, -33.00]),
        zoom: 17
      })
    });
    this.map_service.register(this);
  }
  // GENERAMOS EL METODO PARA EXTRAER EL MAPA Y LO MANEJE EL SERVICIO
  public getMap(){
    return this.map;
  }
}
