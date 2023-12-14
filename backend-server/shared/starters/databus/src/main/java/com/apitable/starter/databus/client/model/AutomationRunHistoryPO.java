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
 * AutomationRunHistoryPO
 */
@JsonPropertyOrder({
  AutomationRunHistoryPO.JSON_PROPERTY_ACTION_IDS,
  AutomationRunHistoryPO.JSON_PROPERTY_ACTION_TYPE_IDS,
  AutomationRunHistoryPO.JSON_PROPERTY_CREATED_AT,
  AutomationRunHistoryPO.JSON_PROPERTY_ERROR_STACKS,
  AutomationRunHistoryPO.JSON_PROPERTY_ROBOT_ID,
  AutomationRunHistoryPO.JSON_PROPERTY_STATUS,
  AutomationRunHistoryPO.JSON_PROPERTY_TASK_ID
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class AutomationRunHistoryPO {
  public static final String JSON_PROPERTY_ACTION_IDS = "actionIds";
  private JsonNullable<String> actionIds = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_ACTION_TYPE_IDS = "actionTypeIds";
  private JsonNullable<String> actionTypeIds = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_CREATED_AT = "createdAt";
  private String createdAt;

  public static final String JSON_PROPERTY_ERROR_STACKS = "errorStacks";
  private JsonNullable<String> errorStacks = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_ROBOT_ID = "robotId";
  private String robotId;

  public static final String JSON_PROPERTY_STATUS = "status";
  private Integer status;

  public static final String JSON_PROPERTY_TASK_ID = "taskId";
  private String taskId;

  public AutomationRunHistoryPO() {
  }

  public AutomationRunHistoryPO actionIds(String actionIds) {
    this.actionIds = JsonNullable.<String>of(actionIds);
    
    return this;
  }

   /**
   * Get actionIds
   * @return actionIds
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getActionIds() {
        return actionIds.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_ACTION_IDS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getActionIds_JsonNullable() {
    return actionIds;
  }
  
  @JsonProperty(JSON_PROPERTY_ACTION_IDS)
  public void setActionIds_JsonNullable(JsonNullable<String> actionIds) {
    this.actionIds = actionIds;
  }

  public void setActionIds(String actionIds) {
    this.actionIds = JsonNullable.<String>of(actionIds);
  }


  public AutomationRunHistoryPO actionTypeIds(String actionTypeIds) {
    this.actionTypeIds = JsonNullable.<String>of(actionTypeIds);
    
    return this;
  }

   /**
   * Get actionTypeIds
   * @return actionTypeIds
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getActionTypeIds() {
        return actionTypeIds.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_ACTION_TYPE_IDS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getActionTypeIds_JsonNullable() {
    return actionTypeIds;
  }
  
  @JsonProperty(JSON_PROPERTY_ACTION_TYPE_IDS)
  public void setActionTypeIds_JsonNullable(JsonNullable<String> actionTypeIds) {
    this.actionTypeIds = actionTypeIds;
  }

  public void setActionTypeIds(String actionTypeIds) {
    this.actionTypeIds = JsonNullable.<String>of(actionTypeIds);
  }


  public AutomationRunHistoryPO createdAt(String createdAt) {
    
    this.createdAt = createdAt;
    return this;
  }

   /**
   * Get createdAt
   * @return createdAt
  **/
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_CREATED_AT)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public String getCreatedAt() {
    return createdAt;
  }


  @JsonProperty(JSON_PROPERTY_CREATED_AT)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setCreatedAt(String createdAt) {
    this.createdAt = createdAt;
  }


  public AutomationRunHistoryPO errorStacks(String errorStacks) {
    this.errorStacks = JsonNullable.<String>of(errorStacks);
    
    return this;
  }

   /**
   * Get errorStacks
   * @return errorStacks
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getErrorStacks() {
        return errorStacks.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_ERROR_STACKS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getErrorStacks_JsonNullable() {
    return errorStacks;
  }
  
  @JsonProperty(JSON_PROPERTY_ERROR_STACKS)
  public void setErrorStacks_JsonNullable(JsonNullable<String> errorStacks) {
    this.errorStacks = errorStacks;
  }

  public void setErrorStacks(String errorStacks) {
    this.errorStacks = JsonNullable.<String>of(errorStacks);
  }


  public AutomationRunHistoryPO robotId(String robotId) {
    
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


  public AutomationRunHistoryPO status(Integer status) {
    
    this.status = status;
    return this;
  }

   /**
   * Get status
   * minimum: 0
   * @return status
  **/
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_STATUS)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public Integer getStatus() {
    return status;
  }


  @JsonProperty(JSON_PROPERTY_STATUS)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setStatus(Integer status) {
    this.status = status;
  }


  public AutomationRunHistoryPO taskId(String taskId) {
    
    this.taskId = taskId;
    return this;
  }

   /**
   * Get taskId
   * @return taskId
  **/
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_TASK_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public String getTaskId() {
    return taskId;
  }


  @JsonProperty(JSON_PROPERTY_TASK_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setTaskId(String taskId) {
    this.taskId = taskId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AutomationRunHistoryPO automationRunHistoryPO = (AutomationRunHistoryPO) o;
    return equalsNullable(this.actionIds, automationRunHistoryPO.actionIds) &&
        equalsNullable(this.actionTypeIds, automationRunHistoryPO.actionTypeIds) &&
        Objects.equals(this.createdAt, automationRunHistoryPO.createdAt) &&
        equalsNullable(this.errorStacks, automationRunHistoryPO.errorStacks) &&
        Objects.equals(this.robotId, automationRunHistoryPO.robotId) &&
        Objects.equals(this.status, automationRunHistoryPO.status) &&
        Objects.equals(this.taskId, automationRunHistoryPO.taskId);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(hashCodeNullable(actionIds), hashCodeNullable(actionTypeIds), createdAt, hashCodeNullable(errorStacks), robotId, status, taskId);
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
    sb.append("class AutomationRunHistoryPO {\n");
    sb.append("    actionIds: ").append(toIndentedString(actionIds)).append("\n");
    sb.append("    actionTypeIds: ").append(toIndentedString(actionTypeIds)).append("\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
    sb.append("    errorStacks: ").append(toIndentedString(errorStacks)).append("\n");
    sb.append("    robotId: ").append(toIndentedString(robotId)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    taskId: ").append(toIndentedString(taskId)).append("\n");
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

