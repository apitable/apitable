package com.vikadata.api.modular.workspace.observer.remind;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.net.url.UrlPath;
import cn.hutool.core.net.url.UrlQuery;
import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.CharsetUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HtmlUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.enums.datasheet.IdRulePrefixEnum;
import com.vikadata.api.enums.datasheet.RemindType;
import com.vikadata.api.enums.exception.PermissionException;
import com.vikadata.api.factory.NotifyMailFactory.MailWithLang;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.api.modular.user.model.UserLangDTO;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.modular.workspace.mapper.NodeRelMapper;
import com.vikadata.api.modular.workspace.observer.DatasheetRemindObserver;
import com.vikadata.api.modular.workspace.observer.remind.NotifyDataSheetMeta.IMRemindParameter;
import com.vikadata.api.modular.workspace.observer.remind.NotifyDataSheetMeta.MailRemindParameter;
import com.vikadata.api.modular.workspace.observer.remind.RemindSubjectType.RemindSubjectEnum;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.NodeRelEntity;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;

import static com.vikadata.define.constants.RedisConstants.GENERAL_LOCKED;

/**
 * <p>
 * 抽象的提醒类
 * </p>
 *
 * @author Pengap
 * @date 2021/10/10 20:45:16
 */
@Slf4j
public abstract class AbstractRemind implements DatasheetRemindObserver {

    @Resource
    protected RedisTemplate<String, Object> redisTemplate;

    @Resource
    protected MemberMapper memberMapper;

    @Resource
    protected UserMapper userMapper;

    @Resource
    protected SpaceMapper spaceMapper;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private NodeRelMapper nodeRelMapper;

    @Resource
    private ConstProperties constProperties;

    @Resource
    private IUserService userService;

    @Override
    public void sendNotify(NotifyDataSheetMeta meta) {
        if (meta.fromMemberId == null && meta.fromUserId == null) {
            log.info("[提及通知]-meta:fromMemberId｜fromUserId为空不发送消息");
            return;
        }
        if (CollUtil.isEmpty(meta.toMemberIds)) {
            log.info("[提及通知]-meta:toMemberIds为空不发送消息");
            return;
        }
        // 构建参数
        this.buildExtraParameter(meta);
        // 判断是否发送
        if (!isSend(meta)) {
            return;
        }
        // 成员
        if (meta.remindType == RemindType.MEMBER) {
            this.notifyMemberAction(meta);
        }
        // 评论
        if (meta.remindType == RemindType.COMMENT) {
            this.notifyCommentAction(meta);
        }
    }

    /**
     * 获取发送订阅类型
     */
    public abstract RemindSubjectEnum getRemindType();

    /**
     * 通知@成员操作
     */
    public abstract void notifyMemberAction(NotifyDataSheetMeta meta);

    /**
     * 通知评论操作
     */
    public abstract void notifyCommentAction(NotifyDataSheetMeta meta);

    /**
     * 构建额外的通知参数
     */
    private NotifyDataSheetMeta buildExtraParameter(NotifyDataSheetMeta meta) {
        String nodeName = getNodeName(meta.nodeId);

        if (getRemindType() == RemindSubjectEnum.EMIL) {
            // 发送Email时需要使用的参数
            List<Long> sendMemberIds = new ArrayList<>();
            meta.toMemberIds.forEach(id -> {
                // 15秒内限发一次
                String lockKey = StrUtil.format(GENERAL_LOCKED, "datasheet:remind", StrUtil.format("{}to{}in{}", meta.fromMemberId, id, meta.nodeId));
                BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(lockKey);
                Boolean result = ops.setIfAbsent("", 15, TimeUnit.SECONDS);
                if (BooleanUtil.isTrue(result)) {
                    sendMemberIds.add(id);
                }
            });
            log.warn("[提及通知]-发送用户mail地址 - sendMemberIds：{}", sendMemberIds);
            if (CollUtil.isNotEmpty(sendMemberIds)) {
                List<String> sendEmails = CollUtil.removeBlank(memberMapper.selectEmailByBatchMemberId(sendMemberIds));
                String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
                List<UserLangDTO> emailsWithLang = userService.getLangByEmails(defaultLang, sendEmails);
                List<MailWithLang> tos = emailsWithLang.stream()
                        .map(emailWithLang -> new MailWithLang(emailWithLang.getLocale(), emailWithLang.getEmail()))
                        .collect(Collectors.toList());
                log.warn("[提及通知]-发送用户mail地址 - sendEmails：{}", sendEmails);
                if (CollUtil.isNotEmpty(sendEmails)) {
                    MailRemindParameter mailRemindParameter = new MailRemindParameter();
                    // 发送Email集合
                    mailRemindParameter.setSendEmails(tos);
                    // 发送者名称
                    mailRemindParameter.setFromMemberName(getMemberName(meta.fromMemberId, meta.fromUserId));
                    // 空间站名称
                    mailRemindParameter.setSpaceName(getSpaceName(meta.spaceId));
                    // 节点名称
                    mailRemindParameter.setNodeName(nodeName);
                    // 通知Url
                    mailRemindParameter.setNotifyUrl(buildNotifyUrl(meta, true));
                    meta.setMailRemindParameter(mailRemindParameter);
                }
            }
        }
        else if (ArrayUtil.contains(RemindSubjectEnum.getImSubject(), getRemindType())) {
            // 发送Im时需要使用的参数
            // 查询成员的第三方集成用户标识
            String fromOpenId = memberMapper.selectOpenIdByMemberId(meta.fromMemberId);
            List<String> sendOpenIds = memberMapper.selectOpenIdByMemberIds(meta.toMemberIds);
            sendOpenIds = CollUtil.removeEmpty(sendOpenIds);
            log.warn("[提及通知]-发送用户Im信息 - fromOpenId：{} - sendOpenIds：{}", fromOpenId, sendOpenIds);
            if (StrUtil.isNotBlank(fromOpenId) && CollUtil.isNotEmpty(sendOpenIds)) {
                IMRemindParameter iMRemindParameter = new IMRemindParameter();
                // 发送者
                iMRemindParameter.setFromOpenId(fromOpenId);
                // 发送OpenIds
                iMRemindParameter.setSendOpenIds(sendOpenIds);
                // 发送者名称
                Integer appType = meta.getAppType();
                if (Objects.nonNull(appType) && appType == SocialAppType.ISV.getType()) {
                    MemberEntity memberEntity = getMember(meta.getFromMemberId());
                    iMRemindParameter.setFromMemberName(memberEntity.getMemberName());
                    Integer socialNameModified = memberEntity.getIsSocialNameModified();
                    iMRemindParameter.setFromMemberNameModified(Objects.isNull(socialNameModified) || socialNameModified != 0);
                } else {
                    iMRemindParameter.setFromMemberName(getMemberName(meta.fromMemberId));
                }
                // 节点名称
                iMRemindParameter.setNodeName(nodeName);
                // 通知Url
                iMRemindParameter.setNotifyUrl(buildNotifyUrl(meta, false));
                meta.setImRemindParameter(iMRemindParameter);
            }
        }
        return meta;
    }

