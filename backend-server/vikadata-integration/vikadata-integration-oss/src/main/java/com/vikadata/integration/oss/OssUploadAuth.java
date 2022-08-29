package com.vikadata.integration.oss;

/**
 * <p>
 * 前端直传凭据
 * </p>
 *
 * @author Pengap
 * @date 2022/3/31 17:52:02
 */
public class OssUploadAuth {

    /**
     * 前端直传token
     */
    private String uploadToken;

    public String getUploadToken() {
        return uploadToken;
    }

    public void setUploadToken(String uploadToken) {
        this.uploadToken = uploadToken;
    }
}
