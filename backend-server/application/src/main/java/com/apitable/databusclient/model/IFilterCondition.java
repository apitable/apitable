/*
 * databus-server
 * databus-server APIs
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


package com.apitable.databusclient.model;

import java.util.Objects;
import com.apitable.databusclient.model.FOperator;
import com.apitable.databusclient.model.FieldKindSO;
import com.google.gson.TypeAdapter;
import com.google.gson.annotations.JsonAdapter;
import com.google.gson.annotations.SerializedName;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import java.io.IOException;
import java.util.Arrays;
import org.openapitools.jackson.nullable.JsonNullable;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.TypeAdapterFactory;
import com.google.gson.reflect.TypeToken;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import java.io.IOException;

import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import com.apitable.databusclient.JSON;

/**
 * IFilterCondition
 */
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", date = "2023-09-06T15:12:05.433596+08:00[Asia/Shanghai]")
public class IFilterCondition {
  public static final String SERIALIZED_NAME_CONDITION_ID = "conditionId";
  @SerializedName(SERIALIZED_NAME_CONDITION_ID)
  private String conditionId;

  public static final String SERIALIZED_NAME_FIELD_ID = "fieldId";
  @SerializedName(SERIALIZED_NAME_FIELD_ID)
  private String fieldId;

  public static final String SERIALIZED_NAME_FIELD_TYPE = "fieldType";
  @SerializedName(SERIALIZED_NAME_FIELD_TYPE)
  private FieldKindSO fieldType;

  public static final String SERIALIZED_NAME_OPERATOR = "operator";
  @SerializedName(SERIALIZED_NAME_OPERATOR)
  private FOperator operator;

  public static final String SERIALIZED_NAME_VALUE = "value";
  @SerializedName(SERIALIZED_NAME_VALUE)
  private Object value = null;

  public IFilterCondition() {
  }

  public IFilterCondition conditionId(String conditionId) {
    
    this.conditionId = conditionId;
    return this;
  }

   /**
   * Get conditionId
   * @return conditionId
  **/
  @javax.annotation.Nonnull
  public String getConditionId() {
    return conditionId;
  }


  public void setConditionId(String conditionId) {
    this.conditionId = conditionId;
  }


  public IFilterCondition fieldId(String fieldId) {
    
    this.fieldId = fieldId;
    return this;
  }

   /**
   * Get fieldId
   * @return fieldId
  **/
  @javax.annotation.Nonnull
  public String getFieldId() {
    return fieldId;
  }


  public void setFieldId(String fieldId) {
    this.fieldId = fieldId;
  }


  public IFilterCondition fieldType(FieldKindSO fieldType) {
    
    this.fieldType = fieldType;
    return this;
  }

   /**
   * Get fieldType
   * @return fieldType
  **/
  @javax.annotation.Nonnull
  public FieldKindSO getFieldType() {
    return fieldType;
  }


  public void setFieldType(FieldKindSO fieldType) {
    this.fieldType = fieldType;
  }


  public IFilterCondition operator(FOperator operator) {
    
    this.operator = operator;
    return this;
  }

   /**
   * Get operator
   * @return operator
  **/
  @javax.annotation.Nonnull
  public FOperator getOperator() {
    return operator;
  }


  public void setOperator(FOperator operator) {
    this.operator = operator;
  }


  public IFilterCondition value(Object value) {
    
    this.value = value;
    return this;
  }

   /**
   * Get value
   * @return value
  **/
  @javax.annotation.Nullable
  public Object getValue() {
    return value;
  }


