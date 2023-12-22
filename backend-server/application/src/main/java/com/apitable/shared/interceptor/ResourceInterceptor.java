/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.interceptor;

import static com.apitable.auth.enums.AuthException.NONE_RESOURCE;
import static com.apitable.space.enums.SpaceException.SPACE_NOT_EXIST;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.ArrayUtil;
import com.apitable.auth.enums.AuthException;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.shared.cache.bean.UserSpaceDto;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.component.ResourceDefinition;
import com.apitable.shared.component.scanner.ApiResourceFactory;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.SessionContext;
import com.apitable.shared.holder.MemberHolder;
import com.apitable.shared.holder.SpaceHolder;
import com.apitable.shared.holder.UserHolder;
import com.apitable.shared.util.ApiHelper;
import com.apitable.space.service.ISpaceService;
import com.apitable.user.mapper.DeveloperMapper;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

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
    private UserSpaceCacheService userSpaceCacheService;

    @Resource
    private ApiResourceFactory apiResourceFactory;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private DeveloperMapper developerMapper;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) {
        String requestPath = resolveServletPath(request);
        ResourceDefinition resourceDef =
            apiResourceFactory.getResourceByUrl(requestPath, request.getMethod());
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
            if (StringUtils.isEmpty(apiKey)) {
                userId = SessionContext.getUserIdFromRequest();
            } else {
                userId = developerMapper.selectUserIdByApiKey(apiKey);
            }
            if (userId == null) {
                throw new BusinessException(AuthException.UNAUTHORIZED);
            }
        } else {
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
            UserSpaceDto userSpace = userSpaceCacheService.getUserSpace(userId, spaceId);
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
            if (ArrayUtil.isNotEmpty(resourceDef.getTags())
                && !CollUtil.containsAny(userSpace.getResourceCodes(),
                Arrays.asList(resourceDef.getTags()))) {
                throw new BusinessException(AuthException.FORBIDDEN);
            }
        }

        return true;
    }
}
