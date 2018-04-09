package earlgrey.database;

import java.lang.reflect.Field;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Hashtable;

import earlgrey.core.ConnectionPool;
import earlgrey.core.ModelCore;

public interface Connector {
	public boolean busy = false;
	public void setCredencial(String user,String password, String db, String host, String port);
	public void setPool(ConnectionPool pool);
	public void connect();
	public boolean TestConector();
	public ResultSet query(String query);
	public boolean update(String query);
	public boolean delete(String query);
	public void close();
	public PreparedStatement prepare(String query, Field primaryKey);
	public boolean commit();
	public void complete(Hashtable<Field, Object> prepare_fields, ArrayList<Field> arrayList, Hashtable<Field, Object> prepare_match_fields, ArrayList<Field> prepare_match_List);
	public ResultSet execute();
	public boolean executeUpdate();
	public void startTransaction();
	public void closeTransaction();
	public boolean finishTransaction();
	public void rollback();
	public int getLastInsertedId() throws SQLException;
	public void complete(Hashtable<Field, Object> prepared, ArrayList<Field> prepared_list);
}
