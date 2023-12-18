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
 * AutomationRobotTriggerRO
 */
@JsonPropertyOrder({
  AutomationRobotTriggerRO.JSON_PROPERTY_INPUT,
  AutomationRobotTriggerRO.JSON_PROPERTY_IS_DELETED,
  AutomationRobotTriggerRO.JSON_PROPERTY_LIMIT_COUNT,
  AutomationRobotTriggerRO.JSON_PROPERTY_PREV_TRIGGER_ID,
  AutomationRobotTriggerRO.JSON_PROPERTY_RESOURCE_ID,
  AutomationRobotTriggerRO.JSON_PROPERTY_TRIGGER_ID,
  AutomationRobotTriggerRO.JSON_PROPERTY_TRIGGER_TYPE_ID,
  AutomationRobotTriggerRO.JSON_PROPERTY_USER_ID
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class AutomationRobotTriggerRO {
  public static final String JSON_PROPERTY_INPUT = "input";
  private String input;

  public static final String JSON_PROPERTY_IS_DELETED = "is_deleted";
  private Boolean isDeleted;

  public static final String JSON_PROPERTY_LIMIT_COUNT = "limit_count";
  private Long limitCount;

  public static final String JSON_PROPERTY_PREV_TRIGGER_ID = "prev_trigger_id";
  private String prevTriggerId;

  public static final String JSON_PROPERTY_RESOURCE_ID = "resource_id";
  private String resourceId;

  public static final String JSON_PROPERTY_TRIGGER_ID = "trigger_id";
  private String triggerId;

  public static final String JSON_PROPERTY_TRIGGER_TYPE_ID = "trigger_type_id";
  private String triggerTypeId;

  public static final String JSON_PROPERTY_USER_ID = "user_id";
  private Long userId;

  public AutomationRobotTriggerRO() {
  }

  public AutomationRobotTriggerRO input(String input) {
    
    this.input = input;
    return this;
  }

   /**
   * Get input
   * @return input
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_INPUT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getInput() {
    return input;
  }


  @JsonProperty(JSON_PROPERTY_INPUT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setInput(String input) {
    this.input = input;
  }


  public AutomationRobotTriggerRO isDeleted(Boolean isDeleted) {
    
    this.isDeleted = isDeleted;
    return this;
  }

   /**
   * Get isDeleted
   * @return isDeleted
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_IS_DELETED)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Boolean getIsDeleted() {
    return isDeleted;
  }


  @JsonProperty(JSON_PROPERTY_IS_DELETED)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setIsDeleted(Boolean isDeleted) {
    this.isDeleted = isDeleted;
  }


  public AutomationRobotTriggerRO limitCount(Long limitCount) {
    
    this.limitCount = limitCount;
    return this;
  }

   /**
   * Get limitCount
   * @return limitCount
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_LIMIT_COUNT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Long getLimitCount() {
    return limitCount;
  }


  @JsonProperty(JSON_PROPERTY_LIMIT_COUNT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setLimitCount(Long limitCount) {
    this.limitCount = limitCount;
  }


  public AutomationRobotTriggerRO prevTriggerId(String prevTriggerId) {
    
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


  public AutomationRobotTriggerRO resourceId(String resourceId) {
    
    this.resourceId = resourceId;
    return this;
  }

   /**
   * Get resourceId
   * @return resourceId
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_RESOURCE_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getResourceId() {
    return resourceId;
  }


  @JsonProperty(JSON_PROPERTY_RESOURCE_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setResourceId(String resourceId) {
    this.resourceId = resourceId;
  }


  public AutomationRobotTriggerRO triggerId(String triggerId) {
    
    this.triggerId = triggerId;
    return this;
  }

   /**
   * Get triggerId
   * @return triggerId
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_TRIGGER_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getTriggerId() {
    return triggerId;
  }


  @JsonProperty(JSON_PROPERTY_TRIGGER_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setTriggerId(String triggerId) {
    this.triggerId = triggerId;
  }


  public AutomationRobotTriggerRO triggerTypeId(String triggerTypeId) {
    
    this.triggerTypeId = triggerTypeId;
    return this;
  }

   /**
   * Get triggerTypeId
   * @return triggerTypeId
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_TRIGGER_TYPE_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getTriggerTypeId() {
    return triggerTypeId;
  }


  @JsonProperty(JSON_PROPERTY_TRIGGER_TYPE_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setTriggerTypeId(String triggerTypeId) {
    this.triggerTypeId = triggerTypeId;
  }


  public AutomationRobotTriggerRO userId(Long userId) {
    
    this.userId = userId;
    return this;
  }

   /**
   * Get userId
   * minimum: 0
   * @return userId
  **/
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_USER_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public Long getUserId() {
    return userId;
  }


  @JsonProperty(JSON_PROPERTY_USER_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setUserId(Long userId) {
    this.userId = userId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AutomationRobotTriggerRO automationRobotTriggerRO = (AutomationRobotTriggerRO) o;
    return Objects.equals(this.input, automationRobotTriggerRO.input) &&
        Objects.equals(this.isDeleted, automationRobotTriggerRO.isDeleted) &&
        Objects.equals(this.limitCount, automationRobotTriggerRO.limitCount) &&
        Objects.equals(this.prevTriggerId, automationRobotTriggerRO.prevTriggerId) &&
        Objects.equals(this.resourceId, automationRobotTriggerRO.resourceId) &&
        Objects.equals(this.triggerId, automationRobotTriggerRO.triggerId) &&
        Objects.equals(this.triggerTypeId, automationRobotTriggerRO.triggerTypeId) &&
        Objects.equals(this.userId, automationRobotTriggerRO.userId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(input, isDeleted, limitCount, prevTriggerId, resourceId, triggerId, triggerTypeId, userId);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class AutomationRobotTriggerRO {\n");
    sb.append("    input: ").append(toIndentedString(input)).append("\n");
    sb.append("    isDeleted: ").append(toIndentedString(isDeleted)).append("\n");
    sb.append("    limitCount: ").append(toIndentedString(limitCount)).append("\n");
    sb.append("    prevTriggerId: ").append(toIndentedString(prevTriggerId)).append("\n");
    sb.append("    resourceId: ").append(toIndentedString(resourceId)).append("\n");
    sb.append("    triggerId: ").append(toIndentedString(triggerId)).append("\n");
    sb.append("    triggerTypeId: ").append(toIndentedString(triggerTypeId)).append("\n");
    sb.append("    userId: ").append(toIndentedString(userId)).append("\n");
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

