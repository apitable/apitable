package com.vikadata.social.dingtalk;

import com.vikadata.social.dingtalk.api.CorpAppOperations;
import com.vikadata.social.dingtalk.api.IsvAppOperations;
import com.vikadata.social.dingtalk.api.MobileAppOperations;
import com.vikadata.social.dingtalk.api.ServiceCorpAppOperations;

/**
 * 飞书相关接口
 *
 * @author Shawn Deng
 * @date 2020-11-18 15:23:21
 */
public interface DingTalk {

    /**
     * 移动接入接口
     *
     * @return 移动接入接口
     */
    MobileAppOperations mobileAppOperations();

    /**
     * 企业内部应用接口
     *
     * @return 企业内部应用接口
     */
    CorpAppOperations corpAppOperations();

    /**
     * 授权第三方企业开发的内部应用接口
     *
     * @return 授权第三方企业开发的内部应用接口
     */
    ServiceCorpAppOperations serviceCorpAppOperations();

    /**
     * 第三方应用市场应用接口
     *
     * @author zoe zheng
     * @date 2021/9/1 6:30 下午
     */
    IsvAppOperations isvAppOperations();
}
