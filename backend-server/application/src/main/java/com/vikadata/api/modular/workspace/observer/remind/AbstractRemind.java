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
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.config.properties.ConstProperties;
import com.vikadata.api.enums.datasheet.IdRulePrefixEnum;
import com.vikadata.api.enums.datasheet.RemindType;
import com.vikadata.api.enums.exception.PermissionException;
import com.vikadata.api.component.notification.NotifyMailFactory.MailWithLang;
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

import static com.vikadata.core.constants.RedisConstants.GENERAL_LOCKED;

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
            log.info("[remind notification]-meta:fromMemberId｜fromUserId is null, do not send messages.");
            return;
        }
        if (CollUtil.isEmpty(meta.toMemberIds)) {
            log.info("[remind notification]-meta:toMemberIds is null, do not send messages.");
            return;
        }
        // build parameters
        this.buildExtraParameter(meta);
        // determine whether to send
        if (!isSend(meta)) {
            return;
        }
        // member
        if (meta.remindType == RemindType.MEMBER) {
            this.notifyMemberAction(meta);
        }
        // comment
        if (meta.remindType == RemindType.COMMENT) {
            this.notifyCommentAction(meta);
        }
    }

    /**
     * get the send subscription type
     */
    public abstract RemindSubjectEnum getRemindType();

    /**
     * notify @member actions
     */
    public abstract void notifyMemberAction(NotifyDataSheetMeta meta);

    /**
     * notify comments actions
     */
    public abstract void notifyCommentAction(NotifyDataSheetMeta meta);

    /**
     * build additional notification parameters
     */
    private NotifyDataSheetMeta buildExtraParameter(NotifyDataSheetMeta meta) {
        String nodeName = getNodeName(meta.nodeId);

        if (getRemindType() == RemindSubjectEnum.EMIL) {
            // parameters to use when sending email
            List<Long> sendMemberIds = new ArrayList<>();
            meta.toMemberIds.forEach(id -> {
                // limit one time in 15 seconds
                String lockKey = StrUtil.format(GENERAL_LOCKED, "datasheet:remind", StrUtil.format("{}to{}in{}", meta.fromMemberId, id, meta.nodeId));
                BoundValueOperations<String, Object> ops = redisTemplate.boundValueOps(lockKey);
                Boolean result = ops.setIfAbsent("", 15, TimeUnit.SECONDS);
                if (BooleanUtil.isTrue(result)) {
                    sendMemberIds.add(id);
                }
            });
            log.warn("[remind notification] - send user mail - sendMemberIds：{}", sendMemberIds);
            if (CollUtil.isNotEmpty(sendMemberIds)) {
                List<String> sendEmails = CollUtil.removeBlank(memberMapper.selectEmailByBatchMemberId(sendMemberIds));
                String defaultLang = LocaleContextHolder.getLocale().toLanguageTag();
                List<UserLangDTO> emailsWithLang = userService.getLangByEmails(defaultLang, sendEmails);
                List<MailWithLang> tos = emailsWithLang.stream()
                        .map(emailWithLang -> new MailWithLang(emailWithLang.getLocale(), emailWithLang.getEmail()))
                        .collect(Collectors.toList());
                log.warn("[remind notification] - send user mail - sendEmails：{}", sendEmails);
                if (CollUtil.isNotEmpty(sendEmails)) {
                    MailRemindParameter mailRemindParameter = new MailRemindParameter();
                    // send email collection
                    mailRemindParameter.setSendEmails(tos);
                    // sender name
                    mailRemindParameter.setFromMemberName(getMemberName(meta.fromMemberId, meta.fromUserId));
                    // space name
                    mailRemindParameter.setSpaceName(getSpaceName(meta.spaceId));
                    // node name
                    mailRemindParameter.setNodeName(nodeName);
                    // notify url
                    mailRemindParameter.setNotifyUrl(buildNotifyUrl(meta, true));
                    meta.setMailRemindParameter(mailRemindParameter);
                }
            }
        }
        else if (ArrayUtil.contains(RemindSubjectEnum.getImSubject(), getRemindType())) {
            // parameters to use when sending im
            // Query the third-party integrated user identity of the member
            String fromOpenId = memberMapper.selectOpenIdByMemberId(meta.fromMemberId);
            List<String> sendOpenIds = memberMapper.selectOpenIdByMemberIds(meta.toMemberIds);
            sendOpenIds = CollUtil.removeEmpty(sendOpenIds);
            log.warn("[remind notification]- send user im information - fromOpenId：{} - sendOpenIds：{}", fromOpenId, sendOpenIds);
            if (StrUtil.isNotBlank(fromOpenId) && CollUtil.isNotEmpty(sendOpenIds)) {
                IMRemindParameter iMRemindParameter = new IMRemindParameter();
                // sender
                iMRemindParameter.setFromOpenId(fromOpenId);
                // send to OpenIds
                iMRemindParameter.setSendOpenIds(sendOpenIds);
                // sender name
                Integer appType = meta.getAppType();
                if (Objects.nonNull(appType) && appType == SocialAppType.ISV.getType()) {
                    MemberEntity memberEntity = getMember(meta.getFromMemberId());
                    iMRemindParameter.setFromMemberName(memberEntity.getMemberName());
                    Integer socialNameModified = memberEntity.getIsSocialNameModified();
                    iMRemindParameter.setFromMemberNameModified(Objects.isNull(socialNameModified) || socialNameModified != 0);
                } else {
                    iMRemindParameter.setFromMemberName(getMemberName(meta.fromMemberId));
                }
                // node name
                iMRemindParameter.setNodeName(nodeName);
                // notify url
                iMRemindParameter.setNotifyUrl(buildNotifyUrl(meta, false));
                meta.setImRemindParameter(iMRemindParameter);
            }
        }
        return meta;
    }

    /**
     * whether to send
     */
    private boolean isSend(NotifyDataSheetMeta meta) {
        if (getRemindType() == RemindSubjectEnum.EMIL) {
            MailRemindParameter mailRemindParameter = meta.getMailRemindParameter();
            if (null == mailRemindParameter || CollUtil.isEmpty(mailRemindParameter.getSendEmails())) {
                log.warn("[remind notification]-spaceId:{}, the user's mail address does not exist and does not send messages. - fromMemberId：{} - toMemberIds：{}", meta.getSpaceId(), meta.getFromMemberId(), meta.getToMemberIds());
                return false;
            }
        }
        else if (ArrayUtil.contains(RemindSubjectEnum.getImSubject(), getRemindType())) {
            IMRemindParameter iMRemindParameter = meta.getImRemindParameter();
            if (null == iMRemindParameter || StrUtil.isBlank(iMRemindParameter.getFromOpenId()) || CollUtil.isEmpty(iMRemindParameter.getSendOpenIds())) {
                log.warn("[remind notification]-spaceId:{}, the user's im info does not exist and does not send messages. - fromMemberId：{} - toMemberIds：{}", meta.getSpaceId(), meta.getFromMemberId(), meta.getToMemberIds());
                return false;
            }
        }
        return true;
    }

    /**
     * build notification url
     *
     * notification url build format
     * </p>
     * {ServerDomain}/workbench/{mirrorId}/{nodeId}/{viewId}/{recordId}?comment=1&notifyId={notifyId}
     * </p>
     * Url parameters:
     * </p>
     * ServerDomain：current service domain name (optional)</br>
     * mirrorId：mirror node Id (maybe empty)</br>
     * nodeId：datasheet id </br>
     * viewId：datasheet view Id </br>
     * recordId：rowId </br>
     * notifyId：nofityId </br>
     */
    protected String buildNotifyUrl(NotifyDataSheetMeta meta, boolean falgServerDomain) {
        StringBuilder notifyUr = new StringBuilder();
        if (falgServerDomain) {
            notifyUr.append(constProperties.getServerDomain());
        }

        // path
        UrlPath notifyPath = UrlPath.of("workbench", CharsetUtil.CHARSET_UTF_8);
        notifyPath.add(meta.nodeId);
        // determine whether the node is a mirror
        if (meta.getNodeId().startsWith(IdRulePrefixEnum.MIRROR.getIdRulePrefixEnum())) {
            // DataSheetId
            NodeRelEntity mainNode = nodeRelMapper.selectByRelNodeId(meta.getNodeId());
            ExceptionUtil.isNotNull(mainNode, PermissionException.NODE_NOT_EXIST);
            notifyPath.add(mainNode.getMainNodeId());
        }
        notifyPath.add(meta.viewId).add(meta.recordId);
        notifyUr.append(notifyPath.build(CharsetUtil.CHARSET_UTF_8));

        // query parameters
        UrlQuery notifyQuery = meta.remindType == RemindType.MEMBER ? new UrlQuery() : UrlQuery.of("comment=1", CharsetUtil.CHARSET_UTF_8);
        // notifyId need to mark the message as read
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
     * get member name. if memberId == null, query defaultUserId
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
