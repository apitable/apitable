/*
 * databus-server
 * databus-server APIs
 *
 * The version of the OpenAPI document: 1.6.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


package com.apitable.starter.databus.client.model;

import java.util.Objects;
import java.util.Arrays;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.annotation.JsonValue;
import org.openapitools.jackson.nullable.JsonNullable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.openapitools.jackson.nullable.JsonNullable;
import java.util.NoSuchElementException;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

/**
 * AutomationTriggerPO
 */
@JsonPropertyOrder({
  AutomationTriggerPO.JSON_PROPERTY_INPUT,
  AutomationTriggerPO.JSON_PROPERTY_PREV_TRIGGER_ID,
  AutomationTriggerPO.JSON_PROPERTY_RESOURCE_ID,
  AutomationTriggerPO.JSON_PROPERTY_ROBOT_ID,
  AutomationTriggerPO.JSON_PROPERTY_TRIGGER_ID,
  AutomationTriggerPO.JSON_PROPERTY_TRIGGER_TYPE_ID
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class AutomationTriggerPO {
  public static final String JSON_PROPERTY_INPUT = "input";
  private JsonNullable<String> input = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_PREV_TRIGGER_ID = "prevTriggerId";
  private JsonNullable<String> prevTriggerId = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_RESOURCE_ID = "resourceId";
  private JsonNullable<String> resourceId = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_ROBOT_ID = "robotId";
  private String robotId;

  public static final String JSON_PROPERTY_TRIGGER_ID = "triggerId";
  private String triggerId;

  public static final String JSON_PROPERTY_TRIGGER_TYPE_ID = "triggerTypeId";
  private String triggerTypeId;

  public AutomationTriggerPO() {
  }

  public AutomationTriggerPO input(String input) {
    this.input = JsonNullable.<String>of(input);
    
    return this;
  }

   /**
   * Get input
   * @return input
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getInput() {
        return input.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_INPUT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getInput_JsonNullable() {
    return input;
  }
  
  @JsonProperty(JSON_PROPERTY_INPUT)
  public void setInput_JsonNullable(JsonNullable<String> input) {
    this.input = input;
  }

  public void setInput(String input) {
    this.input = JsonNullable.<String>of(input);
  }


  public AutomationTriggerPO prevTriggerId(String prevTriggerId) {
    this.prevTriggerId = JsonNullable.<String>of(prevTriggerId);
    
    return this;
  }

   /**
   * Get prevTriggerId
   * @return prevTriggerId
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getPrevTriggerId() {
        return prevTriggerId.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_PREV_TRIGGER_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getPrevTriggerId_JsonNullable() {
    return prevTriggerId;
  }
  
  @JsonProperty(JSON_PROPERTY_PREV_TRIGGER_ID)
  public void setPrevTriggerId_JsonNullable(JsonNullable<String> prevTriggerId) {
    this.prevTriggerId = prevTriggerId;
  }

  public void setPrevTriggerId(String prevTriggerId) {
    this.prevTriggerId = JsonNullable.<String>of(prevTriggerId);
  }


  public AutomationTriggerPO resourceId(String resourceId) {
    this.resourceId = JsonNullable.<String>of(resourceId);
    
    return this;
  }

   /**
   * Get resourceId
   * @return resourceId
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getResourceId() {
        return resourceId.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_RESOURCE_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getResourceId_JsonNullable() {
    return resourceId;
  }
  
  @JsonProperty(JSON_PROPERTY_RESOURCE_ID)
  public void setResourceId_JsonNullable(JsonNullable<String> resourceId) {
    this.resourceId = resourceId;
  }

  public void setResourceId(String resourceId) {
    this.resourceId = JsonNullable.<String>of(resourceId);
  }


  public AutomationTriggerPO robotId(String robotId) {
    
    this.robotId = robotId;
    return this;
  }

   /**
   * Get robotId
   * @return robotId
  **/
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_ROBOT_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public String getRobotId() {
    return robotId;
  }


  @JsonProperty(JSON_PROPERTY_ROBOT_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setRobotId(String robotId) {
    this.robotId = robotId;
  }


  public AutomationTriggerPO triggerId(String triggerId) {
    
    this.triggerId = triggerId;
    return this;
  }

   /**
   * Get triggerId
   * @return triggerId
  **/
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_TRIGGER_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public String getTriggerId() {
    return triggerId;
  }


  @JsonProperty(JSON_PROPERTY_TRIGGER_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setTriggerId(String triggerId) {
    this.triggerId = triggerId;
  }


  public AutomationTriggerPO triggerTypeId(String triggerTypeId) {
    
    this.triggerTypeId = triggerTypeId;
    return this;
  }

   /**
   * Get triggerTypeId
   * @return triggerTypeId
  **/
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_TRIGGER_TYPE_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public String getTriggerTypeId() {
    return triggerTypeId;
  }


  @JsonProperty(JSON_PROPERTY_TRIGGER_TYPE_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
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
    AutomationTriggerPO automationTriggerPO = (AutomationTriggerPO) o;
    return equalsNullable(this.input, automationTriggerPO.input) &&
        equalsNullable(this.prevTriggerId, automationTriggerPO.prevTriggerId) &&
        equalsNullable(this.resourceId, automationTriggerPO.resourceId) &&
        Objects.equals(this.robotId, automationTriggerPO.robotId) &&
        Objects.equals(this.triggerId, automationTriggerPO.triggerId) &&
        Objects.equals(this.triggerTypeId, automationTriggerPO.triggerTypeId);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(hashCodeNullable(input), hashCodeNullable(prevTriggerId), hashCodeNullable(resourceId), robotId, triggerId, triggerTypeId);
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
    sb.append("class AutomationTriggerPO {\n");
    sb.append("    input: ").append(toIndentedString(input)).append("\n");
    sb.append("    prevTriggerId: ").append(toIndentedString(prevTriggerId)).append("\n");
    sb.append("    resourceId: ").append(toIndentedString(resourceId)).append("\n");
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

}

