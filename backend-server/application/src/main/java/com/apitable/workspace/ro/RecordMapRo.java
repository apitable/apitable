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
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

/**
 * <p>
 * DataSheet record request parameters
 * </p>
 */
@ApiModel("DataSheet record request parameters")
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class RecordMapRo {

    @ApiModelProperty(value = "Record ID", position = 2)
    private String id;

    @ApiModelProperty(value = "Data recorded in one row (corresponding to each field)", position = 3)
    private JSONObject data;

    @ApiModelProperty(value = "The historical version number sorted is the revision of the original operation, and the array subscript is the revision of the current record", position = 5)
    private String revisionHistory;

    @ApiModelProperty(value = "Version No", position = 6)
    private Long revision;

    @JsonIgnore
    @TableLogic
    @ApiModelProperty(value = "Delete tag (0: No, 1: Yes)", position = 7)
    private Boolean isDeleted;

    @ApiModelProperty(value = "recordMeta fieldUpdatedMap", position = 8)
    private JSONObject fieldUpdatedMap;
}
