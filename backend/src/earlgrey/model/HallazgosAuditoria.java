package earlgrey.model;

import earlgrey.annotations.Model;
import earlgrey.annotations.ModelField;
import earlgrey.core.ModelCore;

@Model(name = "Hallazgos de Auditoria", tableName = "OBSERVACIONES_AUDITORIA", version = 1)
public class HallazgosAuditoria extends ModelCore{
	@ModelField
	public Integer IDACTIVIDAD;
	@ModelField
	public Integer IDOBSERVACION;
	@ModelField
	public Integer PERIODOACTIVIDAD;
	@ModelField
	public String NOMBRESERVICIO;
	@ModelField
	public String AREASERVICIO;
	@ModelField
	public String TIPOSUBDERE;
	@ModelField
	public String CODIGOSUBDERE;
	@ModelField
	public String NOMBRESUBDERE;
	@ModelField
	public String COMPLEJIDADSERVICIO;
	@ModelField
	public String C_REG_SUBDERE;
	@ModelField
	public String ESTADOSUBSANACION;
	@ModelField
	public String TITULOOBSERVACION;
	@ModelField
	public String DESCOBSERVACION;
	@ModelField
	public String REQUIERESEGUIMIENTO;
	@ModelField
	public String ACCIONCORRECTIVA;
} 
