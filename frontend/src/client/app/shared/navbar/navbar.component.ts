import { Component} from '@angular/core';
import { RestService } from '../../services/rest/rest.service';
import { BlackscreenService } from '../../services/blackscreen/blackscreen.service';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'nav-bar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})

export class NavbarComponent{
}
