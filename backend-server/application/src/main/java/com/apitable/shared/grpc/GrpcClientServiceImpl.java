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

import com.apitable.core.exception.BusinessException;
import com.apitable.integration.grpc.BasicResult;
import com.apitable.integration.grpc.DocumentAssetStatisticResult;
import com.apitable.integration.grpc.DocumentAssetStatisticRo;
import com.apitable.integration.grpc.NodeCopyRo;
import com.apitable.integration.grpc.NodeDeleteRo;
import com.apitable.integration.grpc.RoomServingServiceGrpc.RoomServingServiceBlockingStub;
import com.apitable.workspace.enums.NodeException;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

/**
 * nest grpc client.
 */
@Service
@Slf4j
public class GrpcClientServiceImpl implements IGrpcClientService {
    private static final Integer ERROR_CODE = 500;

    @GrpcClient("nest-grpc-server")
    private RoomServingServiceBlockingStub simpleStub;

    @Override
    public BasicResult nodeCopyChangeset(NodeCopyRo ro) {
        try {
            return simpleStub.copyNodeEffectOt(ro);
        } catch (StatusRuntimeException e) {
            log.error("Copy node error", e);
            return BasicResult.newBuilder().setCode(ERROR_CODE).setSuccess(false)
                .setMessage(e.getMessage()).build();
        }
    }

    @Override
    public BasicResult nodeDeleteChangeset(NodeDeleteRo ro) {
        try {
            return simpleStub.deleteNodeEffectOt(ro);
        } catch (StatusRuntimeException e) {
            log.warn("Delete node error: {}:{}", ro.getDeleteNodeIdList(), ro.getLinkNodeIdList(),
                e);
            // network reasons prompt the user to retry
            if (e.getStatus().equals(Status.UNAVAILABLE)) {
                throw new BusinessException(NodeException.DELETE_NODE_LINK__FIELD_ERROR);
            }
            return BasicResult.newBuilder().setCode(ERROR_CODE).setSuccess(false)
                .setMessage(e.getMessage()).build();
        }
    }

    @Override
    public DocumentAssetStatisticResult documentAssetStatistic(DocumentAssetStatisticRo ro) {
        return simpleStub.documentAssetStatistic(ro);
    }
}
