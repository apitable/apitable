package com.vikadata.api.internal.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.organization.dto.LoadSearchDTO;
import com.vikadata.api.organization.service.IOrganizationService;
import com.vikadata.api.organization.vo.UnitInfoVo;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.constants.ParamsConstants;
import com.vikadata.api.shared.context.LoginContext;
import com.vikadata.core.support.ResponseData;

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
