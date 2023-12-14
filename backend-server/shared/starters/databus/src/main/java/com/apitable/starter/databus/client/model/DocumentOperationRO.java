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
import java.io.File;
import org.openapitools.jackson.nullable.JsonNullable;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.openapitools.jackson.nullable.JsonNullable;
import java.util.NoSuchElementException;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

/**
 * DocumentOperationRO
 */
@JsonPropertyOrder({
  DocumentOperationRO.JSON_PROPERTY_CREATED_BY,
  DocumentOperationRO.JSON_PROPERTY_SPACE_ID,
  DocumentOperationRO.JSON_PROPERTY_UPDATE_DATA
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class DocumentOperationRO {
  public static final String JSON_PROPERTY_CREATED_BY = "created_by";
  private JsonNullable<Long> createdBy = JsonNullable.<Long>undefined();

  public static final String JSON_PROPERTY_SPACE_ID = "space_id";
  private String spaceId;

  public static final String JSON_PROPERTY_UPDATE_DATA = "update_data";
  private File updateData;

  public DocumentOperationRO() {
  }

  public DocumentOperationRO createdBy(Long createdBy) {
    this.createdBy = JsonNullable.<Long>of(createdBy);
    
    return this;
  }

   /**
   * Get createdBy
   * minimum: 0
   * @return createdBy
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public Long getCreatedBy() {
        return createdBy.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_CREATED_BY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Long> getCreatedBy_JsonNullable() {
    return createdBy;
  }
  
  @JsonProperty(JSON_PROPERTY_CREATED_BY)
  public void setCreatedBy_JsonNullable(JsonNullable<Long> createdBy) {
    this.createdBy = createdBy;
  }

  public void setCreatedBy(Long createdBy) {
    this.createdBy = JsonNullable.<Long>of(createdBy);
  }


  public DocumentOperationRO spaceId(String spaceId) {
    
    this.spaceId = spaceId;
    return this;
  }

   /**
   * Get spaceId
   * @return spaceId
  **/
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_SPACE_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public String getSpaceId() {
    return spaceId;
  }


  @JsonProperty(JSON_PROPERTY_SPACE_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setSpaceId(String spaceId) {
    this.spaceId = spaceId;
  }


  public DocumentOperationRO updateData(File updateData) {
    
    this.updateData = updateData;
    return this;
  }

   /**
   * Get updateData
   * @return updateData
  **/
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_UPDATE_DATA)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public File getUpdateData() {
    return updateData;
  }


  @JsonProperty(JSON_PROPERTY_UPDATE_DATA)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setUpdateData(File updateData) {
    this.updateData = updateData;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    DocumentOperationRO documentOperationRO = (DocumentOperationRO) o;
    return equalsNullable(this.createdBy, documentOperationRO.createdBy) &&
        Objects.equals(this.spaceId, documentOperationRO.spaceId) &&
        Objects.equals(this.updateData, documentOperationRO.updateData);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(hashCodeNullable(createdBy), spaceId, updateData);
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
    sb.append("class DocumentOperationRO {\n");
    sb.append("    createdBy: ").append(toIndentedString(createdBy)).append("\n");
    sb.append("    spaceId: ").append(toIndentedString(spaceId)).append("\n");
    sb.append("    updateData: ").append(toIndentedString(updateData)).append("\n");
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

