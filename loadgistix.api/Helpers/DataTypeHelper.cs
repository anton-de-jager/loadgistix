using System;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Collections;
using System.Reflection;
using System.Data;
using System.Threading.Tasks;
using loadgistix.api.Models;
using System.Collections.ObjectModel;

namespace loadgistix.api.Helpers
{
    public class DataTypeHelper
    {
        public static dynamic Convert(object value, string dataType)
        {
            try
            {
                if (value == null || value.ToString() == "0001/01/01 00:00:00")
                {
                    return null;
                }
                else
                {
                    switch (dataType)
                    {
                        case "string":
                            return value.ToString();
                        case "boolean":
                            if (value.ToString().Length > 0)
                            {
                                if (value.ToString() == "1")
                                {
                                    value = true;
                                }
                                if (value.ToString() == "0")
                                {
                                    value = false;
                                }
                                return (bool)value;
                            }
                            else
                            {
                                if (IsNullable(value))
                                {
                                    return null;
                                }
                                else
                                {
                                    return false;
                                }
                            }
                        case "int":
                            if (value.ToString().Length > 0)
                            {
                                return (int)value;
                            }
                            else
                            {

                                if (IsNullable(value))
                                {
                                    return null;
                                }
                                else
                                {
                                    return 0;
                                }
                            }
                        case "int32":
                            if (value.ToString().Length > 0)
                            {
                                return (int)value;
                            }
                            else
                            {

                                if (IsNullable(value))
                                {
                                    return null;
                                }
                                else
                                {
                                    return 0;
                                }
                            }
                        case "decimal":
                            if (value.ToString().Length > 0)
                            {
                                return (decimal)value;
                            }
                            else
                            {

                                if (IsNullable(value))
                                {
                                    return null;
                                }
                                else
                                {
                                    return 0;
                                }
                            }
                        case "double":
                            if (value.ToString().Length > 0)
                            {
                                return double.Parse(value.ToString());
                            }
                            else
                            {

                                if (IsNullable(value))
                                {
                                    return null;
                                }
                                else
                                {
                                    return double.Parse("0");
                                }
                            }
                        case "single":
                            if (value.ToString().Length > 0)
                            {
                                return double.Parse(value.ToString());
                            }
                            else
                            {

                                if (IsNullable(value))
                                {
                                    return null;
                                }
                                else
                                {
                                    return double.Parse("0");
                                }
                            }
                        case "guid":
                            if (value.ToString().Length > 0)
                            {
                                try { return (Guid)value; } catch { return Guid.Parse((string)value); };
                            }
                            else
                            {

                                if (IsNullable(value))
                                {
                                    return null;
                                }
                                else
                                {
                                    return Guid.Empty;
                                }
                            }
                        case "datetime":
                            if (value.ToString().Length > 0)
                            {
                                return (DateTime)value;
                            }
                            else
                            {
                                if (IsNullable(value))
                                {
                                    return null;
                                }
                                else
                                {
                                    return DateTime.MinValue;
                                }
                            }
                        case "dbnull":
                            return null;
                        default:
                            return value.ToString();
                    }
                }
            }
            catch (Exception exc)
            {
                string str = exc.Message;
                return null;
            }
        }
        public static bool IsNullable<T>(T t) { return false; }
        public static bool IsNullable<T>(T? t) where T : struct { return true; }

