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

package com.apitable.organization.ro;

import com.apitable.core.support.deserializer.StringArrayToLongArrayDeserializer;
import com.apitable.core.support.deserializer.StringToLongDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Schema.RequiredMode;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Data;

/**
 * <p>
 * Delete Member Request Parameter.
 * </p>
 */
@Data
@Schema(description = "Batch Delete Member Request Parameters")
public class DeleteBatchMemberRo {

    @Schema(description = "Delete action (0: delete this department, 1: delete from the "
        + "organization structure completely)", example = "0")
    private int action;

    @NotEmpty
    @Schema(description = "Member ID Collection", type = "List", example = "[\"10101\",\"10102\","
        + "\"10103\",\"10104\"]", requiredMode = RequiredMode.REQUIRED)
    @JsonDeserialize(using = StringArrayToLongArrayDeserializer.class)
    private List<Long> memberId;

    @Schema(description = "Department ID, if it is the root department, can not be transferred. "
        + "It is deleted from the root door by default,"
        + " consistent with the principle of removing members from the space",
        requiredMode = RequiredMode.REQUIRED, type = "java.lang.String", example = "1")
    @JsonDeserialize(using = StringToLongDeserializer.class)
    private Long teamId;
}
