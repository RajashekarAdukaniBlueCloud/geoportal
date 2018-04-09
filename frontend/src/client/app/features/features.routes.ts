import { Route } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { HomeComponent } from './home/home.component';
import { AuditoriaComponent } from './auditoria/auditoria.component';
import { CumplimientoComponent } from './cumplimiento/cumplimiento.component';
import { EjecucionComponent } from './ejecucion/ejecucion.component';
import { ScreenComponent } from './screen/screen.component';
import { FuncionariosComponent } from  './funcionarios/funcionarios.component';
import { HallazgosComponent } from './hallazgos/hallazgos.component';

export const FeaturesRoutes: Route[] = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'auditoria'
	},
	{
		path: '',
		component: IndexComponent,
		children: [
			{ path: '', component: ScreenComponent },
	      	{ path: 'auditoria', component: AuditoriaComponent },
	      	{ path: 'cumplimiento', component: CumplimientoComponent },
            { path: 'ejecucion', component: EjecucionComponent },
            { path: 'funcionarios', component: FuncionariosComponent },
            { path: 'hallazgos', component: HallazgosComponent }
		],
		//ROUTER CHILDREN LIMIT (NOT REMOVE - CLI COMPONENT)
		canActivate: []
	}
];