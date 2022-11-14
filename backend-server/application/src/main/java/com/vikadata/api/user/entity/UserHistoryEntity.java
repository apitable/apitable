package com.vikadata.api.user.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
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
 * 用户历史记录表
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
@TableName("vika_user_history")
public class UserHistoryEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     * */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 用户ID
     * */
    private Long userId;

    /**
     * 用户ID
     * */
    private String uuid;

    /**
     * 昵称
     * */
    private String nickName;

    /**
     * 区号
     * */
    private String code;

    /**
     * 手机号码
     * */
    private String mobilePhone;

    /**
     * 邮箱
     * */
    private String email;

    /**
     * 头像
     * */
    private String avatar;

    /**
     * 语言
     * */
    private String locale;

    /**
     * 用户账号状态(1:申请账号注销, 2:撤销账号注销, 3:完成账号注销)
     * */
    private Integer userStatus;

    /**
     * 创建者
     * */
    @TableField(fill = FieldFill.INSERT)
    private Long createdBy;

    /**
     * 更新者
     * */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updatedBy;

    /**
     * 创建时间
     * */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     * */
    private LocalDateTime updatedAt;

}
