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
import com.apitable.starter.databus.client.model.FieldExtraMapValue;
import com.apitable.starter.databus.client.model.FieldUpdatedValue;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

/**
 * RecordMeta
 */
@JsonPropertyOrder({
  RecordMeta.JSON_PROPERTY_CREATED_AT,
  RecordMeta.JSON_PROPERTY_CREATED_BY,
  RecordMeta.JSON_PROPERTY_FIELD_EXTRA_MAP,
  RecordMeta.JSON_PROPERTY_FIELD_UPDATED_MAP,
  RecordMeta.JSON_PROPERTY_UPDATED_AT,
  RecordMeta.JSON_PROPERTY_UPDATED_BY
})
@jakarta.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class RecordMeta {
  public static final String JSON_PROPERTY_CREATED_AT = "createdAt";
  private Long createdAt;

  public static final String JSON_PROPERTY_CREATED_BY = "createdBy";
  private String createdBy;

  public static final String JSON_PROPERTY_FIELD_EXTRA_MAP = "fieldExtraMap";
  private Map<String, FieldExtraMapValue> fieldExtraMap;

  public static final String JSON_PROPERTY_FIELD_UPDATED_MAP = "fieldUpdatedMap";
  private Map<String, FieldUpdatedValue> fieldUpdatedMap;

  public static final String JSON_PROPERTY_UPDATED_AT = "updatedAt";
  private Long updatedAt;

  public static final String JSON_PROPERTY_UPDATED_BY = "updatedBy";
  private String updatedBy;

  public RecordMeta() {
  }

  public RecordMeta createdAt(Long createdAt) {
    
    this.createdAt = createdAt;
    return this;
  }

   /**
   * Get createdAt
   * minimum: 0
   * @return createdAt
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_CREATED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Long getCreatedAt() {
    return createdAt;
  }


  @JsonProperty(JSON_PROPERTY_CREATED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setCreatedAt(Long createdAt) {
    this.createdAt = createdAt;
  }


  public RecordMeta createdBy(String createdBy) {
    
    this.createdBy = createdBy;
    return this;
  }

   /**
   * Get createdBy
   * @return createdBy
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_CREATED_BY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getCreatedBy() {
    return createdBy;
  }


  @JsonProperty(JSON_PROPERTY_CREATED_BY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
  }


  public RecordMeta fieldExtraMap(Map<String, FieldExtraMapValue> fieldExtraMap) {
    
    this.fieldExtraMap = fieldExtraMap;
    return this;
  }

  public RecordMeta putFieldExtraMapItem(String key, FieldExtraMapValue fieldExtraMapItem) {
    if (this.fieldExtraMap == null) {
      this.fieldExtraMap = new HashMap<>();
    }
    this.fieldExtraMap.put(key, fieldExtraMapItem);
    return this;
  }

   /**
   * Get fieldExtraMap
   * @return fieldExtraMap
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_FIELD_EXTRA_MAP)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Map<String, FieldExtraMapValue> getFieldExtraMap() {
    return fieldExtraMap;
  }


  @JsonProperty(JSON_PROPERTY_FIELD_EXTRA_MAP)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setFieldExtraMap(Map<String, FieldExtraMapValue> fieldExtraMap) {
    this.fieldExtraMap = fieldExtraMap;
  }


  public RecordMeta fieldUpdatedMap(Map<String, FieldUpdatedValue> fieldUpdatedMap) {
    
    this.fieldUpdatedMap = fieldUpdatedMap;
    return this;
  }

  public RecordMeta putFieldUpdatedMapItem(String key, FieldUpdatedValue fieldUpdatedMapItem) {
    if (this.fieldUpdatedMap == null) {
      this.fieldUpdatedMap = new HashMap<>();
    }
    this.fieldUpdatedMap.put(key, fieldUpdatedMapItem);
    return this;
  }

   /**
   * Get fieldUpdatedMap
   * @return fieldUpdatedMap
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_FIELD_UPDATED_MAP)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Map<String, FieldUpdatedValue> getFieldUpdatedMap() {
    return fieldUpdatedMap;
  }


  @JsonProperty(JSON_PROPERTY_FIELD_UPDATED_MAP)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setFieldUpdatedMap(Map<String, FieldUpdatedValue> fieldUpdatedMap) {
    this.fieldUpdatedMap = fieldUpdatedMap;
  }


  public RecordMeta updatedAt(Long updatedAt) {
    
    this.updatedAt = updatedAt;
    return this;
  }

   /**
   * Get updatedAt
   * minimum: 0
   * @return updatedAt
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_UPDATED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Long getUpdatedAt() {
    return updatedAt;
  }


  @JsonProperty(JSON_PROPERTY_UPDATED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setUpdatedAt(Long updatedAt) {
    this.updatedAt = updatedAt;
  }


  public RecordMeta updatedBy(String updatedBy) {
    
    this.updatedBy = updatedBy;
    return this;
  }

   /**
   * Get updatedBy
   * @return updatedBy
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_UPDATED_BY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getUpdatedBy() {
    return updatedBy;
  }


  @JsonProperty(JSON_PROPERTY_UPDATED_BY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setUpdatedBy(String updatedBy) {
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
    RecordMeta recordMeta = (RecordMeta) o;
    return Objects.equals(this.createdAt, recordMeta.createdAt) &&
        Objects.equals(this.createdBy, recordMeta.createdBy) &&
        Objects.equals(this.fieldExtraMap, recordMeta.fieldExtraMap) &&
        Objects.equals(this.fieldUpdatedMap, recordMeta.fieldUpdatedMap) &&
        Objects.equals(this.updatedAt, recordMeta.updatedAt) &&
        Objects.equals(this.updatedBy, recordMeta.updatedBy);
  }

  @Override
  public int hashCode() {
    return Objects.hash(createdAt, createdBy, fieldExtraMap, fieldUpdatedMap, updatedAt, updatedBy);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class RecordMeta {\n");
    sb.append("    createdAt: ").append(toIndentedString(createdAt)).append("\n");
    sb.append("    createdBy: ").append(toIndentedString(createdBy)).append("\n");
    sb.append("    fieldExtraMap: ").append(toIndentedString(fieldExtraMap)).append("\n");
    sb.append("    fieldUpdatedMap: ").append(toIndentedString(fieldUpdatedMap)).append("\n");
    sb.append("    updatedAt: ").append(toIndentedString(updatedAt)).append("\n");
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

