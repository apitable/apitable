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
import com.apitable.starter.databus.client.model.AnyBaseField;
import com.apitable.starter.databus.client.model.GanttColorOption;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.annotation.JsonValue;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonTypeName;

/**
 * ViewStyleSo
 */
@JsonPropertyOrder({
  ViewStyleSo.JSON_PROPERTY_AUTO_TASK_LAYOUT,
  ViewStyleSo.JSON_PROPERTY_CARD_COUNT,
  ViewStyleSo.JSON_PROPERTY_COLOR_OPTION,
  ViewStyleSo.JSON_PROPERTY_COVER_FIELD_ID,
  ViewStyleSo.JSON_PROPERTY_END_FIELD_ID,
  ViewStyleSo.JSON_PROPERTY_HIDDEN_GROUP_MAP,
  ViewStyleSo.JSON_PROPERTY_HORIZONTAL,
  ViewStyleSo.JSON_PROPERTY_IS_AUTO_LAYOUT,
  ViewStyleSo.JSON_PROPERTY_IS_COL_NAME_VISIBLE,
  ViewStyleSo.JSON_PROPERTY_IS_COVER_FIT,
  ViewStyleSo.JSON_PROPERTY_KANBAN_FIELD_ID,
  ViewStyleSo.JSON_PROPERTY_LAYOUT_TYPE,
  ViewStyleSo.JSON_PROPERTY_LINK_FIELD_ID,
  ViewStyleSo.JSON_PROPERTY_ONLY_CALC_WORK_DAY,
  ViewStyleSo.JSON_PROPERTY_START_FIELD_ID,
  ViewStyleSo.JSON_PROPERTY_WORK_DAYS
})
@javax.annotation.Generated(value = "org.openapitools.codegen.languages.JavaClientCodegen")
public class ViewStyleSo {
  public static final String JSON_PROPERTY_AUTO_TASK_LAYOUT = "autoTaskLayout";
  private Boolean autoTaskLayout;

  public static final String JSON_PROPERTY_CARD_COUNT = "cardCount";
  private Integer cardCount;

  public static final String JSON_PROPERTY_COLOR_OPTION = "colorOption";
  private GanttColorOption colorOption;

  public static final String JSON_PROPERTY_COVER_FIELD_ID = "coverFieldId";
  private String coverFieldId;

  public static final String JSON_PROPERTY_END_FIELD_ID = "endFieldId";
  private String endFieldId;

  public static final String JSON_PROPERTY_HIDDEN_GROUP_MAP = "hiddenGroupMap";
  private Map<String, Boolean> hiddenGroupMap;

  public static final String JSON_PROPERTY_HORIZONTAL = "horizontal";
  private Boolean horizontal;

  public static final String JSON_PROPERTY_IS_AUTO_LAYOUT = "isAutoLayout";
  private Boolean isAutoLayout;

  public static final String JSON_PROPERTY_IS_COL_NAME_VISIBLE = "isColNameVisible";
  private Boolean isColNameVisible;

  public static final String JSON_PROPERTY_IS_COVER_FIT = "isCoverFit";
  private Boolean isCoverFit;

  public static final String JSON_PROPERTY_KANBAN_FIELD_ID = "kanbanFieldId";
  private String kanbanFieldId;

  public static final String JSON_PROPERTY_LAYOUT_TYPE = "layoutType";
  private AnyBaseField layoutType;

  public static final String JSON_PROPERTY_LINK_FIELD_ID = "linkFieldId";
  private String linkFieldId;

  public static final String JSON_PROPERTY_ONLY_CALC_WORK_DAY = "onlyCalcWorkDay";
  private Boolean onlyCalcWorkDay;

  public static final String JSON_PROPERTY_START_FIELD_ID = "startFieldId";
  private String startFieldId;

  public static final String JSON_PROPERTY_WORK_DAYS = "workDays";
  private List<Integer> workDays;

  public ViewStyleSo() {
  }

  public ViewStyleSo autoTaskLayout(Boolean autoTaskLayout) {
    
    this.autoTaskLayout = autoTaskLayout;
    return this;
  }

