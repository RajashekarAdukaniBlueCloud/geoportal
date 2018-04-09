package earlgrey.controller;

import java.util.ArrayList;

import org.json.JSONArray;
import org.json.JSONObject;

import earlgrey.annotations.Controller;
import earlgrey.annotations.ControllerAction;
import earlgrey.annotations.ParamOptional;
import earlgrey.annotations.ParamRequire;
import earlgrey.annotations.Policie;
import earlgrey.annotations.Route;
import earlgrey.core.ControllerCore;
import earlgrey.core.HttpRequest;
import earlgrey.core.HttpResponse;
import earlgrey.core.ModelCore;
import earlgrey.model.Configuraciones;
import earlgrey.model.SiaperContratosMun;
import earlgrey.model.SiaperFuncionariosMun;
import earlgrey.model.SiaperFuncionariosRun;

@Controller(description = "Controlador para obtener los datos de funcionarios del pais.", name = "Funcionarios_Siaper", version = 1)
@Route(route = "/siaper")
public class Siaper extends ControllerCore{
	//CONTROLADOR DE PRUEBA PARA EFECTUAR DESARROLLO DE LA PLATAFORMA.
	@ControllerAction(description = "Acción del controlador utilizada extraer las estadisticas nacionales de funcionarios.", name = "funcionarios_regiones", version = 1)
	@Route(route = "/regions")
	@ParamRequire(name = "type")
	@ParamRequire(name = "year")
	@Policie(name = "AllPass")
	public static void FuncionariosNacional(HttpRequest req, HttpResponse res){
		/*FUNCIONARIOS*/
		String type_param = req.getParam("type");
		String year = req.getParam("year");
		JSONObject regiones = new JSONObject();
		if(type_param.equals("contract")){
			SiaperContratosMun funcionarios = new SiaperContratosMun();
			funcionarios.FECHACORTE = "31/12/" + year;
			ArrayList<ModelCore> resul = funcionarios.find().get();
			for(int i=0;i<resul.size();i++){
				SiaperContratosMun com = (SiaperContratosMun)resul.get(i);
				String region = (com.COMCODREGION < 10)?"0"+String.valueOf(com.COMCODREGION):String.valueOf(com.COMCODREGION);
				if(!regiones.has(region)){
					JSONObject esquema = new JSONObject();
					regiones.put(region, esquema);
				}
				JSONObject obj = regiones.getJSONObject(String.valueOf(region));
				if(!obj.has(String.valueOf(com.CODTIPOCALIDAD))){
					JSONObject calidad = new JSONObject();
					calidad.put("TIPOCALIDAD", com.TIPOCALIDAD);
					calidad.put("CODIGOCALIDAD", com.CODTIPOCALIDAD);
					calidad.put("TOTAL", 0);
					obj.put(String.valueOf(com.CODTIPOCALIDAD), calidad);
				}
				JSONObject resumen = obj.getJSONObject(String.valueOf(com.CODTIPOCALIDAD));
				resumen.put("TOTAL", resumen.getInt("TOTAL")+com.TOTAL);
			}
		}
		else if(type_param.equals("servant")){
			SiaperFuncionariosRun funcionarios = new SiaperFuncionariosRun();
			funcionarios.FECHACORTE = "31/12/" + year;
			ArrayList<ModelCore> resul = funcionarios.find().get();
			for(int i=0;i<resul.size();i++){
				SiaperFuncionariosRun com = (SiaperFuncionariosRun)resul.get(i);
				String region = (com.COMCODREGION < 10)?"0"+String.valueOf(com.COMCODREGION):String.valueOf(com.COMCODREGION);
				if(!regiones.has(region)){
					JSONObject esquema = new JSONObject();
					esquema.put("COMCODREGION", com.COMCODREGION);
					regiones.put(region, esquema);
				}
				JSONObject obj = regiones.getJSONObject(String.valueOf(region));
				if(!obj.has("TOTAL")) obj.put("TOTAL", 0);
				obj.put("TOTAL", obj.getInt("TOTAL") + com.TOTAL);
			}
		}
		
		res.json(regiones);
		return;
	}
	@ControllerAction(description = "Acción del controlador utilizada para extraer las estadisticas regionales de funcionarios.", name = "funcionarios_region_comunas", version = 1)
	@Route(route = "/regions/:C_REG/communes")
	@ParamRequire(name = "C_REG")
	@ParamRequire(name = "type")
	@ParamRequire(name = "year")
	@Policie(name = "AllPass")
	public static void FuncionariosRegional(HttpRequest req, HttpResponse res){
		String region_param = req.getParam("C_REG");
		String type_param = req.getParam("type");
		String year = req.getParam("year");
		/* Traemos las comunas primero*/
		/*FUNCIONARIOS*/
		JSONObject comunas = new JSONObject();
		if(type_param.equals("contract")){
			SiaperContratosMun funcionarios = new SiaperContratosMun();
			funcionarios.FECHACORTE = "31/12/" + year;
			funcionarios.COMCODREGION = Integer.valueOf(region_param);
			ArrayList<ModelCore> resul = funcionarios.find().get();
			/*ITERAMOS Y ASIGNAMOS LOS RESULTADOS*/
			for(int i=0;i<resul.size();i++){
				SiaperContratosMun com = (SiaperContratosMun)resul.get(i);
				if(!comunas.has(String.valueOf(com.COMCODGOBIERNO))){
					JSONObject esquema = new JSONObject();
					comunas.put(String.valueOf(com.COMCODGOBIERNO), esquema);
				}
				JSONObject obj = comunas.getJSONObject(String.valueOf(com.COMCODGOBIERNO));
				if(!obj.has(String.valueOf(com.CODTIPOCALIDAD))){
					JSONObject calidad = new JSONObject();
					calidad.put("TIPOCALIDAD", com.TIPOCALIDAD);
					calidad.put("CODIGOCALIDAD", com.CODTIPOCALIDAD);
					calidad.put("AREAS", new JSONObject());
					calidad.put("TOTAL", 0);
					obj.put(String.valueOf(com.CODTIPOCALIDAD), calidad);
				}
				JSONObject resumen = obj.getJSONObject(String.valueOf(com.CODTIPOCALIDAD));
				resumen.put("TOTAL", resumen.getInt("TOTAL")+com.TOTAL);
				/*Desglosamos el area para obtener mayor detalle*/
				JSONObject areas = resumen.getJSONObject("AREAS");
				if(!areas.has(String.valueOf(com.CODAREA))){
					JSONObject area = new JSONObject();
					area.put("CODAREA", com.CODAREA);
					area.put("AREA", com.AREA);
					area.put("TOTAL", 0);
					areas.put(String.valueOf(com.CODAREA), area);
				}
				JSONObject area = areas.getJSONObject(String.valueOf(com.CODAREA));
				area.put("TOTAL", area.getInt("TOTAL")+com.TOTAL);
			}
		}
		else if(type_param.equals("servant")){
			SiaperFuncionariosRun funcionarios = new SiaperFuncionariosRun();
			funcionarios.COMCODREGION = Integer.valueOf(region_param);
			funcionarios.FECHACORTE = "31/12/" + year;
			ArrayList<ModelCore> resul = funcionarios.find().get();
			/*ITERAMOS Y ASIGNAMOS LOS RESULTADOS*/
			for(int i=0;i<resul.size();i++){
				SiaperFuncionariosRun com = (SiaperFuncionariosRun)resul.get(i);
				JSONObject esquema = new JSONObject();
				esquema.put("COMCODGOBIERNO", com.COMCODGOBIERNO);
				esquema.put("TOTAL", com.TOTAL);
				comunas.put(String.valueOf(com.COMCODGOBIERNO), esquema);			
			}
		}
		res.json(comunas);
		return;
	}
	@ControllerAction(description = "Acción del controlador utilizada para obtener la información de calidades de una comuna.", name = "calidades_comunas", version = 1)
	@Route(route = "/communes/:C_COM/summary_contracts")
	@ParamRequire(name = "C_COM")
	@ParamRequire(name = "year")
	@Policie(name = "AllPass")
	public static void EstadisticaContratosMunicipales(HttpRequest req, HttpResponse res){
		String com_param = req.getParam("C_COM");
		String year = req.getParam("year");
		/* Traemos las comunas primero*/
		/*FUNCIONARIOS*/
		SiaperContratosMun funcionarios = new SiaperContratosMun();
		funcionarios.COMCODGOBIERNO = Integer.valueOf(com_param);
		funcionarios.FECHACORTE = "31/12/" + year;
		ArrayList<ModelCore> resul = funcionarios.find().get();
		JSONObject resumen_contratos = new JSONObject();
		JSONObject conf_obj = Siaper.getConfigurations();
		/*ITERAMOS Y ASIGNAMOS LOS RESULTADOS*/
		for(int i=0;i<resul.size();i++){
			SiaperContratosMun com = (SiaperContratosMun)resul.get(i);
			if(!conf_obj.getJSONObject("1").getJSONObject(String.valueOf(com.CODTIPOCALIDAD)).getBoolean("visible") ||
					(conf_obj.getJSONObject("2").has(String.valueOf(com.CODAREA)) &&
							!conf_obj.getJSONObject("2").getJSONObject(String.valueOf(com.CODAREA)).getBoolean("visible")) ) continue;
			
			if(!resumen_contratos.has(String.valueOf(com.CODTIPOCALIDAD))){
				JSONObject calidad = new JSONObject();
				calidad.put("TIPOCALIDAD", com.TIPOCALIDAD);
				calidad.put("CODIGOCALIDAD", com.CODTIPOCALIDAD);
				calidad.put("GROUPBYAREA", conf_obj.getJSONObject("1").getJSONObject(String.valueOf(com.CODTIPOCALIDAD)).getBoolean("groupbyarea"));
				calidad.put("AREAS", new JSONObject());
				calidad.put("TOTAL", 0);
				resumen_contratos.put(String.valueOf(com.CODTIPOCALIDAD), calidad);
			}
			JSONObject resumen = resumen_contratos.getJSONObject(String.valueOf(com.CODTIPOCALIDAD));
			resumen.put("TOTAL", resumen.getInt("TOTAL")+com.TOTAL);
			/*Desglosamos el area para obtener mayor detalle*/
			
			JSONObject areas = resumen.getJSONObject("AREAS");
			if(!areas.has(String.valueOf(com.CODAREA))){
				JSONObject area = new JSONObject();
				area.put("CODAREA", com.CODAREA);
				area.put("AREA", com.AREA);
				area.put("TOTAL", 0);
				area.put("CALIDADES", new JSONObject());
				areas.put(String.valueOf(com.CODAREA), area);
			}
			JSONObject area = areas.getJSONObject(String.valueOf(com.CODAREA));
			area.put("TOTAL", area.getInt("TOTAL")+com.TOTAL);
			JSONObject calidades = area.getJSONObject("CALIDADES");
			JSONObject calidad = new JSONObject();
			calidad.put("CODCALIDAD", com.CODCALIDAD);
			calidad.put("CALIDAD", com.CALIDAD);
			calidad.put("TOTAL", com.TOTAL);
			calidades.put(String.valueOf(com.CODCALIDAD), calidad);
		}
		res.json(resumen_contratos);
		return;
	}
	@ControllerAction(description = "Acción del controlador utilizada para los funcionarios de las distintas comunas.", name = "funcionarios_comunas", version = 1)
	@Route(route = "/communes/:C_COM/contracts")
	@ParamRequire(name = "C_COM")
	@ParamRequire(name = "year")
	@Policie(name = "AllPass")
	public static void ContratosMunicipales(HttpRequest req, HttpResponse res){
		String com_param = req.getParam("C_COM");
		String year = req.getParam("year");
		/* Traemos las comunas primero*/
		/*FUNCIONARIOS*/
		SiaperContratosMun funcionarios = new SiaperContratosMun();
		funcionarios.COMCODGOBIERNO = Integer.parseInt(com_param);
		funcionarios.FECHACORTE = "31/12/" + year;
		JSONArray resul = funcionarios.find().getJSON();
		res.json(resul);
		return;
	}
	@ControllerAction(description = "Acción del controlador utilizada para los funcionarios de las distintas comunas.", name = "funcionarios_comunas", version = 1)
	@Route(route = "/communes/:C_COM/public_servants")
	@ParamRequire(name = "C_COM")
	@ParamRequire(name = "year")
	@ParamOptional(name = "contract_frame", defaultsTo = "")
	@ParamOptional(name = "area", defaultsTo = "")
	@Policie(name = "AllPass")
	public static void FuncionariosMunicipales(HttpRequest req, HttpResponse res){
		String id_comuna = req.getParam("C_COM");
		String contract_frame = req.getParam("contract_frame");
		String area = req.getParam("area");
		String year = req.getParam("year");
		/*FUNCIONARIOS*/
		JSONObject regiones = new JSONObject();
		JSONObject conf_obj = Siaper.getConfigurations();
		SiaperFuncionariosMun funcionarios = new SiaperFuncionariosMun();
		funcionarios.COMCODGOBIERNO = id_comuna;
		funcionarios.FECHACORTE = "31/12/" + year;
		if(!contract_frame.isEmpty()) funcionarios.CODCALIDAD = Integer.parseInt(contract_frame);
		if(!area.isEmpty()) funcionarios.CODAREA = Integer.parseInt(area);
		JSONArray resul = funcionarios.find().getJSON();
		JSONArray public_servants = new JSONArray();
		for(int i=0;i<resul.length();i++){
			if(!conf_obj.getJSONObject("1").getJSONObject(String.valueOf(resul.getJSONObject(i).getInt("CODTIPOCALIDAD"))).getBoolean("visible") ||
					(conf_obj.getJSONObject("2").has(String.valueOf(resul.getJSONObject(i).getInt("CODAREA"))) &&
							!conf_obj.getJSONObject("2").getJSONObject(String.valueOf(resul.getJSONObject(i).getInt("CODAREA"))).getBoolean("visible")) ) continue;
			public_servants.put(resul.getJSONObject(i));
		}
		res.json(public_servants);
		return;
	}
	
