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
import com.vikadata.api.model.ro.vcode.VCodeCreateRo;
import com.vikadata.api.model.ro.vcode.VCodeUpdateRo;
import com.vikadata.api.model.vo.vcode.VCodePageVo;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.vcode.service.IVCodeService;
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
 * V码 相关接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/12
 */
@RestController
@Api(tags = "V码模块_V码相关服务接口")
@ApiResource(path = "/vcode")
public class VCodeController {

    @Resource
    private IVCodeService iVCodeService;

    @Resource
    private IGmService iGmService;

    @GetResource(path = "/page", requiredPermission = false)
    @ApiOperation(value = "分页查询列表", notes = PAGE_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "type", value = "类型(0:官方邀请码;2:兑换码)", dataTypeClass = Integer.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "activityId", value = "活动ID", dataTypeClass = String.class, paramType = "query", example = "1296402001573097473"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "分页参数", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseData<PageInfo<VCodePageVo>> page(@RequestParam(name = "type", required = false) Integer type,
            @RequestParam(name = "activityId", required = false) Long activityId,
            @PageObjectParam Page page) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_QUERY);
        return ResponseData.success(PageHelper.build(iVCodeService.getVCodePageVo(page, type, activityId)));
    }

    @PostResource(path = "/create", requiredPermission = false)
    @ApiOperation(value = "创建V码")
    public ResponseData<List<String>> create(@RequestBody @Valid VCodeCreateRo ro) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_MANAGE);
        List<String> codes = iVCodeService.create(userId, ro);
        return ResponseData.success(codes);
    }

    @PostResource(path = "/edit/{code}", requiredPermission = false)
    @ApiOperation(value = "编辑V码配置")
    @ApiImplicitParam(name = "code", value = "V码", required = true, dataTypeClass = String.class, paramType = "path", example = "vc123")
    public ResponseData<Void> edit(@PathVariable("code") String code, @RequestBody @Valid VCodeUpdateRo ro) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_MANAGE);
        iVCodeService.edit(userId, code, ro);
        return ResponseData.success();
    }

    @PostResource(path = "/delete/{code}", method = { RequestMethod.DELETE, RequestMethod.POST }, requiredPermission = false)
    @ApiOperation(value = "删除V码")
    @ApiImplicitParam(name = "code", value = "V码", required = true, dataTypeClass = String.class, paramType = "path", example = "vc123")
    public ResponseData<Void> delete(@PathVariable("code") String code) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.V_CODE_MANAGE);
        // 逻辑删除
        iVCodeService.delete(userId, code);
        return ResponseData.success();
    }

    @PostResource(path = "/exchange/{code}", requiredPermission = false)
    @ApiOperation(value = "兑换V码")
    @ApiImplicitParam(name = "code", value = "V码", required = true, dataTypeClass = String.class, paramType = "path", example = "vc123")
    public ResponseData<Integer> exchange(@PathVariable("code") String code) {
        Long userId = SessionContext.getUserId();
        // 校验兑换码
        iVCodeService.checkRedemptionCode(userId, code.toLowerCase());
        // 使用兑换码
        Integer integer = iVCodeService.useRedemptionCode(userId, code.toLowerCase());
        return ResponseData.success(integer);
    }

}
