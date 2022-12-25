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

package com.apitable.internal.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.apitable.organization.dto.LoadSearchDTO;
import com.apitable.organization.service.IOrganizationService;
import com.apitable.organization.vo.UnitInfoVo;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.core.support.ResponseData;

import org.springframework.web.bind.annotation.RestController;

import static java.util.stream.Collectors.toList;

/**
 * <p>
 * Internal Server - Asset API
 * </p>
 *
 * @author Chambers
 * @date 2022/8/20
 */
@RestController
@ApiResource(path = "/internal/org")
@Api(tags = "Internal Server - org API")
public class InternalOrganizationController {
    @Resource
    private IOrganizationService iOrganizationService;

    @GetResource(path = "/loadOrSearch", requiredLogin = false)
    @ApiOperation(value = "Load/search departments and members", notes = "The most recently selected units are loaded by default when not keyword. The most recently added member of the same group are loaded when not selected. Load max 10")
    @ApiImplicitParams({
            @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
            @ApiImplicitParam(name = "userId", value = "user id", dataTypeClass = String.class, paramType = "query", example = "23232"),
            @ApiImplicitParam(name = "keyword", value = "keyword", dataTypeClass = String.class, paramType = "query", example = "Lili"),
            @ApiImplicitParam(name = "unitIds", value = "unitIds", dataTypeClass = String.class, paramType = "query", example = "1271,1272"),
            @ApiImplicitParam(name = "filterIds", value = "specifies the organizational unit to filter", dataTypeClass = String.class, paramType = "query", example = "123,124"),
            @ApiImplicitParam(name = "all", value = "whether to load all departments and members", defaultValue = "false", dataTypeClass = Boolean.class, paramType = "query"),
            @ApiImplicitParam(name = "searchEmail", value = "whether to search for emails", defaultValue = "false", dataTypeClass = Boolean.class, paramType = "query")
    })
    public ResponseData<List<UnitInfoVo>> loadOrSearch(@Valid LoadSearchDTO params) {
        // sharing node/template: un login users invoke processing
        Long userId = Long.parseLong(params.getUserId());
        String spaceId = LoginContext.me().getSpaceId();
        List<UnitInfoVo> vos = iOrganizationService.loadOrSearchInfo(userId, spaceId, params, null);
        List<UnitInfoVo> existUnitInfo = vos.stream().filter(unitInfoVo -> !unitInfoVo.getIsDeleted()).collect(toList());
        return ResponseData.success(existUnitInfo);
    }
}
