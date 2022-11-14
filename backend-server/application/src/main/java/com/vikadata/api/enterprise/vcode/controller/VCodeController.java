package com.vikadata.api.enterprise.vcode.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.enterprise.vcode.service.IVCodeService;
import com.vikadata.api.shared.util.page.PageObjectParam;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.enterprise.gm.enums.GmAction;
import com.vikadata.api.shared.util.page.PageHelper;
import com.vikadata.api.shared.util.page.PageInfo;
import com.vikadata.api.enterprise.vcode.ro.VCodeCreateRo;
import com.vikadata.api.enterprise.vcode.ro.VCodeUpdateRo;
import com.vikadata.api.enterprise.vcode.vo.VCodePageVo;
import com.vikadata.api.enterprise.gm.service.IGmService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.shared.constants.PageConstants.PAGE_DESC;
import static com.vikadata.api.shared.constants.PageConstants.PAGE_PARAM;
import static com.vikadata.api.shared.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;

/**
 * <p>
 * VCode System - VCode API
 * </p>
 */
@RestController
@Api(tags = "VCode System - VCode API")
@ApiResource(path = "/vcode")
public class VCodeController {

    @Resource
    private IVCodeService iVCodeService;

    @Resource
    private IGmService iGmService;

    @GetResource(path = "/page", requiredPermission = false)
    @ApiOperation(value = "Query VCode Page", notes = PAGE_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "type", value = "Type (0: official invitation code; 2: redemption code)", dataTypeClass = Integer.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "activityId", value = "Activity ID", dataTypeClass = String.class, paramType = "query", example = "1296402001573097473"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "Page Params", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseData<PageInfo<VCodePageVo>> page(@RequestParam(name = "type", required = false) Integer type,
            @RequestParam(name = "activityId", required = false) Long activityId,
            @PageObjectParam Page page) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_QUERY);
        return ResponseData.success(PageHelper.build(iVCodeService.getVCodePageVo(page, type, activityId)));
    }

    @PostResource(path = "/create", requiredPermission = false)
    @ApiOperation(value = "Create VCode")
    public ResponseData<List<String>> create(@RequestBody @Valid VCodeCreateRo ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_MANAGE);
        List<String> codes = iVCodeService.create(userId, ro);
        return ResponseData.success(codes);
    }

    @PostResource(path = "/edit/{code}", requiredPermission = false)
    @ApiOperation(value = "Edit VCode Setting")
    @ApiImplicitParam(name = "code", value = "VCode", required = true, dataTypeClass = String.class, paramType = "path", example = "vc123")
    public ResponseData<Void> edit(@PathVariable("code") String code, @RequestBody @Valid VCodeUpdateRo ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_MANAGE);
        iVCodeService.edit(userId, code, ro);
        return ResponseData.success();
    }

    @PostResource(path = "/delete/{code}", method = { RequestMethod.DELETE, RequestMethod.POST }, requiredPermission = false)
    @ApiOperation(value = "Delete VCode")
    @ApiImplicitParam(name = "code", value = "VCode", required = true, dataTypeClass = String.class, paramType = "path", example = "vc123")
    public ResponseData<Void> delete(@PathVariable("code") String code) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_MANAGE);
        // Update delete status
        iVCodeService.delete(userId, code);
        return ResponseData.success();
    }

    @PostResource(path = "/exchange/{code}", requiredPermission = false)
    @ApiOperation(value = "Exchange VCode")
    @ApiImplicitParam(name = "code", value = "VCode", required = true, dataTypeClass = String.class, paramType = "path", example = "vc123")
    public ResponseData<Integer> exchange(@PathVariable("code") String code) {
        Long userId = SessionContext.getUserId();
        // Check redemption code
        iVCodeService.checkRedemptionCode(userId, code.toLowerCase());
        // Use redemption code
        Integer integer = iVCodeService.useRedemptionCode(userId, code.toLowerCase());
        return ResponseData.success(integer);
    }

}
