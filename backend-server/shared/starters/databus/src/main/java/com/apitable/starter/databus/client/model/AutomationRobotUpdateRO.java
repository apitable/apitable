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
 * AutomationRobotUpdateRO
 */
@JsonPropertyOrder({
  AutomationRobotUpdateRO.JSON_PROPERTY_DESCRIPTION,
  AutomationRobotUpdateRO.JSON_PROPERTY_IS_ACTIVE,
  AutomationRobotUpdateRO.JSON_PROPERTY_IS_DELETED,
  AutomationRobotUpdateRO.JSON_PROPERTY_NAME,
  AutomationRobotUpdateRO.JSON_PROPERTY_PROPS,
  AutomationRobotUpdateRO.JSON_PROPERTY_UPDATED_BY
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class AutomationRobotUpdateRO {
  public static final String JSON_PROPERTY_DESCRIPTION = "description";
  private JsonNullable<String> description = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_IS_ACTIVE = "is_active";
  private JsonNullable<Boolean> isActive = JsonNullable.<Boolean>undefined();

  public static final String JSON_PROPERTY_IS_DELETED = "is_deleted";
  private JsonNullable<Boolean> isDeleted = JsonNullable.<Boolean>undefined();

  public static final String JSON_PROPERTY_NAME = "name";
  private JsonNullable<String> name = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_PROPS = "props";
  private JsonNullable<String> props = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_UPDATED_BY = "updated_by";
  private Long updatedBy;

  public AutomationRobotUpdateRO() {
  }

  public AutomationRobotUpdateRO description(String description) {
    this.description = JsonNullable.<String>of(description);
    
    return this;
  }

   /**
   * Get description
   * @return description
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getDescription() {
        return description.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_DESCRIPTION)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getDescription_JsonNullable() {
    return description;
  }
  
  @JsonProperty(JSON_PROPERTY_DESCRIPTION)
  public void setDescription_JsonNullable(JsonNullable<String> description) {
    this.description = description;
  }

  public void setDescription(String description) {
    this.description = JsonNullable.<String>of(description);
  }


  public AutomationRobotUpdateRO isActive(Boolean isActive) {
    this.isActive = JsonNullable.<Boolean>of(isActive);
    
    return this;
  }

   /**
   * Get isActive
   * @return isActive
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public Boolean getIsActive() {
        return isActive.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_IS_ACTIVE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Boolean> getIsActive_JsonNullable() {
    return isActive;
  }
  
  @JsonProperty(JSON_PROPERTY_IS_ACTIVE)
  public void setIsActive_JsonNullable(JsonNullable<Boolean> isActive) {
    this.isActive = isActive;
  }

  public void setIsActive(Boolean isActive) {
    this.isActive = JsonNullable.<Boolean>of(isActive);
  }


  public AutomationRobotUpdateRO isDeleted(Boolean isDeleted) {
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


  public AutomationRobotUpdateRO name(String name) {
    this.name = JsonNullable.<String>of(name);
    
    return this;
  }

   /**
   * Get name
   * @return name
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getName() {
        return name.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_NAME)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getName_JsonNullable() {
    return name;
  }
  
  @JsonProperty(JSON_PROPERTY_NAME)
  public void setName_JsonNullable(JsonNullable<String> name) {
    this.name = name;
  }

  public void setName(String name) {
    this.name = JsonNullable.<String>of(name);
  }


  public AutomationRobotUpdateRO props(String props) {
    this.props = JsonNullable.<String>of(props);
    
    return this;
  }

   /**
   * Get props
   * @return props
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getProps() {
        return props.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_PROPS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getProps_JsonNullable() {
    return props;
  }
  
  @JsonProperty(JSON_PROPERTY_PROPS)
  public void setProps_JsonNullable(JsonNullable<String> props) {
    this.props = props;
  }

  public void setProps(String props) {
    this.props = JsonNullable.<String>of(props);
  }


  public AutomationRobotUpdateRO updatedBy(Long updatedBy) {
    
    this.updatedBy = updatedBy;
    return this;
  }

   /**
   * Get updatedBy
   * minimum: 0
   * @return updatedBy
  **/
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_UPDATED_BY)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public Long getUpdatedBy() {
    return updatedBy;
  }


  @JsonProperty(JSON_PROPERTY_UPDATED_BY)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setUpdatedBy(Long updatedBy) {
    this.updatedBy = updatedBy;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AutomationRobotUpdateRO automationRobotUpdateRO = (AutomationRobotUpdateRO) o;
    return equalsNullable(this.description, automationRobotUpdateRO.description) &&
        equalsNullable(this.isActive, automationRobotUpdateRO.isActive) &&
        equalsNullable(this.isDeleted, automationRobotUpdateRO.isDeleted) &&
        equalsNullable(this.name, automationRobotUpdateRO.name) &&
        equalsNullable(this.props, automationRobotUpdateRO.props) &&
        Objects.equals(this.updatedBy, automationRobotUpdateRO.updatedBy);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(hashCodeNullable(description), hashCodeNullable(isActive), hashCodeNullable(isDeleted), hashCodeNullable(name), hashCodeNullable(props), updatedBy);
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
    sb.append("class AutomationRobotUpdateRO {\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
    sb.append("    isDeleted: ").append(toIndentedString(isDeleted)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    props: ").append(toIndentedString(props)).append("\n");
    sb.append("    updatedBy: ").append(toIndentedString(updatedBy)).append("\n");
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

