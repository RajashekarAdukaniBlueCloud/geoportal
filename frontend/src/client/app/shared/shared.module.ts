import { NgModule, ModuleWithProviders } from '@angular/core';
import { CuadronacionalComponent } from './cuadronacional/cuadronacional.component';
import { NavcomunasComponent } from './navcomunas/navcomunas.component';
import { CuadrogeneralComponent } from './cuadrogeneral/cuadrogeneral.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BlackscreenComponent } from './blackscreen/blackscreen.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ArbolComponent } from './arbol/arbol.component';
import { PipesModule } from '../pipes/pipes.module';
import { TimelineComponent } from './timeline/timeline.component';
import { TimelineService } from './timeline/timeline.service';
/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule, PipesModule],
  declarations:[BlackscreenComponent, NavbarComponent, ArbolComponent, CuadrogeneralComponent, NavcomunasComponent, CuadronacionalComponent,TimelineComponent],
  exports: [CommonModule, FormsModule, RouterModule, BlackscreenComponent, NavbarComponent, ArbolComponent, CuadrogeneralComponent, 
    NavcomunasComponent, CuadronacionalComponent, TimelineComponent],
  providers: [TimelineService]
    
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
