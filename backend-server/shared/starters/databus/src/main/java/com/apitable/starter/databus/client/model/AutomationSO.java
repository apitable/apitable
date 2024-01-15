/*
 * databus-server
 * databus-server APIs
 *
 * The version of the OpenAPI document: 1.8.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


package com.apitable.starter.databus.client.model;

import java.util.Objects;
import java.util.Arrays;
import com.apitable.starter.databus.client.model.AutomationActionPO;
import com.apitable.starter.databus.client.model.AutomationRobotSO;
import com.apitable.starter.databus.client.model.AutomationTriggerPO;
import com.apitable.starter.databus.client.model.NodeSimplePO;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

/**
 * AutomationSO
 */
@JsonPropertyOrder({
  AutomationSO.JSON_PROPERTY_ACTIONS,
  AutomationSO.JSON_PROPERTY_RELATED_RESOURCES,
  AutomationSO.JSON_PROPERTY_ROBOT,
  AutomationSO.JSON_PROPERTY_TRIGGERS
})
@jakarta.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class AutomationSO {
  public static final String JSON_PROPERTY_ACTIONS = "actions";
  private List<AutomationActionPO> actions = new ArrayList<>();

  public static final String JSON_PROPERTY_RELATED_RESOURCES = "relatedResources";
  private List<NodeSimplePO> relatedResources;

  public static final String JSON_PROPERTY_ROBOT = "robot";
  private AutomationRobotSO robot;

  public static final String JSON_PROPERTY_TRIGGERS = "triggers";
  private List<AutomationTriggerPO> triggers = new ArrayList<>();

  public AutomationSO() {
  }

  public AutomationSO actions(List<AutomationActionPO> actions) {
    
    this.actions = actions;
    return this;
  }

  public AutomationSO addActionsItem(AutomationActionPO actionsItem) {
    if (this.actions == null) {
      this.actions = new ArrayList<>();
    }
    this.actions.add(actionsItem);
    return this;
  }

   /**
   * Get actions
   * @return actions
  **/
  @jakarta.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_ACTIONS)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public List<AutomationActionPO> getActions() {
    return actions;
  }


  @JsonProperty(JSON_PROPERTY_ACTIONS)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setActions(List<AutomationActionPO> actions) {
    this.actions = actions;
  }


  public AutomationSO relatedResources(List<NodeSimplePO> relatedResources) {
    
    this.relatedResources = relatedResources;
    return this;
  }

  public AutomationSO addRelatedResourcesItem(NodeSimplePO relatedResourcesItem) {
    if (this.relatedResources == null) {
      this.relatedResources = new ArrayList<>();
    }
    this.relatedResources.add(relatedResourcesItem);
    return this;
  }

   /**
   * Get relatedResources
   * @return relatedResources
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_RELATED_RESOURCES)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public List<NodeSimplePO> getRelatedResources() {
    return relatedResources;
  }


  @JsonProperty(JSON_PROPERTY_RELATED_RESOURCES)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setRelatedResources(List<NodeSimplePO> relatedResources) {
    this.relatedResources = relatedResources;
  }


  public AutomationSO robot(AutomationRobotSO robot) {
    
    this.robot = robot;
    return this;
  }

   /**
   * Get robot
   * @return robot
  **/
  @jakarta.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_ROBOT)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public AutomationRobotSO getRobot() {
    return robot;
  }


  @JsonProperty(JSON_PROPERTY_ROBOT)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setRobot(AutomationRobotSO robot) {
    this.robot = robot;
  }


  public AutomationSO triggers(List<AutomationTriggerPO> triggers) {
    
    this.triggers = triggers;
    return this;
  }

  public AutomationSO addTriggersItem(AutomationTriggerPO triggersItem) {
    if (this.triggers == null) {
      this.triggers = new ArrayList<>();
    }
    this.triggers.add(triggersItem);
    return this;
  }

   /**
   * Get triggers
   * @return triggers
  **/
  @jakarta.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_TRIGGERS)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public List<AutomationTriggerPO> getTriggers() {
    return triggers;
  }


  @JsonProperty(JSON_PROPERTY_TRIGGERS)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setTriggers(List<AutomationTriggerPO> triggers) {
    this.triggers = triggers;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AutomationSO automationSO = (AutomationSO) o;
    return Objects.equals(this.actions, automationSO.actions) &&
        Objects.equals(this.relatedResources, automationSO.relatedResources) &&
        Objects.equals(this.robot, automationSO.robot) &&
        Objects.equals(this.triggers, automationSO.triggers);
  }

  @Override
  public int hashCode() {
    return Objects.hash(actions, relatedResources, robot, triggers);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class AutomationSO {\n");
    sb.append("    actions: ").append(toIndentedString(actions)).append("\n");
    sb.append("    relatedResources: ").append(toIndentedString(relatedResources)).append("\n");
    sb.append("    robot: ").append(toIndentedString(robot)).append("\n");
    sb.append("    triggers: ").append(toIndentedString(triggers)).append("\n");
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

