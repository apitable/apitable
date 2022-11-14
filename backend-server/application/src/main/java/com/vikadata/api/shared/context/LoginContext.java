package com.vikadata.api.shared.context;

import java.util.List;
import java.util.Locale;
import java.util.Set;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;

import com.vikadata.api.shared.cache.bean.LoginUserDto;
import com.vikadata.api.shared.cache.bean.UserSpaceDto;
import com.vikadata.api.shared.cache.service.LoginUserService;
import com.vikadata.api.shared.cache.service.UserSpaceService;
import com.vikadata.api.shared.component.LanguageManager;
import com.vikadata.api.shared.constants.ParamsConstants;
import com.vikadata.api.shared.holder.LoginUserHolder;
import com.vikadata.api.shared.holder.MemberHolder;
import com.vikadata.api.shared.holder.SpaceHolder;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;

import static com.vikadata.api.space.enums.SpacePermissionException.ILLEGAL_ASSIGN_RESOURCE;

/**
 * <p>
 * login context util
 * </p>
 *
 * @author Shawn Deng
 */
public class LoginContext {

    private final LoginUserService loginUserService;

    private final UserSpaceService userSpaceService;

    public LoginContext(LoginUserService loginUserService, UserSpaceService userSpaceService) {
        this.loginUserService = loginUserService;
        this.userSpaceService = userSpaceService;
    }

    public static LoginContext me() {
        return SpringContextHolder.getBean(LoginContext.class);
    }

    /**
     * get current login user
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
            loginUserDto = loginUserService.getLoginUser(userId);
            LoginUserHolder.set(loginUserDto);
        }
        return loginUserDto;
    }

    /**
     * get current request space id
     *
     * @return space id
     */
    public String getSpaceId() {
        String spaceId = SpaceHolder.get();
        if (spaceId == null) {
            spaceId = HttpContextUtil.getRequest().getHeader(ParamsConstants.SPACE_ID);
            if (spaceId == null) {
                throw new BusinessException("workspace does not exist");
            }
        }
        return spaceId;
    }

    public Long getMemberId() {
        Long memberId = MemberHolder.get();
        if (memberId == null) {
            String spaceId = getSpaceId();
            return getUserSpaceDto(spaceId).getMemberId();
        }
        return memberId;
    }

    public Long getMemberId(Long userId, String spaceId) {
        UserSpaceDto userSpaceDto = userSpaceService.getUserSpace(userId, spaceId);
        return userSpaceDto.getMemberId();
    }

    public void checkAcrossSpace(Long userId, String spaceId) {
        userSpaceService.getUserSpace(userId, spaceId);
    }

    /**
     * whether current user has resource
     *
     * @param resourceCodes resource code list
     */
    public void checkSpaceResource(List<String> resourceCodes) {
        String spaceId = LoginContext.me().getSpaceId();
        Long userId = SessionContext.getUserId();
        UserSpaceDto userSpaceDto = userSpaceService.getUserSpace(userId, spaceId);
        if (userSpaceDto.isMainAdmin()) {
            return;
        }
        Set<String> userResources = userSpaceDto.getResourceCodes();
        ExceptionUtil.isTrue(CollUtil.containsAny(userResources, resourceCodes), ILLEGAL_ASSIGN_RESOURCE);
    }

    /**
     * get space stayed by current login user
     *
     * @param spaceId space
     * @return UserSpaceDto
     */
    public UserSpaceDto getUserSpaceDto(String spaceId) {
        Long userId = SessionContext.getUserId();
        return userSpaceService.getUserSpace(userId, spaceId);
    }

    /**
     * get current user locale
     * use {@code LocaleContextHolder.getLocale().toLanguageTag()}
     */
    public String getLocaleStr() {
        String result = null;
        try {
            result = getLoginUser().getLocale();
        }
        catch (Exception ignored) {

        }
        finally {
            // parse request header：accept-language
            if (StrUtil.isBlank(result)) {
                Locale reqLocale = HttpContextUtil.getRequest().getLocale();
                if (Locale.CHINESE.getLanguage().equals(reqLocale.getLanguage())) {
                    result = LanguageManager.me().getDefaultLanguageTag();
                }
                else {
                    result = Locale.US.toLanguageTag();
                }
            }
        }
        return result;
    }

    /**
     * get current user locale object
     * use {@code LocaleContextHolder.getLocale().toLanguageTag()}
     */
    public Locale getLocale() {
        return Locale.forLanguageTag(getLocaleStr());
    }

    /**
     * get current user locale, replace underscore from "-"
     */
    public String getLocaleStrWithUnderLine() {
        return getLocaleStr().replace("-", "_");
    }
}
