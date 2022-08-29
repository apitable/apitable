package com.vikadata.api.modular.ops.controller;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.developer.GmAction;
import com.vikadata.api.modular.developer.service.IGmService;
import com.vikadata.api.modular.ops.service.IOpsService;
import com.vikadata.core.support.ResponseData;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 产品运营系统相关接口
 * </p>
 *
 * @author Chambers
 * @date 2022/8/15
 */
@Slf4j
@RestController
@ApiResource(path = "/ops")
@Api(tags = "产品运营系统相关接口", hidden = true)
public class OpsController {

    @Resource
    private IGmService iGmService;

    @Resource
    private IOpsService iOpsService;

    @PostResource(path = "/templates/{templateId}/asset/mark", requiredPermission = false)
    @ApiOperation(value = "模板资源标志", notes = "标志指定模板的附件资源，用户引用这部分资源不占用空间站容量", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "templateId", value = "模板ID", required = true, dataTypeClass = String.class, paramType = "path", example = "tpcE7fyADP99W"),
            @ApiImplicitParam(name = "isReversed", value = "是否是反向操作，即取消标志（默认false）", dataTypeClass = Boolean.class, paramType = "query")
    })
    public ResponseData<Void> markTemplateAsset(@PathVariable("templateId") String templateId,
            @RequestParam(name = "isReversed", required = false, defaultValue = "false") Boolean isReversed) {
        log.info("操作者「{}」对模板「{}」的资源进行{}标志", SessionContext.getUserId(), templateId, isReversed ? "反向" : null);
        // 校验权限
        iGmService.validPermission(SessionContext.getUserId(), GmAction.TEMPLATE_ASSET_MARK);
        // 标志模板资源
        iOpsService.markTemplateAsset(templateId, isReversed);
        return ResponseData.success();
    }

}
