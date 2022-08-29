package com.vikadata.api.context;

import java.util.List;
import java.util.Locale;
import java.util.Set;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;

import com.vikadata.api.cache.bean.LoginUserDto;
import com.vikadata.api.cache.bean.UserSpaceDto;
import com.vikadata.api.cache.service.LoginUserService;
import com.vikadata.api.cache.service.UserSpaceService;
import com.vikadata.api.component.LanguageManager;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.holder.LoginUserHolder;
import com.vikadata.api.holder.MemberHolder;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;

import static com.vikadata.api.enums.exception.SpacePermissionException.ILLEGAL_ASSIGN_RESOURCE;

/**
 * <p>
 * 登录用户信息上下文工具
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/29 16:12
 */
public class LoginContext {

    private final LoginUserService loginUserService;

    private final UserSpaceService userSpaceService;

    public LoginContext(LoginUserService loginUserService, UserSpaceService userSpaceService) {
        this.loginUserService = loginUserService;
        this.userSpaceService = userSpaceService;
    }

    /**
     * 获取自身INSTANCE
     */
    public static LoginContext me() {
        return SpringContextHolder.getBean(LoginContext.class);
    }

    /**
     * 获取当前用户
     * <p>
     * 先从ThreadLocal中拿login user，如果有值就直接返回
     * </p>
     *
     * @return LoginUser
     * @author Shawn Deng
     * @date 2019/10/29 16:13
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
     * 获取当前请求的空间ID
     *
     * @return 空间ID
     * @author Shawn Deng
     * @date 2020/2/10 00:20
     */
    public String getSpaceId() {
        String spaceId = SpaceHolder.get();
        if (spaceId == null) {
            spaceId = HttpContextUtil.getRequest().getHeader(ParamsConstants.SPACE_ID);
            if (spaceId == null) {
                throw new BusinessException("工作空间不存在");
            }
        }
        return spaceId;
    }

    /**
     * 获取当前用户在空间内的成员ID
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
        UserSpaceDto userSpaceDto = userSpaceService.getUserSpace(userId, spaceId);
        return userSpaceDto.getMemberId();
    }

    public void checkAcrossSpace(String spaceId) {
        Long userId = SessionContext.getUserId();
        this.checkAcrossSpace(userId, spaceId);
    }

    public void checkAcrossSpace(Long userId, String spaceId) {
        userSpaceService.getUserSpace(userId, spaceId);
    }

    /**
     * 检查是否拥有资源
     *
     * @param resourceCodes 资源列表
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
     * 查询用户对应空间信息
     *
     * @param spaceId 空间ID
     * @return UserSpaceDto
     */
    public UserSpaceDto getUserSpaceDto(String spaceId) {
        Long userId = SessionContext.getUserId();
        return userSpaceService.getUserSpace(userId, spaceId);
    }

    /**
     * 获取当前用户语言
     * 业务代码中使用-LocaleContextHolder.getLocale().toLanguageTag()
     */
    public String getLocaleStr() {
        String result = null;
        try {
            result = getLoginUser().getLocale();
        }
        catch (Exception ignored) {

        }
        finally {
            // 如果登陆用户设置语言为空，解析Http请求头：accept-language
            if (StrUtil.isBlank(result)) {
                Locale reqLocale = HttpContextUtil.getRequest().getLocale();
                if (Locale.CHINESE.getLanguage().equals(reqLocale.getLanguage())) {
                    // 中文环境一律都返回：简体中文；还未兼容繁体
                    result = LanguageManager.me().getDefaultLanguageTag();
                }
                else {
                    // 非中文环境一律都返回：美式英语
                    result = Locale.US.toLanguageTag();
                }
            }
        }
        return result;
    }

    /**
     * 获取当前用户语言Locale对象
     * 业务代码中使用-LocaleContextHolder.getLocale().toLanguageTag()
     */
    public Locale getLocale() {
        return Locale.forLanguageTag(getLocaleStr());
    }

    /**
     * 获取当前用户语言，以下划线代替短横杠，如"zh_CN"
     */
    public String getLocaleStrWithUnderLine() {
        return getLocaleStr().replace("-", "_");
    }
}
