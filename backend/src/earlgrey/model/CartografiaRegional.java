package earlgrey.model;

import earlgrey.annotations.Model;
import earlgrey.annotations.ModelField;
import earlgrey.core.ModelCore;
import earlgrey.types.CentroideType;
import earlgrey.types.GeometriaType;

@Model(name = "Cartografia_regional", tableName = "SPATIAL_DATA_REGIONAL", version = 1)
public class CartografiaRegional extends ModelCore{
	@ModelField
	public String REGION;
	@ModelField
	public String C_REG;
	@ModelField
	public GeometriaType GEOMREGIONAL;
	@ModelField
	public CentroideType CENTROIDE;
	@ModelField
	public String FIT;
} 
