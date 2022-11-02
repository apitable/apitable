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
 * Content Risk Control API
 */
@RestController
@Api(tags = "Content Risk Control API")
@ApiResource(path = "/censor")
public class CensorController {

    @Resource
    private IContentCensorResultService censorResultService;

    @GetResource(path = "/reports/page", requiredLogin = false)
    @ApiOperation(value = "Paging query report information list", notes = "Paging query report information list, each table corresponds to a row of records, and the number of reports is automatically accumulated" + PAGE_DESC, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "status", value = "Processing result, 0 unprocessed, 1 banned, 2 normal (unblocked)", required = true, dataTypeClass = Integer.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = PAGE_PARAM, value = "Paging parameters, see the interface description for instructions", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    })
    public ResponseData<PageInfo<ContentCensorResultVo>> readReports(@RequestParam(name = "status", defaultValue = "0") Integer status, @PageObjectParam Page page) {
        IPage<ContentCensorResultVo> pageResult = censorResultService.readReports(status, page);
        return ResponseData.success(PageHelper.build(pageResult));
    }

    @PostResource(path = "/createReports", requiredLogin = false)
    @ApiOperation(value = "Submit a report")
    public ResponseData<Void> createReports(@RequestBody ContentCensorReportRo censorReportRo) {
        // If it is an anonymous user, verify the cookie to prevent malicious submission
        censorResultService.createReports(censorReportRo);
        return ResponseData.success();
    }

    @PostResource(path = "/updateReports", requiredLogin = false)
    @ApiOperation(value = "Handling whistleblower information", notes = "Force to open in DingTalk, automatically acquire DingTalk users")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "nodeId", value = "node id", required = true, dataTypeClass = String.class, paramType = "query", example = "dstPv5DSHqXknU6Skp"),
            @ApiImplicitParam(name = "status", value = "Processing result, 0 unprocessed, 1 banned, 2 normal (unblocked)", required = true, dataTypeClass = Integer.class, paramType = "query", example = "1")
    })
    public ResponseData<Void> updateReports(@RequestParam("nodeId") String nodeId, @RequestParam("status") Integer status) {
        // Query the DingTalk member information in the session
        String auditorUserId = SessionContext.getDingtalkUserId();
        ExceptionUtil.isNotNull(auditorUserId, AuthException.UNAUTHORIZED);
        censorResultService.updateReports(nodeId, status);
        return ResponseData.success();
    }
}
