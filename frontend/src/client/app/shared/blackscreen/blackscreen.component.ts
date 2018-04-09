import { Component} from '@angular/core';
import { RestService } from '../../services/rest/rest.service';
import { BlackscreenService } from '../../services/blackscreen/blackscreen.service';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'blackscreen-comp',
  templateUrl: 'blackscreen.component.html',
  styleUrls: ['blackscreen.component.css']
})

export class BlackscreenComponent{
	private showme: boolean;
	private id: any;
	private message: string;
	private rest: RestService;
	private black: BlackscreenService;
	private stack: string[] = [];

	constructor(rest: RestService, black: BlackscreenService){
		this.showme = false;
		this.rest = rest;
		this.black = black;
		this.message = 'Cargando';
		rest.blackscreen_set(this);
		black.blackscreen_set(this);
	}
	hide(id: any){
		if(id != null && (this.stack.indexOf(id) > -1)){
			this.stack.splice(this.stack.indexOf(id),1);
			if(this.stack.length == 0){
				this.showme = false;
			}
		} else if (id == null && this.stack.length == 0){
			this.showme = false;
		}
	}
	show(message: string = 'Cargando', id: any){
		if(id != null && (this.stack.indexOf(id) > -1)){
			this.message = message;
			this.showme = true;
		} else if (id == null && this.stack.length == 0){
			this.message = message;
			this.showme = true;
		} else {
			this.stack.push(id);
			this.message = message;
			this.showme = true;
		}
	}
}
