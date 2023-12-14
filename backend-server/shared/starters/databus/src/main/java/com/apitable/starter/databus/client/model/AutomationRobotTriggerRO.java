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
  private JsonNullable<String> input = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_IS_DELETED = "is_deleted";
  private JsonNullable<Boolean> isDeleted = JsonNullable.<Boolean>undefined();

  public static final String JSON_PROPERTY_LIMIT_COUNT = "limit_count";
  private JsonNullable<Long> limitCount = JsonNullable.<Long>undefined();

  public static final String JSON_PROPERTY_PREV_TRIGGER_ID = "prev_trigger_id";
  private JsonNullable<String> prevTriggerId = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_RESOURCE_ID = "resource_id";
  private JsonNullable<String> resourceId = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_TRIGGER_ID = "trigger_id";
  private JsonNullable<String> triggerId = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_TRIGGER_TYPE_ID = "trigger_type_id";
  private JsonNullable<String> triggerTypeId = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_USER_ID = "user_id";
  private Long userId;

  public AutomationRobotTriggerRO() {
  }

  public AutomationRobotTriggerRO input(String input) {
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


  public AutomationRobotTriggerRO isDeleted(Boolean isDeleted) {
    this.isDeleted = JsonNullable.<Boolean>of(isDeleted);
    
    return this;
  }

   /**
   * Get isDeleted
   * @return isDeleted
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public Boolean getIsDeleted() {
        return isDeleted.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_IS_DELETED)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Boolean> getIsDeleted_JsonNullable() {
    return isDeleted;
  }
  
  @JsonProperty(JSON_PROPERTY_IS_DELETED)
  public void setIsDeleted_JsonNullable(JsonNullable<Boolean> isDeleted) {
    this.isDeleted = isDeleted;
  }

  public void setIsDeleted(Boolean isDeleted) {
    this.isDeleted = JsonNullable.<Boolean>of(isDeleted);
  }


  public AutomationRobotTriggerRO limitCount(Long limitCount) {
    this.limitCount = JsonNullable.<Long>of(limitCount);
    
    return this;
  }

   /**
   * Get limitCount
   * @return limitCount
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public Long getLimitCount() {
        return limitCount.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_LIMIT_COUNT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Long> getLimitCount_JsonNullable() {
    return limitCount;
  }
  
  @JsonProperty(JSON_PROPERTY_LIMIT_COUNT)
  public void setLimitCount_JsonNullable(JsonNullable<Long> limitCount) {
    this.limitCount = limitCount;
  }

  public void setLimitCount(Long limitCount) {
    this.limitCount = JsonNullable.<Long>of(limitCount);
  }


  public AutomationRobotTriggerRO prevTriggerId(String prevTriggerId) {
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


  public AutomationRobotTriggerRO resourceId(String resourceId) {
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


  public AutomationRobotTriggerRO triggerId(String triggerId) {
    this.triggerId = JsonNullable.<String>of(triggerId);
    
    return this;
  }

   /**
   * Get triggerId
   * @return triggerId
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getTriggerId() {
        return triggerId.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_TRIGGER_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getTriggerId_JsonNullable() {
    return triggerId;
  }
  
  @JsonProperty(JSON_PROPERTY_TRIGGER_ID)
  public void setTriggerId_JsonNullable(JsonNullable<String> triggerId) {
    this.triggerId = triggerId;
  }

  public void setTriggerId(String triggerId) {
    this.triggerId = JsonNullable.<String>of(triggerId);
  }


  public AutomationRobotTriggerRO triggerTypeId(String triggerTypeId) {
    this.triggerTypeId = JsonNullable.<String>of(triggerTypeId);
    
    return this;
  }

   /**
   * Get triggerTypeId
   * @return triggerTypeId
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getTriggerTypeId() {
        return triggerTypeId.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_TRIGGER_TYPE_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getTriggerTypeId_JsonNullable() {
    return triggerTypeId;
  }
  
  @JsonProperty(JSON_PROPERTY_TRIGGER_TYPE_ID)
  public void setTriggerTypeId_JsonNullable(JsonNullable<String> triggerTypeId) {
    this.triggerTypeId = triggerTypeId;
  }

  public void setTriggerTypeId(String triggerTypeId) {
    this.triggerTypeId = JsonNullable.<String>of(triggerTypeId);
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
    return equalsNullable(this.input, automationRobotTriggerRO.input) &&
        equalsNullable(this.isDeleted, automationRobotTriggerRO.isDeleted) &&
        equalsNullable(this.limitCount, automationRobotTriggerRO.limitCount) &&
        equalsNullable(this.prevTriggerId, automationRobotTriggerRO.prevTriggerId) &&
        equalsNullable(this.resourceId, automationRobotTriggerRO.resourceId) &&
        equalsNullable(this.triggerId, automationRobotTriggerRO.triggerId) &&
        equalsNullable(this.triggerTypeId, automationRobotTriggerRO.triggerTypeId) &&
        Objects.equals(this.userId, automationRobotTriggerRO.userId);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(hashCodeNullable(input), hashCodeNullable(isDeleted), hashCodeNullable(limitCount), hashCodeNullable(prevTriggerId), hashCodeNullable(resourceId), hashCodeNullable(triggerId), hashCodeNullable(triggerTypeId), userId);
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

