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
 * 工作台-节点表
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
@TableName("vika_node")
public class NodeEntity implements Serializable {

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
     * 父节点Id
     */
    private String parentId;

    /**
     * 同级下前一个节点ID
     */
    private String preNodeId;

    /**
     * 自定义节点ID
     */
    private String nodeId;

    /**
     * 名称
     */
    private String nodeName;

    /**
     * 节点图标
     */
    private String icon;

    /**
     * 类型 (0:根节点,1:文件夹,2:数表)
     */
    private Integer type;

    /**
     * 封面图TOKEN
     */
    private String cover;

    /**
     * 是否模版(0:否,1:是)
     */
    private Boolean isTemplate;

    /**
     * 其他信息
     */
    private String extra;

    /**
     * 创建者
     */
    private Long creator;

    /**
     * 删除时的路径
     */
    private String deletedPath;

    /**
     * 删除标记(0:否,1:是)
     */
    @TableLogic
    private Boolean isDeleted;

    /**
     * 回收站标记(0:否,1:是)
     */
    private Boolean isRubbish;

    /**
     * 是否封禁(0:否,1:是)
     */
    private Boolean isBanned;

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
