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
 * FieldUpdatedValue
 */
@JsonPropertyOrder({
  FieldUpdatedValue.JSON_PROPERTY_AT,
  FieldUpdatedValue.JSON_PROPERTY_AUTO_NUMBER,
  FieldUpdatedValue.JSON_PROPERTY_BY
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class FieldUpdatedValue {
  public static final String JSON_PROPERTY_AT = "at";
  private JsonNullable<Long> at = JsonNullable.<Long>undefined();

  public static final String JSON_PROPERTY_AUTO_NUMBER = "autoNumber";
  private JsonNullable<Long> autoNumber = JsonNullable.<Long>undefined();

  public static final String JSON_PROPERTY_BY = "by";
  private JsonNullable<String> by = JsonNullable.<String>undefined();

  public FieldUpdatedValue() {
  }

  public FieldUpdatedValue at(Long at) {
    this.at = JsonNullable.<Long>of(at);
    
    return this;
  }

   /**
   * Get at
   * minimum: 0
   * @return at
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public Long getAt() {
        return at.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_AT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Long> getAt_JsonNullable() {
    return at;
  }
  
  @JsonProperty(JSON_PROPERTY_AT)
  public void setAt_JsonNullable(JsonNullable<Long> at) {
    this.at = at;
  }

  public void setAt(Long at) {
    this.at = JsonNullable.<Long>of(at);
  }


  public FieldUpdatedValue autoNumber(Long autoNumber) {
    this.autoNumber = JsonNullable.<Long>of(autoNumber);
    
    return this;
  }

   /**
   * Get autoNumber
   * minimum: 0
   * @return autoNumber
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public Long getAutoNumber() {
        return autoNumber.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_AUTO_NUMBER)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Long> getAutoNumber_JsonNullable() {
    return autoNumber;
  }
  
  @JsonProperty(JSON_PROPERTY_AUTO_NUMBER)
  public void setAutoNumber_JsonNullable(JsonNullable<Long> autoNumber) {
    this.autoNumber = autoNumber;
  }

  public void setAutoNumber(Long autoNumber) {
    this.autoNumber = JsonNullable.<Long>of(autoNumber);
  }


  public FieldUpdatedValue by(String by) {
    this.by = JsonNullable.<String>of(by);
    
    return this;
  }

   /**
   * Get by
   * @return by
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public String getBy() {
        return by.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_BY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<String> getBy_JsonNullable() {
    return by;
  }
  
  @JsonProperty(JSON_PROPERTY_BY)
  public void setBy_JsonNullable(JsonNullable<String> by) {
    this.by = by;
  }

  public void setBy(String by) {
    this.by = JsonNullable.<String>of(by);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    FieldUpdatedValue fieldUpdatedValue = (FieldUpdatedValue) o;
    return equalsNullable(this.at, fieldUpdatedValue.at) &&
        equalsNullable(this.autoNumber, fieldUpdatedValue.autoNumber) &&
        equalsNullable(this.by, fieldUpdatedValue.by);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(hashCodeNullable(at), hashCodeNullable(autoNumber), hashCodeNullable(by));
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
    sb.append("class FieldUpdatedValue {\n");
    sb.append("    at: ").append(toIndentedString(at)).append("\n");
    sb.append("    autoNumber: ").append(toIndentedString(autoNumber)).append("\n");
    sb.append("    by: ").append(toIndentedString(by)).append("\n");
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

