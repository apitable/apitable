package com.vikadata.api.modular.social.service.impl;

import javax.annotation.Resource;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.TaskManager;
import com.vikadata.api.component.audit.AuditInfoField;
import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.control.ControlTemplate;
import com.vikadata.api.control.permission.NodePermission;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.holder.AuditFieldHolder;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.model.dto.template.TemplateInfo;
import com.vikadata.api.model.ro.node.NodeUpdateOpRo;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.social.model.DingTalkDaCreateTemplateDTO;
import com.vikadata.api.modular.social.model.DingTalkDaDTO;
import com.vikadata.api.modular.social.model.DingTalkDaTemplateUpdateRo;
import com.vikadata.api.modular.social.model.TenantBindDTO;
import com.vikadata.api.modular.social.service.IDingTalkDaService;
import com.vikadata.api.modular.social.service.IDingTalkInternalIsvService;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantService;
import com.vikadata.api.modular.social.service.ISocialTenantUserService;
import com.vikadata.api.modular.social.service.ISocialUserBindService;
import com.vikadata.api.modular.template.mapper.TemplateMapper;
import com.vikadata.api.modular.user.SocialUser;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.modular.workspace.model.NodeCopyOptions;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.boot.autoconfigure.social.DingTalkProperties.IsvAppProperty;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.NodeEntity;
import com.vikadata.integration.vika.model.DingTalkDaTemplateInfo;
import com.vikadata.social.dingtalk.enums.DingTalkMediaType;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppRequest;
import com.vikadata.social.dingtalk.model.DingTalkCreateApaasAppResponse;
import com.vikadata.social.dingtalk.model.DingTalkUserDetail;
import com.vikadata.social.dingtalk.util.DingTalkSignatureUtil;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.vikadata.api.constants.NodeExtraConstants.DING_TALK_DA_STATUS;
import static com.vikadata.api.constants.NodeExtraConstants.DING_TALK_DA_TEMPLATE_KEY;
import static com.vikadata.api.enums.exception.PermissionException.NODE_OPERATION_DENIED;
import static com.vikadata.api.enums.exception.SocialException.DING_TALK_DA_NOT_BIND;
import static com.vikadata.api.enums.exception.SocialException.DING_TALK_DA_SIGNATURE_ERROR;
import static com.vikadata.api.enums.exception.SocialException.DING_TALK_DA_TEMPLATE_NOT_EXITS;
import static com.vikadata.api.enums.exception.SocialException.DING_TALK_DA_TENANT_NOT_EXITS;
import static com.vikadata.api.enums.exception.SocialException.USER_NOT_EXIST;

/**
 * 钉钉集成服务 接口实现
 *
 * @author Shawn Deng
 * @date 2020-12-08 16:29:55
 */
@Service
@Slf4j
public class DingTalkDaServiceImpl implements IDingTalkDaService {
    private static final String ISV_BIZ_APP_HOME_PAGE_TPL = "{}/user/dingtalk/social_bind_space?corpId={}&suiteId={}&bizAppId={}";

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private ISocialTenantUserService iSocialTenantUserService;

    @Resource
    private ISocialUserBindService iSocialUserBindService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    @Resource
    private IDingTalkInternalIsvService iDingTalkInternalIsvService;

    @Resource
    private ISocialTenantService iSocialTenantService;

    @Resource
    private ControlTemplate controlTemplate;

    @Resource
    private INodeService iNodeService;

    @Resource
    private TemplateMapper templateMapper;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private IUserService iUserService;

    @Override
    public void validateSignature(String dingTalkDaKey, String corpId, String timestamp, String signature) {
        try {
            String calSignature = getSignature(dingTalkDaKey, corpId, timestamp);
            if (!signature.equals(calSignature)) {
                throw new BusinessException(DING_TALK_DA_SIGNATURE_ERROR);
            }
        }
        catch (Exception e) {
            throw new BusinessException(DING_TALK_DA_SIGNATURE_ERROR);
        }
    }

