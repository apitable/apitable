package com.vikadata.api.model.ro.asset;

import io.swagger.annotations.ApiModel;
import lombok.Data;


/**
 * <p>
 * 七牛云上传回调Body
 * 参考文档：https://developer.qiniu.com/kodo/1235/vars#magicvar-fname
 * </p>
 *
 * @author Pengap
 * @date 2022/4/6 17:32:02
 */
@Data
@ApiModel("七牛云上传回调Body")
public class AssetQiniuUploadCallbackBody {

    /**
     * 获得文件保存在空间中的资源名。
     */
    private String key;

    /**
     * 文件上传成功后的 HTTPETag。若上传时未指定资源ID，Etag将作为资源ID使用。
     */
    private String hash;

    /**
     * 获得上传的目标空间名。
     */
    private String bucket;

    /**
     * 上传的原始文件名。
     */
    private String fname;

    /**
     * 资源尺寸，单位为字节。
     */
    private Long fsize;

    /**
     * 上传资源的后缀名
     */
    private String ext;

    /**
     * 资源类型，例如JPG图片的资源类型为image/jpg。
     */
    private String mimeType;

    /**
     * 上传资源的后缀名
     */
    private String suffix;

    /**
     * 图片的宽度
     */
    private Integer imageWidth;

    /**
     * 图片的高度
     */
    private Integer imageHeight;

    private Long uploadAssetId;

    private Long uploadDeveloperAssetId;

    private Integer uploadSource;

    private Long uploadUserId;

    private String spaceId;

    private String nodeId;

}
