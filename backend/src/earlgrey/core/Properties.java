package earlgrey.core;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Date;
import java.time.Instant;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.Iterator;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import earlgrey.error.Error500;
import earlgrey.error.Error60;
import earlgrey.error.Error700;
import oracle.sql.DATE;

public class Properties {
	private static Properties instance = null;
	private Logging log;
	private File config;
	private JSONObject config_obj;
	private JSONObject target;
	private JSONObject templates_prop;
	ResourceMaping propertiesMap;
	//CONSTRUCTOR
	public static synchronized Properties getInstance(){
		if(instance == null) instance = new Properties();
		return instance;
	}
	public Properties(){
		if(instance == null) instance = this;
		this.log = new Logging(this.getClass().getName());
		this.propertiesMap = ResourceMaping.getInstance();
		this.templates_prop = this.getPropertiesTemplates(this.propertiesMap.getPropertieTable());
		this.setFile();
	}
	private void setFile(){
		this.config = new File(Kernel.getInstance().kernelname+"/properties/config.properties");
		// EN CASO DE QUE NO EXISTA DEBE SER CREADO
		log.Info("Cargando Archivo de configuraciones de properties");
		try {
			if(!this.config.exists()){
				this.config.createNewFile();
				this.setDefault();
			}
			else
			{
				log.Info("Verificando integridad de archivo de configuraciones");
				FileReader fr = new FileReader(this.config);
				BufferedReader br = new BufferedReader(fr);
				String linea = br.readLine();
				if(linea != null){
					try {
						JSONObject conf = new JSONObject(linea);
						this.config_obj = conf;
						// VERIFICAMOS MODIFICACIONES
						this.checkPropertieFileAndFix();
				    } catch (JSONException ex) {
				    	this.log.Critic("El archivo de configuraciones esta corrupto, verifique su confguracion", Error700.FILE_DAMAGE_ERROR);
				    }
				}
				else{
					this.log.Critic("El archivo de configuraciones esta vacio, restaurando la copia", Error700.FILE_EMPTY_ERROR);
					this.setDefault();
				}
			}
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		log.Info("Archivo de configuración de properties, cargado.");
		this.selectEnv();
	}
	private void setDefault() throws IOException{
		JSONObject config = new JSONObject();
		// ESTABLECEMOS LOS AMBIENTES DE TRABAJO
		JSONArray envi = new JSONArray();
		envi.put(this.getTemplate("DEVELOP", this.propertiesMap.getPropertieTable()));
		envi.put(this.getTemplate("TESTING", this.propertiesMap.getPropertieTable()));
		envi.put(this.getTemplate("PRODUCTION", this.propertiesMap.getPropertieTable()));
		//ASIGANAMOS LAS DEFAULT PROPERTIES
		config.put("env_used", "DEVELOP");
		config.put("environment", envi);
		config.put("routes", new JSONArray());
		config.put("controllers", new JSONArray());
		config.put("prop_templates", this.templates_prop);
		config.put("models", new JSONArray());
		config.put("comunication", new JSONObject());
		config.put("policies", new JSONArray());
		//config.put("propertie_map", db_template);
		JSONObject users = (new JSONObject()).put("USERNAME", "ADMIN").put("PASSWORD", "ADMIN");
		config.put("console",(new JSONObject()).put("users", (new JSONArray()).put(users)));
		FileWriter fichero = new FileWriter(this.config,true);
		PrintWriter pw = new PrintWriter(fichero);
		pw.println(config.toString());
		pw.close();
		fichero.close();
		this.config_obj = config;
		this.log.Info("ARCHIVO DE CONFIGURACIÓN CREADO");
	}
	private JSONObject getPropertiesTemplates(Hashtable<String,JSONObject> properties){
		JSONObject config = new JSONObject();
		Enumeration<String> keys = properties.keys();
		while(keys.hasMoreElements()){
			String propName = keys.nextElement();
			JSONObject prop = properties.get(propName);
			if(prop.get("type").equals("template")){
				JSONObject template = prop.getJSONObject("set");
				JSONArray sets = new JSONArray();
				sets.put(template);
				prop.put("sets", sets);
				prop.put("value", 0);
				config.put(propName, prop);
			}
		}
		return config;
	}
	private JSONObject getTemplate(String envname, Hashtable<String,JSONObject> properties){
		JSONObject config_master = new JSONObject();
		config_master.put("DYNAMIC", new JSONObject());
		config_master.put("TEMPLATES", new JSONObject());
		config_master.put("EARLGREY_ENVNAME", envname);
		JSONObject config = new JSONObject();
		Enumeration<String> keys = properties.keys();
		while(keys.hasMoreElements()){
			String propName = keys.nextElement();
			JSONObject prop = properties.get(propName);
			if(prop.get("type").equals("single")){
				prop.put("value", prop.getString("default"));
				config.put(propName, prop);
			}
			else if(prop.get("type").equals("set")){
				// CARACTERISTICA AUN NO LISTA
				// PENSANDO EN NUEVO REALEASE
				// PERO NO SE DESCARTA EL ELIMINARLA
				JSONObject template = prop.getJSONObject("set");
				/*JSONObject set_template = new JSONObject();
				Iterator<String> llaves = template.keys();
				while(llaves.hasNext()){
					String llave = llaves.next();
					String value = template.getString(llave);
					// BUSCAMOS UNA ANNOTATION QUERY
					try{
						JSONObject object = new JSONObject(value);
						if(object.has("type") && object.has("anottation") && object.has("anottation")){
							
						}
						else{
							this.log.Warning("el object propertie no se encuentra bien estructurado", Error60.PROPERTIE_OBJECT_INCORRECT);
							JSONObject obj = new JSONObject();
							obj.put("type", "single");
							obj.put("default", value);
							obj.put("value", value);
							set_template.put(llave, obj);
						}
					}
					catch(JSONException e){
						JSONObject obj = new JSONObject();
						obj.put("type", "single");
						obj.put("default", value);
						obj.put("value", value);
						set_template.put(llave, obj);
					}
				}*/
				JSONArray sets = new JSONArray();
				sets.put(template);
				prop.put("sets", sets);
				prop.put("value", 0);
				config.put(propName, prop);
			}
			else if(prop.get("type").equals("option")){
				prop.put("value", prop.getInt("default"));
				config.put(propName, prop);
			}
			else if(prop.get("type").equals("array")){
				prop.put("value", prop.getJSONArray("default"));
				config.put(propName, prop);
			}
		}
		config_master.put("STATIC", config);
		return config_master;
	}
	private String[] search_annotation(){
		
		return null;
	}
	private void checkPropertieFileAndFix(){
		this.log.Info("Analizando archivo de configuraciones");
		JSONObject prop_save = this.config_obj;
		Hashtable<String,JSONObject> propiedades = this.propertiesMap.getPropertieTable();
		int hash = prop_save.toString().hashCode();
		JSONArray environments = prop_save.getJSONArray("environment");
		for(int i=0;i<environments.length();i++){
			JSONObject env = this.checkEnv(environments.getJSONObject(i), propiedades);
			environments.put(i,env);
		}
		prop_save.put("environment", environments);
		if(!prop_save.has("prop_templates")) prop_save.put("prop_templates", this.templates_prop);
		this.config_obj = prop_save;
		this.log.Info("Verificando cambios en archivos de configuraciones");
		if(hash == prop_save.toString().hashCode()){
			this.log.Info("No existen cambios, cargando archivo");
			return;
		}
		else
		{
			this.log.Info("Existen cambios respecto a la version antigua. respaldando.");
			this.backupFile();
			this.log.Info("Guardando nuevo archivo de configuraciones.");
			this.saveFile();
		}
		
	}
	private JSONObject checkEnv(JSONObject env, Hashtable<String,JSONObject> props){
		JSONObject conf_global = new JSONObject();
		conf_global.put("EARLGREY_ENVNAME", env.getString("EARLGREY_ENVNAME"));
		if(env.has("DYNAMIC")){
			conf_global.put("DYNAMIC", env.getJSONObject("DYNAMIC"));
		}
		else
		{
			conf_global.put("DYNAMIC", new JSONObject());
		}
		JSONObject conf = new JSONObject();
		Enumeration<String> keys = props.keys();
		while(keys.hasMoreElements()){
			String key = keys.nextElement();
			if(env.has(key)){
				JSONObject prop = env.getJSONObject(key);
				JSONObject new_prop = props.get(key);
				if(new_prop.get("type").equals("single")){
					//COMPARAMOS Y MODIFICAMOS EN CASO SE SERLO
					if(prop.has("value")){
						new_prop.put("value", prop.getString("value"));
					}
					else
					{
						new_prop.put("value", new_prop.getString("default"));
					}
					conf.put(key, new_prop);
				}
				else if(new_prop.get("type").equals("set")){
					if(!prop.getString("type").equals("set")) prop.put("type", "set");
					// VERIFICAMOS EL SET QUE POSEA TODAS LAS CARACTETISTICAS.
					JSONArray new_sets = new JSONArray();
					JSONArray sets = prop.getJSONArray("sets");
					for(int g=0; g<sets.length();g++){
						JSONObject new_set = new JSONObject();
						JSONObject old_set = sets.getJSONObject(g);
						JSONObject set = new_prop.getJSONObject("set");
						Iterator<String> llaves = set.keys();
						while(llaves.hasNext()){
							String keyName = llaves.next();
							if(old_set.has(keyName)){
								new_set.put(keyName, old_set.getString(keyName));
							}
							else
							{
								new_set.put(keyName, set.getString(keyName));
							}
						}
						new_sets.put(new_set);
					}
					prop.put("sets", new_sets);
					if(prop.has("value") && new_sets.length() <= prop.getInt("value")){
						prop.put("value", 0);
					}
					conf.put(key, prop);
				}
				else if(new_prop.get("type").equals("option")){
					JSONArray old_option = prop.getJSONArray("options");
					String option = old_option.getString(prop.getInt("defaultTo"));
					for(int g=0; g<new_prop.getJSONArray("options").length(); g++){
						if(option.equals(new_prop.getJSONArray("options").getString(g))) new_prop.put("value", g);
					}
					new_prop.put("default", prop.getInt("defaultTo"));
					conf.put(key, new_prop);
				}
				else if(new_prop.get("type").equals("array")){
					new_prop.put("default", prop.getJSONArray("default"));
					new_prop.put("value", prop.getJSONArray("value"));
					conf.put(key, new_prop);
				}
			}
			else
			{
				//EN CASO DE NO EXISTIR LAS PROPIEDADES LAS CREAMOS
				JSONObject prop = props.get(key);
				if(prop.get("type").equals("single")){
					prop.put("value", prop.getString("default"));
					conf.put(key, prop);
				}
				else if(prop.get("type").equals("set")){
					JSONArray sets = new JSONArray();
					sets.put(prop.getJSONObject("set"));
					prop.put("sets", sets);
					prop.put("default", 0);
					prop.put("value", 0);
					conf.put(key, prop);
				}
				else if(prop.get("type").equals("option")){
					prop.put("value", prop.getInt("default"));
					conf.put(key, prop);
				}
				else if(prop.get("type").equals("array")){
					prop.put("value", prop.getJSONArray("default"));
					conf.put(key, prop);
				}
			}
		}
		conf_global.put("STATIC", conf);
		// ITERAMOS LOS TEMPLATES
		if(this.config_obj.has("prop_templates")){
			JSONObject conf_temple = new JSONObject();
			JSONObject temp = env.getJSONObject("TEMPLATES");
			JSONObject temple = this.config_obj.getJSONObject("prop_templates");
			Iterator<String> keys_temp = temp.keys();
			while(keys_temp.hasNext()){
				String key = keys_temp.next();
				JSONObject prop = temp.getJSONObject(key);
				if(temple.has(prop.getString("template"))){
					// VERIFICAMOS EL SET QUE POSEA TODAS LAS CARACTETISTICAS.
					JSONArray new_sets = new JSONArray();
					JSONArray sets = prop.getJSONArray("sets");
					JSONObject new_prop = temple.getJSONObject(prop.getString("template"));
					for(int g=0; g<sets.length();g++){
						JSONObject new_set = new JSONObject();
						JSONObject old_set = sets.getJSONObject(g);
						JSONObject set = new_prop.getJSONObject("set");
						Iterator<String> llaves = set.keys();
						while(llaves.hasNext()){
							String keyName = llaves.next();
							if(old_set.has(keyName)){
								new_set.put(keyName, old_set.getString(keyName));
							}
							else
							{
								new_set.put(keyName, set.getString(keyName));
							}
						}
						new_sets.put(new_set);
					}
					prop.put("sets", new_sets);
					if(prop.has("value") && new_sets.length() <= prop.getInt("value")){
						prop.put("value", 0);
					}
					conf_temple.put(key, prop);
				}
			}
			conf_global.put("TEMPLATES", conf_temple);
		}
		else {
			conf_global.put("TEMPLATES", new JSONObject());
		}
		return conf_global;
	}
	private void saveFile(){
		FileWriter fichero;
		try {
			fichero = new FileWriter(this.config);
			PrintWriter pw = new PrintWriter(fichero);
			pw.println(config_obj.toString());
			pw.close();
		} catch (IOException e) {
			this.log.Critic("", Error700.FILE_SAVE_ERROR);
		}
	}
	private void backupFile(){
		FileReader fr;
		try {
			fr = new FileReader(this.config);
			BufferedReader br = new BufferedReader(fr);
			String linea = br.readLine();
			if(linea != null){
				try {
					File back = new File(Kernel.getInstance().kernelname+"/backups/config.properties."+Instant.now());
					FileWriter fichero;
					fichero = new FileWriter(back);
					PrintWriter pw = new PrintWriter(fichero);
					pw.println(linea);
					pw.close();
			    } catch (JSONException ex) {
			    	this.log.Critic("No se puede escribir el archivo Backup. Verifique los permisos y el sistema de archivos kernel", Error700.FILE_SAVE_ERROR);
			    }
			}
			else{
				this.log.Critic("El archivo antiguo de configuracion esta vacio. Abortando Backup", Error700.FILE_EMPTY_ERROR);
				this.setDefault();
			}
		} catch (FileNotFoundException e1) {
			this.log.Critic("El archivo de configuraciones no existe.", 2);
		} catch (IOException e) {
			this.log.Critic("Error IO, al intentar obtener el archivo de configuraciones. (Backup)",Error700.FILE_READ_ERROR);
		}
	}
	private void selectEnv() {
		String prop = this.config_obj.getString("env_used");
		JSONArray envs = this.config_obj.getJSONArray("environment");
		for(int i=0; i< envs.length(); i++){
			JSONObject env = envs.getJSONObject(i);
			if(env.getString("EARLGREY_ENVNAME").equals(prop)){
				this.joinProperties(env);
				this.log.Info("Funcionando en entorno, "+prop);
				return;
			}
		}
		this.log.Critic("No se cargo ningun entorno de propiedades", Error500.PROPERTIES_ENV);
	}
	public JSONObject getProperties(){
		return this.target;
	}
	public String getPropertie(String propname){
		if(this.target.has(propname)){
			if(this.target.getJSONObject(propname).getString("type").equals("single")){
				return this.target.getJSONObject(propname).getString("value");
			}
			else{
				this.log.Warning("La propertie ("+propname+") especificada no corresponde al tipo llamado. Tipo declarado "+this.target.getJSONObject(propname).getString("type"), Error60.PROPERTIE_TYPE_INCORRECT);
			}
		}
		else
		{
			this.log.Warning("La propertie ("+propname+")especificada no existe, se envia valor null", Error60.PROPERTIE_NOT_SET);
			
		}
		return null;
	}
	public JSONObject getPropertieSet(String propname){
		if(this.target.has(propname)){
			if(this.target.getJSONObject(propname).getString("type").equals("set")){
				int selected = this.target.getJSONObject(propname).getInt("value");
				return this.target.getJSONObject(propname).getJSONArray("sets").getJSONObject(selected);
			}
			else{
				this.log.Warning("La propertie ("+propname+") especificada no corresponde al tipo llamado. Tipo declarado "+this.target.getJSONObject(propname).getString("type"), Error60.PROPERTIE_TYPE_INCORRECT);
			}
		}
		else
		{
			this.log.Warning("La propertie ("+propname+")especificada no existe, se envia valor null", Error60.PROPERTIE_NOT_SET);
			
		}
		return null;
	}
	public JSONObject createOrSetPropertieTemplate(String template, String name){
		if(this.config_obj.has("prop_templates")){
			JSONObject templates = this.config_obj.getJSONObject("prop_templates");
			if(templates.has(template)){
				JSONObject temp_obj = templates.getJSONObject(template);
				JSONObject prop_save = this.config_obj;
				JSONArray environments = prop_save.getJSONArray("environment");
				int env_hash = prop_save.toString().hashCode();
				for(int i=0;i<environments.length();i++){
					JSONObject env = environments.getJSONObject(i);
					JSONObject templ = env.getJSONObject("TEMPLATES");
					if(templ.has(name)){
						if(templ.getJSONObject(name).getString("template").equals(template)){
							JSONObject aux = templ.getJSONObject(name);
							JSONObject new_obj = new JSONObject(temp_obj.toString());
							JSONObject set= aux.getJSONObject("set");
							JSONObject new_o = new_obj.getJSONObject("set");
							Iterator<String> keys_o = new_o.keys();
							while(keys_o.hasNext()){
								String key_o = keys_o.next();
								if(set.has(key_o)) new_o.put(key_o, set.getString(key_o));
							}
							aux.put("set", new_o);
							JSONArray sets = new_obj.getJSONArray("sets");
							sets.put(0, new_o);
							aux.put("sets", sets);
							if(!aux.has("name") || aux.getString("name").equals(new_obj.getString("name"))) aux.put("name", name);
							if(!aux.has("type") || aux.getString("type").equals(new_obj.getString("type"))) aux.put("type", "set");
							if(!aux.has("template") || !aux.getString("template").equals(template)) aux.put("template", template);
							aux.put("value", 0);
							templ.put(name, aux);
						}
						else{
							templ.put(name, new JSONObject(temp_obj.toString()));
							JSONObject aux = templ.getJSONObject(name);
							aux.put("name", name);
							aux.put("type", "set");
							aux.put("template", template);
							templ.put(name, aux);
						}
					}
					else
					{
						templ.put(name, new JSONObject(temp_obj.toString()));
						JSONObject aux = templ.getJSONObject(name);
						aux.put("name", name);
						aux.put("type", "set");
						aux.put("template", template);
						templ.put(name, aux);
						this.target.put(name, aux);
					}
					env.put("TEMPLATES", templ);
					environments.put(i,env);
				}
				prop_save.put("environment", environments);
				if(env_hash != prop_save.hashCode()){
					this.saveFile();
				}
				this.config_obj = prop_save;
			}
			else
			{
				this.log.Warning("No existe el propertie template especificado",Error60.PROPERTIE_SET_TEMPLATE_NOTFOUND);
			}
		}
		else
		{
			this.log.Warning("El entorno no tiene configurado adecuadamente los templates sets",Error60.PROPERTIE_SET_TEMPLATE_ERROR);
		}
		return null;
	}
	public String getPropertieOption(String propname){
		if(this.target.has(propname)){
			if(this.target.getJSONObject(propname).getString("type").equals("option")){
				return this.target.getJSONObject(propname).getJSONArray("options").getString(this.target.getJSONObject(propname).getInt("value"));
			}
			else{
				this.log.Warning("La propertie ("+propname+") especificada no corresponde al tipo llamado. Tipo declarado "+this.target.getJSONObject(propname).getString("type"), Error60.PROPERTIE_TYPE_INCORRECT);
			}
		}
		else
		{
			this.log.Warning("La propertie ("+propname+")especificada no existe, se envia valor null", Error60.PROPERTIE_NOT_SET);
			
		}
		return null;
	}
	public JSONArray getPropertieArray(String propname){
		if(this.target.has(propname)){
			return this.target.getJSONObject(propname).getJSONArray("value");
		}
		else
		{
			this.log.Warning("La propertie ("+propname+")especificada no existe, se envia valor null", Error60.PROPERTIE_NOT_SET);
			return null;
		}
	}
	public JSONObject getPropertiesEnv(){
		JSONObject retorno = new JSONObject();
		retorno.put("SELECTED", this.config_obj.getString("env_used"));
		retorno.put("ENV", this.config_obj.getJSONArray("environment"));
		return retorno;
	}
	private void joinProperties(JSONObject env){
		// CREAMOS EL TARGET
		this.target = new JSONObject();
		// UNIMOS LAS PROPIEDADES ESTATICAS
		JSONObject estaticas = env.getJSONObject("STATIC");
		Iterator<String> est_keys = estaticas.keys();
		while(est_keys.hasNext()){
			String llave  = est_keys.next();
			this.target.put(llave, estaticas.getJSONObject(llave));
		}
		// UNIMOS LAS PROPIEDADES DINAMICAS
		JSONObject dinamicas = env.getJSONObject("DYNAMIC");
		Iterator<String> din_keys = dinamicas.keys();
		while(din_keys.hasNext()){
			String llave  = din_keys.next();
			this.target.put(llave, dinamicas.getJSONObject(llave));
		}
		// UNIMOS LAS PROPIEDADES TEMPLATE
		JSONObject template = env.getJSONObject("TEMPLATES");
		Iterator<String> temp_keys = template.keys();
		while(temp_keys.hasNext()){
			String llave  = temp_keys.next();
			this.target.put(llave, template.getJSONObject(llave));
		}
	}
	public boolean selectEnv(String envi) {
		JSONArray envs = this.config_obj.getJSONArray("environment");
		for(int i=0; i< envs.length(); i++){
			JSONObject env = envs.getJSONObject(i);
			if(env.getString("EARLGREY_ENVNAME").equals(envi)){
				this.joinProperties(env);
				this.config_obj.put("env_used", envi);
				this.saveFile();
				Engine.getInstance().restartByProperties();
				this.log.Info("Funcionando en entorno, "+envi);
				return true;
			}
		}
		this.log.Critic("No se cargo ningun entorno de propiedades", Error500.PROPERTIES_ENV);
		return false;
	}
	public JSONObject createEnv(String name){
		this.log.Info("Creando nuevo entorno de properties: "+name);
		JSONObject env = this.getTemplate(name, this.propertiesMap.getPropertieTable());
		this.config_obj.getJSONArray("environment").put(env);
		this.backupFile();
		this.saveFile();
		return env;
	}
	public void setProp(JSONObject props, String name){
		this.log.Info("Modificado las properties.");
		JSONArray propiedades = this.config_obj.getJSONArray("environment");
		for(int i=0; i<propiedades.length(); i++){
			if(propiedades.getJSONObject(i).getString("EARLGREY_ENVNAME").equals(name)){
				propiedades.put(i, props);
			}
		}
		this.joinProperties(props);
		this.config_obj.put("environment", propiedades);
		this.backupFile();
		this.saveFile();
		this.log.Info("Properties modificadas.");
	}
	public void restartProperties(){
		Engine.getInstance().restartByProperties();
	}
}