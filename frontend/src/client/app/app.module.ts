import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { ServicesModule } from './services/services.module';
import { FeaturesModule } from './features/features.module';
import { PipesModule } from './pipes/pipes.module';
import { DirectivesModule } from './directives/directives.module';
import { SharedModule } from './shared/shared.module';
import { ChartModule } from 'angular2-chartjs';

declare var BASE_LOCATION_HREF:any;

@NgModule({
	imports: [BrowserModule, HttpModule, AppRoutingModule, SharedModule.forRoot(),
	ServicesModule, FeaturesModule, PipesModule, DirectivesModule, ChartModule, BrowserAnimationsModule],
	declarations: [AppComponent],
	providers: [{
		provide: APP_BASE_HREF,
		useValue: BASE_LOCATION_HREF
	}],
	bootstrap: [AppComponent]

})
export class AppModule {
	constructor(){
		console.log(BASE_LOCATION_HREF);
	}
}