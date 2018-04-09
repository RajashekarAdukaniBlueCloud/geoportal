import { Component, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import { Commune } from '../../classes/commune';
import { fade } from '../../animations';
declare var ol:any; // DECLARACIÓN DE VARIABLE GLOBAL DE OPEN LAYERS 3
/**
* This class represents the main application component.
*/
@Component({
	moduleId: module.id,
	selector: 'sd-navcomunas',
	templateUrl: 'navcomunas.component.html',
	styleUrls: ['navcomunas.component.css'],
	animations: [fade]
})
export class NavcomunasComponent implements AfterViewInit{
	@Input() private show: boolean;
	@Input() set communes(communes: Commune[]){
		this.communes_showcase = communes;
		this.communes_array = communes;
	};
	@Output() private setCommune = new EventEmitter();

	private communes_array: Commune[];
	private communes_showcase:Commune[];
	
	constructor() {
	}
	public ngAfterViewInit(): void {
		this.communes_showcase = this.communes_array;
	}
	private search_commune(search:string){
		if(search == ""){
			this.communes_showcase = this.communes_array;
		} else {
			var showcase:Commune[] = [];
			for(let i=0;i<this.communes_array.length;i++){
				if(this.communes_array[i].Name.toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) != -1) showcase.push(this.communes_array[i]);
			}
			this.communes_showcase = showcase;
		}
	}
	private over_commune(commune:Commune){
		var features = commune.Polygon.getSource().getFeatures();
		for(let i=0; i<features.length;i++){
			var opts = features[i].get('opts');
			features[i].setStyle(new ol.style.Style({
				fill: new ol.style.Fill({
					color: (opts.hovercolor)?opts.hovercolor:[0, 0, 0, 0.7],
				}),
				stroke: new ol.style.Stroke({
					color: (opts.strokecolor)?opts.strokecolor:[0, 0, 0, 1],
					width: (opts.stroke)?opts.strokecolor:1
				})
			}))
		}
		this.setCommune.emit(commune.Commune);
	}
	private out_commune(commune:Commune){
		var features = commune.Polygon.getSource().getFeatures();
		for(let i=0; i<features.length;i++){
			var opts = features[i].get('opts');
			features[i].setStyle(new ol.style.Style({
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
	private finishCommune() {
		this.setCommune.emit(null);
	}
	private click_commune(commune:Commune){
		var features = commune.Polygon.getSource().getFeatures();
		var action = features[0].get('opts').click;
		if(typeof action == 'function') action(null,features[0]);
	}
}