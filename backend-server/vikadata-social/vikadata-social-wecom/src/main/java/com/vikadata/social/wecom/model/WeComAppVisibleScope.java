package com.vikadata.social.wecom.model;

import java.io.Serializable;

import lombok.Data;
import lombok.experimental.Accessors;
import me.chanjar.weixin.cp.bean.WxCpAgent.Parties;
import me.chanjar.weixin.cp.bean.WxCpAgent.Tags;
import me.chanjar.weixin.cp.bean.WxCpAgent.Users;

/**
 *  wecom visible area
 */
@Data
@Accessors(chain = true)
public class WeComAppVisibleScope implements Serializable {

    private static final long serialVersionUID = 8281934146421013716L;

    /**
     * Whether the app is disabled
     */
    private Integer close;

    /**
     * application visibility scope (people), including userid
     */
    private Users allowUserInfos;

    /**
     * application visibility scope (department)
     */
    private Parties allowParties;

    /**
     *  app visibility (tags)
     */
    private Tags allowTags;

}
