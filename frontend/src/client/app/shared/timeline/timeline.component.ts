import { Component, QueryList, ViewChild, ViewChildren, AfterViewInit, ElementRef } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { TimelineService } from './timeline.service';
import { Subscriber } from 'rxjs/Subscriber';
import { Observable } from 'rxjs/Observable';
declare var noUiSlider:any;
/**
* This class represents the main application component.
*/
@Component({
	moduleId: module.id,
	selector: 'sd-timeline',
	templateUrl: 'timeline.component.html',
	styleUrls: ['timeline.component.css'],
})
export class TimelineComponent implements OnInit, AfterViewInit{
	private show: boolean = true;
	private range: number[] = [2014,2019];
	// @ViewChildren('slider') slider: QueryList<any>;
	@ViewChild('slider') taskNoteRef:ElementRef;
	private sliders: any;
	private type: string = 'double';
	private timeline_observer: Subscriber<any>;
	private config: any = {
		behaviour: 'drag',
		connect: true,
		margin: 1,
		step: 1,
		//limit: 5, // NOTE: overwritten by [limit]="10"
		range: {
		  min: 2014,
		  max: (new Date()).getUTCFullYear()+1
		},
		start: [2014,2018],
		tooltips: true,
		pips: {
			mode: 'count',
		  	density: 4,
		 	values: 6
		},
		format: {
		  to: function (value: any) {
			return value + '';
		  },
		  from: function (value:any) {
			return value.replace(',-', '');
		  }
		}
	};
	/* CONSTRUCTOR */
	constructor(private timeline:TimelineService) {
	}
	public ngAfterViewInit(){
		this.sliders = noUiSlider.create(this.taskNoteRef.nativeElement, this.config);
		if(this.timeline_observer) {
			this.timeline_observer.next();
			this.timeline_observer.complete();
		}
	}
	public ngOnInit(): void {
		this.timeline.registerComponent(this);
	}
	private onChange(event:any){
		this.timeline.handleChange(event);
	}
	public showTimeline(){
		this.show = true;
	}
	public hideTimeline(){
		this.show = false;
	}
	public changeToSingle(min: number, max:number){
		var self = this;
		this.timelineObserver().subscribe(data => {
			this.sliders.destroy();
			this.range = [max];
			this.config.range.min = min;
			this.config.range.max = max;
			this.config.start = [max];
			this.config.pips.values = max - min +1;
			this.sliders = noUiSlider.create(this.taskNoteRef.nativeElement, this.config);
			this.sliders.on('change', function(e:any){
				self.onChange(e);
			});
			this.type = 'single';
		});
	}
	public changeToDouble(min: number,max: number){
		var self = this;
		this.timelineObserver().subscribe(data => {
			this.sliders.destroy();
			this.range = [min,max];
			this.config.range.min = min;
			this.config.start = [min,max];
			this.config.range.max = max;
			this.config.pips.values = max - min +1;
			this.sliders = noUiSlider.create(this.taskNoteRef.nativeElement, this.config);
			this.sliders.on('change', function(e:any){
				self.onChange(e);
			});
			this.type = 'double';
		});
	}
	private timelineObserver(){
		return new Observable(observer => {
			this.timeline_observer = observer;
			if(this.taskNoteRef && this.sliders){
				observer.next();
				observer.complete();
			}
		});
	}
}