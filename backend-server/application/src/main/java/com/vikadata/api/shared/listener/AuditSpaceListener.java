package com.vikadata.api.shared.listener;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;

import com.vikadata.api.shared.component.adapter.MultiDatasourceAdapterTemplate;
import com.vikadata.api.organization.model.UnitInfoDTO;
import com.vikadata.api.organization.service.IUnitService;
import com.vikadata.api.shared.constants.AuditConstants;
import com.vikadata.api.shared.listener.event.AuditSpaceEvent;
import com.vikadata.api.shared.listener.event.AuditSpaceEvent.AuditSpaceArg;
import com.vikadata.api.space.enums.AuditSpaceAction;
import com.vikadata.api.space.enums.AuditSpaceCategory;
import com.vikadata.api.template.mapper.TemplateMapper;
import com.vikadata.api.workspace.mapper.NodeMapper;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.NodeEntity;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import static com.vikadata.api.shared.config.AsyncTaskExecutorConfig.DEFAULT_EXECUTOR_BEAN_NAME;
import static com.vikadata.api.shared.constants.AuditConstants.NODE_DELETED_PATH;
import static com.vikadata.api.shared.constants.AuditConstants.NODE_ID;
import static com.vikadata.api.shared.constants.AuditConstants.NODE_NAME;
import static com.vikadata.api.shared.constants.AuditConstants.NODE_TYPE;
import static com.vikadata.api.shared.constants.AuditConstants.OLD_PARENT_ID;
import static com.vikadata.api.shared.constants.AuditConstants.OLD_PARENT_NAME;
import static com.vikadata.api.shared.constants.AuditConstants.OLD_PRE_NODE_ID;
import static com.vikadata.api.shared.constants.AuditConstants.OLD_PRE_NODE_NAME;
import static com.vikadata.api.shared.constants.AuditConstants.PARENT_ID;
import static com.vikadata.api.shared.constants.AuditConstants.PARENT_NAME;
import static com.vikadata.api.shared.constants.AuditConstants.PRE_NODE_ID;
import static com.vikadata.api.shared.constants.AuditConstants.PRE_NODE_NAME;
import static com.vikadata.api.shared.constants.AuditConstants.SOURCE_NODE_ID;
import static com.vikadata.api.shared.constants.AuditConstants.SOURCE_NODE_NAME;
import static com.vikadata.api.shared.constants.AuditConstants.TEMPLATE_ID;
import static com.vikadata.api.shared.constants.AuditConstants.TEMPLATE_NAME;
import static com.vikadata.api.shared.constants.AuditConstants.UNIT_IDS;
import static com.vikadata.api.shared.constants.AuditConstants.UNIT_NAME;
import static com.vikadata.api.shared.constants.AuditConstants.UNIT_NAMES;
import static com.vikadata.api.space.enums.AuditSpaceAction.CREATE_TEMPLATE;
import static com.vikadata.api.space.enums.AuditSpaceAction.DISABLE_NODE_ROLE;
import static com.vikadata.api.space.enums.AuditSpaceAction.ENABLE_NODE_ROLE;

/**
 * <p>
 * Space audit Listener
 * </p>
 *
 * @author Chambers
 */
@Component
public class AuditSpaceListener {

    @Resource
    private IUnitService iUnitService;

    @Resource
    private TemplateMapper templateMapper;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private MultiDatasourceAdapterTemplate multiDatasourceAdapterTemplate;

    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @TransactionalEventListener(fallbackExecution = true, classes = AuditSpaceEvent.class)
    public void onApplicationEvent(AuditSpaceEvent event) {
        AuditSpaceArg arg = event.getArg();
        String spaceId = arg.getSpaceId();
        AuditSpaceAction action = arg.getAction();
        AuditSpaceCategory category = action.getCategory();
        JSONObject info = arg.getInfo() != null ? arg.getInfo() : JSONUtil.createObj();
        switch (category) {
            case WORK_CATALOG_CHANGE_EVENT:
            case WORK_CATALOG_SHARE_EVENT:
                // Information about splicing nodes
                spaceId = this.appendNodeInfo(arg.getNodeId(), action, info);
                break;
            case WORK_CATALOG_PERMISSION_CHANGE_EVENT:
                // Information about splicing nodes
                spaceId = this.appendNodeInfo(arg.getNodeId(), action, info);
                // Enable or disable permissions, no organizational unit information
                if (ENABLE_NODE_ROLE.equals(action) || DISABLE_NODE_ROLE.equals(action)) {
                    break;
                }
                // Splice organizational unit information
                this.appendUnitInfo(info);
                break;
            case SPACE_TEMPLATE_EVENT:
                // Information about splicing templates
                this.appendTemplateInfo(arg.getNodeId(), action, info);
                break;
            default:
                break;
        }
        multiDatasourceAdapterTemplate.saveSpaceAudit(arg.getUserId(), spaceId, action, info);
    }

