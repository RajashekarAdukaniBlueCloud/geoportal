package earlgrey.controller;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONObject;

import earlgrey.annotations.Controller;
import earlgrey.annotations.ControllerAction;
import earlgrey.annotations.ParamRequire;
import earlgrey.annotations.Policie;
import earlgrey.annotations.Route;
import earlgrey.core.ControllerCore;
import earlgrey.core.HttpRequest;
import earlgrey.core.HttpResponse;
import earlgrey.core.ModelCore;
import earlgrey.model.SicogenCumplimiento;
import earlgrey.model.SicogenDetalleCumplimiento;
import earlgrey.model.SicogenEjecucion;

@Controller(description = "Controlador para obtener las actions de contabilidad.", name = "Test", version = 1)
@Route(route = "/contabilidad")
public class Contabilidad extends ControllerCore{
	@ControllerAction(description = "Se utiliza para obtener la metadata de cumplimiento regional.", name = "contabilidad_cumplimiento regional", version = 1)
	@Route(route = "/regiones/cumplimiento")
	@ParamRequire(name = "year")
	@Policie(name = "AllPass")
	public static void cumplimientoNacional(HttpRequest req, HttpResponse res){
		JSONObject regiones = new JSONObject();
		SicogenCumplimiento cumplimiento = new SicogenCumplimiento();
		cumplimiento.EJERCICIO = req.getParam("year");
		ArrayList<ModelCore> resul = cumplimiento.find().get();
		for(int i=0;i<resul.size();i++){
			SicogenCumplimiento com = (SicogenCumplimiento)resul.get(i);
			String region = (com.REGION < 10)?"0"+String.valueOf(com.REGION):String.valueOf(com.REGION);
			if(!regiones.has(region)){
				JSONObject esquema = new JSONObject();
				esquema.put("CUMPLIDO", 0);
				esquema.put("PARCIAL", 0);
				esquema.put("INCUMPLIDO", 0);
				esquema.put("UPERIODO", 0);
				regiones.put(region, esquema);
			}
			if(com.TIPOARCHIVO == 1 || com.TIPOARCHIVO == 2){
				JSONObject obj = regiones.getJSONObject(region);
				if(Integer.valueOf(com.CODPERIODO)  >= obj.getInt("UPERIODO")){
					obj.put("UPERIODO", com.CODPERIODO);
				}
				if(com.ESTADOARCHIVO == 1){
					obj.put("CUMPLIDO", obj.getInt("CUMPLIDO")+1);
					continue;
				}
				obj.put("INCUMPLIDO", obj.getInt("INCUMPLIDO")+1);
				continue;
			}
			else
			{
				JSONObject obj = regiones.getJSONObject(region);
				if(Integer.valueOf(com.CODPERIODO)  >= obj.getInt("UPERIODO")){
					obj.put("UPERIODO", com.CODPERIODO);
				}
				if(com.ESTADOARCHIVO == 100){
					obj.put("CUMPLIDO", obj.getInt("CUMPLIDO")+1);
					continue;
				}
				else if(com.ESTADOARCHIVO == 50){
					obj.put("PARCIAL", obj.getInt("PARCIAL")+1);
					continue;
				}
				obj.put("INCUMPLIDO", obj.getInt("INCUMPLIDO")+1);
				continue;
			}
		}
		res.json(regiones);
		return;
	}
	@ControllerAction(description = "Se utiliza para obtener la metadata de cumplimiento regional.", name = "contabilidad_cumplimiento regional", version = 1)
	@Route(route = "/regiones/:C_REG/cumplimiento")
	@ParamRequire(name = "C_REG")
	@ParamRequire(name = "year")
	@Policie(name = "AllPass")
	public static void cumplimientoRegional(HttpRequest req, HttpResponse res){
		JSONObject comunas = new JSONObject();
		SicogenCumplimiento cumplimiento = new SicogenCumplimiento();
		cumplimiento.EJERCICIO = req.getParam("year");
		cumplimiento.REGION = Integer.valueOf(req.getParam("C_REG"));
		cumplimiento.TIPOARCHIVO = 0;
		ArrayList<ModelCore> resul = cumplimiento.find().get();
		for(int i=0;i<resul.size();i++){
			SicogenCumplimiento com = (SicogenCumplimiento)resul.get(i);
			if(!comunas.has(com.COMUNA)){
				JSONObject esquema = new JSONObject();
				esquema.put("ESTADO", 0);
				esquema.put("PERIODO", 0);
				esquema.put("CUMPLIDO", 0);
				esquema.put("TOTAL", 0);
				comunas.put(com.COMUNA, esquema);
			}
			JSONObject obj = comunas.getJSONObject(com.COMUNA);
			if(Integer.valueOf(com.CODPERIODO)  >= obj.getInt("PERIODO")){
				obj.put("ESTADO", com.ESTADOARCHIVO);
				obj.put("PERIODO", com.CODPERIODO);
			}
			if(com.ESTADOARCHIVO == 100){
				obj.put("CUMPLIDO", obj.getInt("CUMPLIDO")+1);
			}
			obj.put("TOTAL", obj.getInt("TOTAL")+1);
			
			/*-
			if(!comunas.has(com.COMUNA)){
				JSONObject esquema = new JSONObject();
				esquema.put("CUMPLIDO", 0);
				esquema.put("PARCIAL", 0);
				esquema.put("INCUMPLIDO", 0);
				comunas.put(com.COMUNA, esquema);
			}
			if(com.TIPOARCHIVO == 1 || com.TIPOARCHIVO == 2){
				JSONObject obj = comunas.getJSONObject(com.COMUNA);
				if(com.ESTADOARCHIVO == 1){
					obj.put("CUMPLIDO", obj.getInt("CUMPLIDO")+1);
					continue;
				}
				obj.put("INCUMPLIDO", obj.getInt("INCUMPLIDO")+1);
				continue;
			}
			else
			{
				JSONObject obj = comunas.getJSONObject(com.COMUNA);
				if(com.ESTADOARCHIVO == 100){
					obj.put("CUMPLIDO", obj.getInt("CUMPLIDO")+1);
					continue;
				}
				else if(com.ESTADOARCHIVO == 50){
					obj.put("PARCIAL", obj.getInt("PARCIAL")+1);
					continue;
				}
				obj.put("INCUMPLIDO", obj.getInt("INCUMPLIDO")+1);
				continue;
			}*/
		}
		res.json(comunas);
		return;
	}
	@ControllerAction(description = "Se utiliza para obtener la metadata de cumplimiento regional.", name = "contabilidad_cumplimiento regional", version = 1)
	@Route(route = "/comunas/:C_COM/cumplimiento")
	@ParamRequire(name = "C_COM")
	@ParamRequire(name = "year")
	@Policie(name = "AllPass")
	public static void cumplimientoComunal(HttpRequest req, HttpResponse res){
		SicogenCumplimiento cumplimiento = new SicogenCumplimiento();
		SicogenDetalleCumplimiento detalle = new SicogenDetalleCumplimiento();
		cumplimiento.EJERCICIO = req.getParam("year");
		cumplimiento.COMUNA = req.getParam("C_COM");
		detalle.EJERCICIO = req.getParam("year");
		detalle.COMUNA = req.getParam("C_COM");
		JSONArray result = cumplimiento.find().getJSON();
		for(int i=0; i<result.length(); i++) {
			JSONObject cum = result.getJSONObject(i);
			detalle.CODPERIODO = cum.getInt("CODPERIODO");
			detalle.CODTIPOINFORME = cum.getInt("TIPOARCHIVO");
			JSONArray det = detalle.find().getJSON();
			cum.put("informes", det);
		}
		res.json(result);
		return;
	}
	@ControllerAction(description = "Se utiliza para obtener la metadata de cumplimiento regional.", name = "contabilidad_cumplimiento regional", version = 1)
	@Route(route = "/regiones/ejecucion")
	@ParamRequire(name = "year")
	@Policie(name = "AllPass")
	public static void ejecucionNacional(HttpRequest req, HttpResponse res){
		JSONObject regiones = new JSONObject();
		SicogenEjecucion cumplimiento = new SicogenEjecucion();
		cumplimiento.EJERCICIO = Integer.valueOf(req.getParam("year"));
		ArrayList<ModelCore> resul = cumplimiento.find().get();
		for(int i=0;i<resul.size();i++){
			SicogenEjecucion com = (SicogenEjecucion)resul.get(i);
			String region = (com.CODIGO_REG < 10)?"0"+String.valueOf(com.CODIGO_REG):String.valueOf(com.CODIGO_REG);
			if(!regiones.has(region)){
				JSONObject esquema = new JSONObject();
				esquema.put("EJECUCION", 0);
				esquema.put("PRESUPUESTO_ACT", 0);
				esquema.put("PRESUPUESTO_INI", 0);
				regiones.put(region, esquema);
			}
			JSONObject obj = regiones.getJSONObject(region);
			obj.put("EJECUCION", obj.getInt("EJECUCION")+com.EJECUCION);
			obj.put("PRESUPUESTO_ACT", obj.getInt("PRESUPUESTO_ACT")+com.PRESUPUESTO_ACT);
			obj.put("PRESUPUESTO_INI", obj.getInt("PRESUPUESTO_INI")+com.PRESUPUESTO_INICIAL);
		}
		res.json(regiones);
		return;
	}
	@ControllerAction(description = "Se utiliza para obtener la metadata de cumplimiento regional.", name = "contabilidad_cumplimiento regional", version = 1)
	@Route(route = "/regiones/:C_REG/ejecucion")
	@ParamRequire(name = "C_REG")
	@ParamRequire(name = "year")
	@Policie(name = "AllPass")
	public static void ejecucionRegional(HttpRequest req, HttpResponse res){
		JSONObject regiones = new JSONObject();
		SicogenEjecucion cumplimiento = new SicogenEjecucion();
		cumplimiento.EJERCICIO = Integer.valueOf(req.getParam("year"));
		cumplimiento.CODIGO_REG = Integer.valueOf(req.getParam("C_REG"));
		ArrayList<ModelCore> resul = cumplimiento.find().get();
		for(int i=0;i<resul.size();i++){
			SicogenEjecucion com = (SicogenEjecucion)resul.get(i);
			JSONObject esquema = new JSONObject();
			esquema.put("EJECUCION", com.EJECUCION);
			esquema.put("PRESUPUESTO_ACT", com.PRESUPUESTO_ACT);
			esquema.put("VARIACION_PRE", com.VARIACION_PRESP);
			esquema.put("PRESUPUESTO_INI", com.PRESUPUESTO_INICIAL);
			esquema.put("EJECUCION_PERC", com.EJECUCION_PERC);
			String comuna = (com.CODIGO_COM.length() < 5)?"0"+String.valueOf(com.CODIGO_COM):String.valueOf(com.CODIGO_COM);
			regiones.put(comuna, esquema);
		}
		res.json(regiones);
		return;
	}
}