  public void setValue(Object value) {
    this.value = value;
  }



  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    IFilterCondition ifilterCondition = (IFilterCondition) o;
    return Objects.equals(this.conditionId, ifilterCondition.conditionId) &&
        Objects.equals(this.fieldId, ifilterCondition.fieldId) &&
        Objects.equals(this.fieldType, ifilterCondition.fieldType) &&
        Objects.equals(this.operator, ifilterCondition.operator) &&
        Objects.equals(this.value, ifilterCondition.value);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(conditionId, fieldId, fieldType, operator, value);
  }

  private static <T> int hashCodeNullable(JsonNullable<T> a) {
    if (a == null) {
      return 1;
    }
    return a.isPresent() ? Arrays.deepHashCode(new Object[]{a.get()}) : 31;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class IFilterCondition {\n");
    sb.append("    conditionId: ").append(toIndentedString(conditionId)).append("\n");
    sb.append("    fieldId: ").append(toIndentedString(fieldId)).append("\n");
    sb.append("    fieldType: ").append(toIndentedString(fieldType)).append("\n");
    sb.append("    operator: ").append(toIndentedString(operator)).append("\n");
    sb.append("    value: ").append(toIndentedString(value)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }


  public static HashSet<String> openapiFields;
  public static HashSet<String> openapiRequiredFields;

  static {
    // a set of all properties/fields (JSON key names)
    openapiFields = new HashSet<String>();
    openapiFields.add("conditionId");
    openapiFields.add("fieldId");
    openapiFields.add("fieldType");
    openapiFields.add("operator");
    openapiFields.add("value");

    // a set of required properties/fields (JSON key names)
    openapiRequiredFields = new HashSet<String>();
    openapiRequiredFields.add("conditionId");
    openapiRequiredFields.add("fieldId");
    openapiRequiredFields.add("fieldType");
    openapiRequiredFields.add("operator");
  }

 /**
  * Validates the JSON Element and throws an exception if issues found
  *
  * @param jsonElement JSON Element
  * @throws IOException if the JSON Element is invalid with respect to IFilterCondition
  */
  public static void validateJsonElement(JsonElement jsonElement) throws IOException {
      if (jsonElement == null) {
        if (!IFilterCondition.openapiRequiredFields.isEmpty()) { // has required fields but JSON element is null
          throw new IllegalArgumentException(String.format("The required field(s) %s in IFilterCondition is not found in the empty JSON string", IFilterCondition.openapiRequiredFields.toString()));
        }
      }

      Set<Entry<String, JsonElement>> entries = jsonElement.getAsJsonObject().entrySet();
      // check to see if the JSON string contains additional fields
      for (Entry<String, JsonElement> entry : entries) {
        if (!IFilterCondition.openapiFields.contains(entry.getKey())) {
          throw new IllegalArgumentException(String.format("The field `%s` in the JSON string is not defined in the `IFilterCondition` properties. JSON: %s", entry.getKey(), jsonElement.toString()));
        }
      }

      // check to make sure all required properties/fields are present in the JSON string
      for (String requiredField : IFilterCondition.openapiRequiredFields) {
        if (jsonElement.getAsJsonObject().get(requiredField) == null) {
          throw new IllegalArgumentException(String.format("The required field `%s` is not found in the JSON string: %s", requiredField, jsonElement.toString()));
        }
      }
        JsonObject jsonObj = jsonElement.getAsJsonObject();
      if (!jsonObj.get("conditionId").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `conditionId` to be a primitive type in the JSON string but got `%s`", jsonObj.get("conditionId").toString()));
      }
      if (!jsonObj.get("fieldId").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `fieldId` to be a primitive type in the JSON string but got `%s`", jsonObj.get("fieldId").toString()));
      }
  }

  public static class CustomTypeAdapterFactory implements TypeAdapterFactory {
    @SuppressWarnings("unchecked")
    @Override
    public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
       if (!IFilterCondition.class.isAssignableFrom(type.getRawType())) {
         return null; // this class only serializes 'IFilterCondition' and its subtypes
       }
       final TypeAdapter<JsonElement> elementAdapter = gson.getAdapter(JsonElement.class);
       final TypeAdapter<IFilterCondition> thisAdapter
                        = gson.getDelegateAdapter(this, TypeToken.get(IFilterCondition.class));

       return (TypeAdapter<T>) new TypeAdapter<IFilterCondition>() {
           @Override
           public void write(JsonWriter out, IFilterCondition value) throws IOException {
             JsonObject obj = thisAdapter.toJsonTree(value).getAsJsonObject();
             elementAdapter.write(out, obj);
           }

           @Override
           public IFilterCondition read(JsonReader in) throws IOException {
             JsonElement jsonElement = elementAdapter.read(in);
             validateJsonElement(jsonElement);
             return thisAdapter.fromJsonTree(jsonElement);
           }

       }.nullSafe();
    }
  }

 /**
  * Create an instance of IFilterCondition given an JSON string
  *
  * @param jsonString JSON string
  * @return An instance of IFilterCondition
  * @throws IOException if the JSON string is invalid with respect to IFilterCondition
  */
  public static IFilterCondition fromJson(String jsonString) throws IOException {
    return JSON.getGson().fromJson(jsonString, IFilterCondition.class);
  }

 /**
  * Convert an instance of IFilterCondition to an JSON string
  *
  * @return JSON string
  */
  public String toJson() {
    return JSON.getGson().toJson(this);
  }
}

