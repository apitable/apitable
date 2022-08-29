package com.vikadata.api.interceptor;

import java.util.Collections;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.component.ApiResourceFactory;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.enums.social.SocialPlatformType;
import com.vikadata.api.enums.social.TenantDomainStatus;
import com.vikadata.api.lang.ResourceDefinition;
import com.vikadata.api.modular.social.enums.SocialAppType;
import com.vikadata.api.modular.social.model.SpaceBindDomainDTO;
import com.vikadata.api.modular.social.model.SpaceBindTenantInfoDTO;
import com.vikadata.api.modular.social.service.ISocialTenantBindService;
import com.vikadata.api.modular.social.service.ISocialTenantDomainService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;

import static com.vikadata.api.enums.exception.AuthException.NONE_RESOURCE;
import static com.vikadata.api.enums.exception.PermissionException.NODE_ACCESS_DENIED;
import static com.vikadata.api.enums.exception.SocialException.EXCLUSIVE_DOMAIN_UNBOUND;

/**
 * 专属域名拦截器
 *
 * <p>拦截当前使用的域名，是否是绑定的空间，vika_social_tenant_domain保存空间站对应的域名
 *
 * @author Pengap
 * @date 2021/8/30 16:18:08
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
        // 解析地址
        String requestPath = resolveServletPath(request);
        // 忽略检查地址
        for (String ignoreItem : IGNORE_CHECK_DOMAIN_URL) {
            if (ReUtil.isMatch(ignoreItem, requestPath)) {
                // 通行
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

        // 校验需要校验的请求
        if (resourceDef.getRequiredAccessDomain()) {
            // 查询空间站是否企业微信空间站（自建应用）
            SpaceBindTenantInfoDTO spaceBindStatus = iSocialTenantBindService.getSpaceBindTenantInfoByPlatform(spaceId, SocialPlatformType.WECOM, null);
            // 没有集成企业微信，集成状态=false，集成的类型不是自建应用，不对域名进行校验直接放行
            if (null == spaceBindStatus || !spaceBindStatus.getStatus() || SocialAppType.INTERNAL.getType() != spaceBindStatus.getAppType()) {
                return true;
            }
            // 1.先校验域名可用状态
            dto = iSocialTenantDomainService.getSpaceDomainByDomainName(remoteHost);
            if (null != dto) {
                if (TenantDomainStatus.WAIT_BIND.getCode() == dto.getStatus()) {
                    // 如果域名是绑定中禁止操作，并且弹出错误提示
                    throw new BusinessException(EXCLUSIVE_DOMAIN_UNBOUND);
                }
            }
            // 2.携带空间站Id请求头，校验访问域名是否匹配空间站绑定的域名
            if (StrUtil.isNotBlank(spaceId)) {
                dto = CollUtil.getFirst(iSocialTenantDomainService.getSpaceDomainBySpaceIds(Collections.singletonList(spaceId)));
                ExceptionUtil.isNotNull(dto, EXCLUSIVE_DOMAIN_UNBOUND);

                // 如果空间域名非可用状态，直接返回公网域名
                String spaceDomain = dto.getDomainName();
                if (!StrUtil.equals(spaceDomain, remoteHost)) {
                    throw new BusinessException(NODE_ACCESS_DENIED);
                }
            }
        }
        return true;
    }
}
