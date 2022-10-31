package com.vikadata.api.interceptor;

import java.util.Arrays;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ArrayUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.cache.bean.UserSpaceDto;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.ApiResourceFactory;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.exception.AuthException;
import com.vikadata.api.holder.MemberHolder;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.holder.UserHolder;
import com.vikadata.api.component.ResourceDefinition;
import com.vikadata.api.modular.developer.mapper.DeveloperMapper;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.util.ApiHelper;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;

import org.springframework.web.servlet.HandlerInterceptor;

import static com.vikadata.api.enums.exception.AuthException.NONE_RESOURCE;
import static com.vikadata.api.enums.exception.SpaceException.SPACE_NOT_EXIST;

/**
 * <p>
 * Resource verification interceptor
 * 1.space management resource check
 * 2.Node resource check
 * </p>
 *
 * @author Shawn Deng
 */
@Slf4j
public class ResourceInterceptor extends AbstractServletSupport implements HandlerInterceptor {

    @Resource
    private UserSpaceService userSpaceService;

    @Resource
    private ApiResourceFactory apiResourceFactory;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private DeveloperMapper developerMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String requestPath = resolveServletPath(request);
        ResourceDefinition resourceDef = apiResourceFactory.getResourceByUrl(requestPath);
        if (resourceDef == null) {
            log.error("Request path [{}] is not exist", requestPath);
            throw new BusinessException(NONE_RESOURCE);
        }

        if (!resourceDef.getRequiredLogin()) {
            return true;
        }

        Long userId;
        if (!HttpContextUtil.hasSession()) {
            // Get API KEY
            String apiKey = ApiHelper.getApiKey(request);
            ExceptionUtil.isNotNull(apiKey, AuthException.UNAUTHORIZED);
            userId = developerMapper.selectUserIdByApiKey(apiKey);
            if (userId == null) {
                throw new BusinessException(AuthException.UNAUTHORIZED);
            }
        }
        else {
            // UserId in Session Cookies
            userId = SessionContext.getUserId();
        }
        UserHolder.set(userId);

        if (resourceDef.getRequiredPermission()) {
            // SpaceId in the request header
            String spaceId = request.getHeader(ParamsConstants.SPACE_ID);
            ExceptionUtil.isNotNull(spaceId, SPACE_NOT_EXIST);
            SpaceHolder.set(spaceId);

            // Get all the information of the user in the space
            UserSpaceDto userSpace = userSpaceService.getUserSpace(userId, spaceId);
            MemberHolder.set(userSpace.getMemberId());
            if (userSpace.isMainAdmin()) {
                // The main admin does not verify
                return true;
            }
            if (ArrayUtil.isNotEmpty(resourceDef.getTags())) {
                String tag = "INVITE_MEMBER";
                if (ArrayUtil.contains(resourceDef.getTags(), tag)) {
                    // Determine whether the space is enabled for all members to invite members
                    Boolean invite = iSpaceService.getSpaceGlobalFeature(spaceId).getInvitable();
                    if (Boolean.TRUE.equals(invite)) {
                        return true;
                    }
                }
            }
            if (ArrayUtil.isNotEmpty(resourceDef.getTags()) && !CollUtil.containsAny(userSpace.getResourceCodes(), Arrays.asList(resourceDef.getTags()))) {
                throw new BusinessException(AuthException.FORBIDDEN);
            }
        }

        return true;
    }
}
