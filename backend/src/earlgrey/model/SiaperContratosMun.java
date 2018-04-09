package earlgrey.model;

import earlgrey.annotations.Model;
import earlgrey.annotations.ModelField;
import earlgrey.core.ModelCore;

@Model(name = "Funcionarios Municipales", tableName = "RPT_TBLMUNVIGENTES", datasource = "SIAPER", version = 1)
public class SiaperContratosMun extends ModelCore{
	@ModelField
	public String ISEGLOSANOMBRE;
	@ModelField
	public Integer ISESERVICIOID;
	@ModelField
	public Integer ISECOMUNAOFICINACENTRAL;
	@ModelField
	public Integer COMCODGOBIERNO;
	@ModelField
	public Integer COMCODREGION;
	@ModelField
	public Integer CODCALIDAD;
	@ModelField
	public String CALIDAD;
	@ModelField
	public Integer CODAREA;
	@ModelField
	public String AREA;
	@ModelField
	public Integer CODTIPOCALIDAD;
	@ModelField
	public String TIPOCALIDAD;
	@ModelField
	public Integer TOTAL;
	@ModelField
	public String FECHACORTE;
	@ModelField
	public String FECHACARGA;
} 
