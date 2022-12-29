package com.vikadata.social.dingtalk.event.sync.http.contact;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import com.vikadata.social.dingtalk.event.sync.http.BaseBizDataEvent;
import com.vikadata.social.dingtalk.support.deserializer.StringToMapDeserializer;

@Setter
@Getter
@ToString
public class BaseOrgUserContactEvent extends BaseBizDataEvent {
    private String unionid;

    @JsonProperty("openId")
    private String openId;

    private List<Role> roles;

    private String userid;

    @JsonProperty("isCustomizedPortal")
    private Boolean isCustomizedPortal;

    // json String
    @JsonProperty("isLeaderInDepts")
    @JsonDeserialize(using = StringToMapDeserializer.class)
    private Map<String, Boolean> isLeaderInDepts;

    @JsonProperty("isBoss")
    private Boolean isBoss;

    @JsonProperty("isSenior")
    private Boolean isSenior;

    private List<Long> department;

    private String email;

    @JsonProperty("orderInDepts")
    @JsonDeserialize(using = StringToMapDeserializer.class)
    private Map<String, Long> orderInDepts;

    private String mobile;

    private Boolean active;

    private String avatar;

    @JsonProperty("isAdmin")
    private Boolean isAdmin;

    @JsonProperty("isHide")
    private Boolean isHide;

    private String jobnumber;

    private String name;

    @JsonProperty("stateCode")
    private String stateCode;

    private String position;

    @Getter
    @Setter
    @ToString
    public static class Role {
        private Long id;

        private String name;

        @JsonProperty("groupName")
        private String groupName;

        private Integer type;
    }
}
