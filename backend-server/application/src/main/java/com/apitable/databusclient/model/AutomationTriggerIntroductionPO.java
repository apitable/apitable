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
 * AutomationTriggerIntroductionPO
 */
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen", date = "2023-09-06T15:12:05.433596+08:00[Asia/Shanghai]")
public class AutomationTriggerIntroductionPO {
  public static final String SERIALIZED_NAME_PREV_TRIGGER_ID = "prevTriggerId";
  @SerializedName(SERIALIZED_NAME_PREV_TRIGGER_ID)
  private String prevTriggerId;

  public static final String SERIALIZED_NAME_ROBOT_ID = "robotId";
  @SerializedName(SERIALIZED_NAME_ROBOT_ID)
  private String robotId;

  public static final String SERIALIZED_NAME_TRIGGER_ID = "triggerId";
  @SerializedName(SERIALIZED_NAME_TRIGGER_ID)
  private String triggerId;

  public static final String SERIALIZED_NAME_TRIGGER_TYPE_ID = "triggerTypeId";
  @SerializedName(SERIALIZED_NAME_TRIGGER_TYPE_ID)
  private String triggerTypeId;

  public AutomationTriggerIntroductionPO() {
  }

  public AutomationTriggerIntroductionPO prevTriggerId(String prevTriggerId) {
    
    this.prevTriggerId = prevTriggerId;
    return this;
  }

   /**
   * Get prevTriggerId
   * @return prevTriggerId
  **/
  @javax.annotation.Nullable
  public String getPrevTriggerId() {
    return prevTriggerId;
  }


  public void setPrevTriggerId(String prevTriggerId) {
    this.prevTriggerId = prevTriggerId;
  }


  public AutomationTriggerIntroductionPO robotId(String robotId) {
    
    this.robotId = robotId;
    return this;
  }

   /**
   * Get robotId
   * @return robotId
  **/
  @javax.annotation.Nonnull
  public String getRobotId() {
    return robotId;
  }


  public void setRobotId(String robotId) {
    this.robotId = robotId;
  }


  public AutomationTriggerIntroductionPO triggerId(String triggerId) {
    
    this.triggerId = triggerId;
    return this;
  }

   /**
   * Get triggerId
   * @return triggerId
  **/
  @javax.annotation.Nonnull
  public String getTriggerId() {
    return triggerId;
  }


  public void setTriggerId(String triggerId) {
    this.triggerId = triggerId;
  }


  public AutomationTriggerIntroductionPO triggerTypeId(String triggerTypeId) {
    
    this.triggerTypeId = triggerTypeId;
    return this;
  }

   /**
   * Get triggerTypeId
   * @return triggerTypeId
  **/
  @javax.annotation.Nonnull
  public String getTriggerTypeId() {
    return triggerTypeId;
  }


  public void setTriggerTypeId(String triggerTypeId) {
    this.triggerTypeId = triggerTypeId;
  }



  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AutomationTriggerIntroductionPO automationTriggerIntroductionPO = (AutomationTriggerIntroductionPO) o;
    return Objects.equals(this.prevTriggerId, automationTriggerIntroductionPO.prevTriggerId) &&
        Objects.equals(this.robotId, automationTriggerIntroductionPO.robotId) &&
        Objects.equals(this.triggerId, automationTriggerIntroductionPO.triggerId) &&
        Objects.equals(this.triggerTypeId, automationTriggerIntroductionPO.triggerTypeId);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(prevTriggerId, robotId, triggerId, triggerTypeId);
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
    sb.append("class AutomationTriggerIntroductionPO {\n");
    sb.append("    prevTriggerId: ").append(toIndentedString(prevTriggerId)).append("\n");
    sb.append("    robotId: ").append(toIndentedString(robotId)).append("\n");
    sb.append("    triggerId: ").append(toIndentedString(triggerId)).append("\n");
    sb.append("    triggerTypeId: ").append(toIndentedString(triggerTypeId)).append("\n");
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
    openapiFields.add("prevTriggerId");
    openapiFields.add("robotId");
    openapiFields.add("triggerId");
    openapiFields.add("triggerTypeId");