	@ControllerAction(description = "Acción del controlador utilizada para los contratos de un servidor publico a partir del RUN.", name = "contratos_run", version = 1)
	@Route(route = "/public_servants/:RUN")
	@ParamRequire(name = "RUN")
	@ParamRequire(name = "year")
	@ParamOptional(name = "commune", defaultsTo = "")
	@Policie(name = "AllPass")
	public static void servidoresPublicosPorRun(HttpRequest req, HttpResponse res){
		String run = req.getParam("RUN");
		String commune = req.getParam("commune");
		String year = req.getParam("year");
		/*FUNCIONARIOS*/
		JSONObject regiones = new JSONObject();
		JSONObject conf_obj = Siaper.getConfigurations();
		SiaperFuncionariosMun funcionarios = new SiaperFuncionariosMun();
		funcionarios.RUN = run;
		funcionarios.FECHACORTE = "31/12/" + year;
		if(!commune.isEmpty()) funcionarios.COMCODGOBIERNO = commune;
		JSONArray resul = funcionarios.find().getJSON();
		JSONArray public_servants = new JSONArray();
		for(int i=0;i<resul.length();i++){
			if(!conf_obj.getJSONObject("1").getJSONObject(String.valueOf(resul.getJSONObject(i).getInt("CODTIPOCALIDAD"))).getBoolean("visible") ||
					(conf_obj.getJSONObject("2").has(String.valueOf(resul.getJSONObject(i).getInt("CODAREA"))) &&
							!conf_obj.getJSONObject("2").getJSONObject(String.valueOf(resul.getJSONObject(i).getInt("CODAREA"))).getBoolean("visible")) ) continue;
			public_servants.put(resul.getJSONObject(i));
		}
		res.json(public_servants);
		return;
	}
	
	public static JSONObject getConfigurations(){
		Configuraciones confs = new Configuraciones();
		confs.TYPE = 1;
		ArrayList<ModelCore> result_conf = confs.find().get();
		JSONObject conf_obj = new JSONObject();
		for(int i=0;i<result_conf.size();i++){
			Configuraciones conf = (Configuraciones) result_conf.get(i);
			JSONObject conf_type = new JSONObject();
			conf_type.put(conf.KEY, new JSONObject(conf.VALUE));
			conf_obj.put("1", (conf_obj.has("1") ? conf_obj.getJSONObject("1").put(conf.KEY, new JSONObject(conf.VALUE)) : conf_type));
		}
		confs.TYPE = 2;
		result_conf = confs.find().get();
		for(int i=0;i<result_conf.size();i++){
			Configuraciones conf = (Configuraciones) result_conf.get(i);
			JSONObject conf_type = new JSONObject();
			conf_type.put(conf.KEY, new JSONObject(conf.VALUE));
			conf_obj.put("2", (conf_obj.has("2") ? conf_obj.getJSONObject("2").put(conf.KEY, new JSONObject(conf.VALUE)) : conf_type));
		}
		return conf_obj;
	}
}
