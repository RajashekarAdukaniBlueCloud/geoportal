import { Component, OnInit} from '@angular/core';
import { RestService } from '../../services/rest/rest.service';
import { BlackscreenService } from '../../services/blackscreen/blackscreen.service';
import { Router,ActivatedRoute, NavigationEnd } from '@angular/router';
import { ArbolService } from '../../services/arbol/arbol.service';
import { ILayer } from '../../services/arbol/layer.interface';
import { Location } from "@angular/common";
import { move, drop } from '../../animations';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'arbol-comp',
  templateUrl: 'arbol.component.html',
  styleUrls: ['arbol.component.css'],
  animations: [move, drop]
})

export class ArbolComponent implements OnInit{
	private groups:any[] = [
	{
		name: 'Capas de Auditoría',
		icon: 'fa fa-search',
		layers: [{
			name: 'Informes de Auditoría',
			link: '/auditoria'
		},{
			name: 'Observaciones de Auditoría',
			link: '/hallazgos'
		},],
		active: false
	},
	{
		name: 'Capas de Contabilidad',
		icon: 'fa fa-pie-chart',
		layers: [{
			name: 'Cumplimiento Contable',
			link: '/cumplimiento'
		}, {
			name: 'Ejecución Contable',
			link: '/ejecucion'
		}],
		active: false
	},
	{
		name: 'Capas de Personal',
		icon: 'fa fa-user',
		layers: [{
			name: 'Servidores Públicos',
			link: '/funcionarios'
		}],
		active: false
	}];

	private selected:ILayer[];
	private link:string;
	constructor(rest:RestService, black:BlackscreenService, private router: Router, private arbol:ArbolService){
		// this.layers = [];
		this.arbol.register(this);
		this.link = this.router.url;
		this.checkgroups();
	}
	change(capa:any){
		this.link = capa.link;
	    this.router.navigate([capa.link]);
	}
	private checkgroups(){
		for(let i=0;i<this.groups.length;i++){
			for(let l=0; l<this.groups[i].layers.length; l++){
				if(this.groups[i].layers[l].link == this.link){
					this.groups[i].active = true;
				}
			}
		}
	}
	public registerLayer(layer:ILayer){
		//this.layers.push(layer);
		// console.log(layer);
	}
	public checklayers(link:string){
		this.link = link;
		this.checkgroups();
	}
	public ngOnInit(){
		var self = this;
		this.router.events.subscribe((val) => {
			// see also 
			var status = val instanceof NavigationEnd;
			if(status) self.link = self.router.url;
		});
	}
}
