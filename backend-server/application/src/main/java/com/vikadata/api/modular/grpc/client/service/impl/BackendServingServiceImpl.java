package com.vikadata.api.modular.grpc;

import javax.annotation.Resource;

import io.grpc.stub.StreamObserver;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

import com.vikadata.api.enums.datasheet.IdRulePrefixEnum;
import com.vikadata.api.enums.node.NodeType;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.api.modular.user.service.IUserService;
import com.vikadata.api.modular.workspace.service.INodeRecentlyBrowsedService;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.integration.grpc.ApiServingServiceGrpc;
import com.vikadata.integration.grpc.BasicResult;
import com.vikadata.integration.grpc.NodeBrowsingRo;

import static com.vikadata.api.enums.exception.PermissionException.MEMBER_NOT_IN_SPACE;
import static com.vikadata.api.enums.exception.UserException.USER_NOT_EXIST;
import static com.vikadata.core.constants.ResponseExceptionConstants.DEFAULT_SUCCESS_CODE;
import static com.vikadata.core.constants.ResponseExceptionConstants.DEFAULT_SUCCESS_MESSAGE;

/**
 * backend grp serving service
 */
@GrpcService
@Slf4j
public class BackendServingServiceImpl extends ApiServingServiceGrpc.ApiServingServiceImplBase {
    @Resource
    private INodeRecentlyBrowsedService iNodeRecentlyBrowsedService;

    @Resource
    private INodeService iNodeService;

    @Resource
    private IUserService iUserService;

    @Resource
    private IMemberService iMemberService;

    @SneakyThrows
    @Override
    public void recordNodeBrowsing(NodeBrowsingRo req, StreamObserver<BasicResult> responseObserver) {
        String spaceId = iNodeService.getSpaceIdByNodeId(req.getNodeId());
        // only for folder
        if (req.getNodeId().startsWith(IdRulePrefixEnum.FOD.getIdRulePrefixEnum())) {
            Long userId = iUserService.getUserIdByUuid(req.getUuid());
            ExceptionUtil.isNotNull(userId, USER_NOT_EXIST);
            Long memberId = iMemberService.getMemberIdByUserIdAndSpaceId(userId, spaceId);
            ExceptionUtil.isNotNull(memberId, MEMBER_NOT_IN_SPACE);
            iNodeRecentlyBrowsedService.saveOrUpdate(memberId, spaceId, req.getNodeId(), NodeType.FOLDER);
        }
        BasicResult result = BasicResult.newBuilder()
                .setCode(DEFAULT_SUCCESS_CODE)
                .setMessage(DEFAULT_SUCCESS_MESSAGE).
                setSuccess(true).build();
        responseObserver.onNext(result);
        responseObserver.onCompleted();
    }
}