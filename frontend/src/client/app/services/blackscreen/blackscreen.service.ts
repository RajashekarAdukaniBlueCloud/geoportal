import { Injectable } from '@angular/core';

@Injectable()
export class BlackscreenService {
	//construimos los metodos
	private blackscreen:any;
	show(message:string,id:any){
		this.blackscreen.show(message,id);
	}
	hide(id:any){
		this.blackscreen.hide(id);
	}
	public blackscreen_set(black:any){
		this.blackscreen = black;
	}
}
