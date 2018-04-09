export class InformeAuditoria{
    IDINFORME: number = 0;
    NUMEROINFORME: number = 0;
    ANOINFORME: number = 0;
    FECHAINFORME: string = "";
    TIPOINFORME: string = "";
    NOMBRESERVICIO: string = "";
    TIPOSUBDERE: string = "";
    C_REG_SUBDERE: string = "";
    CODIGOSUBDERE: string = "";
    NOMBRESUBDERE: string = "";
    MATERIAINFORME: string = "";
    FICHAINFORME: string = "";
    PDFINFORME: string = "";
    FICHAINFORMEBIFA: string = "";
    IDACTIVIDAD: string = "";
    
    constructor(data: any = null) {
        if(data) {
            this.IDINFORME = data.IDINFORME;
            this.NUMEROINFORME = data.NUMEROINFORME;
            this.ANOINFORME = data.ANOINFORME;
            this.FECHAINFORME = data.FECHAINFORME;
            this.TIPOINFORME = data.TIPOINFORME;
            this.NOMBRESERVICIO = data.NOMBRESERVICIO;
            this.TIPOSUBDERE = data.TIPOSUBDERE;
            this.C_REG_SUBDERE = data.C_REG_SUBDERE;
            this.CODIGOSUBDERE = data.CODIGOSUBDERE;
            this.NOMBRESUBDERE = data.NOMBRESUBDERE;
            this.MATERIAINFORME = data.MATERIAINFORME;
            this.FICHAINFORME = data.FICHAINFORME;
            this.PDFINFORME = data.PDFINFORME;
            this.FICHAINFORMEBIFA = data.FICHAINFORMEBIFA;
            this.IDACTIVIDAD = data.IDACTIVIDAD;
        }
    }
};