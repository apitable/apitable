package com.vikadata.api.template.controller;

import java.util.List;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.context.LoginContext;
import com.vikadata.api.template.vo.AlbumContentVo;
import com.vikadata.api.template.vo.AlbumVo;
import com.vikadata.api.template.service.ITemplateAlbumService;
import com.vikadata.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * Template Center - Template Album API
 * </p>
 */
@RestController
@Api(tags = "Template Center - Template Album API")
@ApiResource(path = "/")
public class TemplateAlbumController {

    @Resource
    private ITemplateAlbumService iTemplateAlbumService;

    @GetResource(path = "/template/albums/{albumId}", requiredLogin = false)
    @ApiOperation(value = "Get The Template Album Content")
    @ApiImplicitParam(name = "albumId", value = "Template Album ID", dataTypeClass = String.class, paramType = "path", example = "albnafuwa2snc")
    public ResponseData<AlbumContentVo> getAlbumContent(@PathVariable("albumId") String albumId) {
        return ResponseData.success(iTemplateAlbumService.getAlbumContentVo(albumId));
    }

    @GetResource(path = "/template/albums/recommend", requiredLogin = false)
    @ApiOperation(value = "Get Recommended Template Albums")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "excludeAlbumId", value = "Exclude Album", dataTypeClass = String.class, paramType = "query", example = "albnafuwa2snc"),
            @ApiImplicitParam(name = "maxCount", value = "Max Count of Load(The number of response result may be smaller than this)", dataTypeClass = Integer.class, paramType = "query", example = "5")
    })
    public ResponseData<List<AlbumVo>> getRecommendedAlbums(@RequestParam(value = "excludeAlbumId", required = false) String excludeAlbumId,
            @RequestParam(value = "maxCount", required = false, defaultValue = "5") Integer maxCount) {
        String lang = LoginContext.me().getLocaleStrWithUnderLine();
        return ResponseData.success(iTemplateAlbumService.getRecommendedAlbums(lang, maxCount, excludeAlbumId));
    }

}
