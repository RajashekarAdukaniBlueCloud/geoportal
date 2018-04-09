package earlgrey.model;

import earlgrey.annotations.Model;
import earlgrey.annotations.ModelField;
import earlgrey.core.ModelCore;

@Model(name = "Sicogen detalle de cumplimiento", tableName = "SICOGEN2LEE.TBL_GEO_CUMPLIMIENTO2_DET", version = 1)
public class SicogenDetalleCumplimiento extends ModelCore{
	@ModelField
	public String CODMUNICIPIO;
	@ModelField
	public String MUNICIPIO;
	@ModelField
	public Integer REGION;
	@ModelField
	public String COMUNA;
	@ModelField
	public String EJERCICIO;
	@ModelField
	public Integer CODPERIODO;
	@ModelField
	public String PERIODO;
	@ModelField
	public Integer CODTIPOINFORME;
	@ModelField
	public String TIPOINFORME;
	@ModelField
	public String INFORME;
	@ModelField
	public Integer FILEID;
	@ModelField
	public String FECHAENVIO;
	@ModelField
	public String FECHACORTE;
	@ModelField
	public Integer ORDENMUN;
	@ModelField
	public Integer ORDENTOT;
	@ModelField
	public String URL;
}