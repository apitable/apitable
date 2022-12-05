package com.vikadata.api.organization.entity;

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
 * 组织架构-成员表
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
@TableName(keepGlobalPrefix = true, value = "unit_member")
public class MemberEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 用户ID(关联#vika_user#id)
     */
    private Long userId;

    /**
     * 空间ID(关联#vika_space#space_id)
     */
    private String spaceId;

    /**
     * 成员姓名
     */
    private String memberName;

    /**
     * 工号
     */
    private String jobNumber;

    /**
     * 职位
     */
    private String position;

    /**
     * 手机号码
     */
    private String mobile;

    /**
     * 电子邮箱
     */
    private String email;

    /**
     * 第三方平台用户标识
     */
    private String openId;

    /**
     * 用户的空间状态(0:非活跃;1:活跃;2:预删除;3:注销冷静期预删除)
     */
    private Integer status;

    /**
     * 成员名称是否被指定修改过标志(0:否,1:是)
     */
    private Boolean nameModified;

    /**
     * 是否作为第三方 IM 用户修改过昵称。0：否；1：是；2：不是 IM 第三方用户
     */
    private Integer isSocialNameModified;

    /**
     * 是否有小红点(0:否,1:是)
     */
    private Boolean isPoint;

    /**
     * 是否激活(0:否,1:是)
     */
    private Boolean isActive;

    /**
     * 是否管理员(0:否,1:是)
     */
    private Boolean isAdmin;

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
