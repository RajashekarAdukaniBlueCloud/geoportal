package earlgrey.model;

import earlgrey.annotations.Model;
import earlgrey.annotations.ModelField;
import earlgrey.core.ModelCore;

@Model(name = "Observaciones_Auditoria_comunal", tableName = "OBS_AUDITORIA_COMUNAL", version = 1)
public class ObservacionesAuditoriaComunal extends ModelCore{
	@ModelField
	public String C_REG_SUBDERE;
	@ModelField
	public String CODIGOSUBDERE;
	@ModelField
	public Integer TOTAL;
	@ModelField
	public Integer PERIODOACTIVIDAD;
} 
