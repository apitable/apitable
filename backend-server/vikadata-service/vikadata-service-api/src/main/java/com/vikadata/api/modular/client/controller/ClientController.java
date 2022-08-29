package com.vikadata.api.modular.client.controller;

import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.text.StrBuilder;
import cn.hutool.core.util.CharsetUtil;
import cn.hutool.core.util.StrUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.component.ClientEntryTemplateConfig;
import com.vikadata.api.config.FilterConfig;
import com.vikadata.api.config.properties.ClientProperties;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.enums.datasheet.IdRulePrefixEnum;
import com.vikadata.api.model.ro.client.ClientBuildRo;
import com.vikadata.api.model.ro.client.ClientPublishRo;
import com.vikadata.api.model.vo.client.EntryVo;
import com.vikadata.api.model.vo.user.UserInfoVo;
import com.vikadata.api.modular.base.service.IConfigService;
import com.vikadata.api.modular.client.model.ClientInfoVO;
import com.vikadata.api.modular.client.service.IClientReleaseVersionService;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.util.ClientUriUtil;
import com.vikadata.api.util.VikaVersion.Env;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.system.config.i18n.I18nTypes;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.define.constants.RedisConstants.DATASHEET_CLIENT_VERSION_KEY;
import static com.vikadata.define.constants.RedisConstants.KONG_GATEWAY_GRAY_SPACE;
import static com.vikadata.define.constants.RedisConstants.REDIS_ENV;

/**
 * <p>
 * 客户端版本控制器
 * </p>
 *
 * @author zoe zheng
 * @date 2020/4/7 5:12 下午
 */
@RestController
@Api(tags = "客户端接口")
@ApiResource(path = "/client")
@Slf4j
public class ClientController {

    @Resource
    private IUserService iUserService;

    @Resource
    private ClientProperties clientProperties;

    @Resource
    private ObjectMapper objectMapper;

    @Resource
    private IClientReleaseVersionService clientReleaseVersionService;

    @Resource
    private ClientEntryTemplateConfig clientEntryTemplateConfig;

    @Resource
    private IConfigService iConfigService;

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private RedisTemplate<String, String> redisTemplate;

    @GetResource(name = "获取应用版本信息", path = "/info", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "获取应用版本信息", notes = "获取应用客户端版本渲染信息")
    @ApiImplicitParam(name = "pipeline", value = "构建流水号", dataTypeClass = String.class, paramType = "query", example = "4818")
    public ClientInfoVO getTemplateInfo(@RequestHeader HttpHeaders headers, HttpServletRequest request,
            @RequestParam(name = "pipeline", required = false) String pipelineId, @RequestParam(name = "spaceId", required = false) String spaceId) {
        // 如果RequestParam不为空，就主动切换传过来的空间站
        this.userSwitchSpace(SessionContext.getUserIdWithoutException(), spaceId);
        ClientInfoVO info = new ClientInfoVO();
        UserInfoVo userInfoVo = this.getUserInfoFromSession();
        if (null != userInfoVo) {
            try {
                info.setUserInfo(objectMapper.writeValueAsString(userInfoVo));
            }
            catch (JsonProcessingException e) {
                log.error("应用客户端的用户信息序列化失败", e);
                info.setUserInfo(StrUtil.NULL);
            }
            // 获取现在空间站的灰度环境，如果不主动提出要获取的空间站ID，就使用UserMe里面的空间ID（上次活跃的）
            String spaceGrayEnv = this.getSpaceGrayEnv(StrUtil.blankToDefault(spaceId, userInfoVo.getSpaceId()));
            info.setSpaceGrayEnv(spaceGrayEnv);
        }
        else {
            info.setUserInfo(StrUtil.NULL);
        }
        info.setLocale(LocaleContextHolder.getLocale().toLanguageTag());
        info.setMetaContent(getMetaContent(headers));
        info.setWizards(StrUtil.toString(iConfigService.getWizardConfig(I18nTypes.ZH_CN.getName())));
        info.setRedirect(this.redirectByAccessRoot(request, userInfoVo));
        return info;
    }

