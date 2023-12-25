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

import static java.util.stream.Collectors.toList;

import com.apitable.core.support.ResponseData;
import com.apitable.organization.dto.LoadSearchDTO;
import com.apitable.organization.service.IOrganizationService;
import com.apitable.organization.vo.UnitInfoVo;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.RestController;

/**
 * Internal Server - Asset API.
 */
@RestController
@ApiResource(path = "/internal/org")
@Tag(name = "Internal")
public class InternalOrganizationController {

    @Resource
    private IOrganizationService iOrganizationService;

    /**
     * Load/search departments and members.
     */
    @GetResource(path = "/loadOrSearch", requiredLogin = false)
    @Operation(summary = "Load/search departments and members", description = "The most recently "
        + "selected units are loaded by default when not keyword. The most recently added member "
        + "of the same group are loaded when not selected. Load max 10")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id",
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW"),
        @Parameter(name = "userId", description = "user id", schema = @Schema(type = "string"),
            in = ParameterIn.QUERY, example = "23232"),
        @Parameter(name = "keyword", description = "keyword", schema = @Schema(type = "string"),
            in = ParameterIn.QUERY, example = "Lili"),
        @Parameter(name = "unitIds", description = "unitIds", schema = @Schema(type = "string"),
            in = ParameterIn.QUERY, example = "1271,1272"),
        @Parameter(name = "filterIds", description = "specifies the organizational unit to "
            +
            "filter", schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "123,124"),
        @Parameter(name = "all", description = "whether to load all departments and members",
            schema = @Schema(type = "boolean"), in = ParameterIn.QUERY),
        @Parameter(name = "searchEmail", description = "whether to search for emails",
            schema = @Schema(type = "boolean"), in = ParameterIn.QUERY)
    })
    public ResponseData<List<UnitInfoVo>> loadOrSearch(@Valid LoadSearchDTO params) {
        // sharing node/template: un login users invoke processing
        Long userId = Long.parseLong(params.getUserId());
        String spaceId = LoginContext.me().getSpaceId();
        List<UnitInfoVo> vos = iOrganizationService.loadOrSearchInfo(userId, spaceId, params, null);
        List<UnitInfoVo> existUnitInfo =
            vos.stream().filter(unitInfoVo -> !unitInfoVo.getIsDeleted()).collect(toList());
        return ResponseData.success(existUnitInfo);
    }
}
