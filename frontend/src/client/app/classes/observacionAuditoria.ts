import { InformeAuditoria } from "./informeAuditoria";

export class ObservacionAuditoria{
    IDACTIVIDAD: number = 0;
    IDOBSERVACION: number = 0;
    PERIODOACTIVIDAD: number = 0;
    NOMBRESERVICIO: string = "";
    AREASERVICIO: string = "";
    TIPOSUBDERE: string = "";
    CODIGOSUBDERE: string = "";
    NOMBRESUBDERE: string = "";
    COMPLEJIDADSERVICIO: string = "";
    C_REG_SUBDERE: string = "";
    ESTADOSUBSANACION: string = "";
    TITULOOBSERVACION: string = "";
    DESCOBSERVACION: string = "";
    REQUIERESEGUIMIENTO: string = "";
    ACCIONCORRECTIVA: string = "";
    informe: InformeAuditoria = null;
    
    constructor(data: any = null) {
        if(data) {
            this.IDACTIVIDAD = data.IDACTIVIDAD;
            this.IDOBSERVACION = data.IDOBSERVACION;
            this.PERIODOACTIVIDAD = data.PERIODOACTIVIDAD;
            this.NOMBRESERVICIO = data.NOMBRESERVICIO;
            this.AREASERVICIO = data.AREASERVICIO;
            this.TIPOSUBDERE = data.TIPOSUBDERE;
            this.CODIGOSUBDERE = data.CODIGOSUBDERE;
            this.NOMBRESUBDERE = data.NOMBRESUBDERE;
            this.COMPLEJIDADSERVICIO = data.COMPLEJIDADSERVICIO;
            this.C_REG_SUBDERE = data.C_REG_SUBDERE;
            this.ESTADOSUBSANACION = data.ESTADOSUBSANACION;
            this.TITULOOBSERVACION = data.TITULOOBSERVACION;
            this.DESCOBSERVACION = data.DESCOBSERVACION;
            this.REQUIERESEGUIMIENTO = data.REQUIERESEGUIMIENTO;
            this.ACCIONCORRECTIVA = data.ACCIONCORRECTIVA;
            this.informe = data.informe;
        }
    }
};