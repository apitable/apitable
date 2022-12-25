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

package com.apitable.asset.ro;

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
