package com.vikadata.api.asset.service;

import java.util.List;

import com.vikadata.api.asset.enums.AssetType;
import com.vikadata.api.asset.ro.AssetQiniuUploadCallbackBody;
import com.vikadata.api.asset.vo.AssetUploadResult;

/**
 * <p>
 * Asset Upload Callback Service
 * </p>
 *
 * @author Pengap
 * @date 2022/4/6 16:44:50
 */
public interface IAssetCallbackService {

    /**
     * qiniu cloud upload callback
     *
     * @param body  callback body
     * @return AssetUploadResult
     * @author Pengap
     * @date 2022/4/7 15:02:24
     */
    @Deprecated
    AssetUploadResult qiniuCallback(AssetQiniuUploadCallbackBody body);

    /**
     * asset callback notify after complete upload
     *
     * @param assetType     assert type
     * @param resourceKeys  resource key list
     * @return AssetUploadResults
     * @author Chambers
     * @date 2022/8/8
     */
    List<AssetUploadResult> loadAssetUploadResult(AssetType assetType, List<String> resourceKeys);

    /**
     * widget upload callback
     *
     * @param resourceKeys   file urls
     */
    void widgetCallback(List<String> resourceKeys);
}
