package com.vikadata.api.modular.idaas.service;

import com.vikadata.api.modular.idaas.model.IdaasAuthLoginVo;

/**
 * <p>
 * 玉符 IDaaS 登录授权
 * </p>
 * @author 刘斌华
 * @date 2022-05-24 16:41:22
 */
public interface IIdaasAuthService {

    /**
     * 获取维格一键登录页面的地址
     *
     * @param clientId 玉符 IDaaS 应用的 Client ID
     * @return 维格一键登录页面的地址
     * @author 刘斌华
     * @date 2022-05-25 12:19:33
     */
    String getVikaLoginUrl(String clientId);

    /**
     * 获取维格处理玉符登录回调页面的地址
     *
     * @param clientId 玉符 IDaaS 应用的 Client ID
     * @param spaceId 绑定的空间站 ID，私有化部署时不需要该字段
     * @return 维格处理玉符登录回调页面的地址
     * @author 刘斌华
     * @date 2022-05-25 12:19:33
     */
    String getVikaCallbackUrl(String clientId, String spaceId);

    /**
     * 获取玉符 IDaaS 登录的路径
     *
     * @param clientId 玉符 IDaaS 应用的 Client ID
     * @return 玉符 IDaaS 登录的路径
     * @author 刘斌华
     * @date 2022-05-24 16:45:51
     */
    IdaasAuthLoginVo idaasLoginUrl(String clientId);

    /**
     * 玉符 IDaaS 登录后回调完成后续操作
     *
     * @param clientId 玉符 IDaaS 应用的 Client ID
     * @param spaceId 绑定的空间站 ID，私有化部署时不需要该字段
     * @param authCode 回调返回的授权码
     * @param state 回调返回的随机字符串
     * @author 刘斌华
     * @date 2022-05-24 17:32:48
     */
    void idaasLoginCallback(String clientId, String spaceId, String authCode, String state);

}
