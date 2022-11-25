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
 * org - role member table
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
@TableName("vika_unit_role_member")
public class RoleMemberEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * id
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * role id(refer#vika_unit_role#id)
     */
    private Long roleId;

    /**
     * team id/ member id(ref#vika_unit_team#id | #vika_unit_member#id)
     */
    private Long unitRefId;

    /**
     * 1: team；3: member
     */
    private Integer unitType;

    /**
     * create time
     */
    private LocalDateTime createdAt;


}
