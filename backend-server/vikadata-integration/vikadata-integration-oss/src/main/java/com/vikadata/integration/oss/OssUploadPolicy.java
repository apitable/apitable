package com.vikadata.integration.oss;

import java.util.Map;

/**
 * <p>
 * 前端直传凭据
 * </p>
 *
 * @author Pengap
 * @date 2022/3/31 17:52:02
 */
public class OssUploadPolicy {

    /**
     * 若为 1，表示允许用户上传以 scope 的 keyPrefix 为前缀的文件。
     *
     * support：
     * 1.七牛云
     */
    private Integer isPrefixalScope;

    /**
     * 限定为新增语意。如果设置为非 0 值，则无论 scope 设置为什么形式，仅能以新增模式上传文件。
     */
    private Integer insertOnly;

    /**
     * 限定上传文件大小最小值，单位Byte。小于限制上传文件大小的最小值会被判为上传失败，返回 403 状态码
     *
     * support：
     * 1.七牛云
     */
    private Long fsizeMin;

    /**
     * 限定上传文件大小最大值，单位Byte。超过限制上传文件大小的最大值会被判为上传失败，返回 413 状态码。
     *
     * support：
     * 1.七牛云
     */
    private Long fsizeLimit;

    /**
     * 限定用户上传的文件类型。指定本字段值，七牛服务器会侦测文件内容以判断 MimeType，再用判断值跟指定值进行匹配，匹配成功则允许上传，匹配失败则返回 403 状态码。示例：
     * image/* 表示只允许上传图片类型
     * image/jpeg;image/png 表示只允许上传 jpg 和 png 类型的图片
     * !application/json;text/plain 表示禁止上传 json 文本和纯文本。注意最前面的感叹号！
     *
     * support：
     * 1.七牛云
     */
    private String mimeLimit;

    /**
     * 文件存储类型。0 为标准存储（默认），1 为低频存储，2 为归档存储，3 为深度归档存储。 </br>3
     *
     * support：
     * 1.七牛云
     */
    private Integer fileType;

    /**
     * CallBack Body 扩展参数
     */
    private Map<String, Object> putExtra;

    public Integer getIsPrefixalScope() {
        return isPrefixalScope;
    }

    public void setIsPrefixalScope(Integer isPrefixalScope) {
        this.isPrefixalScope = isPrefixalScope;
    }

    public Integer getInsertOnly() {
        return insertOnly;
    }

    public void setInsertOnly(Integer insertOnly) {
        this.insertOnly = insertOnly;
    }

    public Long getFsizeMin() {
        return fsizeMin;
    }

    public void setFsizeMin(Long fsizeMin) {
        this.fsizeMin = fsizeMin;
    }

    public Long getFsizeLimit() {
        return fsizeLimit;
    }

    public void setFsizeLimit(Long fsizeLimit) {
        this.fsizeLimit = fsizeLimit;
    }

    public String getMimeLimit() {
        return mimeLimit;
    }

    public void setMimeLimit(String mimeLimit) {
        this.mimeLimit = mimeLimit;
    }

    public Integer getFileType() {
        return fileType;
    }

    public void setFileType(Integer fileType) {
        this.fileType = fileType;
    }

    public Map<String, Object> getPutExtra() {
        return putExtra;
    }

    public void setPutExtra(Map<String, Object> putExtra) {
        this.putExtra = putExtra;
    }
}
