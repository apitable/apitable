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
 * ViewRowSO
 */
@JsonPropertyOrder({
  ViewRowSO.JSON_PROPERTY_HIDDEN,
  ViewRowSO.JSON_PROPERTY_RECORD_ID
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class ViewRowSO {
  public static final String JSON_PROPERTY_HIDDEN = "hidden";
  private JsonNullable<Boolean> hidden = JsonNullable.<Boolean>undefined();

  public static final String JSON_PROPERTY_RECORD_ID = "recordId";
  private String recordId;

  public ViewRowSO() {
  }

  public ViewRowSO hidden(Boolean hidden) {
    this.hidden = JsonNullable.<Boolean>of(hidden);
    
    return this;
  }

   /**
   * Get hidden
   * @return hidden
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public Boolean getHidden() {
        return hidden.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_HIDDEN)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Boolean> getHidden_JsonNullable() {
    return hidden;
  }
  
  @JsonProperty(JSON_PROPERTY_HIDDEN)
  public void setHidden_JsonNullable(JsonNullable<Boolean> hidden) {
    this.hidden = hidden;
  }

  public void setHidden(Boolean hidden) {
    this.hidden = JsonNullable.<Boolean>of(hidden);
  }


  public ViewRowSO recordId(String recordId) {
    
    this.recordId = recordId;
    return this;
  }

   /**
   * Get recordId
   * @return recordId
  **/
  @javax.annotation.Nonnull
  @JsonProperty(JSON_PROPERTY_RECORD_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)

  public String getRecordId() {
    return recordId;
  }


  @JsonProperty(JSON_PROPERTY_RECORD_ID)
  @JsonInclude(value = JsonInclude.Include.ALWAYS)
  public void setRecordId(String recordId) {
    this.recordId = recordId;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ViewRowSO viewRowSO = (ViewRowSO) o;
    return equalsNullable(this.hidden, viewRowSO.hidden) &&
        Objects.equals(this.recordId, viewRowSO.recordId);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(hashCodeNullable(hidden), recordId);
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
    sb.append("class ViewRowSO {\n");
    sb.append("    hidden: ").append(toIndentedString(hidden)).append("\n");
    sb.append("    recordId: ").append(toIndentedString(recordId)).append("\n");
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