    // a set of required properties/fields (JSON key names)
    openapiRequiredFields = new HashSet<String>();
    openapiRequiredFields.add("robotId");
    openapiRequiredFields.add("triggerId");
    openapiRequiredFields.add("triggerTypeId");
  }

 /**
  * Validates the JSON Element and throws an exception if issues found
  *
  * @param jsonElement JSON Element
  * @throws IOException if the JSON Element is invalid with respect to AutomationTriggerIntroductionPO
  */
  public static void validateJsonElement(JsonElement jsonElement) throws IOException {
      if (jsonElement == null) {
        if (!AutomationTriggerIntroductionPO.openapiRequiredFields.isEmpty()) { // has required fields but JSON element is null
          throw new IllegalArgumentException(String.format("The required field(s) %s in AutomationTriggerIntroductionPO is not found in the empty JSON string", AutomationTriggerIntroductionPO.openapiRequiredFields.toString()));
        }
      }

      Set<Entry<String, JsonElement>> entries = jsonElement.getAsJsonObject().entrySet();
      // check to see if the JSON string contains additional fields
      for (Entry<String, JsonElement> entry : entries) {
        if (!AutomationTriggerIntroductionPO.openapiFields.contains(entry.getKey())) {
          throw new IllegalArgumentException(String.format("The field `%s` in the JSON string is not defined in the `AutomationTriggerIntroductionPO` properties. JSON: %s", entry.getKey(), jsonElement.toString()));
        }
      }

      // check to make sure all required properties/fields are present in the JSON string
      for (String requiredField : AutomationTriggerIntroductionPO.openapiRequiredFields) {
        if (jsonElement.getAsJsonObject().get(requiredField) == null) {
          throw new IllegalArgumentException(String.format("The required field `%s` is not found in the JSON string: %s", requiredField, jsonElement.toString()));
        }
      }
        JsonObject jsonObj = jsonElement.getAsJsonObject();
      if ((jsonObj.get("prevTriggerId") != null && !jsonObj.get("prevTriggerId").isJsonNull()) && !jsonObj.get("prevTriggerId").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `prevTriggerId` to be a primitive type in the JSON string but got `%s`", jsonObj.get("prevTriggerId").toString()));
      }
      if (!jsonObj.get("robotId").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `robotId` to be a primitive type in the JSON string but got `%s`", jsonObj.get("robotId").toString()));
      }
      if (!jsonObj.get("triggerId").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `triggerId` to be a primitive type in the JSON string but got `%s`", jsonObj.get("triggerId").toString()));
      }
      if (!jsonObj.get("triggerTypeId").isJsonPrimitive()) {
        throw new IllegalArgumentException(String.format("Expected the field `triggerTypeId` to be a primitive type in the JSON string but got `%s`", jsonObj.get("triggerTypeId").toString()));
      }
  }

  public static class CustomTypeAdapterFactory implements TypeAdapterFactory {
    @SuppressWarnings("unchecked")
    @Override
    public <T> TypeAdapter<T> create(Gson gson, TypeToken<T> type) {
       if (!AutomationTriggerIntroductionPO.class.isAssignableFrom(type.getRawType())) {
         return null; // this class only serializes 'AutomationTriggerIntroductionPO' and its subtypes
       }
       final TypeAdapter<JsonElement> elementAdapter = gson.getAdapter(JsonElement.class);
       final TypeAdapter<AutomationTriggerIntroductionPO> thisAdapter
                        = gson.getDelegateAdapter(this, TypeToken.get(AutomationTriggerIntroductionPO.class));

       return (TypeAdapter<T>) new TypeAdapter<AutomationTriggerIntroductionPO>() {
           @Override
           public void write(JsonWriter out, AutomationTriggerIntroductionPO value) throws IOException {
             JsonObject obj = thisAdapter.toJsonTree(value).getAsJsonObject();
             elementAdapter.write(out, obj);
           }

           @Override
           public AutomationTriggerIntroductionPO read(JsonReader in) throws IOException {
             JsonElement jsonElement = elementAdapter.read(in);
             validateJsonElement(jsonElement);
             return thisAdapter.fromJsonTree(jsonElement);
           }

       }.nullSafe();
    }
  }

 /**
  * Create an instance of AutomationTriggerIntroductionPO given an JSON string
  *
  * @param jsonString JSON string
  * @return An instance of AutomationTriggerIntroductionPO
  * @throws IOException if the JSON string is invalid with respect to AutomationTriggerIntroductionPO
  */
  public static AutomationTriggerIntroductionPO fromJson(String jsonString) throws IOException {
    return JSON.getGson().fromJson(jsonString, AutomationTriggerIntroductionPO.class);
  }

 /**
  * Convert an instance of AutomationTriggerIntroductionPO to an JSON string
  *
  * @return JSON string
  */
  public String toJson() {
    return JSON.getGson().toJson(this);
  }
}

