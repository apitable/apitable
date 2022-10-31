package com.vikadata.api.modular.censor.controller;

import javax.annotation.Resource;

import com.baomidou.mybatisplus.core.metadata.IPage;
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
import com.vikadata.api.enums.exception.AuthException;
import com.vikadata.api.util.page.PageHelper;
import com.vikadata.api.util.page.PageInfo;
import com.vikadata.api.model.ro.censor.ContentCensorReportRo;
import com.vikadata.api.model.vo.censor.ContentCensorResultVo;
import com.vikadata.api.modular.censor.service.IContentCensorResultService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.PageConstants.PAGE_DESC;
import static com.vikadata.api.constants.PageConstants.PAGE_PARAM;
import static com.vikadata.api.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;

/**
 * 内容风控接口管理
 * @author Benson Cheung
 * @date 2020/5/7 11:27 上午
 */
@RestController
@Api(tags = "内容风控模块接口")
@ApiResource(path = "/censor")
public class CensorController {

    @Resource
    private IContentCensorResultService censorResultService;

    @GetResource(name = "分页查询举报信息列表", path = "/reports/page", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "分页查询举报信息列表", notes = "分页查询举报信息列表，每个数表对应一行记录，举报次数自动累加" + PAGE_DESC, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "status", value = "处理结果，0 未处理，1 封禁，2 正常（解封）", required = true, dataTypeClass = Integer.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "分页参数，说明看接口描述", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    public ResponseData<PageInfo<ContentCensorResultVo>> readReports(@RequestParam(name = "status", defaultValue = "0") Integer status, @PageObjectParam Page page) {
        IPage<ContentCensorResultVo> pageResult = censorResultService.readReports(status, page);
        return ResponseData.success(PageHelper.build(pageResult));
    }

    @PostResource(name = "提交举报信息", path = "/createReports", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "提交举报信息", notes = "提交举报信息")
    public ResponseData<Void> createReports(@RequestBody ContentCensorReportRo censorReportRo) {
        //匿名用户，校验cookie，防止恶意提交
        censorResultService.createReports(censorReportRo);
        return ResponseData.success();
    }

    @PostResource(name = "管理员处理举报信息", path = "/updateReports", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "管理员处理举报信息（强制在钉钉内打开，自动获取钉钉用户）", notes = "管理员处理举报信息")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "数表ID", required = true, dataTypeClass = String.class, paramType = "query", example = "dstPv5DSHqXknU6Skp"),
            @ApiImplicitParam(name = "status", value = "处理结果，0 未处理，1 封禁，2 正常（解封）", required = true, dataTypeClass = Integer.class, paramType = "query", example = "1")
    })
    public ResponseData<Void> updateReports(@RequestParam("nodeId") String nodeId, @RequestParam("status") Integer status) {
        //查询session中的钉钉会员信息
        String auditorUserId = SessionContext.getDingtalkUserId();
        ExceptionUtil.isNotNull(auditorUserId, AuthException.UNAUTHORIZED);
        censorResultService.updateReports(nodeId, status);
        return ResponseData.success();
    }
}
