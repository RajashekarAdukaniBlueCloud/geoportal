import { trigger, transition, state, animate, style  } from '@angular/animations';

export let fade = trigger('fade', [
    state('void', style({
        opacity: 0
    })),
    transition(':enter, :leave', [
        animate(300)
    ])
]);

export let move = trigger('move', [
    state('void', style({
        opacity: 0,
        transform: 'translateX(-40px)'
    })),
    transition(':enter, :leave', [
        animate(300)
    ])
]);

export let drop = trigger('drop', [
    state('void', style({
        opacity: 0,
        transform: 'translateY(-20px)'
    })),
    transition(':enter, :leave', [
        animate(300)
    ])
]);