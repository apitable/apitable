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
 * org - role table
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
@TableName("vika_unit_role")
public class RoleEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * id
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * space id(refer #vika_space#space_id)
     */
    private String spaceId;

    /**
     * role name
     */
    private String roleName;

    /**
     * the role's position in the space's roles list (default 2000, new position is the max position * 2 in the space)
     */
    private Integer position;

    /**
     * delete flag (0: no ,1: yes)
     */
    @TableLogic
    private Integer isDeleted;

    /**
     * creator
     */
    private Long createBy;

    /**
     * updater
     */
    private Long updateBy;

    /**
     * create time
     */
    private LocalDateTime createAt;

    /**
     * update time
     */
    private LocalDateTime updateAt;


}
