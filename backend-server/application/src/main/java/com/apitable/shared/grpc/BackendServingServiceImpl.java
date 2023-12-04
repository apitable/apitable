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

package com.apitable.shared.grpc;

import static com.apitable.core.constants.ResponseExceptionConstants.DEFAULT_SUCCESS_CODE;
import static com.apitable.core.constants.ResponseExceptionConstants.DEFAULT_SUCCESS_MESSAGE;

import cn.hutool.core.util.NumberUtil;
import com.apitable.core.util.ExceptionUtil;
import com.apitable.integration.grpc.ApiServingServiceGrpc;
import com.apitable.integration.grpc.BasicResult;
import com.apitable.integration.grpc.DocumentOperateRo;
import com.apitable.integration.grpc.NodeBrowsingRo;
import com.apitable.interfaces.document.facade.DocumentServiceFacade;
import com.apitable.organization.service.IMemberService;
import com.apitable.shared.component.adapter.MultiDatasourceAdapterTemplate;
import com.apitable.user.service.IUserService;
import com.apitable.workspace.enums.IdRulePrefixEnum;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.enums.PermissionException;
import com.apitable.workspace.service.INodeService;
import io.grpc.stub.StreamObserver;
import jakarta.annotation.Resource;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

/**
 * backend grp serving service.
 */
@GrpcService
@Slf4j
public class BackendServingServiceImpl extends ApiServingServiceGrpc.ApiServingServiceImplBase {

    @Resource
    private MultiDatasourceAdapterTemplate multiDatasourceAdapterTemplate;

    @Resource
    private INodeService iNodeService;

    @Resource
    private IUserService iUserService;

    @Resource
    private IMemberService iMemberService;

    @Resource
    private DocumentServiceFacade documentServiceFacade;

    @SneakyThrows
    @Override
    public void recordNodeBrowsing(NodeBrowsingRo req,
                                   StreamObserver<BasicResult> responseObserver) {
        String spaceId = iNodeService.getSpaceIdByNodeId(req.getNodeId());
        // only for folder
        if (req.getNodeId().startsWith(IdRulePrefixEnum.FOD.getIdRulePrefixEnum())) {
            Long userId = iUserService.getUserIdByUuidWithCheck(req.getUuid());
            Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
            ExceptionUtil.isNotNull(memberId, PermissionException.MEMBER_NOT_IN_SPACE);
            multiDatasourceAdapterTemplate.saveOrUpdateNodeVisitRecord(spaceId, memberId,
                req.getNodeId(), NodeType.FOLDER);
        }
        BasicResult result = BasicResult.newBuilder()
            .setCode(DEFAULT_SUCCESS_CODE)
            .setMessage(DEFAULT_SUCCESS_MESSAGE)
            .setSuccess(true).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }

    @SneakyThrows
    @Override
    public void documentOperate(DocumentOperateRo req,
                                StreamObserver<BasicResult> responseObserver) {
        documentServiceFacade.cellValueOperate(NumberUtil.parseLong(req.getUserId()),
            req.getRecoverDocumentNamesList(), req.getRemoveDocumentNamesList());
        BasicResult result = BasicResult.newBuilder()
            .setCode(DEFAULT_SUCCESS_CODE)
            .setMessage(DEFAULT_SUCCESS_MESSAGE)
            .setSuccess(true).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }
}