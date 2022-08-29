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
import com.vikadata.api.annotation.PageObjectParam;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.helper.PageHelper;
import com.vikadata.api.lang.PageInfo;
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
 * V码 兑换券模板接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/20
 */
@RestController
@Api(tags = "V码模块_V码兑换券模板相关服务接口")
@ApiResource(path = "/vcode/coupon")
public class VCodeCouponController {

    @Resource
    private IVCodeCouponService iVCodeCouponService;

    @Resource
    private IGmService iGmService;

    @GetResource(path = "/list", requiredPermission = false)
    @ApiOperation(value = "查询兑换券模板列表")
    @ApiImplicitParam(name = "keyword", value = "搜索词", dataTypeClass = String.class, paramType = "query", example = "渠道推广")
    public ResponseData<List<VCodeCouponVo>> list(@RequestParam(name = "keyword", required = false) String keyword) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_COUPON_QUERY);
        return ResponseData.success(iVCodeCouponService.getVCodeCouponVo(keyword));
    }

    @GetResource(path = "/page", requiredPermission = false)
    @ApiOperation(value = "分页查询兑换券模板列表", notes = PAGE_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "keyword", value = "搜索词", dataTypeClass = String.class, paramType = "query", example = "渠道推广"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "分页参数", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseData<PageInfo<VCodeCouponPageVo>> page(@RequestParam(name = "keyword", required = false) String keyword, @PageObjectParam Page page) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_COUPON_QUERY);
        return ResponseData.success(PageHelper.build(iVCodeCouponService.getVCodeCouponPageVo(page, keyword)));
    }

    @PostResource(path = "/create", requiredPermission = false)
    @ApiOperation(value = "创建兑换券模板")
    public ResponseData<VCodeCouponVo> create(@RequestBody @Valid VCodeCouponRo ro) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_COUPON_MANAGE);
        Long templateId = iVCodeCouponService.create(ro);
        return ResponseData.success(VCodeCouponVo.builder().templateId(templateId).count(ro.getCount()).comment(ro.getComment()).build());
    }

    @PostResource(path = "/edit/{templateId}", requiredPermission = false)
    @ApiOperation(value = "编辑兑换券模板")
    @ApiImplicitParam(name = "templateId", value = "兑换券模板ID", required = true, dataTypeClass = String.class, paramType = "path", example = "12359")
    public ResponseData<Void> edit(@PathVariable("templateId") Long templateId, @RequestBody VCodeCouponRo ro) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_COUPON_MANAGE);
        iVCodeCouponService.edit(userId, templateId, ro);
        return ResponseData.success();
    }

    @PostResource(path = "/delete/{templateId}", method = { RequestMethod.DELETE, RequestMethod.POST }, requiredPermission = false)
    @ApiOperation(value = "删除兑换券模板")
    @ApiImplicitParam(name = "templateId", value = "兑换券模板ID", required = true, dataTypeClass = String.class, paramType = "path", example = "12359")
    public ResponseData<Void> delete(@PathVariable("templateId") Long templateId) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_COUPON_MANAGE);
        // 检查兑换券模是否存在
        iVCodeCouponService.checkCouponIfExist(templateId);
        // 逻辑删除
        iVCodeCouponService.delete(userId, templateId);
        return ResponseData.success();
    }

}
