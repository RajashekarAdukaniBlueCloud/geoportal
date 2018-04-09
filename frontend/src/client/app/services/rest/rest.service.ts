import { Injectable} from '@angular/core';
import { Config } from '../../shared/config/env.config';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';

@Injectable()
export class RestService {
	http:Http;
	private blackscreen:any;
	private api:string;
	//construimos los metodos
	constructor(http: Http, private router: Router) {
		this.http = http;
		this.api = window.location.pathname;
		this.api = this.api.substring(0,this.api.indexOf(Config.WEB));
		this.api = (Config.ENV == 'DEV') ? Config.PATH + '/' + Config.WEB + "api" : window.location.protocol + "//" + window.location.host + this.api + Config.WEB + "api";
	}
	public post(data:any, uri:string) {
		let body:string = '';
		var id = 'rest-service-'+Math.random();
		this.blackscreen.show('Cargando...',id);
		for(let key in data){
			if(data[key] != null && data[key] != ''){
				if(typeof data[key] == 'object') data[key] = JSON.stringify(data[key]);
				body += key+`=${data[key]}&`;
			}
		}
		body = body.substring(0,(body.length-1));
		let header = this.createHeaders();
		return this.http.post(this.api+uri, body, {
	      	headers: header,
	      	withCredentials: true
	    }).map((res:Response) => {
			let response = res.json();
			this.blackscreen.hide(id);
			return response;
		});
	}
	public postMap(data:any, uri:string) {
		let body:string = '';
		for(let key in data){
			if(data[key] != null && data[key] != ''){
				if(typeof data[key] == 'object') data[key] = JSON.stringify(data[key]);
				body += key+`=${data[key]}&`;
			}
		}
		body = body.substring(0,(body.length-1));
		let header = this.createHeaders();
		return this.http.post(this.api+uri, body, {
	      	headers: header,
	      	withCredentials: true
	    });
	}
	// FOR JWT IMPLEMENTATION (FUTURE)
	public get(uri:string) {
		var id = 'rest-service-'+Math.random();
		let header = this.createHeaders();
		this.blackscreen.show('Cargando...',id);
		return this.http.get(this.api+uri, {
	      	headers: header,
	      	withCredentials: true
	    }).map((res:Response) => {
			let response = res.json();
			this.blackscreen.hide(id);
			return response;
		});
	}
	public getMap(uri:string) {
		let header = this.createHeaders();
		return this.http.get(this.api+uri, {
	      	headers: header,
	      	withCredentials: true
	    });
	}
	public getSilent(uri:string) {
		let header = this.createHeaders();
		return this.http.get(this.api+uri, {
	      	headers: header,
	      	withCredentials: true
	    }).map((res:Response) => {
			let response = res.json();
			return response;
		});
	}
	public getMapSilent(uri:string) {
		let header = this.createHeaders();
		return this.http.get(this.api+uri, {
	      	headers: header,
	      	withCredentials: true
	    });
	}
	public delete(id:number,uri:string) {
		var idi = 'rest-service-'+Math.random();
		this.blackscreen.show('Cargando...',idi);
		let header = this.createHeaders();
		return this.http.delete(this.api+uri+'/'+id, {
	      	headers: header,
	      	withCredentials: true
	    }).map((res:Response) => {
			let response = res.json();
			this.blackscreen.hide(idi);
			return response;
		});
	}
	public put(id:number,uri:string, data:any) {
		var idi = 'rest-service-'+Math.random();
		this.blackscreen.show('Cargando...',id);
		let body:string = '';
		for(let key in data){
			if(data[key] != null && data[key] != ''){
				if(typeof data[key] == 'object') data[key] = JSON.stringify(data[key]);
				body += key+`=${data[key]}&`;
			}
		}
		body = body.substring(0,(body.length-1));
		let header = this.createHeaders();
		return this.http.put(this.api+uri+'/'+id, body,{
	      	headers: header,
	      	withCredentials: true
	    }).map((res:Response) => {
			let response = res.json();
			this.blackscreen.hide(idi);
			return response;
		});
	}
	public blackscreen_set(black:any){
		this.blackscreen = black;
	}
	private createHeaders() {
		var headers = new Headers();
	    headers.append('Content-Type', 'application/x-www-form-urlencoded');
		return headers;
	}
}