    @Override
    public String getSignature(String dingTalkDaKey, String corpId, String timestamp) {
        IsvAppProperty app = iDingTalkInternalIsvService.getIsvAppConfigByDingDingDaKey(dingTalkDaKey);
        if (app != null) {
            String canonicalString = DingTalkSignatureUtil.getCanonicalStringForIsv(Long.parseLong(timestamp), corpId);
            return DingTalkSignatureUtil.computeSignature(app.getDingTalkDa().getSecret(), canonicalString);
        }
        return null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public DingTalkDaCreateTemplateDTO dingTalkDaTemplateCreate(String dingDingDaKey, String authCorpId,
            String templateId, String opUserId, String appName) {
        IsvAppProperty app = iDingTalkInternalIsvService.getIsvAppConfigByDingDingDaKey(dingDingDaKey);
        ExceptionUtil.isNotNull(app, DING_TALK_DA_NOT_BIND);
        TemplateInfo info = templateMapper.selectInfoByTempId(templateId);
        ExceptionUtil.isNotNull(info, DING_TALK_DA_TEMPLATE_NOT_EXITS);
        String appId = app.getSuiteId();
        String homePageLink;
        MemberEntity member = null;
        String nodeId = IdUtil.createNodeId();
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(authCorpId, appId);
        if (StrUtil.isNotBlank(spaceId)) {
            member = memberMapper.selectBySpaceIdAndOpenId(spaceId, opUserId);
        }
        else {
            // todo
            log.error("安装钉钉搭:主应用未绑定:{}:{}", authCorpId, appId);
        }
        if (member != null) {
            Long userId = member.getUserId();
            // 因为钉钉搭可能不会打开主应用，所以这里根据openId初始化一下维格表用户ID
            if (userId == null) {
                DingTalkUserDetail userDetail = iDingTalkInternalIsvService.getUserDetailByUserId(appId, authCorpId, opUserId);
                ExceptionUtil.isFalse(userDetail == null, USER_NOT_EXIST);
                // 创建或者获取用户ID
                userId = iUserService.createSocialUser(new SocialUser(member.getMemberName(), userDetail.getAvatar(),
                        appId, authCorpId, userDetail.getUserid(), userDetail.getUnionid(), SocialPlatformType.DINGTALK));
            }
            // 引用模版
            info.setTemplateId(templateId);
            nodeId = quoteTemplate(info, spaceId, member.getId(), userId, appName);
        }
        homePageLink = dingTalkDaEntryPageUrl(authCorpId, appId, nodeId);
        DingTalkDaCreateTemplateDTO dto = new DingTalkDaCreateTemplateDTO();
        dto.setBizAppId(nodeId);
        dto.setHomepageLink(homePageLink);
        dto.setPcHomepageLink(homePageLink);
        dto.setHomepageEditLink(homePageLink);
        dto.setPcHomepageEditLink(homePageLink);
        return dto;
    }

    @Override
    public DingTalkCreateApaasAppResponse createApssApp(String suiteId, String authCorpId,
            String bizAppId, TemplateInfo templateInfo, String templateIconId, String opUserId) {
        String templateId = templateInfo.getTemplateId();
        // 创建应用，可以在控制台上看见
        DingTalkCreateApaasAppRequest request = new DingTalkCreateApaasAppRequest();
        String appDesc = templateInfo.getName().split(" ")[0];
        String homePageLink = dingTalkDaEntryPageUrl(authCorpId, suiteId, bizAppId);
        request.setAppName(templateInfo.getName());
        request.setAppDesc(appDesc);
        request.setAppIcon(templateIconId);
        request.setHomepageLink(homePageLink);
        request.setPcHomepageLink(homePageLink);
        request.setPcHomepageEditLink(homePageLink);
        request.setHomepageEditLink(homePageLink);
        request.setOmpLink(homePageLink);
        request.setBizAppId(bizAppId);
        request.setOpUserId(opUserId);
        request.setTemplateKey(templateId);
        return iDingTalkInternalIsvService.createMicroApaasApp(suiteId, authCorpId, request);
    }

    @Override
    public String dingTalkDaTemplateIconMediaId(String suiteId, String authCorpId, String templateId) {
        String cacheKey = RedisConstants.getDingTalkTemplateIconKey(templateId);
        if (Boolean.TRUE.equals(redisTemplate.hasKey(cacheKey))) {
            DingTalkDaTemplateInfo info = JSONUtil.toBean(redisTemplate.opsForValue().get(cacheKey),
                    DingTalkDaTemplateInfo.class);
            if (StrUtil.isNotBlank(info.getIconMediaId())) {
                return info.getIconMediaId();
            }
            try {
                byte[] fileData = HttpUtil.downloadBytes(info.getIconUrl());
                String mediaId = iDingTalkInternalIsvService.uploadMedia(suiteId, authCorpId, DingTalkMediaType.IMAGE,
                        fileData, info.getIconName());
                info.setIconMediaId(mediaId);
                redisTemplate.opsForValue().set(cacheKey, JSONUtil.toJsonStr(info));
                return mediaId;
            }
            catch (Exception e) {
                log.error("钉钉搭模版icon上传失败:{}", templateId, e);
            }
            return null;
        }
        log.error("钉钉搭模版未配置icon,请确认是否正确:{}", templateId);
        return null;
    }

    @Override
    public String quoteTemplate(TemplateInfo templateInfo, String spaceId, Long opMemberId, Long opUserId,
            String nodeName) {
        String rootNodeId = iNodeService.getRootNodeIdBySpaceId(spaceId);
        String templateId = templateInfo.getTemplateId();
        // 校验节点权限
        controlTemplate.checkNodePermission(opMemberId, rootNodeId, NodePermission.CREATE_NODE,
                status -> ExceptionUtil.isTrue(status, NODE_OPERATION_DENIED));
        String sourceNodeId = templateInfo.getNodeId();
        // 复制节点到指定空间目录
        NodeEntity shareNode = nodeMapper.selectByNodeId(sourceNodeId);
        String nodeId = IdUtil.createNodeId(shareNode.getType());
        TaskManager.me().execute(() -> {
            NodeCopyOptions options = NodeCopyOptions.builder().copyData(true).verifyNodeCount(false)
                    .nodeName(nodeName).nodeId(nodeId).dingTalkDaTemplateKey(templateId).sourceTemplateId(templateId).build();
            // 转存节点方法，存在GRPC调用，若非异步调用，需保证最后调用
            iNodeService.copyNodeToSpace(opUserId, spaceId, rootNodeId, templateInfo.getNodeId(), options);
        });
        // 累计模板使用次数
        TaskManager.me().execute(() -> templateMapper.updateUsedTimesByTempId(templateId, 1));
        // 审计变量，记录值
        SpaceHolder.set(spaceId);
        AuditFieldHolder.set(AuditInfoField.builder().templateId(templateId).build());
        return nodeId;
    }

    @Override
    public DingTalkDaDTO getDingTalkDaInfoByBizAppId(String bizAppId) {
        String spaceId = iNodeService.getSpaceIdByNodeId(bizAppId);
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        if (bindInfo != null && bindInfo.getAppId() != null) {
            if (!iSocialTenantService.isTenantActive(bindInfo.getTenantId(), bindInfo.getAppId())) {
                return null;
            }
            IsvAppProperty app = iDingTalkInternalIsvService.getIsvAppConfig(bindInfo.getAppId());
            if (app != null) {
                DingTalkDaDTO dto = new DingTalkDaDTO();
                dto.setDingTalkSuiteKey(app.getSuiteKey());
                Integer status = nodeMapper.selectDingTalkDaStatusByNodeId(bizAppId);
                dto.setDingTalkDaStatus(status == null ? 0 : status);
                dto.setDingTalkCorpId(bindInfo.getTenantId());
                return dto;
            }
        }
        return null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void dingTalkDaTemplateUpdate(String dingTalkDaKey, DingTalkDaTemplateUpdateRo updateRo) {
        IsvAppProperty app = iDingTalkInternalIsvService.getIsvAppConfigByDingDingDaKey(dingTalkDaKey);
        ExceptionUtil.isNotNull(app, DING_TALK_DA_NOT_BIND);
        String appId = app.getSuiteId();
        String authCorpId = updateRo.getCorpId();
        String nodeId = updateRo.getBizAppId();
        String spaceId = iSocialTenantBindService.getTenantBindSpaceId(authCorpId, appId);
        ExceptionUtil.isNotNull(spaceId, DING_TALK_DA_TENANT_NOT_EXITS);
        String nodeName = nodeMapper.selectNodeNameByNodeId(nodeId);
        if (StrUtil.isNotBlank(updateRo.getName()) && !nodeName.equals(updateRo.getName())) {
            String unionId = iSocialTenantUserService.getUnionIdByOpenId(appId, authCorpId, updateRo.getOpUserId());
            Long userId = iSocialUserBindService.getUserIdByUnionId(unionId);
            if (userId != null) {
                NodeUpdateOpRo ro = new NodeUpdateOpRo();
                ro.setNodeName(updateRo.getName());
                iNodeService.edit(userId, nodeId, ro);
            }
        }
        dingTalkDaTemplateStatusUpdate(nodeId, updateRo.getAppStatus());
    }

    @Override
    public void dingTalkDaTemplateStatusUpdate(String nodeId, Integer status) {
        if (status != null) {
            // 钉钉搭应用状态0表示停用，1表示启用, 2表示删除, 3表示未发布
            String extra = nodeMapper.selectExtraByNodeId(nodeId);
            if (StrUtil.isBlank(extra)) {
                Dict extraObj = Dict.create().set(DING_TALK_DA_STATUS, status);
                nodeMapper.updateExtraByNodeId(nodeId, JSONUtil.toJsonStr(extraObj));
            }
            else {
                nodeMapper.updateDingTalkDaStatusByNodeId(nodeId, status);
            }
        }
    }

    @Override
    public void handleTemplateQuoted(String spaceId, String nodeId, String templateId, Long memberId) {
        TenantBindDTO bindInfo = iSocialTenantBindService.getTenantBindInfoBySpaceId(spaceId);
        // 过滤非钉钉isv
        if (bindInfo == null || bindInfo.getAppId() == null) {
            return;
        }
        if (!iSocialTenantService.isTenantActive(bindInfo.getTenantId(), bindInfo.getAppId())) {
            return;
        }
        IsvAppProperty app = iDingTalkInternalIsvService.getIsvAppConfig(bindInfo.getAppId());
        // 不是第三方应用,第三方应用没有集成钉钉搭
        if (app == null || app.getDingTalkDa() == null || app.getDingTalkDa().getTemplate() == null) {
            return;
        }
        // 不是指定的模版
        String cacheKey = RedisConstants.getDingTalkTemplateIconKey(templateId);
        if (!Boolean.TRUE.equals(redisTemplate.hasKey(cacheKey))) {
            return;
        }
        TemplateInfo info = templateMapper.selectInfoByTempId(templateId);
        // 模版不存在
        if (info == null) {
            return;
        }
        info.setName(nodeMapper.selectNodeNameByNodeId(nodeId));
        String openId = memberMapper.selectOpenIdById(memberId);
        if (StrUtil.isBlank(openId)) {
            log.error("同步钉钉搭模版失败:用户不存在:{}:{}", templateId, memberId);
            return;
        }

        String mediaId = app.getDingTalkDa().getTemplate().get(templateId);
        try {
            if (StrUtil.isBlank(mediaId)) {
                mediaId = dingTalkDaTemplateIconMediaId(bindInfo.getAppId(), bindInfo.getTenantId(), templateId);
            }
            DingTalkCreateApaasAppResponse response = createApssApp(bindInfo.getAppId(), bindInfo.getTenantId(), nodeId,
                    info, mediaId, openId);
            // 更新节点信息
            if (response.getErrcode() == 0) {
                // 钉钉搭应用状态0表示停用，1表示启用, 2表示删除, 3表示未发布
                String extra = nodeMapper.selectExtraByNodeId(nodeId);
                JSONObject extraObj = StrUtil.isNotBlank(extra) ? JSONUtil.parseObj(extra) : JSONUtil.createObj();
                extraObj.set(DING_TALK_DA_STATUS, 1);
                extraObj.set(DING_TALK_DA_TEMPLATE_KEY, templateId);
                nodeMapper.updateExtraByNodeId(nodeId, JSONUtil.toJsonStr(extraObj));
            }
            else {
                log.error("同步钉钉搭模版失败:{}:[{}]", templateId, response);
            }
        }
        catch (Exception e) {
            log.error("同步钉钉搭模版失败:{}", templateId, e);
        }
    }

    private String dingTalkDaEntryPageUrl(String authCorpId, String suiteId, String bizAppId) {
        return StrUtil.format(ISV_BIZ_APP_HOME_PAGE_TPL, constProperties.getServerDomain(), authCorpId, suiteId,
                bizAppId);
    }
}
