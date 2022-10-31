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
import com.vikadata.api.model.ro.vcode.VCodeActivityRo;
import com.vikadata.api.model.vo.vcode.VCodeActivityPageVo;
import com.vikadata.api.model.vo.vcode.VCodeActivityVo;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.vcode.service.IVCodeActivityService;
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
 * V码 活动接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/14
 */
@RestController
@Api(tags = "V码模块_活动相关服务接口")
@ApiResource(path = "/vcode/activity")
public class VCodeActivityController {

    @Resource
    private IGmService iGmService;

    @Resource
    private IVCodeActivityService iVCodeActivityService;

    @GetResource(path = "/list", requiredPermission = false)
    @ApiOperation(value = "查询活动列表")
    @ApiImplicitParam(name = "keyword", value = "搜索词", dataTypeClass = String.class, paramType = "query", example = "渠道推广")
    public ResponseData<List<VCodeActivityVo>> list(@RequestParam(name = "keyword", required = false) String keyword) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.ACTIVITY_QUERY);
        return ResponseData.success(iVCodeActivityService.getVCodeActivityVo(keyword));
    }

    @GetResource(path = "/page", requiredPermission = false)
    @ApiOperation(value = "分页查询活动列表", notes = PAGE_DESC)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "keyword", value = "搜索词", dataTypeClass = String.class, paramType = "query", example = "渠道推广"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "分页参数", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public ResponseData<PageInfo<VCodeActivityPageVo>> page(@RequestParam(name = "keyword", required = false) String keyword, @PageObjectParam Page page) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.ACTIVITY_QUERY);
        return ResponseData.success(PageHelper.build(iVCodeActivityService.getVCodeActivityPageVo(page, keyword)));
    }

    @PostResource(path = "/create", requiredPermission = false)
    @ApiOperation(value = "创建活动")
    public ResponseData<VCodeActivityVo> create(@RequestBody @Valid VCodeActivityRo ro) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.ACTIVITY_MANAGE);
        Long id = iVCodeActivityService.create(ro);
        return ResponseData.success(VCodeActivityVo.builder().activityId(id).name(ro.getName()).scene(ro.getScene()).build());
    }

    @PostResource(path = "/edit/{activityId}", requiredPermission = false)
    @ApiOperation(value = "修改活动信息")
    @ApiImplicitParam(name = "activityId", value = "活动ID", required = true, dataTypeClass = String.class, paramType = "path", example = "12369")
    public ResponseData<Void> edit(@PathVariable("activityId") Long activityId, @RequestBody VCodeActivityRo ro) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.ACTIVITY_MANAGE);
        iVCodeActivityService.edit(userId, activityId, ro);
        return ResponseData.success();
    }

    @PostResource(path = "/delete/{activityId}", method = { RequestMethod.DELETE, RequestMethod.POST }, requiredPermission = false)
    @ApiOperation(value = "删除活动")
    @ApiImplicitParam(name = "activityId", value = "活动ID", required = true, dataTypeClass = String.class, paramType = "path", example = "12369")
    public ResponseData<Void> delete(@PathVariable("activityId") Long activityId) {
        // 校验权限
        Long userId = SessionContext.getUserId();
        iGmService.validPermission(userId, GmAction.ACTIVITY_MANAGE);
        // 检查活动是否存在
        iVCodeActivityService.checkActivityIfExist(activityId);
        // 逻辑删除
        iVCodeActivityService.delete(userId, activityId);
        return ResponseData.success();
    }
}
