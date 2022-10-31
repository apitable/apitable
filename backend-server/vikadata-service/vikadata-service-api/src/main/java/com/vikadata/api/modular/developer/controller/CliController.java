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
 *  vika-cli command line tool, directly call API commands
 * </p>
 */
@RestController
@Api(tags = "Cli Authorization API")
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
    @ApiOperation(value = "Login authorization, using the developer's Api Key.")
    public ResponseData<DevelopUserVo> authLogin(@RequestParam("api_key") String apiKey) {
        Long userId = developerMapper.selectUserIdByApiKey(apiKey);
        ExceptionUtil.isNotNull(userId, INVALID_DEVELOPER_TOKEN);
        UserEntity userEntity = userMapper.selectById(userId);
        DevelopUserVo vo = new DevelopUserVo();
        vo.setUserName(userEntity.getNickName());
        return ResponseData.success(vo);
    }

    @GetResource(path = "/new/token")
    @ApiOperation(value = "Create Developer Token", notes = "The developer token is passed for login. The network verifies whether the token is valid. The user name is returned and cached locally. \n Generally speaking, this API is not used by vika-cli, but for Web side web page operations.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "user_session_token", value = "Normal login Session Token of the user.", required = true, dataTypeClass = String.class, paramType = "query", example = "AAABBB"),
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
    @ApiOperation(value = "space list", notes = "List the space owned by the user.", produces = MediaType.APPLICATION_JSON_VALUE)
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
    @ApiOperation(value = "Listing cloud applications", notes = "Lists all cloud applications in the specified space.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "developer token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spcyQkKp9XJEl"),
    })
    public ResponseData<String> showApplets(String spaceId) {
        // String userId = developerService.getUserFromRequest();
        // var spaces = developerService.getApplets(userId);

        return null;
    }

    @GetResource(path = "/show/webhooks")
    @ApiOperation(value = "Listing cloud hooks", notes = "Lists all cloud hooks in the specified applet.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "developer token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<String> showWebhooks(String appletId) {

        // String userId = developerService.getUserFromRequest();
        // var spaces = developerService.getWebhooks(appletId);

        return null;
    }

    @GetResource(path = "/new/applet")
    @ApiOperation(value = "New Cloud application", notes = "Create a new cloud application in the specified space.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "developer token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<String> newApplet(String spaceId) {
        return null;
    }

    @GetResource(path = "/new/webhook")
    @ApiOperation(value = "Creating a Cloud Hook", notes = "Creates a cloud hook in the specified applet.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "developer token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<String> newWebhook() {
        return null;
    }

    @GetResource(path = "/upload/plugin")
    @ApiOperation(value = "Upload plug-ins", notes = "Specifies the applet upload plug-in.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "developer token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<String> uploadPlugin() {
        return null;
    }

    @GetResource(path = "/publish/applet")
    @ApiOperation(value = "Publish cloud applications", notes = "Specifies that the applet is published to the marketplace.", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "developer token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<String> publishApplet() {
        return null;
    }

    @GetResource(path = "/graphql")
    @ApiOperation(value = "GraphQL Query", notes = "Query using Graph QL", produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiImplicitParams({
        @ApiImplicitParam(name = "Developer-Token", value = "developer token", required = true, dataTypeClass = String.class, paramType = "header", example = "AABBCC"),
    })
    public ResponseData<String> graphql() {
        return null;
    }
}
