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
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

/**
 * AutomationTriggerIntroductionPO
 */
@JsonPropertyOrder({
  AutomationTriggerIntroductionPO.JSON_PROPERTY_PREV_TRIGGER_ID,
  AutomationTriggerIntroductionPO.JSON_PROPERTY_ROBOT_ID,
  AutomationTriggerIntroductionPO.JSON_PROPERTY_TRIGGER_ID,
  AutomationTriggerIntroductionPO.JSON_PROPERTY_TRIGGER_TYPE_ID
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class AutomationTriggerIntroductionPO {
  public static final String JSON_PROPERTY_PREV_TRIGGER_ID = "prevTriggerId";
  private String prevTriggerId;

  public static final String JSON_PROPERTY_ROBOT_ID = "robotId";
  private String robotId;

  public static final String JSON_PROPERTY_TRIGGER_ID = "triggerId";
  private String triggerId;

  public static final String JSON_PROPERTY_TRIGGER_TYPE_ID = "triggerTypeId";
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
  @JsonProperty(JSON_PROPERTY_PREV_TRIGGER_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getPrevTriggerId() {
    return prevTriggerId;
  }


  @JsonProperty(JSON_PROPERTY_PREV_TRIGGER_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
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


  public AutomationTriggerIntroductionPO triggerId(String triggerId) {
    
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


  public AutomationTriggerIntroductionPO triggerTypeId(String triggerTypeId) {
    
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
    AutomationTriggerIntroductionPO automationTriggerIntroductionPO = (AutomationTriggerIntroductionPO) o;
    return Objects.equals(this.prevTriggerId, automationTriggerIntroductionPO.prevTriggerId) &&
        Objects.equals(this.robotId, automationTriggerIntroductionPO.robotId) &&
        Objects.equals(this.triggerId, automationTriggerIntroductionPO.triggerId) &&
        Objects.equals(this.triggerTypeId, automationTriggerIntroductionPO.triggerTypeId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(prevTriggerId, robotId, triggerId, triggerTypeId);
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

}

