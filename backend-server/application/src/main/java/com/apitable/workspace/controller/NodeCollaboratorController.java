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

import static com.apitable.organization.enums.OrganizationException.NOT_EXIST_MEMBER;

import cn.hutool.core.bean.BeanUtil;
import com.apitable.control.infrastructure.ControlTemplate;
import com.apitable.control.infrastructure.role.ControlRole;
import com.apitable.core.support.ResponseData;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.vo.MemberInfoVo;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.GetResource;
import com.apitable.shared.constants.ParamsConstants;
import com.apitable.shared.context.LoginContext;
import com.apitable.shared.holder.SpaceHolder;
import com.apitable.space.service.ISpaceService;
import com.apitable.space.vo.SpaceGlobalFeature;
import com.apitable.user.service.IUserService;
import com.apitable.workspace.vo.NodeCollaboratorVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Workbench - Node Role Api.
 */
@Tag(name = "Workbench - Node Role Api")
@RestController
@ApiResource(path = "/node")
public class NodeCollaboratorController {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IUserService iUserService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private ControlTemplate controlTemplate;

    /**
     * get collaborator info.
     *
     * @param uuid   user uuid
     * @param nodeId node id
     * @return collaborator info
     */
    @GetResource(path = "/collaborator/info")
    @Operation(summary = "Get Collaborator Info",
        description = "Scene: Collaborator Card Information")
    @Parameters({
        @Parameter(name = ParamsConstants.SPACE_ID, in = ParameterIn.HEADER,
            description = "space id", required = true,
            schema = @Schema(type = "string"), example = "spcyQkKp9XJEl"),
        @Parameter(name = "nodeId", in = ParameterIn.QUERY, required = true,
            schema = @Schema(type = "string"), example = "nodRTGSy43DJ9"),
        @Parameter(name = "uuid", in = ParameterIn.QUERY, required = true,
            schema = @Schema(type = "string"), example = "1")
    })
    public ResponseData<NodeCollaboratorVO> getCollaboratorInfo(
        @RequestParam(value = "uuid") String uuid,
        @RequestParam(name = "nodeId") String nodeId
    ) {
        String spaceId = LoginContext.me().getSpaceId();
        // For member information hiding use
        SpaceGlobalFeature feature = iSpaceService.getSpaceGlobalFeature(spaceId);
        SpaceHolder.setGlobalFeature(feature);
        Long userId = iUserService.getUserIdByUuidWithCheck(uuid);
        // Get target member
        Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
        ExceptionUtil.isNotNull(memberId, NOT_EXIST_MEMBER);
        // Get collaborator view
        MemberInfoVo member = iMemberService.getMemberInfoVo(memberId);
        NodeCollaboratorVO collaboratorVO =
            BeanUtil.copyProperties(member, NodeCollaboratorVO.class);
        ControlRole role = controlTemplate.fetchNodeRole(memberId, nodeId);
        if (role != null) {
            collaboratorVO.setRole(role.getRoleTag());
        }
        return ResponseData.success(collaboratorVO);
    }
}
