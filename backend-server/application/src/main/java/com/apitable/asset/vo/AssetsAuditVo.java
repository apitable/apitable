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

package com.apitable.asset.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Attachment audit result vo.
 * </p>
 */
@Data
@Schema(description = "Attachment audit result vo")
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class AssetsAuditVo {

    /**
     * asset id.
     */
    private Long assetId;

    /**
     * Cloud file storage path.
     */
    private String assetFileUrl;

    /**
     * [Redundancy] md 5 Summary.
     */
    private String assetChecksum;

    /**
     * Audit result score.
     */
    private float auditResultScore;


    /**
     * Suggestions on audit results, including:[“block”,”review”,”pass”].
     */
    private String auditResultSuggestion;

    /**
     * Audit Type, currently supports:pul[Pornographic]/terror[Violent phobia]/politician[Sensitive
     * person]/ads[Image advertisement recognition].
     */
    private String auditScenes;


    /**
     * Reviewer Open Id.
     */
    private String auditorOpenid;

    /**
     * Name of reviewer.
     */
    private String auditorName;

    /**
     * Approve or not (0: No, 1: Yes).
     */
    private Boolean isAudited;

}
