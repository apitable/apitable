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
import com.apitable.starter.databus.client.model.FOperator;
import com.apitable.starter.databus.client.model.FieldKindSO;
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
 * IFilterCondition
 */
@JsonPropertyOrder({
  IFilterCondition.JSON_PROPERTY_CONDITION_ID,
  IFilterCondition.JSON_PROPERTY_FIELD_ID,
  IFilterCondition.JSON_PROPERTY_FIELD_TYPE,
  IFilterCondition.JSON_PROPERTY_OPERATOR,
  IFilterCondition.JSON_PROPERTY_VALUE
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class IFilterCondition {
  public static final String JSON_PROPERTY_CONDITION_ID = "conditionId";
  private String conditionId;

  public static final String JSON_PROPERTY_FIELD_ID = "fieldId";
  private String fieldId;

  public static final String JSON_PROPERTY_FIELD_TYPE = "fieldType";
  private FieldKindSO fieldType;

  public static final String JSON_PROPERTY_OPERATOR = "operator";
  private FOperator operator;

  public static final String JSON_PROPERTY_VALUE = "value";
  private JsonNullable<Object> value = JsonNullable.<Object>of(null);

  public IFilterCondition() {
  }

  public IFilterCondition conditionId(String conditionId) {
    
    this.conditionId = conditionId;
    return this;
  }

   /**
   * Get conditionId
   * @return conditionId
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_CONDITION_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getConditionId() {
    return conditionId;
  }


  @JsonProperty(JSON_PROPERTY_CONDITION_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setConditionId(String conditionId) {
    this.conditionId = conditionId;
  }


  public IFilterCondition fieldId(String fieldId) {
    
    this.fieldId = fieldId;
    return this;
  }

   /**
   * Get fieldId
   * @return fieldId
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_FIELD_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getFieldId() {
    return fieldId;
  }


  @JsonProperty(JSON_PROPERTY_FIELD_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setFieldId(String fieldId) {
    this.fieldId = fieldId;
  }


  public IFilterCondition fieldType(FieldKindSO fieldType) {
    
    this.fieldType = fieldType;
    return this;
  }

   /**
   * Get fieldType
   * @return fieldType
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_FIELD_TYPE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public FieldKindSO getFieldType() {
    return fieldType;
  }


  @JsonProperty(JSON_PROPERTY_FIELD_TYPE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setFieldType(FieldKindSO fieldType) {
    this.fieldType = fieldType;
  }


  public IFilterCondition operator(FOperator operator) {
    
    this.operator = operator;
    return this;
  }

   /**
   * Get operator
   * @return operator
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_OPERATOR)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public FOperator getOperator() {
    return operator;
  }


  @JsonProperty(JSON_PROPERTY_OPERATOR)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setOperator(FOperator operator) {
    this.operator = operator;
  }


  public IFilterCondition value(Object value) {
    this.value = JsonNullable.<Object>of(value);
    
    return this;
  }

   /**
   * Get value
   * @return value
  **/
  @javax.annotation.Nullable
  @JsonIgnore

  public Object getValue() {
        return value.orElse(null);
  }

  @JsonProperty(JSON_PROPERTY_VALUE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public JsonNullable<Object> getValue_JsonNullable() {
    return value;
  }
  
  @JsonProperty(JSON_PROPERTY_VALUE)
  public void setValue_JsonNullable(JsonNullable<Object> value) {
    this.value = value;
  }

  public void setValue(Object value) {
    this.value = JsonNullable.<Object>of(value);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    IFilterCondition ifilterCondition = (IFilterCondition) o;
    return Objects.equals(this.conditionId, ifilterCondition.conditionId) &&
        Objects.equals(this.fieldId, ifilterCondition.fieldId) &&
        Objects.equals(this.fieldType, ifilterCondition.fieldType) &&
        Objects.equals(this.operator, ifilterCondition.operator) &&
        equalsNullable(this.value, ifilterCondition.value);
  }

  private static <T> boolean equalsNullable(JsonNullable<T> a, JsonNullable<T> b) {
    return a == b || (a != null && b != null && a.isPresent() && b.isPresent() && Objects.deepEquals(a.get(), b.get()));
  }

  @Override
  public int hashCode() {
    return Objects.hash(conditionId, fieldId, fieldType, operator, hashCodeNullable(value));
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
    sb.append("class IFilterCondition {\n");
    sb.append("    conditionId: ").append(toIndentedString(conditionId)).append("\n");
    sb.append("    fieldId: ").append(toIndentedString(fieldId)).append("\n");
    sb.append("    fieldType: ").append(toIndentedString(fieldType)).append("\n");
    sb.append("    operator: ").append(toIndentedString(operator)).append("\n");
    sb.append("    value: ").append(toIndentedString(value)).append("\n");
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

