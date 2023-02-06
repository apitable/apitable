/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.space.vo;

import java.time.LocalDate;
import java.util.List;

import cn.hutool.core.date.DatePattern;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;

@Data
@ApiModel("Space Subscribe Info")
public class SpaceSubscribeVo {

    @ApiModelProperty(value = "version", example = "V1", position = 1)
    private String version;

    @ApiModelProperty(value = "produce name", example = "Bronze", position = 2)
    private String product;

    @ApiModelProperty(value = "whether on trial", example = "false", position = 2)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean onTrial;

    private String billingMode;

    private String recurringInterval;

    @ApiModelProperty(value = "plan name", example = "bronze_no_billing_period", position = 3)
    private String plan;

    @ApiModelProperty(value = "added plan names", dataType = "List", example = "[\"space_capacity_50G_v1\",\"api_usage_20000_v1\"]", position = 5)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<String> addOnPlans;

    private Long expireAt;

    @ApiModelProperty(value = "subscription expiration time. if free, it is null.", example = "2019-01-01", position = 6)
    @JsonFormat(pattern = DatePattern.NORM_DATE_PATTERN)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate deadline;

    @ApiModelProperty(value = "seat(unit: people)", example = "10", position = 7)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxSeats;

    @ApiModelProperty(value = "capacity(unit: MB)", example = "10", position = 8)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxCapacitySizeInBytes;

    @ApiModelProperty(value = "sheet number(unit: table)", example = "10", position = 9)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxSheetNums;

    @ApiModelProperty(value = "max rows per sheet(unit: row)", example = "10", position = 10)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRowsPerSheet;

    @ApiModelProperty(value = "max rows in space(unit: row)", example = "10", position = 11)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRowsInSpace;

    @ApiModelProperty(value = "api usage limit(unit: count)", example = "10", position = 12)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxApiCall;

    @ApiModelProperty(value = "admin nums(unit: person)", example = "10", position = 13)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxAdminNums;

    @ApiModelProperty(value = "days of storage in trash(unit: day)", example = "10", position = 14)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRemainTrashDays;

    @ApiModelProperty(value = "max gallery views in space(unit: view)", example = "10", position = 15)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxGalleryViewsInSpace;

    @ApiModelProperty(value = "max kanban views in space(unit: view)", example = "10", position = 16)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxKanbanViewsInSpace;

    @ApiModelProperty(value = "max form views in space(unit: form)", example = "10", position = 17)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxFormViewsInSpace;

    @ApiModelProperty(value = "max gantt views in space(unit: view)", example = "10", position = 18)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxGanttViewsInSpace;

    @ApiModelProperty(value = "max calendar views in space(unit: view)", example = "10", position = 19)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxCalendarViewsInSpace;

    @ApiModelProperty(value = "max field permission nums(unit: unit)", example = "10", position = 20)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long fieldPermissionNums;

    @ApiModelProperty(value = "max node permission nums(unit: unit)", example = "10", position = 20)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long nodePermissionNums;

    @ApiModelProperty(value = "number of days the time machine retains data(unit: day)", example = "10", position = 12)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRemainTimeMachineDays;

    @ApiModelProperty(value = "whether it can be integrated dingtalk", example = "false", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean integrationDingtalk;

    @ApiModelProperty(value = "whether it can be integrated feishu", example = "false", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean integrationFeishu;

    @ApiModelProperty(value = "whether it can be integrated wecom", example = "false", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean integrationWeCom;

    @ApiModelProperty(value = "whether it can be office preview", example = "false", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean integrationOfficePreview;

    @ApiModelProperty(value = "whether it has rainbow label", example = "false", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rainbowLabel;

    @ApiModelProperty(value = "whether it has global watermark", example = "false", position = 12)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean watermark;

    @ApiModelProperty(value = "max days of remain record activity (unit: day)", example = "14", position = 13)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRemainRecordActivityDays;

    @ApiModelProperty(value = "whether space in the black space", position = 14)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean blackSpace;

    @ApiModelProperty(value = "Security Settings - ordinary members perform the invite operation", example = "false", position = 15)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingInviteMember;

    @ApiModelProperty(value = "Security Settings - off station users apply to join the space", example = "false", position = 16)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingApplyJoinSpace;

    @ApiModelProperty(value = "Security Settings - create a public link", example = "false", position = 17)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingShare;

    @ApiModelProperty(value = "Security Settings - export datasheet", example = "false", position = 18)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingExport;

    @ApiModelProperty(value = "Security Settings - read only users download attachments", example = "false", position = 19)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingDownloadFile;

    @ApiModelProperty(value = "Security Settings - read only users copy data off site", example = "false", position = 20)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingCopyCellData;

    @ApiModelProperty(value = "Security Settings - display member's mobile phone number", example = "false", position = 21)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingMobile;

    @ApiModelProperty(value = "the maximum days for querying audit logs(unit: day)", example = "14", position = 22)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxAuditQueryDays;

    @ApiModelProperty(value = "complimentary unexpired capacity(unit：byte)", dataType = "java.lang.String", example = "1024", position = 23)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long unExpireGiftCapacity;

    @ApiModelProperty(value = "capacity(unit：byte)", dataType = "java.lang.String", example = "1024", position = 24)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long subscriptionCapacity;

    @ApiModelProperty(value = "Security Settings - hidden concact", example = "false", position = 25)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingAddressListIsolation;

    @ApiModelProperty(value = "Security Settings - prohibit members manage files in the root directory", example = "false", position = 26)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingCatalogManagement;

    @ApiModelProperty(value = "max mirror nums(unit: mirror)", example = "5", position = 27)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxMirrorNums;
}
