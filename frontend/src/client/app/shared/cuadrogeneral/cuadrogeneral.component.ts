import { Component, Input } from '@angular/core';
/**
* This class represents the main application component.
*/
@Component({
    moduleId: module.id,
    selector: 'sd-cuadrogeneral',
    templateUrl: 'cuadrogeneral.component.html',
    styleUrls: ['cuadrogeneral.component.css'],
})
export class CuadrogeneralComponent {
    @Input() public name: string;
    @Input() public date: string;
}