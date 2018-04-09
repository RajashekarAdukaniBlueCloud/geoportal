package earlgrey.model;

import earlgrey.annotations.Model;
import earlgrey.annotations.ModelField;
import earlgrey.core.ModelCore;

@Model(name = "Funcionarios Municipales por RUN", tableName = "RPT_TBLMUNFUNCIONARIO", datasource = "SIAPER", version = 1)
public class SiaperFuncionariosMun extends ModelCore{
	@ModelField
	public String RUN;
	@ModelField
	public String NOMBRE;
	@ModelField
	public String ISEGLOSANOMBRE;
	@ModelField
	public Integer ISESERVICIOID;
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
	public String PLANTA;
	@ModelField
	public String CARGO;
	@ModelField
	public String GRADO;
	@ModelField
	public String REMUNERACION;
	@ModelField
	public String FECHADESDE;
	@ModelField
	public String FECHAHASTA;
	@ModelField
	public String FECHACORTE;
	@ModelField
	public String FECHACARGA;
	@ModelField
	public String ISECOMUNAOFICINACENTRAL;
	@ModelField
	public String COMCODGOBIERNO;
	@ModelField
	public Integer COMCODREGION;
} 