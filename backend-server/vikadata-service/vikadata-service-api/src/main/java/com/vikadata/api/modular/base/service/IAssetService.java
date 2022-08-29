package com.vikadata.api.modular.base.service;

import java.io.InputStream;
import java.util.List;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.enums.attach.AssetType;
import com.vikadata.api.enums.attach.DeveloperAssetType;
import com.vikadata.api.model.ro.asset.AttachOfficePreviewRo;
import com.vikadata.api.model.ro.asset.AttachUrlOpRo;
import com.vikadata.api.model.vo.asset.AssetUploadResult;
import com.vikadata.entity.AssetEntity;

/**
 * <p>
 * 基础-附件表 服务类
 * </p>
 *
 * @author Chambers
 * @since 2020-03-06
 */
public interface IAssetService extends IService<AssetEntity> {

    /**
     * 上传前置检查
     *
     * @param nodeId    节点ID
     * @param secret    人机验证密钥
     * @author Chambers
     * @date 2022/4/8
     */
    void checkBeforeUpload(String nodeId, String secret);

    /**
     * 上传资源文件到空间内，并计算容量
     *
     * @param nodeId           节点ID
     * @param in               资源文件流
     * @param fileOriginalName 文件源名称
     * @param fileSize         文件资源大小
     * @param mimeType         文件类型
     * @param assetType        资源类型
     * @return AssetUploadResult
     * @author Shawn Deng
     * @date 2020/6/3 20:52
     */
    AssetUploadResult uploadFileInSpace(String nodeId, InputStream in, String fileOriginalName, long fileSize, String mimeType, AssetType assetType);

    /**
     *
     * @param url 网络资源地址
     * @return
     */
    AssetUploadResult uploadRemoteUrl(String url);

    /**
     * 简单上传资源文件，不计入空间容量
     *
     * @param in          资源文件流
     * @param fileSize    文件资源大小
     * @param contentType 资源文件类型
     * @return AssetUploadResult
     * @author Shawn Deng
     * @date 2020/6/3 20:52
     */
    AssetUploadResult uploadFile(InputStream in, long fileSize, String contentType);

    /**
     * 上传资源文件到开发者空间，并计算容量
     *
     * @param in                    资源文件流
     * @param uploadPath            上传文件全路径
     * @param fileOriginalName      文件源名称
     * @param fileSize              文件资源大小
     * @param contentType           文件类型
     * @param createdBy             上传人
     * @param developerAssetType    资源类型
     * @return AssetUploadResult
     * @author Pengap
     * @date 2021/7/21
     */
    AssetUploadResult uploadFileInDeveloper(InputStream in, String uploadPath, String fileOriginalName, long fileSize, String contentType, Long createdBy, DeveloperAssetType developerAssetType);

    /**
     * 文件预览
     *
     * @param officePreviewRo 附件请求参数
     * @param spaceId 空间站ID
     * @author Benson Cheung
     * @date 2021/01/04
     */
    String officePreview(AttachOfficePreviewRo officePreviewRo, String spaceId);

    /**
     * 删除云端s3文件
     *
     * @param token 云端key
     * @author Chambers
     * @date 2020/3/21
     */
    void delete(String token);

    /**
     * 附件url上传
     *
     * @param attachOpRo 附件参数
     * @return AttachVo 附件vo
     * @author Benson Cheung
     * @date 2020/03/25
     */
    AssetUploadResult urlUpload(AttachUrlOpRo attachOpRo);

    /**
     * 上传第三方头像
     *
     * @param avatarUrl 第三方头像地址
     * @return 上传完成的Url
     */
    String downloadAndUploadUrl(String avatarUrl);

    /**
     * 修改资源的模板状态
     *
     * @param assetIds      资源ID数组
     * @param isTemplate    是否是模版附件
     * @author Chambers
     * @date 2022/8/15
     */
    void updateAssetTemplateByIds(List<Long> assetIds, Boolean isTemplate);
}
