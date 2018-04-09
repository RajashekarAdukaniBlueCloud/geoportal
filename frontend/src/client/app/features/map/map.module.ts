import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapComponent } from './map.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MapComponent],
  exports: [MapComponent],
  providers: []
})
export class MapModule { }
