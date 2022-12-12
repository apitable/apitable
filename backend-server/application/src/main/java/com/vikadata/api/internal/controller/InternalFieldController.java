package com.vikadata.api.internal.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.internal.vo.UrlAwareContentsVo;
import com.vikadata.api.internal.ro.UrlsWrapperRo;
import com.vikadata.api.internal.service.IFieldService;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Internal Service - Field Service Interface
 */
@RestController
@ApiResource(path = "/internal/field")
@Api(tags = "Internal Service - Field Service Interface")
public class InternalFieldController {

    @Resource
    private IFieldService fieldService;

    @PostResource(path = "/url/awareContents", requiredPermission = false)
    @ApiOperation(value = "get url related information", notes = "get url related information")
    public ResponseData<UrlAwareContentsVo> urlContentsAwareFill(@RequestBody @Valid UrlsWrapperRo ro) {
        List<String> urls = ro.getUrls();
        Long userId = SessionContext.getUserId();
        UrlAwareContentsVo contents = fieldService.getUrlAwareContents(urls, userId);
        return ResponseData.success(contents);
    }

}
