package com.vikadata.api.space.vo;

import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.LocalDateTimeToMilliSerializer;
import com.vikadata.api.shared.support.serializer.NullNumberSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

/**
 * <p>
 * Instrument cluster space information vo
 * </p>
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@ApiModel("Instrument cluster space information vo")
public class SpaceInfoVO {

    @ApiModelProperty(value = "Space name", example = "My Workspace", position = 1)
    private String spaceName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Space logo", example = "http://...", position = 2)
    private String spaceLogo;

    @ApiModelProperty(value = "Creator name", example = "Zhang San", position = 3)
    private String creatorName;

    @ApiModelProperty(value = "Whether the member (creator) has modified the nickname", notes = "Currently, it is only applicable to the control WeCom isv uses to determine the display name", position = 4)
    private Boolean isCreatorNameModified;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Creator's avatar", example = "http://...", position = 4)
    private String creatorAvatar;

    @ApiModelProperty(value = "Space owner name", example = "Li Si", position = 5)
    private String ownerName;

    @ApiModelProperty(value = "Whether the member (owner) has modified the nickname", notes = "Currently, it is only applicable to the control WeCom isv uses to determine the display name", position = 5)
    private Boolean isOwnerNameModified;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Space owner's avatar", example = "http://...", position = 6)
    private String ownerAvatar;

    @ApiModelProperty(value = "Creation timestamp (ms)", example = "1573561644000", position = 7)
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class, nullsUsing = NullNumberSerializer.class)
    private LocalDateTime createTime;

    @ApiModelProperty(value = "Formal deletion timestamp (ms)", example = "1573561644000", position = 8)
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class, nullsUsing = NullNumberSerializer.class)
    private LocalDateTime delTime;

    @ApiModelProperty(value = "Third party integration binding information", position = 9)
    private SpaceSocialConfig social;

    @ApiModelProperty(value = "Number of departments", example = "5", position = 10)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long deptNumber;

    @ApiModelProperty(value = "Number of seats", example = "5", position = 11)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long seats;

    @ApiModelProperty(value = "Number of tables", example = "5", position = 12)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long sheetNums;

    @ApiModelProperty(value = "Total rows of all tables in the space", example = "5", position = 13)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long recordNums;

    @ApiModelProperty(value = "Number of space administrators", example = "5", position = 14)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long adminNums;

    @ApiModelProperty(value = "Used attachment capacity (in bytes)", example = "1024", position = 15)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long capacityUsedSizes;

    @ApiModelProperty(value = "Cumulative usage of API calls", example = "10", position = 16)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long apiRequestCountUsage;

    @ApiModelProperty(value = "Total number of field permission settings", example = "10", position = 17)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long fieldRoleNums;

    @ApiModelProperty(value = "Total number of file permission settings", example = "10", position = 17)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long nodeRoleNums;

    @ApiModelProperty(value = "Total Kanban Views", example = "10", position = 18)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long kanbanViewNums;

    @ApiModelProperty(value = "Total Album Views", example = "10", position = 19)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long galleryViewNums;

    @ApiModelProperty(value = "Total Gantt Views", example = "10", position = 20)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long ganttViewNums;

    @ApiModelProperty(value = "Total Calendar Views", example = "10", position = 21)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long calendarViewNums;

    @ApiModelProperty(value = "Total Form Views", example = "10", position = 22)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long formViewNums;

    @ApiModelProperty(value = "Used current package attachment capacity (unit: bytes)", example = "1024", position = 23)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long currentBundleCapacityUsedSizes;

    @ApiModelProperty(value = "Used complimentary accessory capacity (unit: bytes)", example = "1024", position = 24)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long giftCapacityUsedSizes;

    @ApiModelProperty(value = "Number of tables (mirrors)", example = "5", position = 25)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long mirrorNums;
}
