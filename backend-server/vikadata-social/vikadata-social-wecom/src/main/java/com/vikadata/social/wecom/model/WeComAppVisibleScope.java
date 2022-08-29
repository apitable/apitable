package com.vikadata.social.wecom.model;

import java.io.Serializable;

import lombok.Data;
import lombok.experimental.Accessors;
import me.chanjar.weixin.cp.bean.WxCpAgent.Parties;
import me.chanjar.weixin.cp.bean.WxCpAgent.Tags;
import me.chanjar.weixin.cp.bean.WxCpAgent.Users;

/**
 * <p>
 *  企业微信可见区域
 * </p>
 *
 * @author Pengap
 * @date 2021/8/16 14:33:20
 */
@Data
@Accessors(chain = true)
public class WeComAppVisibleScope implements Serializable {

    private static final long serialVersionUID = 8281934146421013716L;

    /**
     * 企业应用是否被停用
     */
    private Integer close;

    /**
     * 企业应用可见范围（人员），其中包括userid
     */
    private Users allowUserInfos;

    /**
     * 企业应用可见范围（部门）
     */
    private Parties allowParties;

    /**
     * 企业应用可见范围（标签）
     */
    private Tags allowTags;

}
