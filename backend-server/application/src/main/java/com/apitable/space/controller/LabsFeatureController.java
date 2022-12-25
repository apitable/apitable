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

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.apitable.space.service.ILabsFeatureService;
import com.apitable.space.vo.UserSpaceLabsFeatureVo;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.core.support.ResponseData;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * Laboratory module experimental function interface
 * </p>
 */
@RestController
@Api(tags = "Laboratory module_ Experimental function interface")
@ApiResource(path = "/labs")
@Slf4j
public class LabsFeatureController {

    @Resource
    private ILabsFeatureService iLabsFeatureService;

    @GetResource(name = "Get Lab Function List", path = "/features", requiredPermission = false)
    @ApiOperation(value = "Get Lab Function List", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<UserSpaceLabsFeatureVo> showAvailableLabsFeatures() {
        // Get a list of available experiments
        return ResponseData.success(iLabsFeatureService.getAvailableLabsFeature());
    }
}
