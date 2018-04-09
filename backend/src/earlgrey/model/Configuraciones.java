package earlgrey.model;

import earlgrey.annotations.Model;
import earlgrey.annotations.ModelField;
import earlgrey.core.ModelCore;

@Model(name = "Configuraciones", tableName = "GEOPORTAL_CONF", version = 1)
public class Configuraciones extends ModelCore{
	@ModelField
	public Integer X_CONF;
	@ModelField
	public Integer TYPE;
	@ModelField
	public String KEY;
	@ModelField
	public String VALUE;
} 