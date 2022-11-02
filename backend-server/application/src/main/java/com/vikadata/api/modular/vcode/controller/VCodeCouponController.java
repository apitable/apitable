package com.vikadata.api.modular.vcode.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.util.page.PageObjectParam;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.util.page.PageHelper;
import com.vikadata.api.util.page.PageInfo;
import com.vikadata.api.model.ro.vcode.VCodeCouponRo;
import com.vikadata.api.model.vo.vcode.VCodeCouponPageVo;
import com.vikadata.api.model.vo.vcode.VCodeCouponVo;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.vcode.service.IVCodeCouponService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.PageConstants.PAGE_DESC;
import static com.vikadata.api.constants.PageConstants.PAGE_PARAM;
import static com.vikadata.api.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;

/**
 * <p>
 * VCode System - Coupon API
 * </p>
 */
@RestController
@Api(tags = "VCode System - Coupon API")
@ApiResource(path = "/vcode/coupon")
public class VCodeCouponController {

    @Resource
    private IVCodeCouponService iVCodeCouponService;

    @Resource
    private IGmService iGmService;

    @GetResource(path = "/list", requiredPermission = false)
    @ApiOperation(value = "Query Coupon View List")
    @ApiImplicitParam(name = "keyword", value = "Keyword", dataTypeClass = String.class, paramType = "query", example = "channel")
    public ResponseData<List<VCodeCouponVo>> list(@RequestParam(name = "keyword", required = false) String keyword) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_COUPON_QUERY);
        return ResponseData.success(iVCodeCouponService.getVCodeCouponVo(keyword));
    }

    @GetResource(path = "/page", requiredPermission = false)
    @ApiOperation(value = "Query Coupon Page", notes = PAGE_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "keyword", value = "Keyword", dataTypeClass = String.class, paramType = "query", example = "channel"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "Page Params", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseData<PageInfo<VCodeCouponPageVo>> page(@RequestParam(name = "keyword", required = false) String keyword, @PageObjectParam Page page) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_COUPON_QUERY);
        return ResponseData.success(PageHelper.build(iVCodeCouponService.getVCodeCouponPageVo(page, keyword)));
    }

    @PostResource(path = "/create", requiredPermission = false)
    @ApiOperation(value = "Create Coupon Template")
    public ResponseData<VCodeCouponVo> create(@RequestBody @Valid VCodeCouponRo ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_COUPON_MANAGE);
        Long templateId = iVCodeCouponService.create(ro);
        return ResponseData.success(VCodeCouponVo.builder().templateId(templateId).count(ro.getCount()).comment(ro.getComment()).build());
    }

    @PostResource(path = "/edit/{templateId}", requiredPermission = false)
    @ApiOperation(value = "Edit Coupon Template")
    @ApiImplicitParam(name = "templateId", value = "Coupon Template ID", required = true, dataTypeClass = String.class, paramType = "path", example = "12359")
    public ResponseData<Void> edit(@PathVariable("templateId") Long templateId, @RequestBody VCodeCouponRo ro) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_COUPON_MANAGE);
        iVCodeCouponService.edit(userId, templateId, ro);
        return ResponseData.success();
    }

    @PostResource(path = "/delete/{templateId}", method = { RequestMethod.DELETE, RequestMethod.POST }, requiredPermission = false)
    @ApiOperation(value = "Delete Coupon Template")
    @ApiImplicitParam(name = "templateId", value = "Coupon Template ID", required = true, dataTypeClass = String.class, paramType = "path", example = "12359")
    public ResponseData<Void> delete(@PathVariable("templateId") Long templateId) {
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_COUPON_MANAGE);
        // Verify redemption code
        iVCodeCouponService.checkCouponIfExist(templateId);
        // Update delete status
        iVCodeCouponService.delete(userId, templateId);
        return ResponseData.success();
    }

}
