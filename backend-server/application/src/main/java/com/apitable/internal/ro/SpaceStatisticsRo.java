/*
 * APITable Ltd. <legal@apitable.com>
 * Copyright (C)  2022 APITable Ltd. <https://apitable.com>
 *
 * This code file is part of APITable Enterprise Edition.
 *
 * It is subject to the APITable Commercial License and conditional on having a fully paid-up
 * license from APITable.
 *
 * Access to this code file or other code files in this `enterprise` directory and its
 * subdirectories does not constitute permission to use this code or APITable Enterprise Edition
 * features.
 *
 * Unless otherwise noted, all files Copyright © 2022 APITable Ltd.
 *
 * For purchase of APITable Enterprise Edition license, please contact <sales@apitable.com>.
 */

package com.apitable.internal.ro;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.Data;

/**
 * <p>
 * space statistics parameters.
 * </p>
 */
@Data
@Schema(description = "space statistics param")
public class SpaceStatisticsRo {
    @Schema(description = "count of view type", example = "{1: 1, 2: 3}")
    private Map<Integer, Long> viewCount;

    @Schema(description = "record count", example = "111")
    private Long recordCount;
}
