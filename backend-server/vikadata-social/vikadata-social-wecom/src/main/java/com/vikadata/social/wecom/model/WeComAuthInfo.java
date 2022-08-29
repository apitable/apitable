package com.vikadata.social.wecom.model;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.experimental.Accessors;
import me.chanjar.weixin.cp.bean.WxCpUser;

/**
 * <p>
 * 企业微信授权缓存实体类
 * </p>
 *
 * @author Pengap
 * @date 2021/7/31 16:48:37
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

    // 操作绑定的vika用户Id
    private Long operatingBindUserId;

    // 操作绑定的企业微信成员Id
    private String operatingBindWeComUserId;

    // 操作绑定的企业微信成员信息，忽略序列化不存储倒DB
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
