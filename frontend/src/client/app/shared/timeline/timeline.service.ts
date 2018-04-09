import { Injectable, Inject} from '@angular/core';
import { Config } from '../../shared/config/env.config';
import { TimelineComponent } from './timeline.component';
import 'rxjs/add/operator/map';
import { ITimeline } from '../../classes/itimeline';

@Injectable()
export class TimelineService {
	private timeline: TimelineComponent = null;
	private show_time: boolean = false;
	private timeline_service:ITimeline;
	private min: number = 2014;
	private max: number = 2018;
	private yearsingle: number = 2017;
	// CONSTRUCTOR DEL SERVICIO
	constructor() {
		
	}
	public registerComponent(component:TimelineComponent){
		this.timeline = component;
		if(this.show_time){
			this.timeline.showTimeline();
		} else {
			this.timeline.hideTimeline();
		}
	}
	public changeScale(low: number, high: number, step: number){

	}
	public registerService(timeline_service: ITimeline){
		this.timeline_service = timeline_service;
	}
	public hideTimeline(){
		this.show_time = false;
		if(this.timeline != null){
			this.timeline.hideTimeline();
		}
	}
	public showTimeline(){
		this.show_time = true;
		if(this.timeline != null){
			this.timeline.showTimeline();
		}
	}
	public handleChange(event:any){
		this.min = event[0];
		this.max = event[1];
		this.yearsingle = event;
		this.timeline_service.onTimeLineChange(event);
	}
	public getMin() {
		return this.min;
	}
	public getMax() {
		return this.max;
	}
	public getYearSingle() {
		return this.yearsingle;
	}
	public changeToSingle(min: number, max:number){
		this.min = min;
		this.max = max;
		this.timeline.changeToSingle(min, max);
	}
	public changeToDouble(min: number, max:number){
		this.min = min;
		this.max = max;
		this.timeline.changeToDouble(min, max);
	}
}