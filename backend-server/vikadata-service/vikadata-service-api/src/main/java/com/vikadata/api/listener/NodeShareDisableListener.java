package com.vikadata.api.listener;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.event.NodeShareDisableEvent;
import com.vikadata.api.model.dto.node.NodeShareDTO;
import com.vikadata.api.model.ro.node.NodeShareDisableNotifyRo;
import com.vikadata.api.model.vo.node.BaseNodeInfo;
import com.vikadata.api.modular.base.service.RestTemplateService;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.modular.workspace.mapper.NodeShareSettingMapper;
import com.vikadata.api.modular.workspace.service.INodeService;
import com.vikadata.api.util.MultiValueMapUtils;
import com.vikadata.define.enums.NodeType;

import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import static com.vikadata.api.config.AsyncTaskExecutorConfig.DEFAULT_EXECUTOR_BEAN_NAME;

/**
 * <p>
 * node share close event listener
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
    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
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
                MultiValueMapUtils.accumulatedValueIfAbsent(nodeIdToShareIdsMap, shareDTO.getNodeId(), shareDTO.getShareId());
                continue;
            }
            List<String> subNodeIds = nodeMapper.selectAllSubNodeIds(shareDTO.getNodeId());
            for (String subNodeId : subNodeIds) {
                MultiValueMapUtils.accumulatedValueIfAbsent(nodeIdToShareIdsMap, subNodeId, shareDTO.getShareId());
            }
        }
        if (nodeIdToShareIdsMap.isEmpty()) {
            return;
        }
        List<NodeShareDisableNotifyRo> message = new ArrayList<>(nodeIdToShareIdsMap.size());
        List<BaseNodeInfo> nodeInfos = nodeMapper.selectBaseNodeInfoByNodeIds(nodeIdToShareIdsMap.keySet());
        for (BaseNodeInfo node : nodeInfos) {
            // Folders have no collaborative rooms and do not need broadcasting
            if (node.getType().equals(NodeType.FOLDER.getNodeType())) {
                continue;
            }
            message.add(new NodeShareDisableNotifyRo(node.getNodeId(), nodeIdToShareIdsMap.get(node.getNodeId())));
        }
        restTemplateService.disableNodeShareNotify(message);
    }
}