        public static dynamic GetItem(string connectionString, object item, string query, List<KeyValuePair<string, object>> parms)
        {
            bool gotData = false;
            try
            {
                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    sqlConnection.Open();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    for (int i = 0; i < parms.Count; i++)
                    {
                        cmd.Parameters.AddWithValue("@" + parms[i].Key, parms[i].Value);
                    }

                    using (SqlDataReader sdr = cmd.ExecuteReader())
                    {
                        while (sdr.Read())
                        {
                            System.Reflection.PropertyInfo[] myPropertyInfo = item.GetType().GetProperties();
                            for (int ii = 0; ii < myPropertyInfo.Length; ii++)
                            {
                                if (myPropertyInfo[ii].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfo[ii].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    gotData = true;
                                    item.GetType().GetProperty(myPropertyInfo[ii].Name).SetValue(item, DataTypeHelper.Convert(sdr[myPropertyInfo[ii].Name], GetDataType(item, myPropertyInfo[ii].Name)) == null ? null : DataTypeHelper.Convert(sdr[myPropertyInfo[ii].Name], GetDataType(item, myPropertyInfo[ii].Name)), null);
                                }
                            }
                        }
                    }
                    sqlConnection.Close();
                }

                return gotData ? item : null;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static dynamic GetItems(string connectionString, object obj, string query, List<KeyValuePair<string, object>> parms)
        {
            try
            {
                Type type = obj.GetType();
                Type listType = typeof(List<>).MakeGenericType(new[] { type });
                IList list = (IList)Activator.CreateInstance(listType);

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    sqlConnection.Open();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    for (int i = 0; i < parms.Count; i++)
                    {
                        cmd.Parameters.AddWithValue("@" + parms[i].Key, parms[i].Value);
                    }

                    using (SqlDataReader sdr = cmd.ExecuteReader())
                    {
                        while (sdr.Read())
                        {
                            Type typeItem = obj.GetType();
                            var item = Activator.CreateInstance(typeItem);
                            System.Reflection.PropertyInfo[] myPropertyInfo = obj.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfo.Length; i++)
                            {
                                if (myPropertyInfo[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfo[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfo[i].Name).SetValue(item, DataTypeHelper.Convert(sdr[myPropertyInfo[i].Name], GetDataType(item, myPropertyInfo[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(sdr[myPropertyInfo[i].Name], GetDataType(item, myPropertyInfo[i].Name)), null);
                                }
                            }

                            list.Add(item);
                        }
                    }
                    sqlConnection.Close();
                }

                return list;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }
        public static dynamic GetFromStoredProcedure(string connectionString, object obj, string procedureName, List<KeyValuePair<string, object>> parms)
        {
            try
            {
                Type type = obj.GetType();
                Type listType = typeof(List<>).MakeGenericType(new[] { type });
                IList list = (IList)Activator.CreateInstance(listType);

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = procedureName;

                    sqlConnection.Open();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    for (int i = 0; i < parms.Count; i++)
                    {
                        cmd.Parameters.AddWithValue("@" + parms[i].Key, parms[i].Value);
                    }
                    using (SqlDataReader sdr = cmd.ExecuteReader())
                    {
                        while (sdr.Read())
                        {
                            Type typeItem = obj.GetType();
                            var item = Activator.CreateInstance(typeItem);
                            System.Reflection.PropertyInfo[] myPropertyInfo = obj.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfo.Length; i++)
                            {
                                if (myPropertyInfo[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfo[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfo[i].Name).SetValue(item, DataTypeHelper.Convert(sdr[myPropertyInfo[i].Name], GetDataType(item, myPropertyInfo[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(sdr[myPropertyInfo[i].Name], GetDataType(item, myPropertyInfo[i].Name)), null);
                                }
                            }

                            list.Add(item);
                        }
                    }
                    sqlConnection.Close();
                }

                return list;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static async Task<dynamic> GetFromStoredProcedureAsync(string connectionString, object obj, string procedureName, List<KeyValuePair<string, object>> parms)
        {
            try
            {
                Type type = obj.GetType();
                Type listType = typeof(List<>).MakeGenericType(new[] { type });
                IList list = (IList)Activator.CreateInstance(listType);

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = procedureName;

                    await sqlConnection.OpenAsync();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    for (int i = 0; i < parms.Count; i++)
                    {
                        cmd.Parameters.AddWithValue("@" + parms[i].Key, parms[i].Value);
                    }
                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            Type typeItem = obj.GetType();
                            var item = Activator.CreateInstance(typeItem);
                            System.Reflection.PropertyInfo[] myPropertyInfo = obj.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfo.Length; i++)
                            {
                                if (myPropertyInfo[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfo[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfo[i].Name).SetValue(item, DataTypeHelper.Convert(sdr[myPropertyInfo[i].Name], GetDataType(item, myPropertyInfo[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(sdr[myPropertyInfo[i].Name], GetDataType(item, myPropertyInfo[i].Name)), null);
                                }
                            }

                            list.Add(item);
                        }
                    }
                    await sqlConnection.CloseAsync();
                }

                return list;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static dynamic GetStringFromStoredProcedure(string connectionString, string procedureName, object objIn, string action)
        {
            try
            {
                string result = "";
                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = procedureName;

                    sqlConnection.Open();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    System.Reflection.PropertyInfo[] myPropertyInfoIn = objIn.GetType().GetProperties();
                    cmd.Parameters.AddWithValue("@action", action);
                    for (int i = 0; i < myPropertyInfoIn.Length; i++)
                    {
                        if (myPropertyInfoIn[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoIn[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                        {
                            cmd.Parameters.AddWithValue("@" + myPropertyInfoIn[i].Name.Substring(0, 1).ToLower() + myPropertyInfoIn[i].Name.Substring(1), DataTypeHelper.Convert(objIn.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(objIn), GetDataType(objIn, myPropertyInfoIn[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(objIn.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(objIn), GetDataType(objIn, myPropertyInfoIn[i].Name)));
                        }
                    }
                    using (SqlDataReader sdr = cmd.ExecuteReader())
                    {
                        while (sdr.Read())
                        {
                            result = sdr["result"].ToString();
                        }
                    }
                    sqlConnection.Close();
                }

                return result;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static async Task<dynamic> GetStringFromStoredProcedureAsync(string connectionString, string procedureName, object objIn, string action)
        {
            try
            {
                string result = "";
                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = procedureName;

                    await sqlConnection.OpenAsync();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    System.Reflection.PropertyInfo[] myPropertyInfoIn = objIn.GetType().GetProperties();
                    cmd.Parameters.AddWithValue("@action", action);
                    for (int i = 0; i < myPropertyInfoIn.Length; i++)
                    {
                        if (myPropertyInfoIn[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoIn[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                        {
                            cmd.Parameters.AddWithValue("@" + myPropertyInfoIn[i].Name.Substring(0, 1).ToLower() + myPropertyInfoIn[i].Name.Substring(1), DataTypeHelper.Convert(objIn.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(objIn), GetDataType(objIn, myPropertyInfoIn[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(objIn.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(objIn), GetDataType(objIn, myPropertyInfoIn[i].Name)));
                        }
                    }
                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            result = sdr["result"].ToString();
                        }
                    }
                    await sqlConnection.CloseAsync();
                }

                return result;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static dynamic ExecuteCommand(string connectionString, string query, List<KeyValuePair<string, object>> parms)
        {

            try
            {
                using (SqlConnection sqlConnectionInsert = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(query))
                    {
                        for (int i = 0; i < parms.Count; i++)
                        {
                            cmd.Parameters.AddWithValue("@" + parms[i].Key, parms[i].Value);
                        }
                        cmd.Connection = sqlConnectionInsert;
                        sqlConnectionInsert.Open();
                        cmd.ExecuteNonQuery();
                        sqlConnectionInsert.Close();

                        return "";
                    }
                }
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static dynamic InsertCommand(string connectionString, string table, object objNew)
        {
            try
            {
                using (SqlConnection sqlConnectionInsert = new SqlConnection(connectionString))
                {
                    List<KeyValuePair<string, object>> parms = new List<KeyValuePair<string, object>>();
                    bool firstDone = false;
                    string query1 = "INSERT INTO [" + table + "](";
                    string query2 = "SELECT ";
                    System.Reflection.PropertyInfo[] myPropertyInfo = objNew.GetType().GetProperties();
                    for (int i = 0; i < myPropertyInfo.Length; i++)
                    {
                        //if (myPropertyInfo[i].Name != "Id" && myPropertyInfo[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfo[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                        if (myPropertyInfo[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfo[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                        {
                            query1 += (firstDone ? "," : "") + "[" + myPropertyInfo[i].Name + "]";
                            query2 += (firstDone ? "," : "") + "@" + myPropertyInfo[i].Name;
                            parms.Add(new KeyValuePair<string, object>(myPropertyInfo[i].Name, DataTypeHelper.Convert(objNew.GetType().GetProperty(myPropertyInfo[i].Name).GetValue(objNew), GetDataType(objNew, myPropertyInfo[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(objNew.GetType().GetProperty(myPropertyInfo[i].Name).GetValue(objNew), GetDataType(objNew, myPropertyInfo[i].Name))));
                            firstDone = true;
                        }
                    }
                    query1 += ") " + query2 + ";";
                    //using (SqlCommand cmd = new SqlCommand(query1))
                    //{
                    //    for (int i = 0; i < parms.Count; i++)
                    //    {
                    //        cmd.Parameters.AddWithValue("@" + parms[i].Key, parms[i].Value);
                    //    }
                    //    cmd.Connection = sqlConnectionInsert;
                    //    sqlConnectionInsert.Open();
                    //    sqlConnectionInsert.Close();

                    //    return "";
                    //}
                    return "";
                }
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }


        public static dynamic ExecuteStoredProcedure(string connectionString, object obj, string action, Guid? id)
        {
            try
            {
                Type type = obj.GetType();
                Type listType = typeof(List<>).MakeGenericType(new[] { type });
                IList list = (IList)Activator.CreateInstance(listType);

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = action == "usp_adverts_available" ? action : "usp_" + obj.ToString() + "_" + action;

                    sqlConnection.Open();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    System.Reflection.PropertyInfo[] myPropertyInfo = obj.GetType().GetProperties();
                    for (int i = 0; i < myPropertyInfo.Length; i++)
                    {
                        if (myPropertyInfo[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfo[i].PropertyType.Namespace.IndexOf(".Models") < 0 && action != "Delete" && action != "Select" && action != "SelectActive" && action != "usp_adverts_available")
                        {
                            cmd.Parameters.AddWithValue("@" + myPropertyInfo[i].Name, DataTypeHelper.Convert(obj.GetType().GetProperty(myPropertyInfo[i].Name).GetValue(obj), GetDataType(obj, myPropertyInfo[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(obj.GetType().GetProperty(myPropertyInfo[i].Name).GetValue(obj), GetDataType(obj, myPropertyInfo[i].Name)));
                        }
                        if (myPropertyInfo[i].Name == "Id" && (action == "Delete" || action == "Select"))
                        {
                            cmd.Parameters.AddWithValue("@id", id);
                        }
                        if (myPropertyInfo[i].Name == "UserId" && action == "DeleteActive")
                        {
                            cmd.Parameters.AddWithValue("@userId", id);
                        }
                    }
                    using (SqlDataReader sdr = cmd.ExecuteReader())
                    {
                        while (sdr.Read())
                        {
                            Type typeItem = obj.GetType();
                            var item = Activator.CreateInstance(typeItem);
                            for (int i = 0; i < myPropertyInfo.Length; i++)
                            {
                                if (myPropertyInfo[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfo[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfo[i].Name).SetValue(item, DataTypeHelper.Convert(sdr[myPropertyInfo[i].Name], GetDataType(item, myPropertyInfo[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(sdr[myPropertyInfo[i].Name], GetDataType(item, myPropertyInfo[i].Name)), null);
                                }
                            }

                            list.Add(item);
                        }
                    }
                    sqlConnection.Close();
                }

                switch (action)
                {
                    case "Select":
                        return list.Count > 0 ? list[0] : obj;
                    case "SelectAll":
                        return list;
                    case "usp_adverts_available":
                        return list;
                    default:
                        return obj;
                }
                return list;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }
        public static dynamic ExecuteStoredProcedureInt(string connectionString, object obj, string action, int id)
        {
            try
            {
                Type type = obj.GetType();
                Type listType = typeof(List<>).MakeGenericType(new[] { type });
                IList list = (IList)Activator.CreateInstance(listType);

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = action == "usp_adverts_available" ? action : "usp_" + obj.ToString() + "_" + action;

                    sqlConnection.Open();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    System.Reflection.PropertyInfo[] myPropertyInfo = obj.GetType().GetProperties();
                    for (int i = 0; i < myPropertyInfo.Length; i++)
                    {
                        if (myPropertyInfo[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfo[i].PropertyType.Namespace.IndexOf(".Models") < 0 && action != "Delete" && action != "Select" && action != "SelectActive" && action != "usp_adverts_available")
                        {
                            cmd.Parameters.AddWithValue("@" + myPropertyInfo[i].Name, DataTypeHelper.Convert(obj.GetType().GetProperty(myPropertyInfo[i].Name).GetValue(obj), GetDataType(obj, myPropertyInfo[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(obj.GetType().GetProperty(myPropertyInfo[i].Name).GetValue(obj), GetDataType(obj, myPropertyInfo[i].Name)));
                        }
                        if (myPropertyInfo[i].Name == "Id" && (action == "Delete" || action == "Select"))
                        {
                            cmd.Parameters.AddWithValue("@id", id);
                        }
                        if (myPropertyInfo[i].Name == "UserId" && action == "DeleteActive")
                        {
                            cmd.Parameters.AddWithValue("@userId", id);
                        }
                    }
                    using (SqlDataReader sdr = cmd.ExecuteReader())
                    {
                        while (sdr.Read())
                        {
                            Type typeItem = obj.GetType();
                            var item = Activator.CreateInstance(typeItem);
                            for (int i = 0; i < myPropertyInfo.Length; i++)
                            {
                                if (myPropertyInfo[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfo[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfo[i].Name).SetValue(item, DataTypeHelper.Convert(sdr[myPropertyInfo[i].Name], GetDataType(item, myPropertyInfo[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(sdr[myPropertyInfo[i].Name], GetDataType(item, myPropertyInfo[i].Name)), null);
                                }
                            }

                            list.Add(item);
                        }
                    }
                    sqlConnection.Close();
                }

                switch (action)
                {
                    case "Select":
                        return list.Count > 0 ? list[0] : obj;
                    case "SelectAll":
                        return list;
                    case "usp_adverts_available":
                        return list;
                    default:
                        return obj;
                }
                return list;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }
        public static dynamic ActionStoredProcedure(string connectionString, object objIn, object objOut, string table, string action)
        {
            try
            {
                Type type = objOut.GetType();
                Type listType = typeof(List<>).MakeGenericType(new[] { type });
                IList list = (IList)Activator.CreateInstance(listType);

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = "usp_action_" + table;

                    sqlConnection.Open();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    System.Reflection.PropertyInfo[] myPropertyInfoIn = objIn.GetType().GetProperties();
                    cmd.Parameters.AddWithValue("@action", action);
                    if (table == "version")
                    {
                        cmd.Parameters.AddWithValue("@id", objIn.GetType().GetProperty("Id").GetValue(objIn));
                    }
                    else
                    {
                        for (int i = 0; i < myPropertyInfoIn.Length; i++)
                        {
                            if (myPropertyInfoIn[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoIn[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                            {
                                try
                                {
                                    cmd.Parameters.AddWithValue("@" + myPropertyInfoIn[i].Name.Substring(0, 1).ToLower() + myPropertyInfoIn[i].Name.Substring(1), DataTypeHelper.Convert(objIn.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(objIn), GetDataType(objIn, myPropertyInfoIn[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(objIn.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(objIn), GetDataType(objIn, myPropertyInfoIn[i].Name)));
                                }
                                catch (Exception exc)
                                {
                                    string str = exc.Message;
                                }
                            }
                        }
                    }
                    string sp = "EXEC " + query + " ";
                    for (int i = 0; i < cmd.Parameters.Count; i++)
                    {
                        sp += cmd.Parameters[i].SqlValue.ToString().ToUpper() == "NULL" ? "NULL," : "'" + cmd.Parameters[i].SqlValue + "',";
                    }
                    using (SqlDataReader sdr = cmd.ExecuteReader())
                    {
                        while (sdr.Read())
                        {
                            if (action == "delete" && table != "bid")
                            {
                                string result = sdr["result"].ToString();
                                sqlConnection.Close();
                                return result;
                            }
                            else
                            {
                                Type typeOut = objOut.GetType();
                                var item = Activator.CreateInstance(typeOut);
                                System.Reflection.PropertyInfo[] myPropertyInfoOut = objOut.GetType().GetProperties();
                                for (int i = 0; i < myPropertyInfoOut.Length; i++)
                                {
                                    if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                    {
                                        item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(sdr[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(sdr[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                    }
                                }

                                list.Add(item);
                            }
                        }
                        sqlConnection.Close();
                    }
                }

                switch (action)
                {
                    case "insert":
                        return list.Count > 0 ? list[0] : null;
                    case "update":
                        return list.Count > 0 ? list[0] : null;
                    case "update-image":
                        return list.Count > 0 ? list[0] : null;
                    case "update-image-pdp":
                        return list.Count > 0 ? list[0] : null;
                    case "insert-destination":
                        return list.Count > 0 ? list[0] : null;
                    case "update-status":
                        return list.Count > 0 ? list[0] : null;
                    case "select-single":
                        return list.Count > 0 ? list[0] : null;
                    case "email":
                        return list.Count > 0 ? list[0] : null;
                    case "active":
                        return list.Count > 0 ? list[0] : null;
                    case "activate":
                        return list.Count > 0 ? list[0] : null;
                    case "decline":
                        return list.Count > 0 ? list[0] : null;
                    case "accept":
                        return list.Count > 0 ? list[0] : null;
                    case "location":
                        return list.Count > 0 ? list[0] : null;
                    case "delete":
                        return list.Count > 0 ? list[0] : null;
                    case "voucher":
                        return list.Count > 0 ? list[0] : null;
                    default:
                        return list;
                }
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static async Task<dynamic> ActionStoredProcedureAsync(string connectionString, object objIn, object objOut, string table, string action)
        {
            try
            {
                Type type = objOut.GetType();
                Type listType = typeof(List<>).MakeGenericType(new[] { type });
                IList list = (IList)Activator.CreateInstance(listType);

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = "usp_action_" + table;

                    await sqlConnection.OpenAsync();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    System.Reflection.PropertyInfo[] myPropertyInfoIn = objIn.GetType().GetProperties();
                    cmd.Parameters.AddWithValue("@action", action);
                    if (table == "version")
                    {
                        cmd.Parameters.AddWithValue("@id", objIn.GetType().GetProperty("Id").GetValue(objIn));
                    }
                    else
                    {
                        for (int i = 0; i < myPropertyInfoIn.Length; i++)
                        {
                            if (myPropertyInfoIn[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoIn[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                            {
                                try
                                {
                                    cmd.Parameters.AddWithValue("@" + myPropertyInfoIn[i].Name.Substring(0, 1).ToLower() + myPropertyInfoIn[i].Name.Substring(1), DataTypeHelper.Convert(objIn.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(objIn), GetDataType(objIn, myPropertyInfoIn[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(objIn.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(objIn), GetDataType(objIn, myPropertyInfoIn[i].Name)));
                                }
                                catch (Exception exc)
                                {
                                    string str = exc.Message;
                                }
                            }
                        }
                    }
                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            if (action == "delete" && table != "bid")
                            {
                                string result = sdr["result"].ToString();
                                return result;
                            }
                            else
                            {
                                Type typeOut = objOut.GetType();
                                var item = Activator.CreateInstance(typeOut);
                                System.Reflection.PropertyInfo[] myPropertyInfoOut = objOut.GetType().GetProperties();
                                for (int i = 0; i < myPropertyInfoOut.Length; i++)
                                {
                                    try
                                    {
                                        if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                        {
                                            item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(sdr[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(sdr[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                        }
                                    }
                                    catch (Exception exc)
                                    {
                                        string eee = exc.ToString();
                                    }
                                }

                                list.Add(item);
                            }
                        }
                    }
                }

                switch (action)
                {
                    case "insert":
                        return list.Count > 0 ? list[0] : null;
                    case "update":
                        return list.Count > 0 ? list[0] : null;
                    case "update-image":
                        return list.Count > 0 ? list[0] : null;
                    case "update-image-pdp":
                        return list.Count > 0 ? list[0] : null;
                    case "insert-destination":
                        return list.Count > 0 ? list[0] : null;
                    case "update-status":
                        return list.Count > 0 ? list[0] : null;
                    case "select-single":
                        return list.Count > 0 ? list[0] : null;
                    case "email":
                        return list.Count > 0 ? list[0] : null;
                    case "active":
                        return list.Count > 0 ? list[0] : null;
                    case "activate":
                        return list.Count > 0 ? list[0] : null;
                    case "decline":
                        return list.Count > 0 ? list[0] : null;
                    case "accept":
                        return list.Count > 0 ? list[0] : null;
                    case "location":
                        return list.Count > 0 ? list[0] : null;
                    case "delete":
                        return list.Count > 0 ? list[0] : null;
                    case "voucher":
                        return list.Count > 0 ? list[0] : null;
                    default:
                        return list;
                }
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static dynamic ActionStoredProcedureBidLoad(string connectionString, object objIn, string table, string action)
        {
            try
            {
                List<Load> listLoad = new List<Load>();
                List<Bid> listBid = new List<Bid>();
                BidLoad result = new BidLoad();

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = "usp_action_" + table;

                    sqlConnection.Open();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    System.Reflection.PropertyInfo[] myPropertyInfoIn = objIn.GetType().GetProperties();
                    cmd.Parameters.AddWithValue("@action", action);
                    if (table == "version")
                    {
                        cmd.Parameters.AddWithValue("@id", objIn.GetType().GetProperty("Id").GetValue(objIn));
                    }
                    else
                    {
                        for (int i = 0; i < myPropertyInfoIn.Length; i++)
                        {
                            if (myPropertyInfoIn[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoIn[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                            {
                                cmd.Parameters.AddWithValue("@" + myPropertyInfoIn[i].Name.Substring(0, 1).ToLower() + myPropertyInfoIn[i].Name.Substring(1), DataTypeHelper.Convert(objIn.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(objIn), GetDataType(objIn, myPropertyInfoIn[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(objIn.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(objIn), GetDataType(objIn, myPropertyInfoIn[i].Name)));
                            }
                        }
                    }
                    string sp = "EXEC " + query + " ";
                    for (int i = 0; i < cmd.Parameters.Count; i++)
                    {
                        sp += cmd.Parameters[i].SqlValue.ToString().ToUpper() == "NULL" ? "NULL," : "'" + cmd.Parameters[i].SqlValue + "',";
                    }
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Load item = new Load();
                            System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfoOut.Length; i++)
                            {
                                if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                }
                            }

                            listLoad.Add(item);
                        }

                        reader.NextResult();

                        while (reader.Read())
                        {
                            Bid item = new Bid();
                            System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfoOut.Length; i++)
                            {
                                if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                }
                            }

                            listBid.Add(item);
                        }

                        sqlConnection.Close();
                    }
                }

                result.bid = listBid[0];
                result.load = listLoad[0];

                return result;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static async Task<dynamic> ActionStoredProcedureBidLoadAsync(string connectionString, object objIn, string table, string action)
        {
            try
            {
                List<Load> listLoad = new List<Load>();
                List<Bid> listBid = new List<Bid>();
                BidLoad result = new BidLoad();

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = "usp_action_" + table;

                    await sqlConnection.OpenAsync();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    System.Reflection.PropertyInfo[] myPropertyInfoIn = objIn.GetType().GetProperties();
                    cmd.Parameters.AddWithValue("@action", action);
                    if (table == "version")
                    {
                        cmd.Parameters.AddWithValue("@id", objIn.GetType().GetProperty("Id").GetValue(objIn));
                    }
                    else
                    {
                        for (int i = 0; i < myPropertyInfoIn.Length; i++)
                        {
                            if (myPropertyInfoIn[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoIn[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                            {
                                cmd.Parameters.AddWithValue("@" + myPropertyInfoIn[i].Name.Substring(0, 1).ToLower() + myPropertyInfoIn[i].Name.Substring(1), DataTypeHelper.Convert(objIn.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(objIn), GetDataType(objIn, myPropertyInfoIn[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(objIn.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(objIn), GetDataType(objIn, myPropertyInfoIn[i].Name)));
                            }
                        }
                    }
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            Load item = new Load();
                            System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfoOut.Length; i++)
                            {
                                if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                }
                            }

                            listLoad.Add(item);
                        }

                        await reader.NextResultAsync();

                        while (await reader.ReadAsync())
                        {
                            Bid item = new Bid();
                            System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfoOut.Length; i++)
                            {
                                if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                }
                            }

                            listBid.Add(item);
                        }

                        await sqlConnection.CloseAsync();
                    }
                }

                result.bid = listBid[0];
                result.load = listLoad[0];

                return result;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static dynamic AcceptBid(string connectionString, Bid bid)
        {
            try
            {
                List<Load> listLoad = new List<Load>();
                List<Bid> listBid = new List<Bid>();
                BidLoad result = new BidLoad();

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = "usp_action_bid";

                    sqlConnection.Open();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    System.Reflection.PropertyInfo[] myPropertyInfoIn = bid.GetType().GetProperties();
                    cmd.Parameters.AddWithValue("@action", "accept");
                    for (int i = 0; i < myPropertyInfoIn.Length; i++)
                    {
                        if (myPropertyInfoIn[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoIn[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                        {
                            cmd.Parameters.AddWithValue("@" + myPropertyInfoIn[i].Name.Substring(0, 1).ToLower() + myPropertyInfoIn[i].Name.Substring(1), DataTypeHelper.Convert(bid.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(bid), GetDataType(bid, myPropertyInfoIn[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(bid.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(bid), GetDataType(bid, myPropertyInfoIn[i].Name)));
                        }
                    }
                    string sp = "EXEC " + query + " ";
                    for (int i = 0; i < cmd.Parameters.Count; i++)
                    {
                        sp += cmd.Parameters[i].SqlValue.ToString().ToUpper() == "NULL" ? "NULL," : "'" + cmd.Parameters[i].SqlValue + "',";
                    }
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Load item = new Load();
                            System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfoOut.Length; i++)
                            {
                                if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                }
                            }

                            listLoad.Add(item);
                        }

                        reader.NextResult();

                        while (reader.Read())
                        {
                            Bid item = new Bid();
                            System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfoOut.Length; i++)
                            {
                                if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                }
                            }

                            listBid.Add(item);
                        }

                        sqlConnection.Close();
                    }
                }

                result.bid = listBid[0];
                result.load = listLoad[0];

                return result;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static async Task<dynamic> AcceptBidAsync(string connectionString, Bid bid)
        {
            try
            {
                List<Load> listLoad = new List<Load>();
                List<Bid> listBid = new List<Bid>();
                BidLoad result = new BidLoad();

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = "usp_action_bid";

                    await sqlConnection.OpenAsync();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    System.Reflection.PropertyInfo[] myPropertyInfoIn = bid.GetType().GetProperties();
                    cmd.Parameters.AddWithValue("@action", "accept");
                    for (int i = 0; i < myPropertyInfoIn.Length; i++)
                    {
                        if (myPropertyInfoIn[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoIn[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                        {
                            cmd.Parameters.AddWithValue("@" + myPropertyInfoIn[i].Name.Substring(0, 1).ToLower() + myPropertyInfoIn[i].Name.Substring(1), DataTypeHelper.Convert(bid.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(bid), GetDataType(bid, myPropertyInfoIn[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(bid.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(bid), GetDataType(bid, myPropertyInfoIn[i].Name)));
                        }
                    }
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            Load item = new Load();
                            System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfoOut.Length; i++)
                            {
                                if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                }
                            }

                            listLoad.Add(item);
                        }

                        await reader.NextResultAsync();

                        while (await reader.ReadAsync())
                        {
                            Bid item = new Bid();
                            System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfoOut.Length; i++)
                            {
                                if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                }
                            }

                            listBid.Add(item);
                        }

                        await sqlConnection.CloseAsync();
                    }
                }

                result.bid = listBid[0];
                result.load = listLoad[0];

                return result;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static dynamic DeclineBid(string connectionString, Bid bid)
        {
            try
            {
                List<Load> listLoad = new List<Load>();
                List<Bid> listBid = new List<Bid>();
                BidLoad result = new BidLoad();

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = "usp_action_bid";

                    sqlConnection.Open();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    System.Reflection.PropertyInfo[] myPropertyInfoIn = bid.GetType().GetProperties();
                    cmd.Parameters.AddWithValue("@action", "decline");
                    for (int i = 0; i < myPropertyInfoIn.Length; i++)
                    {
                        if (myPropertyInfoIn[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoIn[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                        {
                            cmd.Parameters.AddWithValue("@" + myPropertyInfoIn[i].Name.Substring(0, 1).ToLower() + myPropertyInfoIn[i].Name.Substring(1), DataTypeHelper.Convert(bid.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(bid), GetDataType(bid, myPropertyInfoIn[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(bid.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(bid), GetDataType(bid, myPropertyInfoIn[i].Name)));
                        }
                    }
                    string sp = "EXEC " + query + " ";
                    for (int i = 0; i < cmd.Parameters.Count; i++)
                    {
                        sp += cmd.Parameters[i].SqlValue.ToString().ToUpper() == "NULL" ? "NULL," : "'" + cmd.Parameters[i].SqlValue + "',";
                    }
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Load item = new Load();
                            System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfoOut.Length; i++)
                            {
                                if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                }
                            }

                            listLoad.Add(item);
                        }

                        reader.NextResult();

                        while (reader.Read())
                        {
                            Bid item = new Bid();
                            System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfoOut.Length; i++)
                            {
                                if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                }
                            }

                            listBid.Add(item);
                        }

                        sqlConnection.Close();
                    }
                }

                result.bid = listBid[0];
                result.load = listLoad[0];

                return result;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static async Task<dynamic> DeclineBidAsync(string connectionString, Bid bid)
        {
            try
            {
                List<Load> listLoad = new List<Load>();
                List<Bid> listBid = new List<Bid>();
                BidLoad result = new BidLoad();

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = "usp_action_bid";

                    await sqlConnection.OpenAsync();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    System.Reflection.PropertyInfo[] myPropertyInfoIn = bid.GetType().GetProperties();
                    cmd.Parameters.AddWithValue("@action", "decline");
                    for (int i = 0; i < myPropertyInfoIn.Length; i++)
                    {
                        if (myPropertyInfoIn[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoIn[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                        {
                            cmd.Parameters.AddWithValue("@" + myPropertyInfoIn[i].Name.Substring(0, 1).ToLower() + myPropertyInfoIn[i].Name.Substring(1), DataTypeHelper.Convert(bid.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(bid), GetDataType(bid, myPropertyInfoIn[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(bid.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(bid), GetDataType(bid, myPropertyInfoIn[i].Name)));
                        }
                    }
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            Load item = new Load();
                            System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfoOut.Length; i++)
                            {
                                if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                }
                            }

                            listLoad.Add(item);
                        }

                        await reader.NextResultAsync();

                        while (await reader.ReadAsync())
                        {
                            Bid item = new Bid();
                            System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfoOut.Length; i++)
                            {
                                if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                }
                            }

                            listBid.Add(item);
                        }

                        await sqlConnection.CloseAsync();
                    }
                }

                result.bid = listBid[0];
                result.load = listLoad[0];

                return result;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static dynamic UpdateStatus(string connectionString, LoadUpdate loadUpdate)
        {
            try
            {
                List<Load> listLoad = new List<Load>();
                List<LoadDestination> listLoadDestination = new List<LoadDestination>();
                List<Bid> listBid = new List<Bid>();
                BidLoadDestination result = new BidLoadDestination();

                using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                {
                    string query = "usp_action_load";

                    sqlConnection.Open();
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    System.Reflection.PropertyInfo[] myPropertyInfoIn = loadUpdate.Load.GetType().GetProperties();
                    cmd.Parameters.AddWithValue("@action", "update-status");
                    for (int i = 0; i < myPropertyInfoIn.Length; i++)
                    {
                        if (myPropertyInfoIn[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoIn[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                        {
                            cmd.Parameters.AddWithValue("@" + myPropertyInfoIn[i].Name.Substring(0, 1).ToLower() + myPropertyInfoIn[i].Name.Substring(1), DataTypeHelper.Convert(loadUpdate.Load.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(loadUpdate.Load), GetDataType(loadUpdate.Load, myPropertyInfoIn[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(loadUpdate.Load.GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(loadUpdate.Load), GetDataType(loadUpdate.Load, myPropertyInfoIn[i].Name)));
                        }
                    }
                    string sp = "EXEC " + query + " ";
                    for (int i = 0; i < cmd.Parameters.Count; i++)
                    {
                        sp += cmd.Parameters[i].SqlValue.ToString().ToUpper() == "NULL" ? "NULL," : "'" + cmd.Parameters[i].SqlValue + "',";
                    }
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Load item = new Load();
                            System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                            for (int i = 0; i < myPropertyInfoOut.Length; i++)
                            {
                                if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                {
                                    item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                }
                            }

                            listLoad.Add(item);
                        }

                        sqlConnection.Close();
                    }
                }

                if (loadUpdate.LoadDestination.Count() > 0)
                {
                    using (SqlConnection sqlConnection = new SqlConnection(connectionString))
                    {
                        string query = "usp_action_loadDestination";

                        sqlConnection.Open();
                        SqlCommand cmd = new SqlCommand(query, sqlConnection);
                        cmd.CommandType = CommandType.StoredProcedure;
                        System.Reflection.PropertyInfo[] myPropertyInfoIn = loadUpdate.LoadDestination[0].GetType().GetProperties();
                        cmd.Parameters.AddWithValue("@action", "update-status");
                        for (int i = 0; i < myPropertyInfoIn.Length; i++)
                        {
                            if (myPropertyInfoIn[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoIn[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                            {
                                cmd.Parameters.AddWithValue("@" + myPropertyInfoIn[i].Name.Substring(0, 1).ToLower() + myPropertyInfoIn[i].Name.Substring(1), DataTypeHelper.Convert(loadUpdate.LoadDestination[0].GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(loadUpdate.LoadDestination[0]), GetDataType(loadUpdate.LoadDestination[0], myPropertyInfoIn[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(loadUpdate.LoadDestination[0].GetType().GetProperty(myPropertyInfoIn[i].Name).GetValue(loadUpdate.LoadDestination[0]), GetDataType(loadUpdate.LoadDestination[0], myPropertyInfoIn[i].Name)));
                            }
                        }
                        string sp = "EXEC " + query + " ";
                        for (int i = 0; i < cmd.Parameters.Count; i++)
                        {
                            sp += cmd.Parameters[i].SqlValue.ToString().ToUpper() == "NULL" ? "NULL," : "'" + cmd.Parameters[i].SqlValue + "',";
                        }
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                LoadDestination item = new LoadDestination();
                                System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                                for (int i = 0; i < myPropertyInfoOut.Length; i++)
                                {
                                    if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                    {
                                        item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                    }
                                }

                                listLoadDestination.Add(item);
                            }

                            reader.NextResult();

                            while (reader.Read())
                            {
                                Bid item = new Bid();
                                System.Reflection.PropertyInfo[] myPropertyInfoOut = item.GetType().GetProperties();
                                for (int i = 0; i < myPropertyInfoOut.Length; i++)
                                {
                                    if (myPropertyInfoOut[i].PropertyType.Namespace != "System.Collections.Generic" && myPropertyInfoOut[i].PropertyType.Namespace.IndexOf(".Models") < 0)
                                    {
                                        item.GetType().GetProperty(myPropertyInfoOut[i].Name).SetValue(item, DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)) == null ? DBNull.Value : DataTypeHelper.Convert(reader[myPropertyInfoOut[i].Name], GetDataType(item, myPropertyInfoOut[i].Name)), null);
                                    }
                                }

                                listBid.Add(item);
                            }

                            sqlConnection.Close();
                        }
                    }
                }

                result.bid = listBid[0];
                result.load = listLoad[0];
                result.loadDestination = listLoadDestination[0];

                return result;
            }
            catch (Exception exc)
            {
                return exc.Message;
            }
        }

        public static DataTable GetDataTableFromQuery(string connectionString, string SqlStatement, Collection<KeyValuePair<string, object>>? CommandParamaterSet = null)
        {
            DataTable dt = null;
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                SqlCommand cmd = null;
                try
                {
                    cmd = new SqlCommand(SqlStatement, sqlConnection) { CommandType = CommandType.StoredProcedure };
                    foreach (KeyValuePair<string, object> kvp in CommandParamaterSet)
                    {
                        cmd.Parameters.AddWithValue(kvp.Key, kvp.Value);
                    }
                    sqlConnection.Open();
                    SqlDataReader dr = cmd.ExecuteReader();
                    if (dr.HasRows)
                    {
                        dt = new DataTable();
                        dt.Load(dr);
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally { cmd.Dispose(); sqlConnection.Close(); sqlConnection.Dispose(); }
            }
            return dt;
        }

        public static string GetDataType(object item, string name)
        {
            try
            {
                if (item.GetType().GetProperty(name).PropertyType.IsGenericType &&
                    item.GetType().GetProperty(name).PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                {
                    string dataType = item.GetType().GetProperty(name).PropertyType.GetGenericArguments()[0].Name.ToLower();
                    return dataType == "single" ? "double" : dataType;
                }
                else
                {
                    string dataType = item.GetType().GetProperty(name).PropertyType.Name.ToLower();
                    return dataType == "single" ? "double" : dataType;
                }
            }
            catch (Exception exc)
            {
                string str = exc.Message;
                return "";
            }
        }

    }
}