   /**
   * Get autoTaskLayout
   * @return autoTaskLayout
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_AUTO_TASK_LAYOUT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Boolean getAutoTaskLayout() {
    return autoTaskLayout;
  }


  @JsonProperty(JSON_PROPERTY_AUTO_TASK_LAYOUT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setAutoTaskLayout(Boolean autoTaskLayout) {
    this.autoTaskLayout = autoTaskLayout;
  }


  public ViewStyleSo cardCount(Integer cardCount) {
    
    this.cardCount = cardCount;
    return this;
  }

   /**
   * Get cardCount
   * @return cardCount
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_CARD_COUNT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Integer getCardCount() {
    return cardCount;
  }


  @JsonProperty(JSON_PROPERTY_CARD_COUNT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setCardCount(Integer cardCount) {
    this.cardCount = cardCount;
  }


  public ViewStyleSo colorOption(GanttColorOption colorOption) {
    
    this.colorOption = colorOption;
    return this;
  }

   /**
   * Get colorOption
   * @return colorOption
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_COLOR_OPTION)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public GanttColorOption getColorOption() {
    return colorOption;
  }


  @JsonProperty(JSON_PROPERTY_COLOR_OPTION)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setColorOption(GanttColorOption colorOption) {
    this.colorOption = colorOption;
  }


  public ViewStyleSo coverFieldId(String coverFieldId) {
    
    this.coverFieldId = coverFieldId;
    return this;
  }

   /**
   * Get coverFieldId
   * @return coverFieldId
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_COVER_FIELD_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getCoverFieldId() {
    return coverFieldId;
  }


  @JsonProperty(JSON_PROPERTY_COVER_FIELD_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setCoverFieldId(String coverFieldId) {
    this.coverFieldId = coverFieldId;
  }


  public ViewStyleSo endFieldId(String endFieldId) {
    
    this.endFieldId = endFieldId;
    return this;
  }

   /**
   * Get endFieldId
   * @return endFieldId
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_END_FIELD_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getEndFieldId() {
    return endFieldId;
  }


  @JsonProperty(JSON_PROPERTY_END_FIELD_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setEndFieldId(String endFieldId) {
    this.endFieldId = endFieldId;
  }


  public ViewStyleSo hiddenGroupMap(Map<String, Boolean> hiddenGroupMap) {
    
    this.hiddenGroupMap = hiddenGroupMap;
    return this;
  }

  public ViewStyleSo putHiddenGroupMapItem(String key, Boolean hiddenGroupMapItem) {
    if (this.hiddenGroupMap == null) {
      this.hiddenGroupMap = new HashMap<>();
    }
    this.hiddenGroupMap.put(key, hiddenGroupMapItem);
    return this;
  }

   /**
   * Get hiddenGroupMap
   * @return hiddenGroupMap
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_HIDDEN_GROUP_MAP)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Map<String, Boolean> getHiddenGroupMap() {
    return hiddenGroupMap;
  }


  @JsonProperty(JSON_PROPERTY_HIDDEN_GROUP_MAP)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setHiddenGroupMap(Map<String, Boolean> hiddenGroupMap) {
    this.hiddenGroupMap = hiddenGroupMap;
  }


  public ViewStyleSo horizontal(Boolean horizontal) {
    
    this.horizontal = horizontal;
    return this;
  }

   /**
   * Get horizontal
   * @return horizontal
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_HORIZONTAL)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Boolean getHorizontal() {
    return horizontal;
  }


  @JsonProperty(JSON_PROPERTY_HORIZONTAL)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setHorizontal(Boolean horizontal) {
    this.horizontal = horizontal;
  }


  public ViewStyleSo isAutoLayout(Boolean isAutoLayout) {
    
    this.isAutoLayout = isAutoLayout;
    return this;
  }

   /**
   * Get isAutoLayout
   * @return isAutoLayout
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_IS_AUTO_LAYOUT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Boolean getIsAutoLayout() {
    return isAutoLayout;
  }


  @JsonProperty(JSON_PROPERTY_IS_AUTO_LAYOUT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setIsAutoLayout(Boolean isAutoLayout) {
    this.isAutoLayout = isAutoLayout;
  }


  public ViewStyleSo isColNameVisible(Boolean isColNameVisible) {
    
    this.isColNameVisible = isColNameVisible;
    return this;
  }

   /**
   * Get isColNameVisible
   * @return isColNameVisible
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_IS_COL_NAME_VISIBLE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Boolean getIsColNameVisible() {
    return isColNameVisible;
  }


  @JsonProperty(JSON_PROPERTY_IS_COL_NAME_VISIBLE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setIsColNameVisible(Boolean isColNameVisible) {
    this.isColNameVisible = isColNameVisible;
  }


  public ViewStyleSo isCoverFit(Boolean isCoverFit) {
    
    this.isCoverFit = isCoverFit;
    return this;
  }

   /**
   * Get isCoverFit
   * @return isCoverFit
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_IS_COVER_FIT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Boolean getIsCoverFit() {
    return isCoverFit;
  }


  @JsonProperty(JSON_PROPERTY_IS_COVER_FIT)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setIsCoverFit(Boolean isCoverFit) {
    this.isCoverFit = isCoverFit;
  }


  public ViewStyleSo kanbanFieldId(String kanbanFieldId) {
    
    this.kanbanFieldId = kanbanFieldId;
    return this;
  }

   /**
   * Get kanbanFieldId
   * @return kanbanFieldId
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_KANBAN_FIELD_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getKanbanFieldId() {
    return kanbanFieldId;
  }


  @JsonProperty(JSON_PROPERTY_KANBAN_FIELD_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setKanbanFieldId(String kanbanFieldId) {
    this.kanbanFieldId = kanbanFieldId;
  }


  public ViewStyleSo layoutType(AnyBaseField layoutType) {
    
    this.layoutType = layoutType;
    return this;
  }

   /**
   * Get layoutType
   * @return layoutType
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_LAYOUT_TYPE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public AnyBaseField getLayoutType() {
    return layoutType;
  }


  @JsonProperty(JSON_PROPERTY_LAYOUT_TYPE)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setLayoutType(AnyBaseField layoutType) {
    this.layoutType = layoutType;
  }


  public ViewStyleSo linkFieldId(String linkFieldId) {
    
    this.linkFieldId = linkFieldId;
    return this;
  }

   /**
   * Get linkFieldId
   * @return linkFieldId
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_LINK_FIELD_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getLinkFieldId() {
    return linkFieldId;
  }


  @JsonProperty(JSON_PROPERTY_LINK_FIELD_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setLinkFieldId(String linkFieldId) {
    this.linkFieldId = linkFieldId;
  }


  public ViewStyleSo onlyCalcWorkDay(Boolean onlyCalcWorkDay) {
    
    this.onlyCalcWorkDay = onlyCalcWorkDay;
    return this;
  }

   /**
   * Get onlyCalcWorkDay
   * @return onlyCalcWorkDay
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_ONLY_CALC_WORK_DAY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public Boolean getOnlyCalcWorkDay() {
    return onlyCalcWorkDay;
  }


  @JsonProperty(JSON_PROPERTY_ONLY_CALC_WORK_DAY)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setOnlyCalcWorkDay(Boolean onlyCalcWorkDay) {
    this.onlyCalcWorkDay = onlyCalcWorkDay;
  }


  public ViewStyleSo startFieldId(String startFieldId) {
    
    this.startFieldId = startFieldId;
    return this;
  }

   /**
   * Get startFieldId
   * @return startFieldId
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_START_FIELD_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public String getStartFieldId() {
    return startFieldId;
  }


  @JsonProperty(JSON_PROPERTY_START_FIELD_ID)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setStartFieldId(String startFieldId) {
    this.startFieldId = startFieldId;
  }


  public ViewStyleSo workDays(List<Integer> workDays) {
    
    this.workDays = workDays;
    return this;
  }

  public ViewStyleSo addWorkDaysItem(Integer workDaysItem) {
    if (this.workDays == null) {
      this.workDays = new ArrayList<>();
    }
    this.workDays.add(workDaysItem);
    return this;
  }

   /**
   * Get workDays
   * @return workDays
  **/
  @javax.annotation.Nullable
  @JsonProperty(JSON_PROPERTY_WORK_DAYS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)

