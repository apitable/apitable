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

import com.apitable.shared.support.serializer.CreditUnitSerializer;
import com.apitable.shared.support.serializer.ImageSerializer;
import com.apitable.shared.support.serializer.LocalDateTimeToMilliSerializer;
import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.apitable.shared.support.serializer.NullStringSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Instrument cluster space information vo.
 * </p>
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Schema(description = "Instrument cluster space information vo")
public class SpaceInfoVO {

    @Schema(description = "Space name", example = "My Workspace")
    private String spaceName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @Schema(description = "Space logo", example = "http://...")
    private String spaceLogo;

    @Schema(description = "Creator name", example = "Zhang San")
    private String creatorName;

    @Schema(description = "Whether the member (creator) has modified the nickname")
    private Boolean isCreatorNameModified;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @Schema(description = "Creator's avatar", example = "http://...")
    private String creatorAvatar;

    @Schema(description = "Space owner name", example = "Li Si")
    private String ownerName;

    @Schema(description = "Whether the member (owner) has modified the nickname")
    private Boolean isOwnerNameModified;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @Schema(description = "Space owner's avatar", example = "http://...")
    private String ownerAvatar;

    @Schema(description = "Creation timestamp (ms)", example = "1573561644000")
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class,
        nullsUsing = NullNumberSerializer.class)
    private LocalDateTime createTime;

    @Schema(description = "Formal deletion timestamp (ms)", example = "1573561644000")
    @JsonSerialize(using = LocalDateTimeToMilliSerializer.class,
        nullsUsing = NullNumberSerializer.class)
    private LocalDateTime delTime;

    @Schema(description = "Third party integration binding information")
    private SpaceSocialConfig social;

    @Schema(description = "Number of departments", example = "5")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long deptNumber;

    @Schema(description = "Number of seats", example = "5")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long seats;

    @Schema(description = "Number of tables", example = "5")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long sheetNums;

    @Schema(description = "Total rows of all tables in the space", example = "5")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long recordNums;

    @Schema(description = "Number of space administrators", example = "5")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long adminNums;

    @Schema(description = "Used attachment capacity (in bytes)", example = "1024")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long capacityUsedSizes;

    @Schema(description = "Cumulative usage of API calls", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long apiRequestCountUsage;

    @Schema(description = "Total number of field permission settings", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long fieldRoleNums;

    @Schema(description = "Total number of file permission settings", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long nodeRoleNums;

    @Schema(description = "Total Kanban Views", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long kanbanViewNums;

    @Schema(description = "Total Album Views", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long galleryViewNums;

    @Schema(description = "Total Gantt Views", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long ganttViewNums;

    @Schema(description = "Total Calendar Views", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long calendarViewNums;

    @Schema(description = "Total Form Views", example = "10")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long formViewNums;

    @Schema(description = "Used current package attachment capacity (unit: bytes)",
        example = "1024")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long currentBundleCapacityUsedSizes;

    @Schema(description = "Used complimentary accessory capacity (unit: bytes)", example = "1024")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long giftCapacityUsedSizes;

    @Schema(description = "Number of tables (mirrors)", example = "5")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long mirrorNums;

    @Schema(description = "Number of used credit", example = "5.0001")
    @JsonSerialize(nullsUsing = CreditUnitSerializer.class)
    private BigDecimal usedCredit;

    @Schema(description = "Whether enable chatbot feature")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isEnableChatbot;

    @Schema(description = "Seat usage")
    private SeatUsage seatUsage;

    @Schema(description = "Number of widget", example = "5")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long widgetNums;

    @Schema(description = "Automation Runs Count", example = "5")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long automationRunsNums;

    @Schema(description = "space feature")
    private SpaceGlobalFeature feature;

    @Schema(description = "User's resource information view in the space")
    private UserSpaceVo userResource;

    @Schema(description = "List of experimental functions",
            type = "java.util.List", example = "[\"RENDER_PROMPT\", \"ASYNC_COMPUTE\", \"ROBOT\"]")
    private List<String> labsKeys;


}
