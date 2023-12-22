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

package com.apitable.space.controller;

import com.apitable.core.support.ResponseData;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.space.service.ILabsFeatureService;
import com.apitable.space.vo.UserSpaceLabsFeatureVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RestController;

/**
 * Laboratory module experimental function interface.
 */
@RestController
@Tag(name = "Laboratory module_ Experimental function interface")
@ApiResource(path = "/labs")
public class LabsFeatureController {

    @Resource
    private ILabsFeatureService iLabsFeatureService;

    /**
     * Get Lab Function List.
     */
    @GetResource(path = "/features", requiredPermission = false)
    @Operation(summary = "Get Lab Function List")
    public ResponseData<UserSpaceLabsFeatureVo> showAvailableLabsFeatures() {
        // Get a list of available experiments
        return ResponseData.success(iLabsFeatureService.getAvailableLabsFeature());
    }
}