  public List<Integer> getWorkDays() {
    return workDays;
  }


  @JsonProperty(JSON_PROPERTY_WORK_DAYS)
  @JsonInclude(value = JsonInclude.Include.USE_DEFAULTS)
  public void setWorkDays(List<Integer> workDays) {
    this.workDays = workDays;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    ViewStyleSo viewStyleSo = (ViewStyleSo) o;
    return Objects.equals(this.autoTaskLayout, viewStyleSo.autoTaskLayout) &&
        Objects.equals(this.cardCount, viewStyleSo.cardCount) &&
        Objects.equals(this.colorOption, viewStyleSo.colorOption) &&
        Objects.equals(this.coverFieldId, viewStyleSo.coverFieldId) &&
        Objects.equals(this.endFieldId, viewStyleSo.endFieldId) &&
        Objects.equals(this.hiddenGroupMap, viewStyleSo.hiddenGroupMap) &&
        Objects.equals(this.horizontal, viewStyleSo.horizontal) &&
        Objects.equals(this.isAutoLayout, viewStyleSo.isAutoLayout) &&
        Objects.equals(this.isColNameVisible, viewStyleSo.isColNameVisible) &&
        Objects.equals(this.isCoverFit, viewStyleSo.isCoverFit) &&
        Objects.equals(this.kanbanFieldId, viewStyleSo.kanbanFieldId) &&
        Objects.equals(this.layoutType, viewStyleSo.layoutType) &&
        Objects.equals(this.linkFieldId, viewStyleSo.linkFieldId) &&
        Objects.equals(this.onlyCalcWorkDay, viewStyleSo.onlyCalcWorkDay) &&
        Objects.equals(this.startFieldId, viewStyleSo.startFieldId) &&
        Objects.equals(this.workDays, viewStyleSo.workDays);
  }

