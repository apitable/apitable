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
 * 工作台-组件发布历史表
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
@TableName(keepGlobalPrefix = true, value = "widget_package_release")
public class WidgetPackageReleaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 版本摘要唯一标识(id+package_id+version生成)
     */
    private String releaseSha;

    /**
     * 版本号,package_id下唯一
     */
    private String version;

    /**
     * 组件包ID
     */
    private String packageId;

    /**
     * 用户ID(关联#vika_user#id)
     */
    private Long releaseUserId;

    /**
     * 代码地址
     */
    private String releaseCodeBundle;

    /**
     * 源代码地址
     */
    private String sourceCodeBundle;

    /**
     * 源码加密密钥
     */
    private String secretKey;

    /**
     * 状态(0:待审核,1:审核通过,2:已拒绝)
     */
    private Integer status;

    /**
     * 发布版本说明
     */
    private String releaseNote;

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

    /**
     * 安装环境编码
     */
    private String installEnvCode;

    /**
     * 运行环境编码
     */
    private String runtimeEnvCode;

}
