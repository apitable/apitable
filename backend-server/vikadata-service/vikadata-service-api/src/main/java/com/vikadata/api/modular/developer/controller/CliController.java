package com.vikadata.api.modular.developer.controller;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.api.constants.ParamsConstants;
import com.vikadata.api.context.SessionContext;
import com.vikadata.api.modular.developer.mapper.DeveloperMapper;
import com.vikadata.api.modular.developer.model.DevelopUserVo;
import com.vikadata.api.modular.developer.model.DeveloperVo;
import com.vikadata.api.modular.developer.model.SpaceShowcaseVo;
import com.vikadata.api.modular.space.mapper.SpaceMapper;
import com.vikadata.api.modular.user.mapper.UserMapper;
import com.vikadata.core.support.ResponseData;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.SpaceEntity;
import com.vikadata.entity.UserEntity;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.enums.exception.DeveloperException.INVALID_DEVELOPER_TOKEN;

/**
 * <p>
 * 用于vika-cli命令行工具，直接调用的API命令
 * </p>
 *
 * @author Kelly Chen
 * @date 2020/4/7 14:55
 */
@RestController
@Api(tags = "Cli 授权接口")
@ApiResource(path = "/developer")
@Slf4j
public class CliController {

    @Resource
    private DeveloperMapper developerMapper;

    @Resource
    private UserMapper userMapper;

    @Resource
    private SpaceMapper spaceMapper;

    @PostResource(path = "/auth/login", requiredLogin = false)
    @ApiOperation(value = "登录授权，使用开发者的ApiKey")
    public ResponseData<DevelopUserVo> authLogin(@RequestParam("api_key") String apiKey) {
        Long userId = developerMapper.selectUserIdByApiKey(apiKey);
        ExceptionUtil.isNotNull(userId, INVALID_DEVELOPER_TOKEN);
        UserEntity userEntity = userMapper.selectById(userId);
        DevelopUserVo vo = new DevelopUserVo();
        vo.setUserName(userEntity.getNickName());
        return ResponseData.success(vo);
    }

    @GetResource(path = "/new/token")
    @ApiOperation(value = "创建个Developer Token", notes = "传入developer_token进行登录，联网验证token是否有效，返回用户名，并在本地做缓存。\n一般来说，这个API不是vika-cli用的，而是给Web端网页操作的。", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "user_session_token", value = "用户的正常登录Session Token", required = true, dataTypeClass = String.class, paramType = "query", example = "AAABBB"),
    })
    public ResponseData<DeveloperVo> newToken() {

        // String sessionToken = getSessionToken();
        // checkSessionToken
        // String developerToken = developerService.newToken();
        // NewTokenRo ro = new NewTokenRo(developerToken)
        // return ResponseData.success(ro);

        return null;
    }

    @GetResource(path = "/show/spaces", requiredPermission = false)
    @ApiOperation(value = "列出空间站", notes = "列出用户所拥有的空间。", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseData<List<SpaceShowcaseVo>> showSpaces() {
        Long userId = SessionContext.getUserId();
        List<SpaceShowcaseVo> spaceList = new ArrayList<>();
        List<SpaceEntity> spaces = spaceMapper.selectByUserId(userId);
        if (CollUtil.isNotEmpty(spaces)) {
            for (SpaceEntity space : spaces) {
                SpaceShowcaseVo vo = new SpaceShowcaseVo();
                vo.setSpaceId(space.getSpaceId());
                vo.setSpaceName(space.getName());
                vo.setCreatedAt(space.getCreatedAt());
                spaceList.add(vo);
            }
        }
        return ResponseData.success(spaceList);
    }

    @GetResource(path = "/show/applets")
    @ApiOperation(value = "列出云程序", notes = "列出指定Space里的所有云程序", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "开发者Token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "空间ID", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
    })
    public ResponseData<String> showApplets(String spaceId) {
        // String userId = developerService.getUserFromRequest();
        // var spaces = developerService.getApplets(userId);

        return null;
    }

    @GetResource(path = "/show/webhooks")
    @ApiOperation(value = "列出云钩子", notes = "列出指定applet里的所有云钩子", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "开发者Token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<String> showWebhooks(String appletId) {

        // String userId = developerService.getUserFromRequest();
        // var spaces = developerService.getWebhooks(appletId);

        return null;
    }

    @GetResource(path = "/new/applet")
    @ApiOperation(value = "新建云程序", notes = "在指定的space新建云程序", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "开发者Token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<String> newApplet(String spaceId) {
        return null;
    }

    @GetResource(path = "/new/webhook")
    @ApiOperation(value = "新建云钩子", notes = "在指定的applet创建云钩子", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "开发者Token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<String> newWebhook() {
        return null;
    }

    @GetResource(path = "/upload/plugin")
    @ApiOperation(value = "上传插件", notes = "指定applet上传插件", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "开发者Token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<String> uploadPlugin() {
        return null;
    }

    @GetResource(path = "/publish/applet")
    @ApiOperation(value = "发布云程序", notes = "指定applet发布到市场", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "开发者Token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<String> publishApplet() {
        return null;
    }

    @GetResource(path = "/graphql")
    @ApiOperation(value = "GraphQL查询", notes = "使用GraphQL进行查询", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "开发者Token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<String> graphql() {
        return null;
    }
}
