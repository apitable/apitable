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
import com.vikadata.api.helper.ApiHelper;
import com.vikadata.api.holder.MemberHolder;
import com.vikadata.api.holder.SpaceHolder;
import com.vikadata.api.holder.UserHolder;
import com.vikadata.api.lang.ResourceDefinition;
import com.vikadata.api.modular.developer.mapper.DeveloperMapper;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.core.util.HttpContextUtil;

import org.springframework.web.servlet.HandlerInterceptor;

import static com.vikadata.api.enums.exception.AuthException.NONE_RESOURCE;
import static com.vikadata.api.enums.exception.SpaceException.SPACE_NOT_EXIST;

/**
 * <p>
 * 资源校验拦截器
 * 1.空间管理资源校验
 * 2.节点资源校验
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/8 21:20
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
        // 解析地址
        String requestPath = resolveServletPath(request);
        log.info("请求资源地址：{}", requestPath);
        ResourceDefinition resourceDef = apiResourceFactory.getResourceByUrl(requestPath);
        if (resourceDef == null) {
            log.info("请求资源地址不存在");
            throw new BusinessException(NONE_RESOURCE);
        }

        //资源不需要登录则忽略
        if (!resourceDef.getRequiredLogin()) {
            return true;
        }

        Long userId;
        if (!HttpContextUtil.hasSession()) {
            // 获取 API KEY
            String apiKey = ApiHelper.getApiKey(request);
            ExceptionUtil.isNotNull(apiKey, AuthException.UNAUTHORIZED);
            userId = developerMapper.selectUserIdByApiKey(apiKey);
            if (userId == null) {
                throw new BusinessException(AuthException.UNAUTHORIZED);
            }
        }
        else {
            //UserId在Session的Cookies里
            userId = SessionContext.getUserId();
        }
        UserHolder.set(userId);

        // 空间管理权限校验
        if (resourceDef.getRequiredPermission()) {
            //SpaceId在请求头
            String spaceId = request.getHeader(ParamsConstants.SPACE_ID);
            ExceptionUtil.isNotNull(spaceId, SPACE_NOT_EXIST);
            SpaceHolder.set(spaceId);

            //获取用户在空间的所有信息
            UserSpaceDto userSpace = userSpaceService.getUserSpace(userId, spaceId);
            MemberHolder.set(userSpace.getMemberId());
            if (userSpace.isMainAdmin()) {
                //主管理员不校验
                return true;
            }
            if (ArrayUtil.isNotEmpty(resourceDef.getTags())) {
                String tag = "INVITE_MEMBER";
                if (ArrayUtil.contains(resourceDef.getTags(), tag)) {
                    //判断空间是否开启了全员可邀请成员
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
