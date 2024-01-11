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

import cn.hutool.core.date.DatePattern;
import com.apitable.shared.support.serializer.NullArraySerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;
import lombok.Data;

/**
 * Space Subscribe Vo.
 */
@Data
@Schema(description = "Space Subscribe Info")
public class SpaceSubscribeVo {

    @Schema(description = "version", example = "V1")
    private String version;

    @Schema(description = "produce name", example = "Bronze")
    private String product;

    @Schema(description = "whether on trial", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean onTrial;

    private String billingMode;

    private String recurringInterval;

    @Schema(description = "plan name", example = "bronze_no_billing_period")
    private String plan;

    @Schema(description = "added plan names", type = "List",
        example = "[\"space_capacity_50G_v1\",\"api_usage_20000_v1\"]")
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<String> addOnPlans;

    @Schema(description = "expire unix timestamp", example = "1703234649")
    private Long expireAt;

    @Schema(description = "subscription expiration time. if free, it is null.",
        example = "2019-01-01", deprecated = true)
    @JsonFormat(pattern = DatePattern.NORM_DATE_PATTERN)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate deadline;

    @Schema(description = "cycle day of month", example = "21")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer cycleDayOfMonth;

    @Schema(description = "seat(unit: people)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxSeats;

    @Schema(description = "capacity(unit: MB)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxCapacitySizeInBytes;

    @Schema(description = "sheet number(unit: table)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxSheetNums;

    @Schema(description = "max rows per sheet(unit: row)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRowsPerSheet;

    @Schema(description = "max rows in space(unit: row)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRowsInSpace;

    @Schema(description = "api usage limit(unit: count)", example = "10", deprecated = true)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    @Deprecated(since = "1.8.0", forRemoval = true)
    private Long maxApiCall;

    @Schema(description = "api call number per month", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long apiCallNumsPerMonth;

    @Schema(description = "admin nums(unit: person)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxAdminNums;

    @Schema(description = "days of storage in trash(unit: day)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRemainTrashDays;

    @Schema(description = "max gallery views in space(unit: view)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxGalleryViewsInSpace;

    @Schema(description = "max kanban views in space(unit: view)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxKanbanViewsInSpace;

    @Schema(description = "max form views in space(unit: form)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxFormViewsInSpace;

    @Schema(description = "max gantt views in space(unit: view)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxGanttViewsInSpace;

    @Schema(description = "max calendar views in space(unit: view)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxCalendarViewsInSpace;

    @Schema(description = "max field permission nums(unit: unit)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long fieldPermissionNums;

    @Schema(description = "max node permission nums(unit: unit)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long nodePermissionNums;

    @Schema(description = "number of days the time machine retains data(unit: day)", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRemainTimeMachineDays;

    @Schema(description = "whether it can be integrated dingtalk", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean integrationDingtalk;

    @Schema(description = "whether it can be integrated feishu", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean integrationFeishu;

    @Schema(description = "whether it can be integrated wecom", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean integrationWeCom;

    @Schema(description = "whether it can be office preview", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean integrationOfficePreview;

    @Schema(description = "whether it has rainbow label", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean rainbowLabel;

    @Schema(description = "whether it has global watermark", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean watermark;

    @Schema(description = "max days of remain record activity (unit: day)", example = "14")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxRemainRecordActivityDays;

    @Schema(description = "whether space in the black space")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean blackSpace;

    @Schema(description = "Security Settings - ordinary members perform the invite operation",
        example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingInviteMember;

    @Schema(description = "Security Settings - off station users apply to join the space",
        example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingApplyJoinSpace;

    @Schema(description = "Security Settings - create a public link", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingShare;

    @Schema(description = "Security Settings - export datasheet", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingExport;

    @Schema(description = "Security Settings - read only users download attachments",
        example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingDownloadFile;

    @Schema(description = "Security Settings - read only users copy data off site",
        example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingCopyCellData;

    @Schema(description = "Security Settings - display member's mobile phone number",
        example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingMobile;

    @Schema(description = "the maximum days for querying audit logs(unit: day)", example = "14")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxAuditQueryDays;

    @Schema(description = "Advance - whether to use audit log query",
        example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean auditQuery;

    @Schema(description = "the maximum credit number for ai query(unit: int)", example = "1000")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxMessageCredits;

    @Schema(description = "the maximum automation count (unit: int)", example = "100")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxAutomationRunNums;

    @Schema(description = "the maximum Widget count (unit: int)", example = "30")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxWidgetNums;

    @Schema(description = "complimentary unexpired capacity(unit：byte)", type = "java.lang.String",
        example = "1024")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long unExpireGiftCapacity;

    @Schema(description = "capacity(unit：byte)", type = "java.lang.String", example = "1024")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long subscriptionCapacity;

    @Schema(description = "Security Settings - hidden concact", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingAddressListIsolation;

    @Schema(description = "Security Settings - prohibit members manage files in the root directory",
        example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean securitySettingCatalogManagement;

    @Schema(description = "max mirror nums(unit: mirror)", example = "5")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long maxMirrorNums;

    @Schema(description = "whether can control form brand log", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean controlFormBrandLogo;
}
