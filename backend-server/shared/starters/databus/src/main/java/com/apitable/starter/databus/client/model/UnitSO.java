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
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

/**
 * UnitSO
 */
@JsonPropertyOrder({
  UnitSO.JSON_PROPERTY_AVATAR,
  UnitSO.JSON_PROPERTY_AVATAR_COLOR,
  UnitSO.JSON_PROPERTY_IS_ACTIVE,
  UnitSO.JSON_PROPERTY_IS_DELETED,
  UnitSO.JSON_PROPERTY_IS_MEMBER_NAME_MODIFIED,
  UnitSO.JSON_PROPERTY_IS_NICK_NAME_MODIFIED,
  UnitSO.JSON_PROPERTY_NAME,
  UnitSO.JSON_PROPERTY_NICK_NAME,
  UnitSO.JSON_PROPERTY_ORIGINAL_UNIT_ID,
  UnitSO.JSON_PROPERTY_TYPE,
  UnitSO.JSON_PROPERTY_UNIT_ID,
  UnitSO.JSON_PROPERTY_USER_ID,
  UnitSO.JSON_PROPERTY_UUID
})
@jakarta.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class UnitSO {
  public static final String JSON_PROPERTY_AVATAR = "avatar";
  private String avatar;

  public static final String JSON_PROPERTY_AVATAR_COLOR = "avatarColor";
  private Integer avatarColor;

  public static final String JSON_PROPERTY_IS_ACTIVE = "isActive";
  private Integer isActive;

  public static final String JSON_PROPERTY_IS_DELETED = "isDeleted";
  private Integer isDeleted;

  public static final String JSON_PROPERTY_IS_MEMBER_NAME_MODIFIED = "isMemberNameModified";
  private Boolean isMemberNameModified;

  public static final String JSON_PROPERTY_IS_NICK_NAME_MODIFIED = "isNickNameModified";
  private Boolean isNickNameModified;

  public static final String JSON_PROPERTY_NAME = "name";
  private String name;

  public static final String JSON_PROPERTY_NICK_NAME = "nickName";
  private String nickName;

  public static final String JSON_PROPERTY_ORIGINAL_UNIT_ID = "originalUnitId";
  private String originalUnitId;

  public static final String JSON_PROPERTY_TYPE = "type";
  private Integer type;

  public static final String JSON_PROPERTY_UNIT_ID = "unitId";
  private String unitId;

  public static final String JSON_PROPERTY_USER_ID = "userId";
  private String userId;

  public static final String JSON_PROPERTY_UUID = "uuid";
  private String uuid;

  public UnitSO() {
  }

  public UnitSO avatar(String avatar) {
    
    this.avatar = avatar;
    return this;
  }

   /**
   * Get avatar
   * @return avatar
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_AVATAR)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getAvatar() {
    return avatar;
  }


  @JsonProperty(JSON_PROPERTY_AVATAR)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setAvatar(String avatar) {
    this.avatar = avatar;
  }


  public UnitSO avatarColor(Integer avatarColor) {
    
    this.avatarColor = avatarColor;
    return this;
  }

   /**
   * Get avatarColor
   * @return avatarColor
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_AVATAR_COLOR)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Integer getAvatarColor() {
    return avatarColor;
  }


  @JsonProperty(JSON_PROPERTY_AVATAR_COLOR)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setAvatarColor(Integer avatarColor) {
    this.avatarColor = avatarColor;
  }


  public UnitSO isActive(Integer isActive) {
    
    this.isActive = isActive;
    return this;
  }

   /**
   * Get isActive
   * minimum: 0
   * @return isActive
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_IS_ACTIVE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Integer getIsActive() {
    return isActive;
  }


  @JsonProperty(JSON_PROPERTY_IS_ACTIVE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setIsActive(Integer isActive) {
    this.isActive = isActive;
  }


  public UnitSO isDeleted(Integer isDeleted) {
    
    this.isDeleted = isDeleted;
    return this;
  }

   /**
   * Get isDeleted
   * minimum: 0
   * @return isDeleted
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_IS_DELETED)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Integer getIsDeleted() {
    return isDeleted;
  }


  @JsonProperty(JSON_PROPERTY_IS_DELETED)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setIsDeleted(Integer isDeleted) {
    this.isDeleted = isDeleted;
  }


  public UnitSO isMemberNameModified(Boolean isMemberNameModified) {
    
    this.isMemberNameModified = isMemberNameModified;
    return this;
  }

   /**
   * Get isMemberNameModified
   * @return isMemberNameModified
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_IS_MEMBER_NAME_MODIFIED)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Boolean getIsMemberNameModified() {
    return isMemberNameModified;
  }


  @JsonProperty(JSON_PROPERTY_IS_MEMBER_NAME_MODIFIED)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setIsMemberNameModified(Boolean isMemberNameModified) {
    this.isMemberNameModified = isMemberNameModified;
  }


  public UnitSO isNickNameModified(Boolean isNickNameModified) {
    
    this.isNickNameModified = isNickNameModified;
    return this;
  }

   /**
   * Get isNickNameModified
   * @return isNickNameModified
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_IS_NICK_NAME_MODIFIED)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Boolean getIsNickNameModified() {
    return isNickNameModified;
  }


  @JsonProperty(JSON_PROPERTY_IS_NICK_NAME_MODIFIED)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setIsNickNameModified(Boolean isNickNameModified) {
    this.isNickNameModified = isNickNameModified;
  }


  public UnitSO name(String name) {
    
    this.name = name;
    return this;
  }

   /**
   * Get name
   * @return name
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_NAME)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getName() {
    return name;
  }


  @JsonProperty(JSON_PROPERTY_NAME)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setName(String name) {
    this.name = name;
  }


  public UnitSO nickName(String nickName) {
    
    this.nickName = nickName;
    return this;
  }

   /**
   * Get nickName
   * @return nickName
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_NICK_NAME)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getNickName() {
    return nickName;
  }


  @JsonProperty(JSON_PROPERTY_NICK_NAME)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setNickName(String nickName) {
    this.nickName = nickName;
  }


  public UnitSO originalUnitId(String originalUnitId) {
    
    this.originalUnitId = originalUnitId;
    return this;
  }

   /**
   * Get originalUnitId
   * @return originalUnitId
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_ORIGINAL_UNIT_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getOriginalUnitId() {
    return originalUnitId;
  }


  @JsonProperty(JSON_PROPERTY_ORIGINAL_UNIT_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setOriginalUnitId(String originalUnitId) {
    this.originalUnitId = originalUnitId;
  }


  public UnitSO type(Integer type) {
    
    this.type = type;
    return this;
  }

   /**
   * Get type
   * minimum: 0
   * @return type
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_TYPE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Integer getType() {
    return type;
  }


  @JsonProperty(JSON_PROPERTY_TYPE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setType(Integer type) {
    this.type = type;
  }


  public UnitSO unitId(String unitId) {
    
    this.unitId = unitId;
    return this;
  }

   /**
   * Get unitId
   * @return unitId
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_UNIT_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getUnitId() {
    return unitId;
  }


  @JsonProperty(JSON_PROPERTY_UNIT_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setUnitId(String unitId) {
    this.unitId = unitId;
  }


  public UnitSO userId(String userId) {
    
    this.userId = userId;
    return this;
  }

   /**
   * Get userId
   * @return userId
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_USER_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getUserId() {
    return userId;
  }


  @JsonProperty(JSON_PROPERTY_USER_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setUserId(String userId) {
    this.userId = userId;
  }


  public UnitSO uuid(String uuid) {
    
    this.uuid = uuid;
    return this;
  }

   /**
   * Get uuid
   * @return uuid
  **/
  @jakarta.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_UUID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getUuid() {
    return uuid;
  }


  @JsonProperty(JSON_PROPERTY_UUID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setUuid(String uuid) {
    this.uuid = uuid;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    UnitSO unitSO = (UnitSO) o;
    return Objects.equals(this.avatar, unitSO.avatar) &&
        Objects.equals(this.avatarColor, unitSO.avatarColor) &&
        Objects.equals(this.isActive, unitSO.isActive) &&
        Objects.equals(this.isDeleted, unitSO.isDeleted) &&
        Objects.equals(this.isMemberNameModified, unitSO.isMemberNameModified) &&
        Objects.equals(this.isNickNameModified, unitSO.isNickNameModified) &&
        Objects.equals(this.name, unitSO.name) &&
        Objects.equals(this.nickName, unitSO.nickName) &&
        Objects.equals(this.originalUnitId, unitSO.originalUnitId) &&
        Objects.equals(this.type, unitSO.type) &&
        Objects.equals(this.unitId, unitSO.unitId) &&
        Objects.equals(this.userId, unitSO.userId) &&
        Objects.equals(this.uuid, unitSO.uuid);
  }

  @Override
  public int hashCode() {
    return Objects.hash(avatar, avatarColor, isActive, isDeleted, isMemberNameModified, isNickNameModified, name, nickName, originalUnitId, type, unitId, userId, uuid);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class UnitSO {\n");
    sb.append("    avatar: ").append(toIndentedString(avatar)).append("\n");
    sb.append("    avatarColor: ").append(toIndentedString(avatarColor)).append("\n");
    sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
    sb.append("    isDeleted: ").append(toIndentedString(isDeleted)).append("\n");
    sb.append("    isMemberNameModified: ").append(toIndentedString(isMemberNameModified)).append("\n");
    sb.append("    isNickNameModified: ").append(toIndentedString(isNickNameModified)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    nickName: ").append(toIndentedString(nickName)).append("\n");
    sb.append("    originalUnitId: ").append(toIndentedString(originalUnitId)).append("\n");
    sb.append("    type: ").append(toIndentedString(type)).append("\n");
    sb.append("    unitId: ").append(toIndentedString(unitId)).append("\n");
    sb.append("    userId: ").append(toIndentedString(userId)).append("\n");
    sb.append("    uuid: ").append(toIndentedString(uuid)).append("\n");
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

