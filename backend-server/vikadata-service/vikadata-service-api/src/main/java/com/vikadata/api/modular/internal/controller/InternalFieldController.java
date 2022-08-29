package com.vikadata.api.modular.internal.controller;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.modular.internal.model.UrlAwareContentVo;
import com.vikadata.api.modular.internal.model.UrlAwareContentsVo;
import com.vikadata.api.modular.internal.model.UrlsWrapperRo;
import com.vikadata.api.modular.internal.service.IFieldService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 *     内部服务-字段服务接口
 * </p>
 * @author tao
 */
@RestController
@ApiResource(path = "/internal/field")
@Api(tags = "内部服务-字段服务接口")
public class InternalFieldController {

    @Resource
    private IFieldService fieldService;

    @PostResource(path = "/url/awareContents", requiredPermission = false)
    @ApiOperation(value = "获取URL相关信息", notes = "获取URL相关信息")
    public ResponseData<UrlAwareContentsVo> urlContentsAwareFill(@RequestBody @Valid UrlsWrapperRo ro) {
        List<String> urls = ro.getUrls();
        Long userId = SessionContext.getUserId();
        UrlAwareContentsVo contents = fieldService.getUrlAwareContents(urls, userId);
        return ResponseData.success(contents);
    }

}