    /**
     * 客户端应用版本入口
     * 应用版本在不同的环境下都有不同的处理，环境变量设置位置：ClientProperties.Datasheet.Env
     * SaaS环境有: test(test)、integration(alpha)、staging(beta)、production(release)
     * @param pipelineId 可选参数，ci流水号，当环境变量是test或integration时，
     *                   可以获取指定的pipelineId的应用版本，版本号一般是feature.${pipelineId}
     * @return 应用版本网页内容，一般是response的contentType=text/html的内容
     */
    @Deprecated
    @GetResource(name = "应用版本入口", path = "/entry", requiredPermission = false, requiredLogin = false, produces = { MediaType.TEXT_HTML_VALUE })
    @ApiOperation(value = "客户端应用版本入口", notes = "客户端应用版本入口")
    @ApiImplicitParam(name = "pipeline", value = "构建流水号", dataTypeClass = String.class, paramType = "query", example = "4818")
    public String entry(@RequestHeader HttpHeaders headers, @RequestParam(name = "pipeline", required = false) String pipelineId,
            HttpServletRequest request, HttpServletResponse response) {
        // 正式环境不允许加载 pipeline 入口
        String envName = StrUtil.blankToDefault(clientProperties.getDatasheet().getEnv(), "other");
        String versionName = clientReleaseVersionService.getVersionOrDefault(Env.of(envName), pipelineId);
        if (StrUtil.isBlank(versionName)) {
            log.error("客户端版本不存在，请检查发布客户端");
            return "Error Rendering....";
        }

        EntryVo entryVo = EntryVo.builder().env(envName).version(versionName).build();
        UserInfoVo userInfoVo = getUserInfoFromSession();
        if (null != userInfoVo) {
            try {
                entryVo.setUserInfoVo(objectMapper.writeValueAsString(userInfoVo));
            }
            catch (JsonProcessingException e) {
                log.error("应用客户端的用户信息序列化失败", e);
                entryVo.setUserInfoVo(StrUtil.NULL);
            }
            // 尝试搜索空间站灰度信息
            this.tryFillSpaceEnvByGray(userInfoVo.getSpaceId(), entryVo);
        }
        else {
            // 前端不接受空值，只接受 "null"
            entryVo.setUserInfoVo(StrUtil.NULL);
        }

        // 在入口页写入用户全局语言,语言变量在cookies里，自动获取
        entryVo.setLocale(LocaleContextHolder.getLocale().toLanguageTag());
        // Feature客户端版本不允许放入内存
        String templateContent = versionName.contains("feature") ?
                clientReleaseVersionService.getHtmlContentByVersion(entryVo.getVersion())
                : clientReleaseVersionService.getHtmlContentCacheIfAbsent(entryVo.getVersion());
        if (StrUtil.isNotBlank(templateContent)) {
            // 加载引导及公告配置
            entryVo.setWizards(StrUtil.toString(iConfigService.getWizardConfig(I18nTypes.ZH_CN.getName())));
            // 加载header中的meta标签内容
            entryVo.setMetaContent(getMetaContent(headers));
            // 如果直接访问 / or /workbench
            this.redirectByAccessRoot(request, response, userInfoVo);
            // 渲染
            return clientEntryTemplateConfig.render(templateContent, BeanUtil.beanToMap(entryVo));
        }
        return "Error Rendering....";
    }

    private UserInfoVo getUserInfoFromSession() {
        if (!HttpContextUtil.hasSession()) {
            return null;
        }
        UserInfoVo userInfoVo;
        try {
            userInfoVo = iUserService.getCurrentUserInfo(SessionContext.getUserId(), null, false);
        }
        catch (Exception e) {
            log.warn("从 Session 获取 UserInfo 失败。", e);
            return null;
        }
        return userInfoVo;
    }

