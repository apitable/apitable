package com.vikadata.integration.oss;

/**
 * <p>
 * oss upload certificate
 * </p>
 *
 * @author Pengap
 * @date 2022/3/31 17:52:02
 */
public class OssUploadAuth {

    /**
     * upload certificate token
     */
    private String uploadToken;

    /**
     * upload URL
     */
    private String uploadUrl;

    /**
     * upload request method
     */
    private String uploadRequestMethod;

    public String getUploadToken() {
        return uploadToken;
    }

    public void setUploadToken(String uploadToken) {
        this.uploadToken = uploadToken;
    }

    public String getUploadUrl() {
        return uploadUrl;
    }

    public void setUploadUrl(String uploadUrl) {
        this.uploadUrl = uploadUrl;
    }

    public String getUploadRequestMethod() {
        return uploadRequestMethod;
    }

    public void setUploadRequestMethod(String uploadRequestMethod) {
        this.uploadRequestMethod = uploadRequestMethod;
    }
}
