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

package com.apitable.workspace.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.workspace.ro.MarkNodeMoveRo;
import com.apitable.workspace.vo.FavoriteNodeInfo;
import com.apitable.workspace.service.INodeFavoriteService;
import com.apitable.core.support.ResponseData;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Api(tags = "Workbench - Node Favorite Api")
@ApiResource(path = "/node/favorite")
public class NodeFavoriteController {

    @Resource
    private INodeFavoriteService iNodeFavoriteService;

    @GetResource(path = "/list")
    @ApiOperation(value = "Get favorite nodes")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<List<FavoriteNodeInfo>> list() {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        return ResponseData.success(iNodeFavoriteService.getFavoriteNodeList(spaceId, memberId));
    }

    @PostResource(path = "/move")
    @ApiOperation(value = "Move favorite node")
    @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW")
    public ResponseData<Void> move(@RequestBody @Valid MarkNodeMoveRo ro) {
        Long memberId = LoginContext.me().getMemberId();
        iNodeFavoriteService.move(memberId, ro.getNodeId(), ro.getPreNodeId());
        return ResponseData.success();
    }

    @Notification(templateId = NotificationTemplateId.NODE_FAVORITE)
    @PostResource(path = "/updateStatus/{nodeId}")
    @ApiOperation(value = "Change favorite status")
    @ApiImplicitParams({
        @ApiImplicitParam(name = ParamsConstants.SPACE_ID, value = "space id", required = true, dataTypeClass = String.class, paramType = "header", example = "spczJrh2i3tLW"),
        @ApiImplicitParam(name = ParamsConstants.PLAYER_SOCKET_ID, value = "user socket id", dataTypeClass = String.class, paramType = "header", example = "QkKp9XJEl"),
        @ApiImplicitParam(name = "nodeId", value = "node id", required = true, dataTypeClass = String.class, paramType = "path", example = "fod8mXUeiXyVo")
    })
    public ResponseData<Void> updateStatus(@PathVariable("nodeId") String nodeId) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        iNodeFavoriteService.updateFavoriteStatus(spaceId, memberId, nodeId);
        return ResponseData.success();
    }

}