  @Override
  public int hashCode() {
    return Objects.hash(autoTaskLayout, cardCount, colorOption, coverFieldId, endFieldId, hiddenGroupMap, horizontal, isAutoLayout, isColNameVisible, isCoverFit, kanbanFieldId, layoutType, linkFieldId, onlyCalcWorkDay, startFieldId, workDays);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class ViewStyleSo {\n");
    sb.append("    autoTaskLayout: ").append(toIndentedString(autoTaskLayout)).append("\n");
    sb.append("    cardCount: ").append(toIndentedString(cardCount)).append("\n");
    sb.append("    colorOption: ").append(toIndentedString(colorOption)).append("\n");
    sb.append("    coverFieldId: ").append(toIndentedString(coverFieldId)).append("\n");
    sb.append("    endFieldId: ").append(toIndentedString(endFieldId)).append("\n");
    sb.append("    hiddenGroupMap: ").append(toIndentedString(hiddenGroupMap)).append("\n");
    sb.append("    horizontal: ").append(toIndentedString(horizontal)).append("\n");
    sb.append("    isAutoLayout: ").append(toIndentedString(isAutoLayout)).append("\n");
    sb.append("    isColNameVisible: ").append(toIndentedString(isColNameVisible)).append("\n");
    sb.append("    isCoverFit: ").append(toIndentedString(isCoverFit)).append("\n");
    sb.append("    kanbanFieldId: ").append(toIndentedString(kanbanFieldId)).append("\n");
    sb.append("    layoutType: ").append(toIndentedString(layoutType)).append("\n");
    sb.append("    linkFieldId: ").append(toIndentedString(linkFieldId)).append("\n");
    sb.append("    onlyCalcWorkDay: ").append(toIndentedString(onlyCalcWorkDay)).append("\n");
    sb.append("    startFieldId: ").append(toIndentedString(startFieldId)).append("\n");
    sb.append("    workDays: ").append(toIndentedString(workDays)).append("\n");
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

