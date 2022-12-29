package com.vikadata.api.client.service.impl;

import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.codec.Base64;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;
import com.github.zafarkhaja.semver.Version;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.client.mapper.ClientReleaseVersionMapper;
import com.vikadata.api.client.service.IClientReleaseVersionService;
import com.vikadata.api.client.vo.MetaLabelContentVo;
import com.vikadata.api.shared.component.ClientEntryTemplateConfig;
import com.vikadata.api.shared.config.properties.ClientProperties;
import com.vikadata.api.shared.constants.NodeDescConstants;
import com.vikadata.api.workspace.enums.IdRulePrefixEnum;
import com.vikadata.api.workspace.dto.NodeDescParseDTO;
import com.vikadata.api.template.mapper.TemplateMapper;
import com.vikadata.api.workspace.mapper.NodeMapper;
import com.vikadata.api.workspace.mapper.NodeShareSettingMapper;
import com.vikadata.api.workspace.service.INodeDescService;
import com.vikadata.api.workspace.service.IResourceMetaService;
import com.vikadata.api.shared.util.ClientUriUtil;
import com.vikadata.api.shared.util.VikaStrings;
import com.vikadata.api.shared.util.VikaVersion;
import com.vikadata.api.shared.util.VikaVersion.Env;
import com.vikadata.core.constants.RedisConstants;
import com.vikadata.entity.ClientReleaseVersionEntity;
import com.vikadata.entity.NodeShareSettingEntity;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.vikadata.core.constants.RedisConstants.DATASHEET_CLIENT_VERSION_KEY;

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
