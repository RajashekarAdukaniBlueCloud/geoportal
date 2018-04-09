package earlgrey.model;

import earlgrey.annotations.Model;
import earlgrey.annotations.ModelField;
import earlgrey.core.ModelCore;

@Model(name = "Comunas", tableName = "DATOS_COMUNALES_COMP", version = 1)
public class Comunas extends ModelCore{
	@ModelField
	public String NOMBRE;
	@ModelField
	public String NUMERO;
	@ModelField
	public String C_REGION_SUBDERE;
} 
