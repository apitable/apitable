package com.vikadata.api.user.vo;

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

import com.vikadata.api.shared.cache.bean.LoginUserDto;
import com.vikadata.api.shared.cache.bean.UserLinkInfo;
import com.vikadata.api.shared.support.serializer.ImageSerializer;
import com.vikadata.api.shared.support.serializer.NullArraySerializer;
import com.vikadata.api.shared.support.serializer.NullBooleanSerializer;
import com.vikadata.api.shared.support.serializer.NullJsonObjectSerializer;
import com.vikadata.api.shared.support.serializer.NullNumberSerializer;
import com.vikadata.api.shared.support.serializer.NullStringSerializer;

import static com.vikadata.api.shared.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

/**
 * <p>
 * Account Information View
 * </p>
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@ApiModel("Account Information View")
public class UserInfoVo implements Serializable {

    private static final long serialVersionUID = 6771376557632188356L;

    @ApiModelProperty(value = "User ID (the actual return is uuid)", dataType = "java.lang.String", example = "1", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String userId;

    @ApiModelProperty(value = "User UUID", example = "1261273764218", position = 1)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String uuid;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Nickname", example = "Zhang San", position = 2)
    private String nickName;

    @ApiModelProperty(value = "Mobile phone area code", example = "+1", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String areaCode;

    @ApiModelProperty(value = "Phone number", example = "\"13344445555\"", position = 3)
    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    private String mobile;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Email", example = "admin@vikadata.com", position = 4)
    private String email;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Avatar", example = "null", position = 5)
    private String avatar;

    @ApiModelProperty(value = "Registration time", example = "2019-01-01 10:12:13", position = 6)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime signUpTime;

    @ApiModelProperty(value = "Last logon time", example = "2019-01-01 10:12:13", position = 6)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime lastLoginTime;

    @ApiModelProperty(value = "Bind third-party information", position = 6)
    @JsonSerialize(nullsUsing = NullArraySerializer.class)
    private List<UserLinkVo> thirdPartyInformation;

    @ApiModelProperty(value = "Whether to set a password is required. It indicates that the user does not have a password. It is a standard field for initialization and password setting", example = "false", position = 7)
    private Boolean needPwd;

    @Builder.Default
    @ApiModelProperty(value = "Whether it is necessary to create a space indicates that the user does not have any space association, which is a standard field for space creation guidance", example = "false", position = 7)
    private Boolean needCreate = true;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Space id", example = "spcx2yLGGedWc", position = 8)
    private String spaceId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Space name", example = "My Workspace", position = 9)
    private String spaceName;

    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    @ApiModelProperty(value = "Space logo", example = "http://...", position = 10)
    private String spaceLogo;

    @JsonSerialize(using = ToStringSerializer.class, nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Member ID corresponding to the space", example = "101", position = 11)
    private Long memberId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Member name corresponding to the space", example = "Member 1", position = 12)
    private String memberName;

    @JsonSerialize(using = ToStringSerializer.class, nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Organization unit ID of the corresponding member of the space", example = "101", position = 11)
    private Long unitId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "ID of the open data table node in the space", example = "dst151d", position = 13)
    private String activeNodeId;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "ID of the view opened in the meter", example = "views135", position = 14)
    private String activeViewId;

    @ApiModelProperty(value = "Active node location (0: working directory; 1: star)", example = "0", position = 14)
    @JsonSerialize(nullsUsing = NullNumberSerializer.class)
    private Integer activeNodePos;

    @Builder.Default
    @ApiModelProperty(value = "Whether it is a space administrator, and whether the space management menu is displayed", example = "false", position = 15)
    private Boolean isAdmin = false;

    @Builder.Default
    @ApiModelProperty(value = "Primary administrator or not", example = "false", position = 15)
    private Boolean isMainAdmin = false;

    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    @ApiModelProperty(value = "Whether the account is cancelled during the cooling off period (account recovery is allowed during the cooling off period)", example = "false", position = 16)
    private Boolean isPaused = false;

    @ApiModelProperty(value = "Account destruction time", example = "2022-01-03 00:00:00", position = 17)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonFormat(pattern = TIME_SIMPLE_PATTERN)
    private LocalDateTime closeAt;

    @Builder.Default
    @ApiModelProperty(value = "Whether the space is deleted", example = "false", position = 18)
    private Boolean isDelSpace = false;

    @JsonSerialize(nullsUsing = NullStringSerializer.class)
    @ApiModelProperty(value = "Developer Access Token", example = "uskPtGBUw8EuVKoo3X6", position = 19)
    private String apiKey;

    @ApiModelProperty(value = "Boot related status values", example = "{\"1\":1, \"3\":5}", position = 20)
    @JsonSerialize(nullsUsing = NullJsonObjectSerializer.class)
    private JSONObject wizards;

    @ApiModelProperty(value = "Personal invitation code", example = "vikatest", position = 21)
    private String inviteCode;

    @ApiModelProperty(value = "Space station domain name", position = 22)
    private String spaceDomain;

    @ApiModelProperty(value = "Whether the user's space has changed the internal nickname (abandoned)", position = 23)
    private Boolean isNameModified;

    @ApiModelProperty(value = "Whether the user is new", position = 23)
    private Boolean isNewComer;

    @ApiModelProperty(value = "(Used in WeCom)Whether the user has modified the nickname", position = 23)
    private Boolean isNickNameModified;

    @ApiModelProperty(value = "(Used in WeCom)Whether the member has modified the nickname", position = 24)
    private Boolean isMemberNameModified;

    @ApiModelProperty(value = "Whether to send subscription related notifications", notes = "Read「ConstProperties」Value of profile", position = 25)
    private Boolean sendSubscriptionNotify;

    @ApiModelProperty(value = "Have you ever used invitation rewards", notes = "Identify whether invitation rewards have been used", position = 26)
    @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
    private Boolean usedInviteReward;

    public UserInfoVo transferDataFromDto(LoginUserDto loginUserDto
            , UserLinkInfo userLinkInfo, List<UserLinkVo> userLinkVos) {
        this.setUserId(loginUserDto.getUuid());
        this.setUuid(loginUserDto.getUuid());
        this.setNickName(loginUserDto.getNickName());
        this.setAreaCode(loginUserDto.getAreaCode());
        this.setMobile(loginUserDto.getMobile());
        this.setEmail(loginUserDto.getEmail());
        this.setAvatar(loginUserDto.getAvatar());
        this.setNeedPwd(loginUserDto.getNeedPwd());
        this.setWizards(JSONUtil.parseObj(userLinkInfo.getWizards()));
        this.setThirdPartyInformation(userLinkVos);
        this.setInviteCode(userLinkInfo.getInviteCode());
        this.setSignUpTime(loginUserDto.getSignUpTime());
        this.setLastLoginTime(loginUserDto.getLastLoginTime());
        this.setIsPaused(loginUserDto.getIsPaused());
        // Avoid Login User Dto cache the logged in account, which will lead to NPE
        if (null == this.getIsPaused()) {
            this.setIsPaused(false);
        }
        this.setApiKey(userLinkInfo.getApiKey());
        this.setIsNickNameModified(loginUserDto.getIsNickNameModified());
        return this;
    }

}
