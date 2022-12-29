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
 * 工作台-附件表
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
@TableName(keepGlobalPrefix = true, value = "space_asset")
public class SpaceAssetEntity implements Serializable {

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
     * 数表节点Id(关联#vika_node#node_id)
     */
    private String nodeId;

    /**
     * 资源ID(关联#vika_asset#id)
     */
    private Long assetId;

    /**
     * [冗余]md5摘要
     */
    private String assetChecksum;

    /**
     * 引用次数
     */
    private Integer cite;

    /**
     * 类型 (0:用户头像1:空间logo2:数表附件3:缩略图4:节点描述图)
     */
    private Integer type;

    /**
     * 源文件名，本次上传的文件名
     */
    private String sourceName;

    /**
     * [冗余]文件大小(单位:byte)
     */
    private Integer fileSize;

    /**
     * [Redundant] Whether it is a template attachment (0: No, 1: Yes)
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

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

}
