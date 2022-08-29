package com.vikadata.api.modular.base.controller;

import java.io.IOException;

import javax.annotation.Resource;
import javax.validation.Valid;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PageObjectParam;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.attach.AssetType;
import com.vikadata.api.enums.exception.AuthException;
import com.vikadata.api.enums.exception.PermissionException;
import com.vikadata.api.helper.PageHelper;
import com.vikadata.api.lang.PageInfo;
import com.vikadata.api.model.ro.asset.AssetsAuditRo;
import com.vikadata.api.model.ro.asset.AttachAuditCallbackRo;
import com.vikadata.api.model.ro.asset.AttachOfficePreviewRo;
import com.vikadata.api.model.ro.asset.AttachOpRo;
import com.vikadata.api.model.ro.asset.AttachUrlOpRo;
import com.vikadata.api.model.ro.space.SpaceAssetOpRo;
import com.vikadata.api.model.vo.asset.AssetUploadResult;
import com.vikadata.api.model.vo.asset.AssetsAuditVo;
import com.vikadata.api.modular.base.service.IAssetAuditService;
import com.vikadata.api.modular.base.service.IAssetService;
import com.vikadata.api.modular.space.service.ISpaceAssetService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import static com.vikadata.api.constants.PageConstants.PAGE_PARAM;
import static com.vikadata.api.constants.PageConstants.PAGE_SIMPLE_EXAMPLE;

/**
 * 附件接口
 *
 * @author Chambers
 * @since 2019/9/19
 */
@RestController
@Api(tags = "基础模块_附件接口")
@ApiResource(path = "/base/attach")
public class AttachController {

    @Resource
    private IAssetService iAssetService;

    @Resource
    private IAssetAuditService iAssetAuditService;

    @Resource
    private ISpaceAssetService iSpaceAssetService;

    @Resource
    private INodeService iNodeService;

    @PostResource(name = "上传资源", path = "/upload", requiredLogin = false)
    @ApiOperation(value = "上传资源", notes = "上传资源文件，无限制任何文件类型", produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseData<AssetUploadResult> upload(@Valid AttachOpRo data) throws IOException {
        AssetType assetType = AssetType.of(data.getType());
        MultipartFile file = data.getFile();
        // 未登录状态下，进行人机验证
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

    @PostResource(name = "office文档预览转换", path = "/officePreview/{spaceId}", requiredPermission = false)
    @ApiOperation(value = "office文档预览转换", notes = "office文档预览转换，调用永中office转换接口")
    public ResponseData<String> officePreview(@PathVariable String spaceId, @RequestBody @Valid AttachOfficePreviewRo results) {
        return ResponseData.success(iAssetService.officePreview(results, spaceId));
    }

    @PostResource(name = "图片审核结果回调", path = "/auditCallback", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "图片审核结果回调", notes = "接受OSS云存储的图片审核结果，对违规图片与需人工审核的结果进行特殊处理", hidden = true)
    public ResponseData<Void> auditCallback(@RequestBody @Valid AttachAuditCallbackRo result) {
        iAssetAuditService.auditCallback(result);
        return ResponseData.success();
    }

    @GetResource(name = "分页查询需人工审核的图片", path = "/readReviews", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "分页查询需人工审核的图片", notes = "分页查询需人工审核的图片")
    @ApiImplicitParam(name = PAGE_PARAM, value = "分页参数，说明看接口描述", required = true, dataTypeClass = String.class, paramType = "query", example = PAGE_SIMPLE_EXAMPLE)
    @SuppressWarnings("rawtypes")
    public ResponseData<PageInfo<AssetsAuditVo>> readReviews(@PageObjectParam Page page) {
        //查询session中的钉钉会员信息
        String auditorUserId = SessionContext.getDingtalkUserId();
        ExceptionUtil.isNotNull(auditorUserId, AuthException.UNAUTHORIZED);
        return ResponseData.success(PageHelper.build(iAssetAuditService.readReviews(page)));
    }

    @PostResource(name = "提交图片审核结果", path = "/submitAuditResult", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "提交图片审核结果", notes = "提交图片审核结果，提交时输入审核人姓名")
    public ResponseData<Void> submitAuditResult(@RequestBody @Valid AssetsAuditRo results) {
        //查询session中的钉钉会员信息
        String auditorUserId = SessionContext.getDingtalkUserId();
        ExceptionUtil.isNotNull(auditorUserId, AuthException.UNAUTHORIZED);
        iAssetAuditService.submitAuditResult(results);
        return ResponseData.success();
    }

    @PostResource(name = "图片URL上传接口", path = "/urlUpload", requiredPermission = false)
    @ApiOperation(value = "图片URL上传接口", notes = "图片URL上传接口")
    public ResponseData<AssetUploadResult> urlUpload(@Valid AttachUrlOpRo opRo) {
        AssetUploadResult result = iAssetService.urlUpload(opRo);
        return ResponseData.success(result);
    }

    @PostResource(name = "空间附件资源引用数变更", path = "/cite", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "空间附件资源引用数变更", notes = "相同附件需重复传token")
    public ResponseData<Void> cite(@RequestBody @Valid SpaceAssetOpRo opRo) {
        // 表单匿名填写
        String spaceId = iNodeService.getSpaceIdByNodeIdIncludeDeleted(opRo.getNodeId());
        ExceptionUtil.isNotNull(spaceId, PermissionException.NODE_NOT_EXIST);
        iSpaceAssetService.datasheetAttachmentCite(spaceId, opRo);
        return ResponseData.success();
    }
}
