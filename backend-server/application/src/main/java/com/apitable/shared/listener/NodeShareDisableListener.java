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

package com.apitable.shared.listener;

import cn.hutool.core.collection.CollUtil;
import com.apitable.base.service.RestTemplateService;
import com.apitable.shared.listener.event.NodeShareDisableEvent;
import com.apitable.shared.util.MultiValueMapUtils;
import com.apitable.workspace.dto.NodeShareDTO;
import com.apitable.workspace.enums.NodeType;
import com.apitable.workspace.mapper.NodeMapper;
import com.apitable.workspace.mapper.NodeShareSettingMapper;
import com.apitable.workspace.ro.NodeShareDisableNotifyRo;
import com.apitable.workspace.service.INodeService;
import com.apitable.workspace.vo.BaseNodeInfo;
import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * <p>
 * node share close event listener.
 * </p>
 *
 * @author Chambers
 */
@Slf4j
@Component
public class NodeShareDisableListener implements ApplicationListener<NodeShareDisableEvent> {

    @Resource
    private INodeService iNodeService;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private NodeShareSettingMapper nodeShareSettingMapper;

    @Resource
    private RestTemplateService restTemplateService;

    @Override
    @Async
    public void onApplicationEvent(NodeShareDisableEvent event) {
        List<String> nodeIds = event.getNodeIds();
        List<NodeShareDTO> shareDTOList = nodeShareSettingMapper.selectDtoByNodeIds(nodeIds);
        if (CollUtil.isEmpty(shareDTOList)) {
            return;
        }
        Map<String, List<String>> nodeIdToShareIdsMap = new HashMap<>(8);
        for (NodeShareDTO shareDTO : shareDTOList) {
            NodeType nodeType = iNodeService.getTypeByNodeId(shareDTO.getNodeId());
            if (nodeType != NodeType.FOLDER) {
                MultiValueMapUtils.accumulatedValueIfAbsent(nodeIdToShareIdsMap,
                    shareDTO.getNodeId(), shareDTO.getShareId());
                continue;
            }
            List<String> subNodeIds =
                iNodeService.getNodeIdsInNodeTree(shareDTO.getNodeId(), -1);
            for (String subNodeId : subNodeIds) {
                MultiValueMapUtils.accumulatedValueIfAbsent(nodeIdToShareIdsMap, subNodeId,
                    shareDTO.getShareId());
            }
        }
        if (nodeIdToShareIdsMap.isEmpty()) {
            return;
        }
        List<NodeShareDisableNotifyRo> message = new ArrayList<>(nodeIdToShareIdsMap.size());
        List<BaseNodeInfo> nodeInfos =
            nodeMapper.selectBaseNodeInfoByNodeIds(nodeIdToShareIdsMap.keySet());
        for (BaseNodeInfo node : nodeInfos) {
            // Folders have no collaborative rooms and do not need broadcasting
            if (node.getType().equals(NodeType.FOLDER.getNodeType())) {
                continue;
            }
            message.add(new NodeShareDisableNotifyRo(node.getNodeId(),
                nodeIdToShareIdsMap.get(node.getNodeId())));
        }
        restTemplateService.disableNodeShareNotify(message);
    }
}
