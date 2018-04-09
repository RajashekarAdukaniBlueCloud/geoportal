/*
* This class represents the class definition.
*/
export class CumplimientoDetalle {
    public CODMUNICIPIO: string = "";
    public MUNICIPIO: string = "";
    public REGION: number = 0;
    public COMUNA: string = "";
    public EJERCICIO: string = "";
    public CODPERIODO: number = 0;
    public PERIODO: string = "";
    public CODTIPOINFORME: number = 0;
    public TIPOINFORME: string = "";
    public INFORME: string = "";
    public FILEID: number = 0;
    public FECHAENVIO: string = "";
    public FECHACORTE: string = "";
    public ORDENMUN: number = 0;
    public ORDENTOT: number = 0;
    public URL: string = "";

    constructor(data: any = null) {
        if(data) {
            this. CODMUNICIPIO = data.CODMUNICIPIO;
            this. MUNICIPIO = data.MUNICIPIO;
            this. REGION = data.REGION;
            this. COMUNA = data.COMUNA;
            this. EJERCICIO = data.EJERCICIO;
            this. CODPERIODO = data.CODPERIODO;
            this. PERIODO = data.PERIODO;
            this. CODTIPOINFORME = data.CODTIPOINFORME;
            this. TIPOINFORME = data.TIPOINFORME;
            this. INFORME = data.INFORME;
            this. FILEID = data.FILEID;
            this. FECHAENVIO = data.FECHAENVIO;
            this. FECHACORTE = data.FECHACORTE;
            this. ORDENMUN = data.ORDENMUN;
            this. ORDENTOT = data.ORDENTOT;
            this.URL = data.URL;
        }
    }

    public getFechaCorte() : Date {
        if(this.FECHACORTE) {
            let split_date = this.FECHACORTE.split('/');
            return new Date(Number(split_date[2]), Number(split_date[1])-1, Number(split_date[0]));
        }
        return null;
    }

    public getFechaEnvio() : Date {
        if(this.FECHAENVIO) {
            let split_date = this.FECHAENVIO.split('/');
            return new Date(Number(split_date[2]), Number(split_date[1])-1, Number(split_date[0]));
        }
        return null;
    }
}