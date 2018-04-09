package earlgrey.core;

import java.util.Hashtable;

import org.apache.commons.lang3.ArrayUtils;

import earlgrey.def.RouteDef;

public class Router {
	// CARGAMOS EL ARBOL DE RUTAS
	private Hashtable<String,RouteDef> RouteMap;
	// CARGAMOS LA TABLA DE RUTAS
	private Hashtable<String,RouteDef> RouteTable;
	// CONSTRUCTOR
	public Router() {
		ResourceMaping resource = ResourceMaping.getInstance();
		this.RouteMap = resource.getRouteMap();
		this.RouteTable = resource.getRouteTable();
	}
	public RouteDef route(String path){
		
		String[] ruta = path.split("/");
		if(ruta.length > 0){
			if(this.RouteMap.containsKey(ruta[0])){
				RouteDef rt = this.RouteMap.get(ruta[0]);
				ruta = ArrayUtils.remove(ruta,0);
				RouteDef enrutado = rt.route(ruta, null);
				return enrutado;
			}
			else
			{
				return null;
			}
		}
		else
		{
			return null;
		}
	}
}
