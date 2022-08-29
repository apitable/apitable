package com.vikadata.api.modular.client.service.impl;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.codec.Base64;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.text.StrSpliter;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.github.zafarkhaja.semver.Version;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.ClientEntryTemplateConfig;
import com.vikadata.api.component.TaskManager;
import com.vikadata.api.config.properties.ClientProperties;
import com.vikadata.api.constants.NodeDescConstants;
import com.vikadata.api.enums.datasheet.IdRulePrefixEnum;
import com.vikadata.api.factory.NotifyMailFactory;
import com.vikadata.api.model.dto.client.ClientEntryDetailDto;
import com.vikadata.api.model.dto.node.NodeDescParseDTO;
import com.vikadata.api.model.ro.client.ClientBuildRo;
import com.vikadata.api.model.vo.client.MetaLabelContentVo;
import com.vikadata.api.model.vo.client.NotifyEmailVo;
import com.vikadata.api.modular.client.mapper.ClientReleaseVersionMapper;
import com.vikadata.api.modular.client.service.IClientReleaseVersionService;
import com.vikadata.api.modular.template.mapper.TemplateMapper;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.modular.workspace.mapper.NodeShareSettingMapper;
import com.vikadata.api.modular.workspace.service.INodeDescService;
import com.vikadata.api.modular.workspace.service.IResourceMetaService;
import com.vikadata.api.util.ClientUriUtil;
import com.vikadata.api.util.CollectionUtil;
import com.vikadata.api.util.VikaStrings;
import com.vikadata.api.util.VikaVersion;
import com.vikadata.api.util.VikaVersion.Env;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.define.constants.RedisConstants;
import com.vikadata.entity.ClientReleaseVersionEntity;
import com.vikadata.entity.NodeShareSettingEntity;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.vikadata.api.constants.MailPropConstants.SUBJECT_PUBLISH_NOTIFY;
import static com.vikadata.define.constants.RedisConstants.DATASHEET_CLIENT_VERSION_KEY;

/**
 * <p>
 * 版本发布表
 * </p>
 *
 * @author zoe zheng
 * @date 2020/4/7 4:58 下午
 */
