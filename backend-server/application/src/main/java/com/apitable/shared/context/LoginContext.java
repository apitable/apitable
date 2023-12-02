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

package com.apitable.shared.context;

import static com.apitable.space.enums.SpacePermissionException.ILLEGAL_ASSIGN_RESOURCE;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import com.apitable.core.exception.BusinessException;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.core.util.HttpContextUtil;
import com.apitable.core.util.SpringContextHolder;
import com.apitable.shared.cache.bean.LoginUserDto;
import com.apitable.shared.cache.bean.UserSpaceDto;
import com.apitable.shared.cache.service.LoginUserCacheService;
import com.apitable.shared.cache.service.UserSpaceCacheService;
import com.apitable.shared.component.LanguageManager;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.holder.LoginUserHolder;
import com.apitable.shared.holder.MemberHolder;
import com.apitable.shared.holder.SpaceHolder;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.apache.commons.lang3.StringUtils;

/**
 * <p>
 * login context util.
 * </p>
 *
 * @author Shawn Deng
 */
public class LoginContext {

    private final LoginUserCacheService loginUserCacheService;

    private final UserSpaceCacheService userSpaceCacheService;

    public LoginContext(LoginUserCacheService loginUserCacheService,
                        UserSpaceCacheService userSpaceCacheService) {
        this.loginUserCacheService = loginUserCacheService;
        this.userSpaceCacheService = userSpaceCacheService;
    }

    public static LoginContext me() {
        return SpringContextHolder.getBean(LoginContext.class);
    }

    /**
     * get current login user.
     * <p>
     * get login user from threadLocal if has
     * </p>
     *
     * @return LoginUser
     */
    public LoginUserDto getLoginUser() {
        LoginUserDto loginUserDto = LoginUserHolder.get();
        if (loginUserDto == null) {
            Long userId = SessionContext.getUserId();
            loginUserDto = loginUserCacheService.getLoginUser(userId);
            LoginUserHolder.set(loginUserDto);
        }
        return loginUserDto;
    }

    /**
     * get current request space id.
     *
     * @return space id
     */
    public String getSpaceId() {
        String spaceId = SpaceHolder.get();
        if (spaceId == null) {
            spaceId = HttpContextUtil.getRequest().getParameter(ParamsConstants.SPACE_ID_PARAMETER);
            spaceId = StringUtils.isEmpty(spaceId)
                ? HttpContextUtil.getRequest().getHeader(ParamsConstants.SPACE_ID) :
                spaceId;
            if (spaceId == null) {
                throw new BusinessException("workspace does not exist");
            }
        }
        return spaceId;
    }

    /**
     * get user current member id in space.
     *
     * @return member id
     */
    public Long getMemberId() {
        Long memberId = MemberHolder.get();
        if (memberId == null) {
            String spaceId = getSpaceId();
            return getUserSpaceDto(spaceId).getMemberId();
        }
        return memberId;
    }

    public Long getMemberId(Long userId, String spaceId) {
        UserSpaceDto userSpaceDto = userSpaceCacheService.getUserSpace(userId, spaceId);
        return userSpaceDto.getMemberId();
    }

    public void checkAcrossSpace(Long userId, String spaceId) {
        userSpaceCacheService.getUserSpace(userId, spaceId);
    }

    /**
     * whether current user has resource.
     *
     * @param resourceCodes resource code list
     */
    public void checkSpaceResource(List<String> resourceCodes) {
        String spaceId = LoginContext.me().getSpaceId();
        Long userId = SessionContext.getUserId();
        UserSpaceDto userSpaceDto = userSpaceCacheService.getUserSpace(userId, spaceId);
        if (userSpaceDto.isMainAdmin()) {
            return;
        }
        Set<String> userResources = userSpaceDto.getResourceCodes();
        ExceptionUtil.isTrue(CollUtil.containsAny(userResources, resourceCodes),
            ILLEGAL_ASSIGN_RESOURCE);
    }

    /**
     * get space stayed by current login user.
     *
     * @param spaceId space
     * @return UserSpaceDto
     */
    public UserSpaceDto getUserSpaceDto(String spaceId) {
        Long userId = SessionContext.getUserId();
        return userSpaceCacheService.getUserSpace(userId, spaceId);
    }

    /**
     * get current user locale.
     * use {@code LocaleContextHolder.getLocale().toLanguageTag()}
     */
    public String getLocaleStr() {
        String result = null;
        try {
            result = getLoginUser().getLocale();
        } catch (Exception ignored) {
            // nothing
        } finally {
            // parse request header：accept-language
            if (StrUtil.isBlank(result)) {
                Locale reqLocale = HttpContextUtil.getRequest().getLocale();
                if (Locale.CHINESE.getLanguage().equals(reqLocale.getLanguage())) {
                    result = LanguageManager.me().getDefaultLanguageTag();
                } else {
                    result = Locale.US.toLanguageTag();
                }
            }
        }
        return result;
    }

    /**
     * get current user locale object.
     * use {@code LocaleContextHolder.getLocale().toLanguageTag()}
     */
    public Locale getLocale() {
        return Locale.forLanguageTag(getLocaleStr());
    }

    /**
     * get current user locale, replace underscore from "-".
     */
    public String getLocaleStrWithUnderLine() {
        return getLocaleStr().replace("-", "_");
    }
}
