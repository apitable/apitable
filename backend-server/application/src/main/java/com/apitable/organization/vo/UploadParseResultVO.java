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

package com.apitable.organization.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * Template resolution result view.
 * </p>
 */
@Data
@Schema(description = "Template resolution result view、")
public class UploadParseResultVO {

    @Schema(description = "Total number of resolutions", example = "100")
    private Integer rowCount;

    @Schema(description = "Number of successful parsing", example = "198")
    private Integer successCount;

    @Schema(description = "Number of failed parsing", example = "2")
    private Integer errorCount;

    private List<ParseErrorRecordVO> errorList;
}
