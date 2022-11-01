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
import com.vikadata.api.component.notification.NotifyMailFactory;
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
 * Version release table
 * </p>
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
                // integration/test Pipeline Id can be loaded
                return "feature." + pipelineId;
            }
        }
        // Otherwise, the latest version will be loaded by default
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
        // Check whether the SaaS environment is available, otherwise do not check the version specification
        String env = StrUtil.blankToDefault(clientProperties.getDatasheet().getEnv(), "other");
        boolean isSaasEnv = VikaVersion.isSaaSEnv(env);
        if (isSaasEnv) {
            // Check whether the version conforms to the specification
            VikaVersion version = VikaVersion.parseNotException(clientBuildRo.getVersion());
            if (version == null) {
                // Failed to parse version
                throw new BusinessException("illegal version, please check again");
            }
            if (!version.isFeatureVersion()) {
                // For non development version, verify ci deployment user permissions
                if (clientProperties.getDatasheet().getPublish() != null && CollectionUtil.isNotEmpty(clientProperties.getDatasheet().getPublish().getAuthUser())) {
                    if (!clientProperties.getDatasheet().getPublish().getAuthUser().contains(clientBuildRo.getPublishUser())) {
                        throw new BusinessException("You have no permission to publish client");
                    }
                }
            }
            String realVersion = version.isFeatureVersion() ? version.getBuildMetaVersion() : version.toString();
            save(ClientReleaseVersionEntity.builder()
                    .version(realVersion)
                    .description(StrUtil.sub(clientBuildRo.getDescription(), 0, 255))
                    .htmlContent(htmlContent)
                    .publishUser(clientBuildRo.getPublishUser()).build());
            if (version.isFeatureVersion()) {
                // Send an email if it is a feature
                TaskManager.me().execute(() -> sendNotifyEmail(realVersion));
            }
        }
        else {
            // Non SaaS Environment: poc、Local development、selfhost....any
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
            log.error("Unable to find the client version:{}", version);
            throw new RuntimeException("Unable to find the client version: " + version);
        }
        // Update the cache to prevent the cache from not updating in time after version rollback
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
        // Note that the feature version should not be put into memory, which will only increase unnecessary queries and occupation
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
            // Render message HTML body
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
            log.error("Failed to send version update mail");
        }
    }

    @Override
    public String getMetaContent(String uri) {
        // Whether it is a shared page route
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
            // Since the platform robot is the first one opened after sharing, there will be no cache penetration. The set cache time is one minute
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
        // Not a sharing page, use the default meta tag
        return getDefaultMetaContent();
    }

    @Override
    public String getNodeIdFromUri(String uri) {
        // Share ID
        String shareId = ClientUriUtil.getIdFromUri(uri, IdRulePrefixEnum.SHARE.getIdRulePrefixEnum());
        if (StrUtil.isNotBlank(shareId)) {
            return shareSettingMapper.selectNodeIdByShareId(shareId);
        }
        // Template ID
        String tmplId = ClientUriUtil.getIdFromUri(uri, IdRulePrefixEnum.TPL.getIdRulePrefixEnum());
        if (StrUtil.isNotBlank(tmplId)) {
            // Official talent analysis
            return templateMapper.selectNodeIdByTempIdAndType(tmplId, 0);
        }
        return null;
    }

    @Override
    public String getSpaceIdFromUri(String uri) {
        // Share ID
        String shareId = ClientUriUtil.getIdFromUri(uri, IdRulePrefixEnum.SHARE.getIdRulePrefixEnum());
        if (StrUtil.isNotBlank(shareId)) {
            return shareSettingMapper.selectSpaceIdByShareId(shareId);
        }
        return null;
    }

    @Override
    public boolean isMoreThanClientVersion(String version) {
        // This mode is used when the Saa S version is in operation to publish messages in full volume, not in other environments
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
            // Replace the beginning string of version number
            String tmpVersion = ReUtil.replaceAll(version, "^[a-zA-Z]", "");
            return Version.valueOf(tmpVersion);
        }
        catch (Exception e) {
            log.error("Error parsing version number:{}", version);
            return null;
        }
    }

    @Override
    public String getLatestVersion() {
        // Get the client environment configuration
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
            // Non SaaS environment, just get the latest
            return clientReleaseVersionMapper.selectClientLatestVersion();
        }
    }

    private MetaLabelContentVo getDefaultShareMetaContentVo(NodeShareSettingEntity entity) {
        // Non existent
        if (ObjectUtil.isNull(entity)) {
            return MetaLabelContentVo.builder()
                    .description(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_file_deleted_desc"),
                            clientProperties.getDatasheet().getMetaLabel().getNodeDeletedContent().getDescription()))
                    .image(clientProperties.getDatasheet().getMetaLabel().getNodeDeletedContent().getImage())
                    .title(StrUtil.blankToDefault(VikaStrings.t("client_meta_label_file_deleted_title"),
                            clientProperties.getDatasheet().getMetaLabel().getNodeDeletedContent().getTitle())).build();
        }
        String nodeName = nodeMapper.selectNodeNameByNodeId(entity.getNodeId());
        // The sharing node has been deleted
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
        // Template deleted
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
        // Load the default value first, and then replace it with data
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
        // Prevent the node from being deleted and return null
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
            log.warn("Failed to get node description", e);
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
