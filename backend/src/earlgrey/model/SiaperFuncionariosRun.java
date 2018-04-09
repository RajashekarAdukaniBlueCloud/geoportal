package earlgrey.model;

import earlgrey.annotations.Model;
import earlgrey.annotations.ModelField;
import earlgrey.core.ModelCore;

@Model(name = "Funcionarios Municipales por Run", tableName = "RPT_TBLMUNTOTAL_X_RUN", datasource = "SIAPER", version = 1)
public class SiaperFuncionariosRun extends ModelCore{
	@ModelField
	public String ISEGLOSANOMBRE;
	@ModelField
	public Integer ISESERVICIOID;
	@ModelField
	public Integer ISECOMUNAOFICINACENTRAL;
	@ModelField
	public String COMCODGOBIERNO;
	@ModelField
	public Integer COMCODREGION;
	@ModelField
	public Integer TOTAL;
	@ModelField
	public String FECHACORTE;
	@ModelField
	public String FECHACARGA;
} 