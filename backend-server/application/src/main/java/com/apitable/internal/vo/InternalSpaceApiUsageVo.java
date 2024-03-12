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

package com.apitable.internal.vo;

import com.apitable.shared.support.serializer.NullBooleanSerializer;
import com.apitable.shared.support.serializer.NullNumberSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * space subscription plan resource view.
 */
@Data
@Schema(description = "space subscription plan resource view")
public class InternalSpaceApiUsageVo {

    @Schema(description = "whether to allow over limiting", example = "false")
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean isAllowOverLimit;

    @Schema(description = "api usage used", example = "10000", deprecated = true)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    @Deprecated(since = "1.8.0", forRemoval = true)
    private Long apiUsageUsedCount;

    @Schema(description = "api call nums used current month", example = "10000")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long apiCallUsedNumsCurrentMonth;

    @Schema(description = "maximum api usage", example = "60000", deprecated = true)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    @Deprecated(since = "1.8.0", forRemoval = true)
    private Long maxApiUsageCount;

    @Schema(description = "maximum api usage", example = "60000")
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Long apiCallNumsPerMonth;
}
