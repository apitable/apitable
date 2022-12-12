package com.vikadata.api.asset.controller;

import java.io.IOException;

import javax.annotation.Resource;
import javax.validation.Valid;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.asset.enums.AssetType;
import com.vikadata.api.asset.ro.AssetsAuditRo;
import com.vikadata.api.asset.ro.AttachAuditCallbackRo;
import com.vikadata.api.asset.ro.AttachOpRo;
import com.vikadata.api.asset.ro.AttachUrlOpRo;
import com.vikadata.api.asset.service.IAssetAuditService;
import com.vikadata.api.asset.service.IAssetService;
import com.vikadata.api.asset.vo.AssetUploadResult;
import com.vikadata.api.asset.vo.AssetsAuditVo;
import com.vikadata.api.auth.enums.AuthException;
import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.component.scanner.annotation.PostResource;
import com.vikadata.api.shared.context.SessionContext;
import com.vikadata.api.shared.util.page.PageHelper;
import com.vikadata.api.shared.util.page.PageInfo;
import com.vikadata.api.shared.util.page.PageObjectParam;
import com.vikadata.api.space.ro.SpaceAssetOpRo;
import com.vikadata.api.space.service.ISpaceAssetService;
import com.vikadata.api.workspace.enums.PermissionException;
import com.vikadata.api.workspace.service.INodeService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import static com.vikadata.api.shared.constants.PageConstants.PAGE_PARAM;
import static com.vikadata.api.shared.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;

/**
 * Attachment interface
 */
@RestController
@Api(tags = "Basic module - Attachment Interface")
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

    @PostResource(name = "Upload resources", path = "/upload", requiredLogin = false)
    @ApiOperation(value = "Upload resources", notes = "Upload resource files, any file type is unlimited", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseData<AssetUploadResult> upload(@Valid AttachOpRo data) throws IOException {
        AssetType assetType = AssetType.of(data.getType());
        MultipartFile file = data.getFile();
        // When not logged in, perform human-machine verification
        Long userId = SessionContext.getUserIdWithoutException();
        if (userId == null) {
            iAssetService.checkBeforeUpload(data.getNodeId(), data.getData());
        }
        if (AssetType.isSpaceAsset(assetType)) {
            AssetUploadResult result = iAssetService.uploadFileInSpace(data.getNodeId(), file.getInputStream(), file.getOriginalFilename(), file.getSize(), file.getContentType(), assetType);
            return ResponseData.success(result);
        }
        else {
            ExceptionUtil.isNotNull(userId, AuthException.UNAUTHORIZED);
            AssetUploadResult result = iAssetService.uploadFile(file.getInputStream(), file.getSize(), file.getContentType());
            return ResponseData.success(result);
        }
    }

    @PostResource(name = "Image review result callback", path = "/auditCallback", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "Image review result callback", notes = "Accept the image review results stored in the OSS cloud, and carry out special treatment for illegal images and results requiring manual review", hidden = true)
    public ResponseData<Void> auditCallback(@RequestBody @Valid AttachAuditCallbackRo result) {
        iAssetAuditService.auditCallback(result);
        return ResponseData.success();
    }

    @GetResource(name = "Paging query pictures that need manual review", path = "/readReviews", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "Paging query pictures that need manual review", notes = "Paging query pictures that need manual review")
    @ApiImplicitParam(name = PAGE_PARAM, value = "Page params", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    @SuppressWarnings("rawtypes")
    public ResponseData<PageInfo<AssetsAuditVo>> readReviews(@PageObjectParam Page page) {
        String auditorUserId = SessionContext.getDingtalkUserId();
        ExceptionUtil.isNotNull(auditorUserId, AuthException.UNAUTHORIZED);
        return ResponseData.success(PageHelper.build(iAssetAuditService.readReviews(page)));
    }

    @PostResource(name = "Submit image review results", path = "/submitAuditResult", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "Submit image review results", notes = "Submit the image review results, enter the reviewer's name when submitting")
    public ResponseData<Void> submitAuditResult(@RequestBody @Valid AssetsAuditRo results) {
        // Query the DingTalk member information in the session
        String auditorUserId = SessionContext.getDingtalkUserId();
        ExceptionUtil.isNotNull(auditorUserId, AuthException.UNAUTHORIZED);
        iAssetAuditService.submitAuditResult(results);
        return ResponseData.success();
    }

    @PostResource(name = "Image URL upload interface", path = "/urlUpload", requiredPermission = false)
    @ApiOperation(value = "Image URL upload interface", notes = "Image URL upload interface")
    public ResponseData<AssetUploadResult> urlUpload(@Valid AttachUrlOpRo opRo) {
        AssetUploadResult result = iAssetService.urlUpload(opRo);
        return ResponseData.success(result);
    }

    @PostResource(name = "Changes in the number of references to space attachment resources", path = "/cite", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "Changes in the number of references to space attachment resources", notes = "The same attachment needs to pass the token repeatedly")
    public ResponseData<Void> cite(@RequestBody @Valid SpaceAssetOpRo opRo) {
        // Fill out the form anonymously
        String spaceId = iNodeService.getSpaceIdByNodeIdIncludeDeleted(opRo.getNodeId());
        ExceptionUtil.isNotNull(spaceId, PermissionException.NODE_NOT_EXIST);
        iSpaceAssetService.datasheetAttachmentCite(spaceId, opRo);
        return ResponseData.success();
    }
}
