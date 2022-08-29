package com.vikadata.integration.oss;

import java.io.InputStream;

/**
 * <p>
 * Oss 对象
 * </p>
 *
 * @author Chambers
 * @date 2020/12/10
 */
public class OssObject {

    private String contentDigest;

    private Long contentLength;

    private String contentType;

    private InputStream inputStream;

    public OssObject(String contentDigest, Long contentLength, String contentType, InputStream inputStream) {
        this.contentDigest = contentDigest;
        this.contentLength = contentLength;
        this.contentType = contentType;
        this.inputStream = inputStream;
    }

    public String getContentDigest() {
        return contentDigest;
    }

    public void setContentDigest(String contentDigest) {
        this.contentDigest = contentDigest;
    }

    public Long getContentLength() {
        return contentLength;
    }

    public void setContentLength(Long contentLength) {
        this.contentLength = contentLength;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public InputStream getInputStream() {
        return inputStream;
    }

    public void setInputStream(InputStream inputStream) {
        this.inputStream = inputStream;
    }

    @Override
    public String toString() {
        return "OssObject{" +
                "contentDigest='" + contentDigest + '\'' +
                ", contentLength=" + contentLength +
                ", contentType='" + contentType + '\'' +
                '}';
    }
}
