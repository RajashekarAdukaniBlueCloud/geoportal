import { Component, Input } from '@angular/core';
/**
* This class represents the main application component.
*/
@Component({
    moduleId: module.id,
    selector: 'sd-cuadronacional',
    templateUrl: 'cuadronacional.component.html',
    styleUrls: ['cuadronacional.component.css'],
})
export class CuadronacionalComponent {
    @Input() public value: string;
    @Input() public leyend: string;
}