    /**
     * 是否发送
     */
    private boolean isSend(NotifyDataSheetMeta meta) {
        if (getRemindType() == RemindSubjectEnum.EMIL) {
            MailRemindParameter mailRemindParameter = meta.getMailRemindParameter();
            if (null == mailRemindParameter || CollUtil.isEmpty(mailRemindParameter.getSendEmails())) {
                log.warn("[提及通知]-spaceId:{},用户mail地址不存在,不发送消息 - fromMemberId：{} - toMemberIds：{}", meta.getSpaceId(), meta.getFromMemberId(), meta.getToMemberIds());
                return false;
            }
        }
        else if (ArrayUtil.contains(RemindSubjectEnum.getImSubject(), getRemindType())) {
            IMRemindParameter iMRemindParameter = meta.getImRemindParameter();
            if (null == iMRemindParameter || StrUtil.isBlank(iMRemindParameter.getFromOpenId()) || CollUtil.isEmpty(iMRemindParameter.getSendOpenIds())) {
                log.warn("[提及通知]-spaceId:{},用户Im信息不存在,不发送消息 - fromMemberId：{} - toMemberIds：{}", meta.getSpaceId(), meta.getFromMemberId(), meta.getToMemberIds());
                return false;
            }
        }
        return true;
    }

    /**
     * 构建通知Url
     *
     * 通知Url构建格式：
     * </p>
     * {ServerDomain}/workbench/{mirrorId}/{nodeId}/{viewId}/{recordId}?comment=1&notifyId={notifyId}
     * </p>
     * Url参数：
     * </p>
     * ServerDomain：当前服务域名（可选）</br>
     * mirrorId：镜像节点Id（可能为空）</br>
     * nodeId：数表Id </br>
     * viewId：数表视图Id </br>
     * recordId：行记录Id </br>
     * notifyId：通知Id </br>
     */
    protected String buildNotifyUrl(NotifyDataSheetMeta meta, boolean falgServerDomain) {
        StringBuilder notifyUr = new StringBuilder();
        if (falgServerDomain) {
            notifyUr.append(constProperties.getServerDomain());
        }

        // 路径
        UrlPath notifyPath = UrlPath.of("workbench", CharsetUtil.CHARSET_UTF_8);
        notifyPath.add(meta.nodeId);
        // 判断节点是否是镜像
        if (meta.getNodeId().startsWith(IdRulePrefixEnum.MIRROR.getIdRulePrefixEnum())) {
            // DataSheetId
            NodeRelEntity mainNode = nodeRelMapper.selectByRelNodeId(meta.getNodeId());
            ExceptionUtil.isNotNull(mainNode, PermissionException.NODE_NOT_EXIST);
            notifyPath.add(mainNode.getMainNodeId());
        }
        notifyPath.add(meta.viewId).add(meta.recordId);
        notifyUr.append(notifyPath.build(CharsetUtil.CHARSET_UTF_8));

        // 参数
        UrlQuery notifyQuery = meta.remindType == RemindType.MEMBER ? new UrlQuery() : UrlQuery.of("comment=1", CharsetUtil.CHARSET_UTF_8);
        // notifyId需要将消息标记为已读
        notifyQuery.add("notifyId", meta.notifyId);
        notifyUr.append('?').append(notifyQuery.build(CharsetUtil.CHARSET_UTF_8));

        return notifyUr.toString();
    }

    protected String getNodeName(String nodeId) {
        return nodeMapper.selectNodeNameByNodeId(nodeId);
    }

    protected String getMemberName(Long memberId) {
        return memberMapper.selectMemberNameById(memberId);
    }

    protected MemberEntity getMember(Long memberId) {
        return memberMapper.selectById(memberId);
    }

    protected String getUserName(Long userId) {
        return userMapper.selectUserNameById(userId);
    }

    /**
     * 获取成员名称，memberId == null，查询defaultUserId
     */
    protected String getMemberName(Long memberId, Long defaultUserId) {
        if (null != memberId) {
            return getMemberName(memberId);
        }
        return getUserName(defaultUserId);
    }

    protected String getSpaceName(String spaceId) {
        return spaceMapper.selectSpaceNameBySpaceId(spaceId);
    }

    protected String unescapeHtml(String contentHtml) {
        return HtmlUtil.unescape(HtmlUtil.filter(contentHtml));
    }

}
