package earlgrey.model;

import earlgrey.annotations.Model;
import earlgrey.annotations.ModelField;
import earlgrey.core.ModelCore;

@Model(name = "SicogenEjecucion", tableName = "SICOGEN2LEE.TBL_GEO_EJECUCION_DET", version = 1)
public class SicogenEjecucion extends ModelCore{
	@ModelField
	public String CODIGO_COM;
	@ModelField
	public Integer PRESUPUESTO_INICIAL;
	@ModelField
	public Integer PRESUPUESTO_ACT;
	@ModelField
	public Integer VARIACION_PRESP;
	@ModelField
	public Integer EJECUCION;
	@ModelField
	public Integer EJECUCION_PERC;
	@ModelField
	public Integer MUNICIPIO_COD;
	@ModelField
	public Integer CODIGO_REG;
	@ModelField
	public Integer EJERCICIO;
} 
