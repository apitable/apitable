package com.vikadata.scheduler.space.pojo;

import lombok.Data;

@Data
public class Asset {

    private Long id;

    /**
     * 整个文件的Hash，MD5摘要
     */
    private String checksum;

    /**
     * 资源文件前32个字节的Base64
     */
    private String headSum;

    /**
     * 存储桶标志
     */
    private String bucket;

    /**
     * 存储桶名称
     */
    private String bucketName;

    /**
     * 文件大小(单位:byte)
     */
    private Integer fileSize;

    /**
     * 云端文件存放路径
     */
    private String fileUrl;

    /**
     * MimeType
     */
    private String mimeType;

    /**
     * 文件扩展名
     */
    private String extensionName;

    /**
     * 预览图令牌
     */
    private String preview;

    /**
     * 是否是模版附件(0:否,1:是)
     */
    private Boolean isTemplate;

    /**
     * 图片高度
     */
    private Integer height;

    /**
     * 图片宽度
     */
    private Integer width;
}