@Service
@Slf4j
public class ClientReleaseVersionServiceImpl extends ServiceImpl<ClientReleaseVersionMapper, ClientReleaseVersionEntity>
        implements IClientReleaseVersionService {

    @Resource
    private ClientReleaseVersionMapper clientReleaseVersionMapper;

    @Resource
    private ClientProperties clientProperties;

    @Resource
    private INodeDescService nodeDescService;

    @Resource
    private NodeShareSettingMapper shareSettingMapper;

    @Resource
    private ClientEntryTemplateConfig clientEntryTemplate;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private TemplateMapper templateMapper;

    @Resource
    private IResourceMetaService iResourceMetaService;

    @Override
    public String getVersionOrDefault(Env env, String pipelineId) {
        if (StrUtil.isNotBlank(pipelineId)) {
            if (env != null && (env.isIntegrationEnv() || env.isTestEnv())) {
                // integration/test 可以加载pipelineId
                return "feature." + pipelineId;
            }
        }
        // 否则默认加载最新版本
        return Boolean.TRUE.equals(redisTemplate.hasKey(DATASHEET_CLIENT_VERSION_KEY)) ?
                redisTemplate.opsForValue().get(DATASHEET_CLIENT_VERSION_KEY)
                : getLatestVersion();
    }

    @Override
    public void createClientVersion(ClientBuildRo clientBuildRo) {
        String htmlContent = new String(Base64.decode(clientBuildRo.getHtmlContent()), StandardCharsets.UTF_8);
        if (StrUtil.isBlank(htmlContent)) {
            throw new BusinessException("html content is blank");
        }
        // 检查是否SaaS环境，否则不检查版本规范
        String env = StrUtil.blankToDefault(clientProperties.getDatasheet().getEnv(), "other");
        boolean isSaasEnv = VikaVersion.isSaaSEnv(env);
        if (isSaasEnv) {
            // 检查版本是否符合规范
            VikaVersion version = VikaVersion.parseNotException(clientBuildRo.getVersion());
            if (version == null) {
                // 解析版本失败
                throw new BusinessException("illegal version, please check again");
            }
            if (!version.isFeatureVersion()) {
                // 非开发版本，校验ci部署用户权限
                if (clientProperties.getDatasheet().getPublish() != null && CollectionUtil.isNotEmpty(clientProperties.getDatasheet().getPublish().getAuthUser())) {
                    if (!clientProperties.getDatasheet().getPublish().getAuthUser().contains(clientBuildRo.getPublishUser())) {
                        throw new BusinessException("You have no permission to publish client");
                    }
                }
            }
            // feature版本不需要版本号，直接使用[feature.{pipelineId}]
            String realVersion = version.isFeatureVersion() ? version.getBuildMetaVersion() : version.toString();
            save(ClientReleaseVersionEntity.builder()
                    .version(realVersion)
                    .description(StrUtil.sub(clientBuildRo.getDescription(), 0, 255))
                    .htmlContent(htmlContent)
                    .publishUser(clientBuildRo.getPublishUser()).build());
            if (version.isFeatureVersion()) {
                // 如果是feature 就发送邮件
                TaskManager.me().execute(() -> sendNotifyEmail(realVersion));
            }
        }
        else {
            // 非SaaS环境: poc、本地开发、selfhost....any
            save(ClientReleaseVersionEntity.builder()
                    .version(clientBuildRo.getVersion())
                    .description(StrUtil.sub(clientBuildRo.getDescription(), 0, 255))
                    .htmlContent(htmlContent)
                    .publishUser(clientBuildRo.getPublishUser()).build());
        }
    }

    @Override
    public String getHtmlContentByVersion(String version) {
        ClientEntryDetailDto clientEntryDetailDto = clientReleaseVersionMapper.selectClientEntryDetailByVersion(version);
        if (clientEntryDetailDto == null) {
            log.error("无法查到客户端版本:{}", version);
            throw new RuntimeException("无法查到客户端版本: " + version);
        }
        // 更新缓存，防止版本回滚之后缓存不及时更新
        return clientEntryDetailDto.getHtmlContent();
    }

    @Override
    public String refreshHtmlContent(String version) {
        String htmlContent = getHtmlContentByVersion(version);
        ClientProperties.HTML_CONTENT_CACHE.put(version, htmlContent);
        return htmlContent;
    }

    @Override
    public String getHtmlContentCacheIfAbsent(String version) {
        // 注意，feature版本不要放入内存，这样只会增加没必要的查询与占用
        String htmlContent = ClientProperties.HTML_CONTENT_CACHE.get(version);
        if (StrUtil.isBlank(htmlContent)) {
            htmlContent = refreshHtmlContent(version);
        }
        return htmlContent;
    }

    @Override
    public void sendNotifyEmail(String version) {
        try {
            ClientEntryDetailDto clientEntryDetailDto =
                    clientReleaseVersionMapper.selectClientEntryDetailByVersion(version);
            // 渲染邮件HTML正文
            NotifyEmailVo notifyEmailVo = NotifyEmailVo.builder().version(version)
                    .publishUser(clientEntryDetailDto.getPublishUser()).years(DateUtil.thisYear())
                    .content(clientEntryDetailDto.getDescription()).build();

            String subject = version + clientProperties.getDatasheet().getNotify().getTitle();
            if (version.contains(ClientProperties.CLIENT_FEATURE_ENV)) {
                subject = version + "--" + ClientProperties.CLIENT_FEATURE_ENV + "更新";
            }
            String personal = clientProperties.getDatasheet().getNotify().getSenderName();
            List<String> to = StrSpliter.split(clientProperties.getDatasheet().getNotify().getEmailTo(), ',', true, true);
            NotifyMailFactory.me().notify(personal, subject, SUBJECT_PUBLISH_NOTIFY, Dict.parse(notifyEmailVo), null, to);
        }
        catch (Exception e) {
            e.printStackTrace();
            log.error("发送版本更新邮件失败");
        }
    }

    @Override
    public String getMetaContent(String uri) {
        // 是否是分享页路由
        if (ClientUriUtil.isMatchSharePath(uri)) {
            MetaLabelContentVo defaultMetaContent;
            String nodeId = null;
            String metaLabel = Base64.decodeStr(clientProperties.getDatasheet().getMetaLabel().getCommonLabel());
            String keyId = ClientUriUtil.getIdFromUri(uri, IdRulePrefixEnum.SHARE.getIdRulePrefixEnum());
            if (StrUtil.isNotBlank(keyId)) {
                NodeShareSettingEntity shareEntity = shareSettingMapper.selectNodeIdAndEnabledByShareId(keyId);
                defaultMetaContent = getDefaultShareMetaContentVo(shareEntity);
                if (ObjectUtil.isNotNull(shareEntity)) {
                    nodeId = shareEntity.getNodeId();
                }
            }
            else {
                keyId = ClientUriUtil.getIdFromUri(uri, IdRulePrefixEnum.TPL.getIdRulePrefixEnum());
                nodeId = templateMapper.selectNodeIdByTempIdAndType(keyId, 0);
                defaultMetaContent = getDefaultTplMetaContentVo(nodeId);
            }
            if (ObjectUtil.isNotNull(defaultMetaContent)) {
                defaultMetaContent.setPageUrl(clientProperties.getDatasheet().getHost() + uri);
                return clientEntryTemplate.render(metaLabel, BeanUtil.beanToMap(defaultMetaContent));
            }
            String cacheKey = RedisConstants.getEntryMetaKey(keyId);
            // 因为分享之后，第一个打开的是平台机器人，所以不会存在缓存穿透，设置的缓存时间为一分钟
            if (BooleanUtil.isTrue(redisTemplate.hasKey(cacheKey))) {
                return redisTemplate.opsForValue().get(cacheKey);
            }
            MetaLabelContentVo metaLabelContentVo = getMetaContentVo(nodeId);
            metaLabelContentVo.setPageUrl(clientProperties.getDatasheet().getHost() + uri);
            String metaContent = clientEntryTemplate.render(metaLabel, BeanUtil.beanToMap(metaLabelContentVo));
            log.info("Entry:Meta:{},{},{},{}", uri, metaLabel, metaLabelContentVo, metaContent);
            redisTemplate.opsForValue().set(cacheKey, metaContent,
                    clientProperties.getDatasheet().getMetaLabel().getCacheExpire(), TimeUnit.MINUTES);
            return metaContent;
        }
        // 不是分享页，使用默认的meta标签
        return getDefaultMetaContent();
    }

    @Override
    public String getNodeIdFromUri(String uri) {
        // 分享ID
        String shareId = ClientUriUtil.getIdFromUri(uri, IdRulePrefixEnum.SHARE.getIdRulePrefixEnum());
        if (StrUtil.isNotBlank(shareId)) {
            return shareSettingMapper.selectNodeIdByShareId(shareId);
        }
        // 模版ID
        String tmplId = ClientUriUtil.getIdFromUri(uri, IdRulePrefixEnum.TPL.getIdRulePrefixEnum());
        if (StrUtil.isNotBlank(tmplId)) {
            // 官方的才解析
            return templateMapper.selectNodeIdByTempIdAndType(tmplId, 0);
        }
        return null;
    }

    @Override
    public String getSpaceIdFromUri(String uri) {
        // 分享ID
        String shareId = ClientUriUtil.getIdFromUri(uri, IdRulePrefixEnum.SHARE.getIdRulePrefixEnum());
        if (StrUtil.isNotBlank(shareId)) {
            return shareSettingMapper.selectSpaceIdByShareId(shareId);
        }
        return null;
    }

    @Override
    public boolean isMoreThanClientVersion(String version) {
        // 此方式是SaaS版本运营时全量发布消息时使用，不在其他环境使用
        VikaVersion compareVersion = VikaVersion.parseNotException(version);
        if (compareVersion == null) {
            log.error("fail to parse version from notification: {}", version);
            return false;
        }
        String clientVersionStr = Boolean.TRUE.equals(redisTemplate.hasKey(DATASHEET_CLIENT_VERSION_KEY)) ?
                redisTemplate.opsForValue().get(DATASHEET_CLIENT_VERSION_KEY) : getLatestVersion();
        VikaVersion clientVersion = VikaVersion.parseNotException(clientVersionStr);
        if (clientVersion == null) {
            log.error("fail to parse version from current client: {}", clientVersionStr);
            return false;
        }
        return compareVersion.isGreaterThan(clientVersion);
    }

    @Deprecated
    public Version getVersion(String version) {
        try {
            // 替换掉版本号开头字符串
            String tmpVersion = ReUtil.replaceAll(version, "^[a-zA-Z]", "");
            return Version.valueOf(tmpVersion);
        }
        catch (Exception e) {
            log.error("解析版本号错误:{}", version);
            return null;
        }
    }

    @Override
    public String getLatestVersion() {
        // 获取客户端环境配置
        String env = StrUtil.blankToDefault(clientProperties.getDatasheet().getEnv(), "other");
        if (log.isDebugEnabled()) {
            log.debug("Client Datasheet Env: {}", env);
        }
        Env datasheetEnv = Env.of(env);
        if (datasheetEnv != null) {
            long count = SqlHelper.retCount(clientReleaseVersionMapper.selectTotalCount());
            for (long i = 0; i < count; i++) {
                String versionName = clientReleaseVersionMapper.selectClientLatestVersionByOffset(i);
                VikaVersion version = VikaVersion.parseNotException(versionName);
                if (version != null && version.isVersionOfEnv(datasheetEnv)) {
                    return versionName;
                }
            }
            return null;
        }
        else {
            // 非SaaS环境，直接获取最新的即可
            return clientReleaseVersionMapper.selectClientLatestVersion();
        }
    }

    private MetaLabelContentVo getDefaultShareMetaContentVo(NodeShareSettingEntity entity) {
        // 不存在
        if (ObjectUtil.isNull(entity)) {
            return MetaLabelContentVo.builder()
                    .description(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_file_deleted_desc"),
                            clientProperties.getDatasheet().getMetaLabel().getNodeDeletedContent().getDescription()))
                    .image(clientProperties.getDatasheet().getMetaLabel().getNodeDeletedContent().getImage())
                    .title(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_file_deleted_title"),
                            clientProperties.getDatasheet().getMetaLabel().getNodeDeletedContent().getTitle())).build();
        }
        String nodeName = nodeMapper.selectNodeNameByNodeId(entity.getNodeId());
        // 分享节点被删除了
        if (StrUtil.isBlank(nodeName)) {
            return MetaLabelContentVo.builder()
                    .description(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_file_deleted_desc"),
                            clientProperties.getDatasheet().getMetaLabel().getNodeDeletedContent().getDescription()))
                    .image(clientProperties.getDatasheet().getMetaLabel().getNodeDeletedContent().getImage())
                    .title(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_file_deleted_title"),
                            clientProperties.getDatasheet().getMetaLabel().getNodeDeletedContent().getTitle())).build();
        }
        if (!entity.getIsEnabled()) {
            return MetaLabelContentVo.builder()
                    .description(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_share_disable_desc"),
                            clientProperties.getDatasheet().getMetaLabel().getShareNotEnableContent().getDescription()))
                    .image(clientProperties.getDatasheet().getMetaLabel().getShareNotEnableContent().getImage())
                    .title(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_share_disable_title"),
                            clientProperties.getDatasheet().getMetaLabel().getShareNotEnableContent().getTitle())).build();
        }
        return null;
    }

    private MetaLabelContentVo getDefaultTplMetaContentVo(String nodeId) {
        // 模版被删除了
        if (StrUtil.isBlank(nodeId)) {
            return MetaLabelContentVo.builder()
                    .description(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_template_deleted_desc"),
                            clientProperties.getDatasheet().getMetaLabel().getTplDeletedContent().getDescription()))
                    .image(clientProperties.getDatasheet().getMetaLabel().getTplDeletedContent().getImage())
                    .title(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_template_deleted_title"),
                            clientProperties.getDatasheet().getMetaLabel().getTplDeletedContent().getTitle())).build();

        }
        return null;
    }

    private MetaLabelContentVo getMetaContentVo(String nodeId) {
        // 先加载默认的值，之后有数据再替换
        MetaLabelContentVo metaLabelContentVo = MetaLabelContentVo.builder()
                .description(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_desc"),
                        clientProperties.getDatasheet().getMetaLabel().getDefaultContent().getDescription()))
                .image(clientProperties.getDatasheet().getMetaLabel().getDefaultContent().getImage())
                .title(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_title"),
                        clientProperties.getDatasheet().getMetaLabel().getDefaultContent().getTitle())).build();
        if (StrUtil.isBlank(nodeId)) {
            return metaLabelContentVo;
        }
        String nodeName = nodeMapper.selectNodeNameByNodeId(nodeId);
        if (StrUtil.isBlank(nodeName)) {
            return metaLabelContentVo;
        }
        // 防止节点被删除，返回null
        metaLabelContentVo.setTitle(nodeName);
        try {
            NodeDescParseDTO nodeDescParseDto = nodeId.startsWith(IdRulePrefixEnum.FORM.getIdRulePrefixEnum())
                    ? iResourceMetaService.parseFormDescByFormId(nodeId) :
                    nodeDescService.parseNodeDescByNodeId(nodeId);
            List<String> content = nodeDescParseDto.getContent();
            List<String> imageUrl = nodeDescParseDto.getImageUrl();
            if (!content.isEmpty()) {
                metaLabelContentVo.setDescription(StrUtil.sub(StrUtil.join("", content),
                        0, NodeDescConstants.DESC_TEXT_META_LENGTH));
            }
            if (!imageUrl.isEmpty()) {
                metaLabelContentVo.setImage(imageUrl.get(0));
            }
        }
        catch (Exception e) {
            log.warn("获取节点描述失败", e);
        }
        return metaLabelContentVo;
    }

    private String getDefaultMetaContent() {
        String defaultMetaLabel = Base64.decodeStr(clientProperties.getDatasheet().getMetaLabel().getDefaultLabel());
        MetaLabelContentVo defaultMetaContent = MetaLabelContentVo.builder()
                .description(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_desc"),
                        clientProperties.getDatasheet().getMetaLabel().getDefaultContent().getDescription()))
                .title(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_title"),
                        clientProperties.getDatasheet().getMetaLabel().getDefaultContent().getTitle())).build();
        return clientEntryTemplate.render(defaultMetaLabel, BeanUtil.beanToMap(defaultMetaContent));
    }
}
