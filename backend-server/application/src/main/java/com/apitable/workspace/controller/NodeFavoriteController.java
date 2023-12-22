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

import com.apitable.core.support.ResponseData;
import com.apitable.shared.component.notification.NotificationTemplateId;
import com.apitable.shared.component.notification.annotation.Notification;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.workspace.ro.MarkNodeMoveRo;
import com.apitable.workspace.service.INodeFavoriteService;
import com.apitable.workspace.vo.FavoriteNodeInfo;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Workbench - Node Favorite Api.
 */
@RestController
@Tag(name = "Workbench - Node Favorite Api")
@ApiResource(path = "/node/favorite")
public class NodeFavoriteController {

    @Resource
    private INodeFavoriteService iNodeFavoriteService;

    /**
     * Get favorite nodes.
     */
    @GetResource(path = "/list")
    @Operation(summary = "Get favorite nodes")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW")
    public ResponseData<List<FavoriteNodeInfo>> list() {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        return ResponseData.success(iNodeFavoriteService.getFavoriteNodeList(spaceId, memberId));
    }

    /**
     * Move favorite node.
     */
    @PostResource(path = "/move")
    @Operation(summary = "Move favorite node")
    @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
        schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW")
    public ResponseData<Void> move(@RequestBody @Valid MarkNodeMoveRo ro) {
        Long memberId = LoginContext.me().getMemberId();
        iNodeFavoriteService.move(memberId, ro.getNodeId(), ro.getPreNodeId());
        return ResponseData.success();
    }

    /**
     * Change favorite status.
     */
    @Notification(templateId = NotificationTemplateId.NODE_FAVORITE)
    @PostResource(path = "/updateStatus/{nodeId}")
    @Operation(summary = "Change favorite status")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, description = "space id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "spczJrh2i3tLW"),
        @Parameter(name = ParamsConstants.PLAYER_SOCKET_ID, description = "user socket id",
            schema = @Schema(type = "string"), in = ParameterIn.HEADER, example = "QkKp9XJEl"),
        @Parameter(name = "nodeId", description = "node id", required = true,
            schema = @Schema(type = "string"), in = ParameterIn.PATH, example = "fod8mXUeiXyVo")
    })
    public ResponseData<Void> updateStatus(@PathVariable("nodeId") String nodeId) {
        String spaceId = LoginContext.me().getSpaceId();
        Long memberId = LoginContext.me().getMemberId();
        iNodeFavoriteService.updateFavoriteStatus(spaceId, memberId, nodeId);
        return ResponseData.success();
    }

}
