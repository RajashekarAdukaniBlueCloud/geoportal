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
import earlgrey.model.AuditoriaComunal;
import earlgrey.model.CartografiaRegional;
import earlgrey.model.HallazgosAuditoria;
import earlgrey.model.ObservacionesAuditoriaComunal;
import earlgrey.model.Sica;

@Controller(description = "Controlador para obtener las actions de auditoria.", name = "Test", version = 1)
@Route(route = "/auditoria")
public class Auditoria extends ControllerCore{
	//CONTROLADOR DE PRUEBA PARA EFECTUAR DESARROLLO DE LA PLATAFORMA.
	@ControllerAction(description = "Acción del controlador utilizada para obtener la metadata de regiones.", name = "auditoria_metadata_regiones", version = 1)
	@Route(route = "/regiones/informes")
	@Policie(name = "AllPass")
	public static void regionalstats(HttpRequest req, HttpResponse res){
		JSONObject retorno = new JSONObject();
		Sica informes = new Sica();
		ArrayList<ModelCore> resultado = informes.find().get();
		for(int i=0;i<resultado.size();i++){
			Sica informe = (Sica) resultado.get(i);
			if(!retorno.has(informe.C_REG_SUBDERE)){
				retorno.put(informe.C_REG_SUBDERE, new JSONObject());
			}
			if(!retorno.getJSONObject(informe.C_REG_SUBDERE).has(String.valueOf(informe.ANOINFORME))){
				JSONObject region = new JSONObject();
				region.put("TOTAL_INFORMES", 0);
				retorno.getJSONObject(informe.C_REG_SUBDERE).put(String.valueOf(informe.ANOINFORME), region);
			}
			int total = retorno.getJSONObject(informe.C_REG_SUBDERE).getJSONObject(String.valueOf(informe.ANOINFORME)).getInt("TOTAL_INFORMES");
			retorno.getJSONObject(informe.C_REG_SUBDERE).getJSONObject(String.valueOf(informe.ANOINFORME)).put("TOTAL_INFORMES", ++total);
		}
		res.json(retorno);
		return;
	}
	@ControllerAction(description = "Acción del controlador utilizada para obtener la metadata de comunas.", name = "auditoria_metadata_comunas", version = 1)
	@Route(route = "/regiones/:C_REG/comunas/informes")
	@ParamRequire(name = "C_REG")
	@Policie(name = "AllPass")
	public static void comunalstats(HttpRequest req, HttpResponse res){
		String region = req.getParam("C_REG");
		JSONObject retorno = new JSONObject();
		AuditoriaComunal informes = new AuditoriaComunal();
		informes.C_REG_SUBDERE = region;
		ArrayList<ModelCore> resultado = informes.find().get();
		for(int i=0;i<resultado.size();i++){
			AuditoriaComunal informe = (AuditoriaComunal) resultado.get(i);
			if(!retorno.has(informe.CODIGOSUBDERE)){
				retorno.put(informe.CODIGOSUBDERE, new JSONObject());
			}
			if(!retorno.getJSONObject(informe.CODIGOSUBDERE).has(String.valueOf(informe.ANOINFORME))){
				JSONObject comuna = new JSONObject();
				comuna.put("TOTAL_INFORMES", 0);
				retorno.getJSONObject(informe.CODIGOSUBDERE).put(String.valueOf(informe.ANOINFORME), comuna);
			}
			int total = retorno.getJSONObject(informe.CODIGOSUBDERE).getJSONObject(String.valueOf(informe.ANOINFORME)).getInt("TOTAL_INFORMES");
			retorno.getJSONObject(informe.CODIGOSUBDERE).getJSONObject(String.valueOf(informe.ANOINFORME)).put("TOTAL_INFORMES", (total+informe.TOTAL));
		}
		res.json(retorno);
		return;
	}
	@ControllerAction(description = "Acción del controlador utilizada para obtener las auditorias de una comuna.", name = "auditoria_comunas", version = 1)
	@Route(route = "/comunas/:C_COM/informes")
	@ParamRequire(name = "C_COM")
	@Policie(name = "AllPass")
	public static void getAuditoriasComunal(HttpRequest req, HttpResponse res){
		String comuna = req.getParam("C_COM");
		Sica informes = new Sica();
		informes.CODIGOSUBDERE = comuna;
		JSONArray resul = informes.find().getJSON();
		res.json(resul);
		return;
	}
	@ControllerAction(description = "Acción del controlador utilizada para obtener los hallazgos regionales.", name = "hallazgos_metadata_regiones", version = 1)
	@Route(route = "/regiones/hallazgos")
	@Policie(name = "AllPass")
	public static void hallazgosRegional(HttpRequest req, HttpResponse res){
		JSONObject retorno = new JSONObject();
		HallazgosAuditoria Hallazgos = new HallazgosAuditoria();
		ArrayList<ModelCore> resultado = Hallazgos.find().get();
		for(int i=0;i<resultado.size();i++){
			HallazgosAuditoria informe = (HallazgosAuditoria) resultado.get(i);
			if(!retorno.has(informe.C_REG_SUBDERE)){
				retorno.put(informe.C_REG_SUBDERE, new JSONObject());
			}
			if(!retorno.getJSONObject(informe.C_REG_SUBDERE).has(String.valueOf(informe.PERIODOACTIVIDAD))){
				JSONObject region = new JSONObject();
				region.put("TOTAL_HALLAZGOS", 0);
				retorno.getJSONObject(informe.C_REG_SUBDERE).put(String.valueOf(informe.PERIODOACTIVIDAD), region);
			}
			int total = retorno.getJSONObject(informe.C_REG_SUBDERE).getJSONObject(String.valueOf(informe.PERIODOACTIVIDAD)).getInt("TOTAL_HALLAZGOS");
			retorno.getJSONObject(informe.C_REG_SUBDERE).getJSONObject(String.valueOf(informe.PERIODOACTIVIDAD)).put("TOTAL_HALLAZGOS", ++total);
		}
		res.json(retorno);
		return;
	}
	@ControllerAction(description = "Acción del controlador utilizada para obtener la metadata de comunas.", name = "auditoria_metadata_comunas", version = 1)
	@Route(route = "/regiones/:C_REG/comunas/hallazgos")
	@ParamRequire(name = "C_REG")
	@Policie(name = "AllPass")
	public static void hallazgosComunal(HttpRequest req, HttpResponse res){
		String region = req.getParam("C_REG");
		JSONObject retorno = new JSONObject();
		ObservacionesAuditoriaComunal informes = new ObservacionesAuditoriaComunal();
		informes.C_REG_SUBDERE = region;
		ArrayList<ModelCore> resultado = informes.find().get();
		for(int i=0;i<resultado.size();i++){
			ObservacionesAuditoriaComunal informe = (ObservacionesAuditoriaComunal) resultado.get(i);
			if(!retorno.has(informe.CODIGOSUBDERE)){
				retorno.put(informe.CODIGOSUBDERE, new JSONObject());
			}
			if(!retorno.getJSONObject(informe.CODIGOSUBDERE).has(String.valueOf(informe.PERIODOACTIVIDAD))){
				JSONObject comuna = new JSONObject();
				comuna.put("TOTAL_HALLAZGOS", 0);
				retorno.getJSONObject(informe.CODIGOSUBDERE).put(String.valueOf(informe.PERIODOACTIVIDAD), comuna);
			}
			int total = retorno.getJSONObject(informe.CODIGOSUBDERE).getJSONObject(String.valueOf(informe.PERIODOACTIVIDAD)).getInt("TOTAL_HALLAZGOS");
			retorno.getJSONObject(informe.CODIGOSUBDERE).getJSONObject(String.valueOf(informe.PERIODOACTIVIDAD)).put("TOTAL_HALLAZGOS", (total+informe.TOTAL));
		}
		res.json(retorno);
		return;
	}
	@ControllerAction(description = "Acción del controlador utilizada para obtener las auditorias de una comuna.", name = "auditoria_comunas", version = 1)
	@Route(route = "/comunas/:C_COM/hallazgos")
	@ParamRequire(name = "C_COM")
	@Policie(name = "AllPass")
	public static void getHallazgosComunal(HttpRequest req, HttpResponse res){
		String comuna = req.getParam("C_COM");
		HallazgosAuditoria informes = new HallazgosAuditoria();
		informes.CODIGOSUBDERE = comuna;
		JSONArray resul = informes.find().getJSON();
		res.json(resul);
		return;
	}

	@ControllerAction(description = "Acción del controlador utilizada para obtener la auditoria de una actividad.", name = "auditoria_actividad", version = 1)
	@Route(route = "/actividades/:id_actividad/informe")
	@ParamRequire(name = "id_actividad")
	@Policie(name = "AllPass")
	public static void getInformeByActividad(HttpRequest req, HttpResponse res){
		String id_actividad = req.getParam("id_actividad");
		Sica informes = new Sica();
		informes.IDACTIVIDAD = id_actividad;
		JSONArray resul = informes.find().getJSON();
		res.json(resul);
		return;
	}
}
