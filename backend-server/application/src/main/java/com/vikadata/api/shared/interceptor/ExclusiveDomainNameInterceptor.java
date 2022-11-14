package com.vikadata.api.shared.interceptor;

import java.util.Collections;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.shared.component.scanner.ApiResourceFactory;
import com.vikadata.api.shared.constants.ParamsConstants;
import com.vikadata.api.enterprise.social.enums.SocialPlatformType;
import com.vikadata.api.enterprise.social.enums.TenantDomainStatus;
import com.vikadata.api.shared.component.ResourceDefinition;
import com.vikadata.api.enterprise.social.enums.SocialAppType;
import com.vikadata.api.enterprise.social.model.SpaceBindDomainDTO;
import com.vikadata.api.enterprise.social.model.SpaceBindTenantInfoDTO;
import com.vikadata.api.enterprise.social.service.ISocialTenantBindService;
import com.vikadata.api.enterprise.social.service.ISocialTenantDomainService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;

import static com.vikadata.api.base.enums.AuthException.NONE_RESOURCE;
import static com.vikadata.api.workspace.enums.PermissionException.NODE_ACCESS_DENIED;
import static com.vikadata.api.enterprise.social.enums.SocialException.EXCLUSIVE_DOMAIN_UNBOUND;

/**
 * Exclusive domain name blocker
 *
 * <p>Intercept the currently used domain name, whether it is the bound space
 *
 * @author Pengap
 */
@Slf4j
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(value = "vikadata-starter.social.wecom.enabled", havingValue = "true")
public class ExclusiveDomainNameInterceptor extends AbstractServletSupport implements HandlerInterceptor {

    @Resource
    private ApiResourceFactory apiResourceFactory;

    @Resource
    private ISocialTenantDomainService iSocialTenantDomainService;

    @Resource
    private ISocialTenantBindService iSocialTenantBindService;

    private final String[] IGNORE_CHECK_DOMAIN_URL = { "/user/me", "/social/wecom/bind/(.*)/config" };

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String requestPath = resolveServletPath(request);
        for (String ignoreItem : IGNORE_CHECK_DOMAIN_URL) {
            if (ReUtil.isMatch(ignoreItem, requestPath)) {
                return true;
            }
        }
        ResourceDefinition resourceDef = apiResourceFactory.getResourceByUrl(requestPath);
        if (resourceDef == null) {
            throw new BusinessException(NONE_RESOURCE);
        }

        SpaceBindDomainDTO dto;
        String remoteHost = HttpContextUtil.getRemoteHost(request);
        String spaceId = request.getHeader(ParamsConstants.SPACE_ID);

        if (resourceDef.getRequiredAccessDomain()) {
            // Query whether the space station is an enterprise WeChat space station
            SpaceBindTenantInfoDTO spaceBindStatus = iSocialTenantBindService.getSpaceBindTenantInfoByPlatform(spaceId, SocialPlatformType.WECOM, null);
            if (null == spaceBindStatus || !spaceBindStatus.getStatus() || SocialAppType.INTERNAL.getType() != spaceBindStatus.getAppType()) {
                return true;
            }
            // 1.Check the availability of the domain name first
            dto = iSocialTenantDomainService.getSpaceDomainByDomainName(remoteHost);
            if (null != dto) {
                if (TenantDomainStatus.WAIT_BIND.getCode() == dto.getStatus()) {
                    // If the domain name is prohibited from binding, and an error message pops up
                    throw new BusinessException(EXCLUSIVE_DOMAIN_UNBOUND);
                }
            }
            // 2.Check whether the access domain name matches the domain name bound to the space
            if (StrUtil.isNotBlank(spaceId)) {
                dto = CollUtil.getFirst(iSocialTenantDomainService.getSpaceDomainBySpaceIds(Collections.singletonList(spaceId)));
                ExceptionUtil.isNotNull(dto, EXCLUSIVE_DOMAIN_UNBOUND);

                // If the space domain name is not available, return the public domain name directly
                String spaceDomain = dto.getDomainName();
                if (!StrUtil.equals(spaceDomain, remoteHost)) {
                    throw new BusinessException(NODE_ACCESS_DENIED);
                }
            }
        }
        return true;
    }
}
