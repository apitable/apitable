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

package com.apitable.workspace.ro;

import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * DataSheet record request parameters.
 * </p>
 */
@Schema(description = "DataSheet record request parameters")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class RecordMapRo {

    @Schema(description = "Record ID")
    private String id;

    @Schema(description = "Data recorded in one row (corresponding to each field)")
    private JSONObject data;

    @Schema(description = "The historical version number sorted is the revision of the original "
        + "operation, and the array subscript is the revision of the current record")
    private String revisionHistory;

    @Schema(description = "Version No")
    private Long revision;

    @JsonIgnore
    @TableLogic
    @Schema(description = "Delete tag (0: No, 1: Yes)")
    private Boolean isDeleted;

    @Schema(description = "recordMeta fieldUpdatedMap")
    private JSONObject fieldUpdatedMap;
}
