import { CumplimientoDetalle } from './cumplimientodetalle';
/*
* This class represents the class definition.
*/
export class Cumplimiento {
    public CODMUNICIPIO: string = "";
    public MUNICIPIO: string = "";
    public REGION: number = 0;
    public COMUNA: string = "";
    public EJERCICIO: string = "";
    public CODPERIODO: number = 0;
    public PERIODO: string = "";
    public TIPOARCHIVO: number = 0;
    public ESTADOARCHIVO: number = 0;
    public reports: CumplimientoDetalle[] = [];

    constructor(data: any = null) {
        if(data) {
            this.CODMUNICIPIO = data.CODMUNICIPIO;
            this.MUNICIPIO = data.MUNICIPIO;
            this.REGION = data.REGION;
            this.COMUNA = data.COMUNA;
            this.EJERCICIO = data.EJERCICIO;
            this.CODPERIODO = data.CODPERIODO;
            this.PERIODO = data.PERIODO;
            this.TIPOARCHIVO = data.TIPOARCHIVO;
            this.ESTADOARCHIVO = data.ESTADOARCHIVO;
            data.informes.forEach((element: any) => {
                this.reports.push(new CumplimientoDetalle(element));
            });
        }
    }
}