package earlgrey.model;

import earlgrey.annotations.Model;
import earlgrey.annotations.ModelField;
import earlgrey.core.ModelCore;

@Model(name = "Sicogen", tableName = "SICOGEN2LEE.TBL_GEO_CUMPLIMIENTO_DET", version = 1)
public class SicogenCumplimiento extends ModelCore{
	@ModelField
	public String COMUNA;
	@ModelField
	public Integer TIPOARCHIVO;
	@ModelField
	public Integer ESTADOARCHIVO;
	@ModelField
	public String EJERCICIO;
	@ModelField
	public String PERIODO;
	@ModelField
	public Integer CODPERIODO;
	@ModelField 
	public Integer REGION;
	@ModelField
	public String CODMUNICIPIO;
	@ModelField
	public String MUNICIPIO;
} 