    private String appendNodeInfo(String nodeId, AuditSpaceAction action, JSONObject info) {
        // query node basic information
        NodeEntity node = nodeMapper.selectByNodeIdIncludeDeleted(nodeId);
        info.set(NODE_ID, node.getNodeId());
        info.set(NODE_TYPE, node.getType());
        if (!info.containsKey(NODE_NAME)) {
            info.set(NODE_NAME, node.getNodeName());
        }
        switch (action) {
            case CREATE_NODE:
            case IMPORT_NODE:
            case COPY_NODE:
            case MOVE_NODE:
            case SORT_NODE:
            case RECOVER_RUBBISH_NODE:
            case STORE_SHARE_NODE:
            case QUOTE_TEMPLATE:
                // Set parent node information
                this.setParentNodeInfo(node.getSpaceId(), node.getParentId(), info);
                // Set pre-node information
                this.setPreNodeInfo(node.getPreNodeId(), info);
                // Node replication, set the source node information to be replicated
                if (info.containsKey(SOURCE_NODE_ID)) {
                    info.set(SOURCE_NODE_NAME, nodeMapper.selectNodeNameByNodeIdIncludeDeleted(info.getStr(SOURCE_NODE_ID)));
                }
                break;
            case DELETE_NODE:
                // The path to delete the node
                info.set(NODE_DELETED_PATH, StrUtil.nullToEmpty(node.getDeletedPath()));
                break;
            default:
                break;
        }
        return node.getSpaceId();
    }

    private void appendUnitInfo(JSONObject info) {
        boolean multiple = false;
        List<Long> unitIds = new ArrayList<>();
        if (info.containsKey(AuditConstants.UNIT_IDS)) {
            multiple = true;
            unitIds.addAll(info.getJSONArray(UNIT_IDS).toList(Long.class));
        }
        else if (info.containsKey(AuditConstants.UNIT_ID)) {
            unitIds.add(info.getLong(AuditConstants.UNIT_ID));
        }
        else {
            return;
        }

        // Querying Organizational Unit Views
        List<UnitInfoDTO> unitInfos = iUnitService.getUnitInfoDTOByUnitIds(unitIds);

        // Supplemental Organizational Unit Information
        if (multiple) {
            info.set(UNIT_NAMES, unitInfos.stream().map(UnitInfoDTO::getName).collect(Collectors.toList()));
            return;
        }
        UnitInfoDTO unitInfo = unitInfos.stream().findFirst().orElseThrow(() -> new BusinessException("Data Exception"));
        info.set(UNIT_NAME, unitInfo.getName());
    }

    private void appendTemplateInfo(String nodeId, AuditSpaceAction action, JSONObject info) {
        // Create a template
        if (CREATE_TEMPLATE.equals(action)) {
            // Information about splicing nodes
            this.appendNodeInfo(nodeId, action, info);
        }
        String templateName = templateMapper.selectNameByTemplateIdIncludeDelete(info.getStr(TEMPLATE_ID));
        info.set(TEMPLATE_NAME, templateName);
    }

    private void setParentNodeInfo(String spaceId, String parentId, JSONObject info) {
        info.set(PARENT_ID, parentId);
        String rootNodeId = nodeMapper.selectRootNodeIdBySpaceId(spaceId);
        // Determine if it is created in the root directory,
        // if yes, save the name of the parent node, otherwise save it as an empty string ""
        String parentName = rootNodeId.equals(parentId) ? StrUtil.EMPTY : nodeMapper.selectNodeNameByNodeIdIncludeDeleted(parentId);
        info.set(PARENT_NAME, parentName);

        // Node moves across folders, the original parent node name
        if (info.containsKey(OLD_PARENT_ID)) {
            String oldParentName = rootNodeId.equals(info.getStr(OLD_PARENT_ID)) ? StrUtil.EMPTY :
                    nodeMapper.selectNodeNameByNodeIdIncludeDeleted(info.getStr(OLD_PARENT_ID));
            info.set(OLD_PARENT_NAME, oldParentName);
        }
    }

    private void setPreNodeInfo(String preNodeId, JSONObject info) {
        info.set(PRE_NODE_ID, StrUtil.nullToEmpty(preNodeId));
        String preNodeName = preNodeId == null ? StrUtil.EMPTY : nodeMapper.selectNodeNameByNodeIdIncludeDeleted(preNodeId);
        info.set(PRE_NODE_NAME, preNodeName);

        // Node movement or sorting, the previous node name of the original position
        if (info.containsKey(OLD_PRE_NODE_ID)) {
            String oldPreNodeName = StrUtil.isBlank(info.getStr(OLD_PRE_NODE_ID)) ? StrUtil.EMPTY :
                    nodeMapper.selectNodeNameByNodeIdIncludeDeleted(info.getStr(OLD_PRE_NODE_ID));
            info.set(OLD_PRE_NODE_NAME, oldPreNodeName);
        }
    }
}
