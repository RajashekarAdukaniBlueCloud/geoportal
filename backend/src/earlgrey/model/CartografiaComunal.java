package earlgrey.model;

import earlgrey.annotations.Model;
import earlgrey.annotations.ModelField;
import earlgrey.core.ModelCore;
import earlgrey.types.CentroideType;
import earlgrey.types.GeometriaType;

@Model(name = "Cartografia_comunal", tableName = "SPATIAL_DATA_COMUNAL", version = 1)
public class CartografiaComunal extends ModelCore{
	@ModelField
	public String CINE_COM;
	@ModelField
	public String COMUNA;
	@ModelField
	public String X_REGI;
	@ModelField
	public GeometriaType GEOMCOMUNAL;
	@ModelField
	public CentroideType CENTROIDE;
	@ModelField
	public String FIT;
} 
