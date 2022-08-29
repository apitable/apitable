package com.vikadata.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 资源审核表
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
@TableName("vika_asset_audit")
public class AssetAuditEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 资源ID(关联#vika_asset#id)
     */
    private Long assetId;

    /**
     * 云端文件存放路径
     */
    private String assetFileUrl;

    /**
     * [冗余]md5摘要
     */
    private String assetChecksum;

    /**
     * 审核结果分数
     */
    private Float auditResultScore;

    /**
     * 审核结果建议，包括：[“block”,”review”,”pass”]
     */
    private String auditResultSuggestion;

    /**
     * 审核类型，目前支持：pul[色情]/terror[暴恐]/politician[敏感人物]/ads[图片广告识别]
     */
    private String auditScenes;

    /**
     * 审核人OpenId
     */
    private String auditorOpenid;

    /**
     * 审核人名称
     */
    private String auditorName;

    /**
     * 是否已人工审核(0:否,1:是)
     */
    private Boolean isAudited;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

}