    /**
     * 如果直接访问 / or /workbench，根据用户活跃节点情况看看是否需要重定向
     *
     * 注意这是一个备份，方法新集群稳定后，这个方法可以删除
     *
     * @param userInfo 用户活跃节点信息
     * @param request  HttpServletRequest
     * @param response HttpServletResponse
     * @author Pengap
     * @date 2022/6/13 17:12:02
     */
    @Deprecated
    @SneakyThrows
    private void redirectByAccessRoot(HttpServletRequest request, HttpServletResponse response, UserInfoVo userInfo) {
        // 用户访问的域名
        String scheme = HttpContextUtil.getScheme(request);
        String remoteHost = HttpContextUtil.getRemoteHost(request);
        // 用户访问的路径
        String originalUrl = request.getHeader(FilterConfig.X_ORIGINAL_URI);

        if (null != userInfo && StrUtil.isNotBlank(remoteHost) && StrUtil.equalsAnyIgnoreCase(originalUrl, "/", "/workbench")) {
            String activeNodeId = userInfo.getActiveNodeId();
            String activeViewId = userInfo.getActiveViewId();
            // 判断是否有激活节点
            if (StrUtil.isNotBlank(activeNodeId)) {
                StrBuilder redirectUrl = StrBuilder.create("https".equals(scheme) ? "https" : "http")
                        .append("://")
                        .append(remoteHost)
                        .append("/workbench/").append(activeNodeId);
                // 判断是否有激活视图
                if (StrUtil.isNotBlank(activeViewId)) {
                    redirectUrl.append("/").append(activeViewId);
                }
                // 重定向
                response.sendRedirect(redirectUrl.toString());
            }
        }
    }

    private String redirectByAccessRoot(HttpServletRequest request, UserInfoVo userInfo) {
        // 用户访问的路径
        String originalUrl = request.getHeader(FilterConfig.X_ORIGINAL_URI);

        if (null != userInfo && StrUtil.equalsAnyIgnoreCase(originalUrl, "/", "/workbench", "/workbench/")) {
            String activeNodeId = userInfo.getActiveNodeId();
            String activeViewId = userInfo.getActiveViewId();
            // 判断是否有激活节点
            if (StrUtil.isNotBlank(activeNodeId)) {
                StrBuilder redirectUrl = StrBuilder.create("/workbench/").append(activeNodeId);
                // 判断是否有激活视图
                if (StrUtil.isNotBlank(activeViewId)) {
                    redirectUrl.append("/").append(activeViewId);
                }
                return redirectUrl.toString();
            }
        }
        return null;
    }

    /**
     * 尝试根据空间站ID来填充灰度信息
     *
     * @param spaceId 空间站ID
     * @param entry   版本VO
     * @author Pengap
     * @date 2022/6/13 22:54:05
     */
    private void tryFillSpaceEnvByGray(String spaceId, EntryVo entry) {
        if (StrUtil.isBlank(spaceId)) {
            return;
        }
        // 尝试查询一下空间站是否在灰度环境
        String spaceGrayEnv = this.getSpaceGrayEnv(spaceId);
        if (StrUtil.isBlank(spaceGrayEnv)) {
            return;
        }
        /*
         * 1.注意这里其实是破坏了 redis 序列化的魔法变量模式，抢先在序列化前替换了
         * 2.这里为什么要小写?
         *  2.1 因为 spaceGrayEnv 等于 nginx config upstream 的名称
         *      举个栗子：正常的：upstream = backend；灰度的 backend = backendTeamX
         *      这样标识在nginx才能区分，所有这里spaceGrayEnv需要这样缓存
         *  2.2 TeamX这个值又是等于spring.profiles.active
         *      举个栗子：teamx spring.profiles.active = teamx
         *      所有为了能查询到这个全部转换为小写
         */
        spaceGrayEnv = StrUtil.toString(spaceGrayEnv).toLowerCase();
        Dict dict = Dict.create().set(REDIS_ENV, spaceGrayEnv);
        String cacheClientVersionKey = StrUtil.format(DATASHEET_CLIENT_VERSION_KEY, dict);

        // 如果空间站存在灰度环境，去获取缓存中的最新版本号
        String spaceGrayVersion = redisTemplate.opsForValue().get(cacheClientVersionKey);
        if (StrUtil.isBlank(spaceGrayVersion)) {
            return;
        }

        // 替换之前查询出来的版本，变更为 灰度的版本号
        entry.setVersion(spaceGrayVersion);
        String grayEnv;
        Map<String, String> irregularEnv = clientProperties.getDatasheet().getIrregularEnv();
        if (MapUtil.isNotEmpty(irregularEnv) && StrUtil.isNotBlank(grayEnv = irregularEnv.get(spaceGrayEnv))) {
            entry.setEnv(grayEnv);
        }
    }

