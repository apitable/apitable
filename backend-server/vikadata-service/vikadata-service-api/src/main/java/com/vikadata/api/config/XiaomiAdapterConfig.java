package com.vikadata.api.config;

import java.io.IOException;
import java.io.Writer;
import java.nio.charset.StandardCharsets;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xiaomi.aegis.vo.UserInfoVO;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.api.component.ApiResourceFactory;
import com.vikadata.api.constants.FilterConstants;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.lang.ResourceDefinition;
import com.vikadata.api.modular.social.mapper.SocialUserBindMapper;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.boot.autoconfigure.xiaomi.UnauthorizedResponseCustomizer;
import com.vikadata.core.support.ResponseData;

import org.springframework.beans.factory.BeanFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import static com.vikadata.api.enums.exception.AuthException.UNAUTHORIZED;
import static com.vikadata.boot.autoconfigure.xiaomi.CasMidunFilter.isIgnoreUrl;
import static com.xiaomi.aegis.constant.SdkConstants.REQUEST_ATTRIBUTE_USER_INFO_KEY;

/**
 * 小米适配器配置
 *
 * @author Shawn Deng
 * @date 2021-07-01 11:50:16
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnProperty(value = "vikadata-starter.xiaomi.enabled", havingValue = "true")
public class XiaomiAdapterConfig {

    @Primary
    @Bean
    public UnauthorizedResponseCustomizer noAuthResponseCustomizer(ObjectMapper objectMapper) {
        return response -> {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setCharacterEncoding(StandardCharsets.UTF_8.toString());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            try (Writer writer = response.getWriter()) {
                objectMapper.writeValue(writer, ResponseData.error(UNAUTHORIZED.getCode(), UNAUTHORIZED.getMessage()));
                writer.flush();
            }
            catch (IOException e) {
                throw new ServletException(e);
            }
        };
    }

    @Bean
    FilterRegistrationBean<CasProxyUserDetailFilter> casProxyUserDetailFilter(BeanFactory beanFactory, ApiResourceFactory resourceFactory) {
        FilterRegistrationBean<CasProxyUserDetailFilter> filterRegistrationBean =
            new FilterRegistrationBean<>(new CasProxyUserDetailFilter(beanFactory, resourceFactory));
        filterRegistrationBean.setOrder(FilterConstants.TRACE_REQUEST_FILTER);
        filterRegistrationBean.setOrder(Ordered.LOWEST_PRECEDENCE);
        return filterRegistrationBean;
    }
}

@Slf4j
final class CasProxyUserDetailFilter extends OncePerRequestFilter {

    private static final Logger LOGGER = LoggerFactory.getLogger(CasProxyUserDetailFilter.class);

    private final BeanFactory beanFactory;

    private final ApiResourceFactory apiResourceFactory;

    public CasProxyUserDetailFilter(BeanFactory beanFactory, ApiResourceFactory apiResourceFactory) {
        this.beanFactory = beanFactory;
        this.apiResourceFactory = apiResourceFactory;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String serverPath = request.getServletPath();
        if (isIgnoreUrl(serverPath)) {
            LOGGER.info("业务检查到米盾忽略路径: {}", serverPath);
            filterChain.doFilter(request, response);
            return;
        }
        ResourceDefinition resourceDef = apiResourceFactory.getResourceByUrl(serverPath);
        if (resourceDef != null) {
            if (!resourceDef.getRequiredLogin()) {
                LOGGER.info("无需会话路径: {}", serverPath);
                filterChain.doFilter(request, response);
                return;
            }
        }
        UserInfoVO userInfoVO = (UserInfoVO) request.getAttribute(REQUEST_ATTRIBUTE_USER_INFO_KEY);
        log.info("用户信息：{}", JSONUtil.toJsonStr(userInfoVO));
        // 查询用户是否存在，不存在则自动创建账号，存在创建会话
        String miUsername = userInfoVO.getUser();
        if (StrUtil.isBlank(miUsername)) {
            throw new ServletException(UNAUTHORIZED.getMessage());
        }
        SocialUserBindMapper socialUserBindMapper = beanFactory.getBean(SocialUserBindMapper.class);
        Long userId = socialUserBindMapper.selectUserIdByUnionId(miUsername);
        if (userId == null) {
            // 创建账号并创建空间
            String remark = String.format("%s(%s)", userInfoVO.getDisplayName(), userInfoVO.getDepartmentName());
            userId = beanFactory.getBean(IUserService.class).createByExternalSystem(miUsername, userInfoVO.getName(), userInfoVO.getAvatar(), userInfoVO.getEmail(), remark);
        }
        SessionContext.setExternalId(userId, miUsername);
        filterChain.doFilter(request, response);
    }
}
