/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.template.controller;

import java.util.List;

import javax.annotation.Resource;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.context.LoginContext;
import com.apitable.template.vo.AlbumContentVo;
import com.apitable.template.vo.AlbumVo;
import com.apitable.template.service.ITemplateAlbumService;
import com.apitable.core.support.ResponseData;

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
