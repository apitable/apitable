package com.vikadata.api.asset.ro;

import io.swagger.annotations.ApiModel;
import lombok.Data;


/**
 * <p>
 * Qiniu Cloud upload callback Body
 * Reference documentation：https://developer.qiniu.com/kodo/1235/vars#magicvar-fname
 * </p>
 *
 * @author Pengap
 */
@Data
@ApiModel("Qiniu Cloud upload callback Body")
public class AssetQiniuUploadCallbackBody {

    /**
     * Get the resource name of the file saved in the space.
     */
    private String key;

    /**
     * The HTTPETag after the file is uploaded successfully. If the resource ID is not specified when uploading, the Etag will be used as the resource ID.
     */
    private String hash;

    /**
     * Get the upload target space name。
     */
    private String bucket;

    /**
     * Uploaded original filename。
     */
    private String fname;

    /**
     * Resource size, in bytes.
     */
    private Long fsize;

    /**
     * The suffix of the uploaded resource
     */
    private String ext;

    /**
     * Resource type, for example, the resource type of a JPG image is imagejpg.
     */
    private String mimeType;

    /**
     * The suffix of the uploaded resource
     */
    private String suffix;

    /**
     * the width of the image
     */
    private Integer imageWidth;

    /**
     * the height of the picture
     */
    private Integer imageHeight;

    private Long uploadAssetId;

    private Long uploadDeveloperAssetId;

    private Integer uploadSource;

    private Long uploadUserId;

    private String spaceId;

    private String nodeId;

    private String bucketType;

    private Integer assetType;

}
