package com.vikadata.api.enterprise.ops.controller;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.enterprise.gm.enums.GmAction;
import com.vikadata.api.enterprise.gm.service.IGmService;
import com.vikadata.api.enterprise.ops.service.IOpsService;
import com.vikadata.core.support.ResponseData;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * Product Operation System API
 * </p>
 */
@Slf4j
@RestController
@ApiResource(path = "/ops")
@Api(tags = "Product Operation System API", hidden = true)
public class OpsController {

    @Resource
    private IGmService iGmService;

    @Resource
    private IOpsService iOpsService;

    @PostResource(path = "/templates/{templateId}/asset/mark", requiredPermission = false)
    @ApiOperation(value = "Template Asset Remark", notes = "Indicates the attachment resource of the specified template. Users refer to this part of the resource without occupying the space station capacity", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
            @ApiImplicitParam(name = "templateId", value = "Template Custom ID", required = true, dataTypeClass = String.class, paramType = "path", example = "tpcE7fyADP99W"),
            @ApiImplicitParam(name = "isReversed", value = "Whether it is a reverse operation, that is, cancel the flag (default false)", dataTypeClass = Boolean.class, paramType = "query")
    })
    public ResponseData<Void> markTemplateAsset(@PathVariable("templateId") String templateId,
            @RequestParam(name = "isReversed", required = false, defaultValue = "false") Boolean isReversed) {
        log.info("Operator 「{}」 {} marks the asset of template「{}」", SessionContext.getUserId(), isReversed ? "reverse" : null, templateId);
        // check permission
        iGmService.validPermission(SessionContext.getUserId(), GmAction.TEMPLATE_ASSET_MARK);
        // mark template asset
        iOpsService.markTemplateAsset(templateId, isReversed);
        return ResponseData.success();
    }

}
