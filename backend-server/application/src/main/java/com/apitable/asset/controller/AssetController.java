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

package com.apitable.asset.controller;

import static com.apitable.shared.constants.PageConstants.PAGE_PARAM;
import static com.apitable.shared.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;

import com.apitable.asset.enums.AssetType;
import com.apitable.asset.ro.AssetsAuditRo;
import com.apitable.asset.ro.AttachAuditCallbackRo;
import com.apitable.asset.ro.AttachOpRo;
import com.apitable.asset.ro.AttachUrlOpRo;
import com.apitable.asset.service.IAssetAuditService;
import com.apitable.asset.service.IAssetService;
import com.apitable.asset.vo.AssetUploadResult;
import com.apitable.asset.vo.AssetsAuditVo;
import com.apitable.auth.enums.AuthException;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.util.page.PageHelper;
import com.apitable.shared.util.page.PageInfo;
import com.apitable.shared.util.page.PageObjectParam;
import com.apitable.space.ro.SpaceAssetOpRo;
import com.apitable.space.service.ISpaceAssetService;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.service.INodeService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.io.IOException;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Attachment interface.
 */
@RestController
@Tag(name = "Basic module - Attachment Interface")
@ApiResource(path = "/base/attach")
public class AssetController {

    @Resource
    private IAssetService iAssetService;

    @Resource
    private IAssetAuditService iAssetAuditService;

    @Resource
    private ISpaceAssetService iSpaceAssetService;

    @Resource
    private INodeService iNodeService;

    /**
     * Upload resources.
     */
    @PostResource(path = "/upload", requiredLogin = false)
    @Operation(summary = "Upload resources",
        description = "Upload resource files, any file type is unlimited")
    public ResponseData<AssetUploadResult> upload(@Valid AttachOpRo data) throws IOException {
        AssetType assetType = AssetType.of(data.getType());
        MultipartFile file = data.getFile();
        // When not logged in, perform human-machine verification
        Long userId = SessionContext.getUserIdWithoutException();
        if (userId == null) {
            iAssetService.checkBeforeUpload(data.getNodeId(), data.getData());
        }
        if (AssetType.isSpaceAsset(assetType)) {
            AssetUploadResult result =
                iAssetService.uploadFileInSpace(data.getNodeId(), file.getInputStream(),
                    file.getOriginalFilename(), file.getSize(), file.getContentType(), assetType);
            return ResponseData.success(result);
        }
        ExceptionUtil.isNotNull(userId, AuthException.UNAUTHORIZED);
        AssetUploadResult result = iAssetService.uploadFile(file.getInputStream(),
            file.getSize(), file.getContentType());
        return ResponseData.success(result);
    }

    /**
     * Image review result callback.
     */
    @PostResource(path = "/auditCallback", requiredLogin = false)
    @Operation(summary = "Image review result callback",
        description = "Accept the image review results stored in the OSS cloud, "
            + "and carry out special treatment for illegal images "
            + "and results requiring manual review", hidden = true)
    public ResponseData<Void> auditCallback(@RequestBody @Valid AttachAuditCallbackRo result) {
        iAssetAuditService.auditCallback(result);
        return ResponseData.success();
    }

    /**
     * Paging query pictures that need manual review.
     */
    @GetResource(path = "/readReviews", requiredLogin = false)
    @Operation(summary = "Paging query pictures that need manual review")
    @Parameter(name = PAGE_PARAM, description = "Page params", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.QUERY, example = PAGE_SIMPLE_EXAMPLE)
    @SuppressWarnings("rawtypes")
    public ResponseData<PageInfo<AssetsAuditVo>> readReviews(@PageObjectParam Page page) {
        String auditorUserId = SessionContext.getDingtalkUserId();
        ExceptionUtil.isNotNull(auditorUserId, AuthException.UNAUTHORIZED);
        return ResponseData.success(PageHelper.build(iAssetAuditService.readReviews(page)));
    }

    /**
     * Submit image review results.
     */
    @PostResource(path = "/submitAuditResult", requiredLogin = false)
    @Operation(summary = "Submit image review results",
        description = "Submit the image review results, enter the reviewer's name when submitting")
    public ResponseData<Void> submitAuditResult(@RequestBody @Valid AssetsAuditRo results) {
        // Query the DingTalk member information in the session
        String auditorUserId = SessionContext.getDingtalkUserId();
        ExceptionUtil.isNotNull(auditorUserId, AuthException.UNAUTHORIZED);
        iAssetAuditService.submitAuditResult(results);
        return ResponseData.success();
    }

    /**
     * Image URL upload interface.
     */
    @PostResource(path = "/urlUpload", requiredPermission = false)
    @Operation(summary = "Image URL upload interface")
    public ResponseData<AssetUploadResult> urlUpload(@Valid AttachUrlOpRo opRo) {
        AssetUploadResult result = iAssetService.urlUpload(opRo);
        return ResponseData.success(result);
    }

    /**
     * Changes in the number of references to space attachment resources.
     */
    @PostResource(path = "/cite", requiredLogin = false)
    @Operation(summary = "Changes in the number of references to space attachment resources",
        description = "The same attachment needs to pass the token repeatedly")
    public ResponseData<Void> cite(@RequestBody @Valid SpaceAssetOpRo opRo) {
        // Fill out the form anonymously
        String spaceId = iNodeService.getSpaceIdByNodeIdIncludeDeleted(opRo.getNodeId());
        ExceptionUtil.isNotNull(spaceId, PermissionException.NODE_NOT_EXIST);
        iSpaceAssetService.datasheetAttachmentCite(spaceId, opRo);
        return ResponseData.success();
    }
}