    private String getSpaceGrayEnv(String spaceId) {
        if (StrUtil.isBlank(spaceId)) {
            return null;
        }
        return redisTemplate.execute((RedisCallback<String>) connection -> {
            byte[] bytes = connection.hGet(StrUtil.utf8Bytes(KONG_GATEWAY_GRAY_SPACE), StrUtil.utf8Bytes(spaceId));
            return StrUtil.str(bytes, CharsetUtil.CHARSET_UTF_8);
        });
    }

    private String getMetaContent(HttpHeaders headers) {
        // nginx加入header 过滤空格之后的数据
        String originalUrl = headers.getFirst(FilterConfig.X_ORIGINAL_URI);
        String uri = ClientUriUtil.parseOriginUrlPath(originalUrl);
        return clientReleaseVersionService.getMetaContent(uri);
    }

    /**
     * 用户切换空间站
     *
     * @param userId   用户ID
     * @param spaceId  切换空间站的Id
     * @author Pengap
     * @date 2022/7/6 12:04:49
     */
    private void userSwitchSpace(Long userId, String spaceId) {
        try {
            // userId不等于空，spaceId不等于空并且不等于'undefined'，spaceId必须要'spc'开头
            boolean isPass = null != userId && StrUtil.isNotBlank(spaceId) &&
                    !StrUtil.isNullOrUndefined(spaceId) &&
                    StrUtil.startWithIgnoreEquals(spaceId, IdRulePrefixEnum.SPC.getIdRulePrefixEnum());
            if (isPass) {
                iSpaceService.switchSpace(userId, spaceId);
            }
        }
        catch (Exception e) {
            log.error("渲染模版时,用户切换空间站异常", e);
            // 不要因为切换空间站的异常导致模版无法正常的渲染
        }
    }

    /**
     * 构建(创建)客户端应用版本
     *
     * @param clientBuildRo 请求参数
     * @return 响应体
     */
    @Deprecated
    @PostResource(name = "创建客户端应用版本", path = "/build", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "创建客户端应用版本", notes = "创建客户端应用版本")
    public ResponseData<Void> build(@RequestBody @Valid ClientBuildRo clientBuildRo) {
        clientReleaseVersionService.createClientVersion(clientBuildRo);
        return ResponseData.success();
    }

    @Deprecated
    @PostResource(name = "客户端发布应用版本", path = "/publish", requiredPermission = false, requiredLogin = false)
    @ApiOperation(value = "客户端发布应用版本", notes = "客户端发布应用版本")
    public ResponseData<Void> publish(@RequestBody ClientPublishRo publishRo) {
        try {
            String versionName = publishRo.getVersion();
            redisTemplate.opsForValue().set(DATASHEET_CLIENT_VERSION_KEY, versionName, 30, TimeUnit.DAYS);
            // 刷新机器上存储的指定应用版本内容
            clientReleaseVersionService.refreshHtmlContent(versionName);
            return ResponseData.success();
        }
        catch (Exception e) {
            log.error("发布客户端版本失败", e);
            throw new BusinessException("fail to publish client version");
        }
    }

}
