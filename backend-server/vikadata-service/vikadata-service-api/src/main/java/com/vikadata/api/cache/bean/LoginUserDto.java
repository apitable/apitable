package com.vikadata.api.cache.bean;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.Data;

import static com.vikadata.api.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

/**
 * <p>
 * 登录用户信息缓存对象
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/12 17:29
 */
@Data
public class LoginUserDto implements Serializable {

    private static final long serialVersionUID = -5514888389641162703L;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * uuid
     */
    private String uuid;

    /**
     * 昵称
     */
    private String nickName;

    /**
     * 区号
     */
    private String areaCode;

    /**
     * 手机号码
     */
    private String mobile;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 是否需要设置密码
     */
    private Boolean needPwd = false;

    /**
     * 注册时间
     */
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime signUpTime;

    /**
     * 最后登录时间
     * 注意Redis 序列化LocalDateTime要特殊配置序列化和反序列化器
     */
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime lastLoginTime;

    /**
     * 语言
     */
    private String locale;

    /**
     * 注销冷静期(1:是,0:否)
     */
    private Boolean isPaused = false;

    /**
     * 用户（user）是否修改过昵称
     */
    private Boolean isNickNameModified;
}
