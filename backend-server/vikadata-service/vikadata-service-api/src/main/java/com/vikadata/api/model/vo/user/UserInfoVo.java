package com.vikadata.api.model.vo.user;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.vikadata.api.cache.bean.LoginUserDto;
import com.vikadata.api.cache.bean.UserLinkInfo;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullArraySerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullJsonObjectSerializer;
import com.vikadata.api.support.serializer.NullNumberSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

import static com.vikadata.api.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

/**
 * <p>
 * 账户信息视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/3/5 15:38
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("账户信息视图")
public class UserInfoVo implements Serializable {

    private static final long serialVersionUID = 6771376557632188356L;

    @ApiModelProperty(value = "用户ID(实际返回是uuid)", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @ApiModelProperty(value = "用户UUID", example = "1261273764218", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "昵称", example = "张三", position = 2)
    private String nickName;

    @ApiModelProperty(value = "手机区号", example = "+1", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String areaCode;

    @ApiModelProperty(value = "手机号码", example = "\"13344445555\"", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String mobile;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "邮箱", example = "admin@vikadata.com", position = 4)
    private String email;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "头像", example = "null", position = 5)
    private String avatar;

    @ApiModelProperty(value = "注册时间", example = "2019-01-01 10:12:13", position = 6)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime signUpTime;

    @ApiModelProperty(value = "最后登录时间", example = "2019-01-01 10:12:13", position = 6)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime lastLoginTime;

    @ApiModelProperty(value = "绑定第三方的信息", position = 6)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<UserLinkVo> thirdPartyInformation;

    @ApiModelProperty(value = "是否需要设置密码，标识用户没有密码，作为初始化设置密码引导的标准字段", example = "false", position = 7)
    private Boolean needPwd;

    @Builder.Default
    @ApiModelProperty(value = "是否需要创建空间，标识用户没有任何空间关联，作为创建空间引导的标准字段", example = "false", position = 7)
    private Boolean needCreate = true;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "空间id", example = "spcx2yLGGedWc", position = 8)
    private String spaceId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "空间名称", example = "我的工作空间", position = 9)
    private String spaceName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "空间logo", example = "http://...", position = 10)
    private String spaceLogo;

    @JsonSerialize(using = ToStringSerializer.class, nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "空间对应的成员ID", example = "101", position = 11)
    private Long memberId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "空间对应的成员名称", example = "成员1", position = 12)
    private String memberName;

    @JsonSerialize(using = ToStringSerializer.class, nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "空间对应成员的组织单元ID", example = "101", position = 11)
    private Long unitId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "空间里打开的数表节点ID", example = "dst151d", position = 13)
    private String activeNodeId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "数表里打开的视图ID", example = "views135", position = 14)
    private String activeViewId;

    @ApiModelProperty(value = "活动节点位置(0:工作目录;1:星标)", example = "0", position = 14)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer activeNodePos;

    @Builder.Default
    @ApiModelProperty(value = "是否是空间管理员,标识是否显示空间管理菜单", example = "false", position = 15)
    private Boolean isAdmin = false;

    @Builder.Default
    @ApiModelProperty(value = "是否主管理员", example = "false", position = 15)
    private Boolean isMainAdmin = false;

    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    @ApiModelProperty(value = "是否账号注销冷静期(冷静期允许恢复账号)", example = "false", position = 16)
    private Boolean isPaused = false;

    @ApiModelProperty(value = "账号销毁时间", example = "2022-01-03 00:00:00", position = 17)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    private LocalDateTime closeAt;

    @Builder.Default
    @ApiModelProperty(value = "空间是否是删除状态", example = "false", position = 18)
    private Boolean isDelSpace = false;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "开发者访问令牌", example = "uskPtGBUw8EuVKoo3X6", position = 19)
    private String apiKey;

    @ApiModelProperty(value = "引导相关状态值", example = "{\"1\":1, \"3\":5}", position = 20)
    @JsonSerialize(nullsUsing = NullJsonObjectSerializer.class)
    private JSONObject wizards;

    @ApiModelProperty(value = "个人邀请码", example = "vikatest", position = 21)
    private String inviteCode;

    @ApiModelProperty(value = "空间站域名", position = 22)
    private String spaceDomain;

    @ApiModelProperty(value = "用户所在空间是否修改过站内昵称(废弃)", position = 23)
    private Boolean isNameModified;

    @ApiModelProperty(value = "用户是否是新人", position = 23)
    private Boolean isNewComer;

    @ApiModelProperty(value = "(企业微信情况下使用)用户（user）是否修改过昵称", position = 23)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "(企业微信情况下使用)成员（member）是否修改过昵称", position = 24)
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "是否发送订阅相关通知", notes = "读取「ConstProperties」配置文件的值", position = 25)
    private Boolean sendSubscriptionNotify;

    @ApiModelProperty(value = "是否使用过邀请奖励", notes = "标识是否使用过邀请奖励", position = 26)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean usedInviteReward;

    public UserInfoVo transferDataFromDto(LoginUserDto loginUserDto
            , UserLinkInfo userLinkInfo, List<UserLinkVo> thirdPartyInformation) {
        this.setUserId(loginUserDto.getUuid());
        this.setUuid(loginUserDto.getUuid());
        this.setNickName(loginUserDto.getNickName());
        this.setAreaCode(loginUserDto.getAreaCode());
        this.setMobile(loginUserDto.getMobile());
        this.setEmail(loginUserDto.getEmail());
        this.setAvatar(loginUserDto.getAvatar());
        this.setNeedPwd(loginUserDto.getNeedPwd());
        this.setWizards(JSONUtil.parseObj(userLinkInfo.getWizards()));
        this.setThirdPartyInformation(thirdPartyInformation);
        this.setInviteCode(userLinkInfo.getInviteCode());
        this.setSignUpTime(loginUserDto.getSignUpTime());
        this.setLastLoginTime(loginUserDto.getLastLoginTime());
        this.setIsPaused(loginUserDto.getIsPaused());
        // 避免已经登录的账号有LoginUserDto缓存，会导致NPE
        if (null == this.getIsPaused()) {
            this.setIsPaused(false);
        }
        this.setApiKey(userLinkInfo.getApiKey());
        this.setIsNickNameModified(loginUserDto.getIsNickNameModified());
        return this;
    }

}
