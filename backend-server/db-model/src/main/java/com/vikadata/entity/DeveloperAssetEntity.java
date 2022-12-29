package com.vikadata.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
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
 * 工作台-开发者资源表
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
@TableName(keepGlobalPrefix = true, value = "developer_asset")
public class DeveloperAssetEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 空间ID(关联#vika_space#space_id)
     */
    private String spaceId;

    /**
     * 自定义节点ID
     */
    private String nodeId;

    /**
     * 存储桶名称
     */
    private String bucketName;

    /**
     * 类型 (0:小组件)
     */
    private Integer type;

    /**
     * 源文件名，本次上传的文件名
     */
    private String sourceName;

    /**
     * 资源ID(关联#vika_asset#id)
     */
    private Long assetId;

    /**
     * [冗余]md5摘要
     */
    private String assetChecksum;

    /**
     * [冗余]文件大小(单位:byte)
     */
    private Integer fileSize;

    /**
     * 删除标记(0:否,1:是)
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * 创建者
     */
    @TableField(fill = FieldFill.INSERT)
    private Long createdBy;

    /**
     * 最后修改者
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updatedBy;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

}
