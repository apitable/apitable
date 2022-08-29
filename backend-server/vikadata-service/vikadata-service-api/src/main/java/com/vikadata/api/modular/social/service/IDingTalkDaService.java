package com.vikadata.api.modular.social.service;

import com.vikadata.api.model.dto.template.TemplateInfo;
import com.vikadata.api.modular.social.model.DingTalkDaCreateTemplateDTO;
import com.vikadata.api.modular.social.model.DingTalkDaDTO;
import com.vikadata.api.modular.social.model.DingTalkDaTemplateUpdateRo;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppResponse;

/**
 * <p>
 * 钉钉集成服务 接口
 * </p>
 * @author zoe zheng
 * @date 2021/5/7 5:09 下午
 */
public interface IDingTalkDaService {
    /**
     * 验证钉钉搭的回调签名
     *
     * @param dingTalkDaKey 钉钉搭的key，自定义的
     * @param corpId 企业ID
     * @param timestamp 时间戳
     * @param signature 传递的签名
     * @author zoe zheng
     * @date 2021/9/28 15:24
     */
    void validateSignature(String dingTalkDaKey, String corpId, String timestamp, String signature);

    /**
     * 获取钉钉搭签名
     *
     * @param dingTalkDaKey 钉钉搭的的key，自定义的
     * @param corpId 企业ID
     * @param timestamp 时间戳
     * @return String|null
     * @author zoe zheng
     * @date 2021/9/28 16:10
     */
    String getSignature(String dingTalkDaKey, String corpId, String timestamp);

    /**
     * 钉钉搭使用模版
     *
     * @param dingDingDaKey 钉钉搭定义的key
     * @param authCorpId 授权企业ID
     * @param templateKey 模版ID
     * @param opUserId 操作人钉钉UserID
     * @param appName 钉钉搭应用的名称
     * @return mediaId
     * @author zoe zheng
     * @date 2021/9/29 16:55
     */
    DingTalkDaCreateTemplateDTO dingTalkDaTemplateCreate(String dingDingDaKey, String authCorpId, String templateKey,
            String opUserId, String appName);

    /**
     *  获取模版的logo
     *
     * @param suiteId 第三方应用suiteID
     * @param authCorpId 授权企业ID
     * @param template 模版信息
     * @param templateIconId 模版应用iconID
     * @param bizAppId 应用ID
     * @param opUserId 操作人钉钉UserID
     * @return mediaId
     * @author zoe zheng
     * @date 2021/9/29 16:55
     */
    DingTalkCreateApaasAppResponse createApssApp(String suiteId, String authCorpId,
            String bizAppId, TemplateInfo template, String templateIconId, String opUserId);

    /**
     *  获取模版的logo
     *
     * @param suiteId 第三方应用suiteID
     * @param authCorpId 授权企业ID
     * @param templateId 模版ID
     * @return mediaId
     * @author zoe zheng
     * @date 2021/9/29 16:55
     */
    String dingTalkDaTemplateIconMediaId(String suiteId, String authCorpId, String templateId);

    /**
     * 引用模版到用户绑定的空间
     *
     * @param templateInfo 模版信息
     * @param spaceId 空间ID
     * @param opMemberId 操作成员ID
     * @param opUserId 操作人的维格表userId
     * @param nodeName 钉钉搭应用的名称
     * @return 生成的目录ID
     * @author zoe zheng
     * @date 2021/9/30 17:24
     */
    String quoteTemplate(TemplateInfo templateInfo, String spaceId, Long opMemberId, Long opUserId, String nodeName);

    /**
     * 根据bizAppId获取钉钉搭应用信息
     *
     * @param bizAppId 钉钉搭应用
     * @return DingTalkDaDTO
     * @author zoe zheng
     * @date 2021/10/8 20:05
     */
    DingTalkDaDTO getDingTalkDaInfoByBizAppId(String bizAppId);

    /**
     * 钉钉搭应用更新
     *
     * @param dingTalkDaKey 钉钉搭定义的key
     * @param updateRo 更新参数
     * @author zoe zheng
     * @date 2021/10/8 20:45
     */
    void dingTalkDaTemplateUpdate(String dingTalkDaKey, DingTalkDaTemplateUpdateRo updateRo);

    /**
     * 钉钉搭模版应用删除
     *
     * @param bizAppId 钉钉搭appId对应我们的模版引用之后创建的nodeId
     * @param status 钉钉搭应用状态0表示停用，1表示启用, 2表示删除, 3表示未发布
     * @author zoe zheng
     * @date 2021/10/12 13:39
     */
    void dingTalkDaTemplateStatusUpdate(String bizAppId, Integer status);

    /**
     *  获取模版的logo
     *
     * @param spaceId 空间站ID
     * @param nodeId 模版引用之后创建的文件ID
     * @param templateId 模版ID
     * @param memberId 操作用户成员ID
     * @return mediaId
     * @author zoe zheng
     * @date 2021/9/29 16:55
     */
    void handleTemplateQuoted(String spaceId, String nodeId, String templateId, Long memberId);
}
