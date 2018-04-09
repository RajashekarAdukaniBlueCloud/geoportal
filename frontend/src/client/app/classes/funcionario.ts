/*
* This class represents the class definition.
*/
export class Funcionario {
    RUN: string = '';
    NOMBRE: string = '';
    ISEGLOSANOMBRE: string = '';
    ISESERVICIOID: number = 0;
    CODCALIDAD: number = 0;
    CALIDAD: string = '';
    CODAREA: number = 0;
    AREA: string = '';
    CODTIPOCALIDAD: number = 0;
    TIPOCALIDAD: string = '';
    PLANTA: string = '';
    CARGO: string = '';
    GRADO: string = '';
    REMUNERACION: string = '';
    FECHADESDE: string = '';
    FECHAHASTA: string = '';
    FECHACORTE: string = '';
    FECHACARGA: string = '';
    ISECOMUNAOFICINACENTRAL: string = '';
    COMCODGOBIERNO: string = '';
    COMCODREGION: number = 0;

    constructor(data:any = null) {
        if (data) {
            this.RUN = data.RUN ? data.RUN : '';
            this.NOMBRE = data.NOMBRE ? data.NOMBRE : '';
            this.ISEGLOSANOMBRE = data.ISEGLOSANOMBRE ? data.ISEGLOSANOMBRE : '';
            this.ISESERVICIOID = data.ISESERVICIOID ? data.ISESERVICIOID : '';
            this.CODCALIDAD = data.CODCALIDAD ? data.CODCALIDAD : '';
            this.CALIDAD = data.CALIDAD ? data.CALIDAD : '';
            this.CODAREA = data.CODAREA ? data.CODAREA : '';
            this.AREA = data.AREA ? data.AREA : '';
            this.CODTIPOCALIDAD = data.CODTIPOCALIDAD ? data.CODTIPOCALIDAD : '';
            this.TIPOCALIDAD = data.TIPOCALIDAD ? data.TIPOCALIDAD : '';
            this.PLANTA = data.PLANTA ? data.PLANTA : '';
            this.CARGO = data.CARGO ? data.CARGO : '';
            this.GRADO = data.GRADO ? data.GRADO : '';
            this.REMUNERACION = data.REMUNERACION ? data.REMUNERACION : '';
            this.FECHADESDE = data.FECHADESDE ? data.FECHADESDE : '';
            this.FECHAHASTA = data.FECHAHASTA ? data.FECHAHASTA : '';
            this.FECHACORTE = data.FECHACORTE ? data.FECHACORTE : '';
            this.FECHACARGA = data.FECHACARGA ? data.FECHACARGA : '';
            this.ISECOMUNAOFICINACENTRAL = data.ISECOMUNAOFICINACENTRAL ? data.ISECOMUNAOFICINACENTRAL : '';
            this.COMCODGOBIERNO = data.COMCODGOBIERNO ? data.COMCODGOBIERNO : '';
            this.COMCODREGION = data.COMCODREGION ? data.COMCODREGION : '';
        }
    }
}