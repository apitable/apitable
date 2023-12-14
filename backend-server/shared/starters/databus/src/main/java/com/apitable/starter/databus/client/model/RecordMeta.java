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
import com.apitable.starter.databus.client.model.FieldExtraMapValue;
import com.apitable.starter.databus.client.model.FieldUpdatedValue;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.HashMap;
import java.util.Map;
import org.openapitools.jackson.nullable.JsonNullable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.openapitools.jackson.nullable.JsonNullable;
import java.util.NoSuchElementException;
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
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class RecordMeta {
  public static final String JSON_PROPERTY_CREATED_AT = "createdAt";
  private JsonNullable<Long> createdAt = JsonNullable.<Long>undefined();

  public static final String JSON_PROPERTY_CREATED_BY = "createdBy";
  private JsonNullable<String> createdBy = JsonNullable.<String>undefined();

  public static final String JSON_PROPERTY_FIELD_EXTRA_MAP = "fieldExtraMap";
  private JsonNullable<Map<String, FieldExtraMapValue>> fieldExtraMap = JsonNullable.<Map<String, FieldExtraMapValue>>undefined();

  public static final String JSON_PROPERTY_FIELD_UPDATED_MAP = "fieldUpdatedMap";
  private JsonNullable<Map<String, FieldUpdatedValue>> fieldUpdatedMap = JsonNullable.<Map<String, FieldUpdatedValue>>undefined();

  public static final String JSON_PROPERTY_UPDATED_AT = "updatedAt";
  private JsonNullable<Long> updatedAt = JsonNullable.<Long>undefined();

  public static final String JSON_PROPERTY_UPDATED_BY = "updatedBy";
  private JsonNullable<String> updatedBy = JsonNullable.<String>undefined();

  public RecordMeta() {
  }

  public RecordMeta createdAt(Long createdAt) {
    this.createdAt = JsonNullable.<Long>of(createdAt);
    
    return this;
  }

   /**
   * Get createdAt
   * minimum: 0
   * @return createdAt
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public Long getCreatedAt() {
        return createdAt.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_CREATED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Long> getCreatedAt_JsonNullable() {
    return createdAt;
  }
  
  @JsonProperty(JSON_PROPERTY_CREATED_AT)
  public void setCreatedAt_JsonNullable(JsonNullable<Long> createdAt) {
    this.createdAt = createdAt;
  }

  public void setCreatedAt(Long createdAt) {
    this.createdAt = JsonNullable.<Long>of(createdAt);
  }


  public RecordMeta createdBy(String createdBy) {
    this.createdBy = JsonNullable.<String>of(createdBy);
    
    return this;
  }

   /**
   * Get createdBy
   * @return createdBy
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getCreatedBy() {
        return createdBy.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_CREATED_BY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getCreatedBy_JsonNullable() {
    return createdBy;
  }
  
  @JsonProperty(JSON_PROPERTY_CREATED_BY)
  public void setCreatedBy_JsonNullable(JsonNullable<String> createdBy) {
    this.createdBy = createdBy;
  }

  public void setCreatedBy(String createdBy) {
    this.createdBy = JsonNullable.<String>of(createdBy);
  }


  public RecordMeta fieldExtraMap(Map<String, FieldExtraMapValue> fieldExtraMap) {
    this.fieldExtraMap = JsonNullable.<Map<String, FieldExtraMapValue>>of(fieldExtraMap);
    
    return this;
  }

  public RecordMeta putFieldExtraMapItem(String key, FieldExtraMapValue fieldExtraMapItem) {
    if (this.fieldExtraMap == null || !this.fieldExtraMap.isPresent()) {
      this.fieldExtraMap = JsonNullable.<Map<String, FieldExtraMapValue>>of(new HashMap<>());
    }
    try {
      this.fieldExtraMap.get().put(key, fieldExtraMapItem);
    } catch (java.util.NoSuchElementException e) {
      // this can never happen, as we make sure above that the value is present
    }
    return this;
  }

   /**
   * Get fieldExtraMap
   * @return fieldExtraMap
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public Map<String, FieldExtraMapValue> getFieldExtraMap() {
        return fieldExtraMap.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_FIELD_EXTRA_MAP)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Map<String, FieldExtraMapValue>> getFieldExtraMap_JsonNullable() {
    return fieldExtraMap;
  }
  
  @JsonProperty(JSON_PROPERTY_FIELD_EXTRA_MAP)
  public void setFieldExtraMap_JsonNullable(JsonNullable<Map<String, FieldExtraMapValue>> fieldExtraMap) {
    this.fieldExtraMap = fieldExtraMap;
  }

  public void setFieldExtraMap(Map<String, FieldExtraMapValue> fieldExtraMap) {
    this.fieldExtraMap = JsonNullable.<Map<String, FieldExtraMapValue>>of(fieldExtraMap);
  }


  public RecordMeta fieldUpdatedMap(Map<String, FieldUpdatedValue> fieldUpdatedMap) {
    this.fieldUpdatedMap = JsonNullable.<Map<String, FieldUpdatedValue>>of(fieldUpdatedMap);
    
    return this;
  }

  public RecordMeta putFieldUpdatedMapItem(String key, FieldUpdatedValue fieldUpdatedMapItem) {
    if (this.fieldUpdatedMap == null || !this.fieldUpdatedMap.isPresent()) {
      this.fieldUpdatedMap = JsonNullable.<Map<String, FieldUpdatedValue>>of(new HashMap<>());
    }
    try {
      this.fieldUpdatedMap.get().put(key, fieldUpdatedMapItem);
    } catch (java.util.NoSuchElementException e) {
      // this can never happen, as we make sure above that the value is present
    }
    return this;
  }

   /**
   * Get fieldUpdatedMap
   * @return fieldUpdatedMap
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public Map<String, FieldUpdatedValue> getFieldUpdatedMap() {
        return fieldUpdatedMap.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_FIELD_UPDATED_MAP)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Map<String, FieldUpdatedValue>> getFieldUpdatedMap_JsonNullable() {
    return fieldUpdatedMap;
  }
  
  @JsonProperty(JSON_PROPERTY_FIELD_UPDATED_MAP)
  public void setFieldUpdatedMap_JsonNullable(JsonNullable<Map<String, FieldUpdatedValue>> fieldUpdatedMap) {
    this.fieldUpdatedMap = fieldUpdatedMap;
  }

  public void setFieldUpdatedMap(Map<String, FieldUpdatedValue> fieldUpdatedMap) {
    this.fieldUpdatedMap = JsonNullable.<Map<String, FieldUpdatedValue>>of(fieldUpdatedMap);
  }


  public RecordMeta updatedAt(Long updatedAt) {
    this.updatedAt = JsonNullable.<Long>of(updatedAt);
    
    return this;
  }

   /**
   * Get updatedAt
   * minimum: 0
   * @return updatedAt
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public Long getUpdatedAt() {
        return updatedAt.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_UPDATED_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Long> getUpdatedAt_JsonNullable() {
    return updatedAt;
  }
  
  @JsonProperty(JSON_PROPERTY_UPDATED_AT)
  public void setUpdatedAt_JsonNullable(JsonNullable<Long> updatedAt) {
    this.updatedAt = updatedAt;
  }

  public void setUpdatedAt(Long updatedAt) {
    this.updatedAt = JsonNullable.<Long>of(updatedAt);
  }


  public RecordMeta updatedBy(String updatedBy) {
    this.updatedBy = JsonNullable.<String>of(updatedBy);
    
    return this;
  }

   /**
   * Get updatedBy
   * @return updatedBy
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getUpdatedBy() {
        return updatedBy.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_UPDATED_BY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getUpdatedBy_JsonNullable() {
    return updatedBy;
  }
  
  @JsonProperty(JSON_PROPERTY_UPDATED_BY)
  public void setUpdatedBy_JsonNullable(JsonNullable<String> updatedBy) {
    this.updatedBy = updatedBy;
  }

  public void setUpdatedBy(String updatedBy) {
    this.updatedBy = JsonNullable.<String>of(updatedBy);
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
    return equalsNullable(this.createdAt, recordMeta.createdAt) &&
        equalsNullable(this.createdBy, recordMeta.createdBy) &&
        equalsNullable(this.fieldExtraMap, recordMeta.fieldExtraMap) &&
        equalsNullable(this.fieldUpdatedMap, recordMeta.fieldUpdatedMap) &&
        equalsNullable(this.updatedAt, recordMeta.updatedAt) &&
        equalsNullable(this.updatedBy, recordMeta.updatedBy);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(hashCodeNullable(createdAt), hashCodeNullable(createdBy), hashCodeNullable(fieldExtraMap), hashCodeNullable(fieldUpdatedMap), hashCodeNullable(updatedAt), hashCodeNullable(updatedBy));
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

