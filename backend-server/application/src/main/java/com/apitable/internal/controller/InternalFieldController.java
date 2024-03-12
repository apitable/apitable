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

package com.apitable.internal.controller;

import com.apitable.core.support.ResponseData;
import com.apitable.internal.ro.UrlsWrapperRo;
import com.apitable.internal.service.IFieldService;
import com.apitable.internal.vo.UrlAwareContentsVo;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.context.SessionContext;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Internal Service - Field Service Interface.
 */
@RestController
@ApiResource(path = "/internal/field")
@Tag(name = "Internal")
public class InternalFieldController {

    @Resource
    private IFieldService fieldService;

    /**
     * Get url related information.
     */
    @PostResource(path = "/url/awareContents", requiredPermission = false)
    @Operation(summary = "Fetch url", description = "get url related information")
    public ResponseData<UrlAwareContentsVo> urlContentsAwareFill(
        @RequestBody @Valid UrlsWrapperRo ro) {
        List<String> urls = ro.getUrls();
        Long userId = SessionContext.getUserId();
        UrlAwareContentsVo contents = fieldService.getUrlAwareContents(urls, userId);
        return ResponseData.success(contents);
    }

}
