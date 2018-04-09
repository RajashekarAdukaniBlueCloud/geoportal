import { NgModule } from '@angular/core';
import { GrammarcheckerPipe } from './grammarchecker/grammarchecker.pipe';
import { RunPipe } from './run/run.pipe';
import { DatetextPipe } from './datetext/datetext.pipe';
import { KeysPipe } from './keys/keys.pipe';
import { NoemptyPipe } from './noempty/noempty.pipe';
import { ClpPipe } from './clp/clp.pipe';
import { CapitalizePipe } from './capitalize/capitalize.pipe';
import { PointReplacerPipe } from './point/point-replace.pipe';
import { RemoveUnderscorePipe } from './removeunderscore/removeunderscore.pipe';
/**
* Especificamos el modulo
*/

@NgModule({
	declarations:[CapitalizePipe, ClpPipe, NoemptyPipe, KeysPipe, PointReplacerPipe, DatetextPipe, RemoveUnderscorePipe, GrammarcheckerPipe, RunPipe],
	exports: [CapitalizePipe, ClpPipe, NoemptyPipe, KeysPipe, PointReplacerPipe, DatetextPipe, RemoveUnderscorePipe, GrammarcheckerPipe, RunPipe]
})
export class PipesModule {
}