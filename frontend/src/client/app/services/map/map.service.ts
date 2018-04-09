import { Injectable} from '@angular/core';
import { Config } from '../../shared/config/env.config';
import { MapComponent } from '../../features/map/map.component';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
declare var ol:any; // DECLARACIÓN DE VARIABLE GLOBAL DE OPEN LAYERS 3

@Injectable()
export class MapService {
	private map:MapComponent;
	private zoom:number;
	private zoomListeners:any[] = [];
	private mouseEventInteraction:any;
	private layers:any[] = [];
	// CONSTRUCTOR DEL SERVICIO
	constructor(private router: Router) {
		
	}
	// METODO PARA REGISTRAR EL COMPONENTE MAP
	public register(map:MapComponent){
		this.map = map;
		this.setLatLng(-70,-33);
		this.zoom = 4;
		this.setZoom(4);
		this.interactions();
		this.zoomlistener();
	}
	// MEOTDO PARA ESTABLECER EL CENTRO EN BASE LAT,LNG
	public setLatLng(lat:number, lng: number){
		this.map.getMap().getView().setCenter(ol.proj.fromLonLat([lat,lng]));
	}
	// METODO PARA MANEJAR EL ZOOM
	public setZoom(lvl:number){
		this.zoom = lvl;
		this.map.getMap().getView().setZoom(lvl);
	}
	public getCoordLatLng(lat:number, lng: number){
		return ol.proj.fromLonLat([lat,lng]);
	}
	//**********************************
	// METODOS PARA MANEJAR LOS EVENTOS
	//*********************************
	public interactions(){
		var self = this.map;
		// ESTE SERVICIO ES EL ENCARGADO DE GESTIONAR LOS EVENTOS DEL MAPA
		// ES IMPORTANTE SABER QUE INVESTIGUE Y PROGRAME ESTE METODO A LAS
		// 21:33 HRS DEL DIA 21 DE ABRIL DEL 2017 CON EVIDENTE ESTADO DE SOLMNOLENCIA

		// DECLARAMOS EL METODO QUE GESTIONARA LOS EVENTOS MOUSEOVER Y MOUSEOUT
		let mouseover = new ol.interaction.Select({
			layers: function(layer:any) {
	          	return true;
	        },
	        filter: function(feature:any, layer:any) {
		        if(feature == null) return false;
		        return true;
		    },
		    condition: ol.events.condition.pointerMove
        });
        //LUEGO REGISTRAMOS EL EVENTO
        mouseover.on('select', function(e:any){
        	//EL TENER UNA CAPA DESELECCIONADA BAJO ESTA MODALIDAD DENOTA UN EVENTO MOUSEOUT
			if(e.deselected.length > 0) {
				document.body.style.cursor = 'default';
				var hover = e.deselected[0].get('opts').hovercolor;
				if(typeof hover != undefined){
					var opts = e.deselected[0].get('opts');
					e.deselected[0].setStyle(new ol.style.Style({
					  	fill: new ol.style.Fill({
					  		color: (opts.fillcolor)?opts.fillcolor:[0, 0, 0, 0.7],
						}),
						stroke: new ol.style.Stroke({
						  color: (opts.strokecolor)?opts.strokecolor:[0, 0, 0, 1],
						  width: (opts.stroke)?opts.strokecolor:1
						})
					}));
				}
				var mouseout = e.deselected[0].get('opts').mouseout;
				if(typeof mouseout == 'function') mouseout(e,e.deselected[0]) ;
			}
			//EL TENER UNA CAPA SELECCIONADA BAJO ESTA MODALIDAD DENOTA UN EVENTO MOUSEENTER
			if(e.selected.length > 0){
				document.body.style.cursor = 'pointer';
				var hover = e.selected[0].get('opts').hovercolor;
				if(typeof hover != undefined){
					var opts = e.selected[0].get('opts');
					e.selected[0].setStyle(new ol.style.Style({
					  	fill: new ol.style.Fill({
					  		color: (opts.hovercolor)?opts.hovercolor:[0, 0, 0, 0.7],
						}),
						stroke: new ol.style.Stroke({
						  color: (opts.strokecolor)?opts.strokecolor:[0, 0, 0, 1],
						  width: (opts.stroke)?opts.strokecolor:1
						})
					}));
				}
				var mouseenter = e.selected[0].get('opts').mouseenter;
				if(typeof mouseenter == 'function') mouseenter(e,e.selected[0]) ;
			}
        });
        // LUEGO REGISTRAMOS EL EVENTO
        this.mouseEventInteraction = mouseover;
        this.map.getMap().addInteraction(mouseover);
        // FIN DE MECANISMOS PARA GESTIONAR EL MOUSEENTER Y MOUSEOUT

        // DECLARAMOS EL METODO QUE GESTIONARA LOS EVENTOS CLICK
				this.map.getMap().getViewport().addEventListener('click', function (evt:any) {
					evt.stopPropagation(); 	
					var feature = self.getMap().forEachFeatureAtPixel(self.getMap().getEventPixel(evt),function(feature:any, layer:any){
						return feature;
					});
					if (feature) {
						mouseover.getFeatures().clear();
						document.body.style.cursor = 'default';
						var action = feature.get('opts').click;
						if(typeof action == 'function') action(evt,feature);
							var hover = feature.get('opts').hovercolor;
						if(typeof hover != undefined){
							var opts = feature.get('opts');
							feature.setStyle(new ol.style.Style({
								fill: new ol.style.Fill({
									color: (opts.fillcolor)?opts.fillcolor:[0, 0, 0, 0.7],
								}),
								stroke: new ol.style.Stroke({
									color: (opts.strokecolor)?opts.strokecolor:[0, 0, 0, 1],
									width: (opts.stroke)?opts.strokecolor:1
								})
							}));
						}
					}
				});

        // DECLARAMOS EL QUE GESTIONA LOS EVENTOS RIGHTCLICK
        this.map.getMap().getViewport().addEventListener('contextmenu', function (evt:any) {
		    evt.preventDefault();
		    var feature = self.getMap().forEachFeatureAtPixel(self.getMap().getEventPixel(evt),function(feature:any, layer:any){
	            return feature;
	        });
		    if (feature) {
		    	mouseover.getFeatures().clear();
		    	var action = feature.get('opts').rightclick;
				if(typeof action == 'function') action(evt,feature) ;
		    }
		});
        // FIN DE LOS ELEMENTOS CITADOS
	}
	//CREAMOS UN METODO PARA LIMPIAR LOS INTERACTIONS
	public clearMouseInteraction(){
		this.mouseEventInteraction.getFeatures();
	}
	//*******************************
	// METODO PARA ESTABLECER LOS ELEMENTOS DE MANEJO DEL MAPA
	// FUNCIONES DE DIBUJO Y ELEMENTOS DE TRAZADO
	// 
	//*******************************
	public setMarker(lat:number, lng:number, opts:any){

		var point = new ol.geom.Point(this.getCoordLatLng(lat,lng));
		var iconFeature = new ol.Feature({
		  geometry: point
		});


		var iconStyle = new ol.style.Style({
		  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		    anchor: [0.5, 46],
		    anchorXUnits: 'fraction',
		    anchorYUnits: 'pixels',
		    opacity: 0.75,
		    src: 'assets/data/icon.png'
		  }))
		});
		var linestring_feature = new ol.Feature({
		  geometry: new ol.geom.Point(this.getCoordLatLng(lat,lng))
		});
		
		// iconFeature.setStyle(iconStyle);
		var fill = new ol.style.Fill({
		  color: [180, 0, 0, 0.3]
		});
		 
		var stroke = new ol.style.Stroke({
		  color: [0, 0, 0, 1],
		  width: 10
		});
		var vectorSource = new ol.source.Vector({
		  features: [linestring_feature]
		});

		var vectorLayer = new ol.layer.Vector({
		  source: vectorSource
		});
		
		var style = new ol.style.Style({
		  image: new ol.style.Circle({
		    fill: fill,
		    stroke: stroke,
		    radius: 8
		  }),
		  fill: fill,
		  stroke: stroke
		});
		vectorLayer.setStyle(style);
		this.map.getMap().addLayer(vectorLayer);
		this.layers.push(vectorLayer);
		return linestring_feature;
	}
	public setPolygon(coords:number[],opts:any){
		
	}
	public setMultiPolyLine(coord:any,opts:any){
		var coords:number[][] = coord.coordinates;
		var coordinates:any = [];
		for(let i=0;i<coords.length;i++){
			coordinates[i] = [];
			for(let l=0; l<coords[i].length;l+=2){
				
				coordinates[i].push(this.getCoordLatLng(coords[i][l+1],coords[i][l]))
			}
		}	
		var linestring_feature = new ol.Feature({
		  geometry: new ol.geom.MultiLineString(coordinates)
		});
		var vector_layer = new ol.layer.Vector({
		  source: new ol.source.Vector({
		    features: [linestring_feature]
		  })
		});
		var fill = new ol.style.Fill({
		  color: [0, 0, 0, 0.7]
		});
		 
		var stroke = new ol.style.Stroke({
		  color: [0, 0, 0, 1],
		  width: 1
		});
		var style = new ol.style.Style({
		  image: new ol.style.Circle({
		    fill: fill,
		    stroke: stroke,
		    radius: 8
		  }),
		  fill: fill,
		  stroke: stroke
		});
		vector_layer.setStyle(style);
		this.map.getMap().addLayer(vector_layer);
		this.layers.push(vector_layer);
		return linestring_feature;
	}
	public getMap(){
		return this.map;
	}
	public setMultiPolygonHSL(coord:any,opts:any){
		var coords:number[][] = coord.coordinates;
		var coordinates:any = [];
		for(let i=0;i<coords.length;i++){
			coordinates[i] = [];
			var cor:any = [];
			for(let l=0; l<coords[i].length;l+=2){
				cor.push(this.getCoordLatLng(coords[i][l+1],coords[i][l]));
			}
			coordinates[i].push(cor);
		}	
		let linestring_feature = new ol.Feature({
		  geometry: new ol.geom.MultiPolygon(coordinates),
		  opts: opts,
		});
		let vector_layer:any = new ol.layer.Vector({
		  	source: new ol.source.Vector({
		    	features: [linestring_feature]
		  	})
		});
		opts.fillcolor = (opts.fillcolor)?this.hslToHex(opts.fillcolor[0],opts.fillcolor[1],opts.fillcolor[2]):[0, 0, 0, 0.7];
		var style = new ol.style.Style({
		  	fill: new ol.style.Fill({
		  		color: opts.fillcolor
			}),
			stroke: new ol.style.Stroke({
			  color: (opts.strokecolor)?opts.strokecolor:[0, 0, 0, 1],
			  width: (opts.stroke)?opts.strokecolor:1
			})
		});
		linestring_feature.setStyle(style);
		this.map.getMap().addLayer(vector_layer);
		this.layers.push(vector_layer);
		return vector_layer;
	}
	public getExentMultiPolygon(coord:any){
		var coords:number[][][] = coord;
		var coordinates:any = [];
		for(let i=0;i<coords.length;i++){
			coordinates[i] = [];
			var cor:any = [];
			for(let l=0; l<coords[i].length;l++){
				for(let k=0; k<coords[i][l].length; k+= 2){
					cor.push(this.getCoordLatLng(coords[i][l][k+1],coords[i][l][k]));
				}
			}
			coordinates[i].push(cor);
		}	
		let linestring_feature = new ol.Feature({
		  geometry: new ol.geom.MultiPolygon(coordinates)
		});
		let vector_layer:any = new ol.layer.Vector({
		  	source: new ol.source.Vector({
		    	features: [linestring_feature]
		  	})
		});
		return vector_layer.getSource().getExtent();
	}
	public setMultiPolygon(coord:any,opts:any){
		var coords:number[][] = coord.coordinates;
		var coordinates:any = [];
		for(let i=0;i<coords.length;i++){
			coordinates[i] = [];
			var cor:any = [];
			for(let l=0; l<coords[i].length;l+=2){
				cor.push(this.getCoordLatLng(coords[i][l+1],coords[i][l]));
			}
			coordinates[i].push(cor);
		}	
		let linestring_feature = new ol.Feature({
		  geometry: new ol.geom.MultiPolygon(coordinates),
		  opts: opts,
		});
		let vector_layer:any = new ol.layer.Vector({
		  	source: new ol.source.Vector({
		    	features: [linestring_feature]
		  	})
		});
		var style = new ol.style.Style({
		  	fill: new ol.style.Fill({
		  		color: (opts.fillcolor)?opts.fillcolor:[0, 0, 0, 0.7]
			}),
			stroke: new ol.style.Stroke({
			  color: (opts.strokecolor)?opts.strokecolor:[0, 0, 0, 1],
			  width: (opts.stroke)?opts.strokecolor:1
			})
		});
		linestring_feature.setStyle(style);
		this.map.getMap().addLayer(vector_layer);
		this.layers.push(vector_layer);
		return vector_layer;
	}
	public addZoomChange(callback:any){
       	var obj = {
       		f:callback
       	};
       	this.zoomListeners.push(obj);
	}
	public removeZoomChanged(callback:any = null){
		if(callback == null){
			this.zoomListeners = [];
		}
		else{
			this.zoomListeners.splice(this.zoomListeners.indexOf(callback),1);
		}
	}
	public fitToGeometry(extent:any){
		if(extent) {
			this.map.getMap().getView().fit(extent, this.map.getMap().getSize());
		}
	}
	private zoomlistener(){
		var self = this;
		this.map.getMap().on('moveend', function(){
			var newZoomLevel = self.map.getMap().getView().getZoom();
			if(self.zoom != newZoomLevel){
				for(let i=0; i<self.zoomListeners.length;i++){
					self.zoomListeners[i].f();
				}
			}
		},this.map.getMap());
	}
	private hslToHex(h:any, s:any, l:any) {
	  h /= 360;
	  s /= 100;
	  l /= 100;
	  let r, g, b;
	  if (s === 0) {
	    r = g = b = l; // achromatic
	  } else {
	    const hue2rgb = (p:any, q:any, t:any) => {
	      if (t < 0) t += 1;
	      if (t > 1) t -= 1;
	      if (t < 1 / 6) return p + (q - p) * 6 * t;
	      if (t < 1 / 2) return q;
	      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	      return p;
	    };
	    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	    const p = 2 * l - q;
	    r = hue2rgb(p, q, h + 1 / 3);
	    g = hue2rgb(p, q, h);
	    b = hue2rgb(p, q, h - 1 / 3);
	  }
	  const toHex = function(x:any){
	    const hex = Math.round(x * 255).toString(16);
	    return hex.length === 1 ? '0' + hex : hex;
	  };
	  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
	}
	public clear(){
		for(let i=0; i<this.layers.length; i++){
			this.map.getMap().removeLayer(this.layers[i]);
		}
	}
}