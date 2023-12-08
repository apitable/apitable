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

import com.apitable.core.support.ResponseData;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.context.LoginContext;
import com.apitable.template.service.ITemplateAlbumService;
import com.apitable.template.vo.AlbumContentVo;
import com.apitable.template.vo.AlbumVo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Template Center - Template Album API.
 */
@RestController
@Tag(name = "Template Center - Template Album API")
@ApiResource
public class TemplateAlbumController {

    @Resource
    private ITemplateAlbumService iTemplateAlbumService;

    /**
     * Get The Template Album Content.
     */
    @GetResource(path = "/template/albums/{albumId}", requiredLogin = false)
    @Operation(summary = "Get The Template Album Content")
    @Parameter(name = "albumId", description = "Template Album ID",
        schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "albnafuwa2snc")
    public ResponseData<AlbumContentVo> getAlbumContent(@PathVariable("albumId") String albumId) {
        return ResponseData.success(iTemplateAlbumService.getAlbumContentVo(albumId));
    }

    /**
     * Get Recommended Template Albums.
     */
    @GetResource(path = "/template/albums/recommend", requiredLogin = false)
    @Operation(summary = "Get Recommended Template Albums")
    @Parameters({
        @Parameter(name = "excludeAlbumId", description = "Exclude Album",
            schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = "albnafuwa2snc"),
        @Parameter(name = "maxCount", in = ParameterIn.QUERY,
            description = "Max Count of Load.The number of response result may be smaller than it",
            schema = @Schema(type = "integer"), example = "5")
    })
    public ResponseData<List<AlbumVo>> getRecommendedAlbums(
        @RequestParam(value = "excludeAlbumId", required = false) String excludeAlbumId,
        @RequestParam(value = "maxCount", required = false, defaultValue = "5") Integer maxCount) {
        String lang = LoginContext.me().getLocaleStrWithUnderLine();
        return ResponseData.success(
            iTemplateAlbumService.getRecommendedAlbums(lang, maxCount, excludeAlbumId));
    }

}
