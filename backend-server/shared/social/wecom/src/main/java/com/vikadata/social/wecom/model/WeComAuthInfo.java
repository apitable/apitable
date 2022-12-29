package com.vikadata.social.wecom.model;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.experimental.Accessors;
import me.chanjar.weixin.cp.bean.WxCpUser;

/**
 * WeCom authorization cache entity class
 */
@Data
@Accessors(chain = true)
public class WeComAuthInfo implements Serializable {

    private static final long serialVersionUID = -2574662709358097927L;

    private String corpId;

    private Integer agentId;

    private String agentSecret;

    private Integer close;

    private AgentInfo agentInfo;

    // operate bind user ID in current system
    private Long operatingBindUserId;

    // operate bind user ID in wecom system
    private String operatingBindWeComUserId;

    // operate the bound enterprise wecom's member information, ignore serialization and do not store the reverse DB
    @JsonIgnore
    private volatile WxCpUser operatingBindWeComUser;

    @Data
    @Accessors(chain = true)
    public static class AgentInfo implements Serializable {

        private static final long serialVersionUID = -5613941799135115160L;

        private String name;

        private String squareLogoUrl;

        private String description;

        private String redirectDomain;

        private Integer reportLocationFlag;

        private Integer isreportenter;

        private String homeUrl;

    }

}
