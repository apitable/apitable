package com.vikadata.api.user.entity;

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
 * 用户表
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
@TableName("vika_user")
public class UserEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 用户ID
     */
    private String uuid;

    /**
     * 昵称
     */
    private String nickName;

    /**
     * 区号
     */
    private String code;

    /**
     * 手机号码
     */
    private String mobilePhone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 密码
     */
    private String password;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 性别
     */
    private String gender;

    /**
     * 备注
     */
    private String remark;

    /**
     * 语言
     */
    private String locale;

    /**
     * 钉钉开放应用内的唯一标识
     */
    private String dingOpenId;

    /**
     * 钉钉开发者企业内的唯一标识
     */
    private String dingUnionId;

    /**
     * 最后登录时间
     */
    private LocalDateTime lastLoginTime;

    /**
     * 是否作为第三方 IM 用户修改过昵称。0：否；1：是；2：不是 IM 第三方用户
     */
    private Integer isSocialNameModified;

    /**
     * 注销冷静期(1:是,0:否)
     */
    private Boolean isPaused;

    /**
     * 删除标记(1:是,0:否)
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
