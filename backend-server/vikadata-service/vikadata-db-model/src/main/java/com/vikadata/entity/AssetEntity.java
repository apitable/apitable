package com.vikadata.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 资源表
 * </p>
 *
 * @author Mybatis Generator Tool
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode
@TableName("vika_asset")
public class AssetEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
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

    /**
     * 删除标记(0:否,1:是)
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

}
