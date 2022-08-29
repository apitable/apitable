package com.vikadata.api.listener;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;

import com.vikadata.api.enums.audit.AuditSpaceAction;
import com.vikadata.api.enums.audit.AuditSpaceCategory;
import com.vikadata.api.event.AuditSpaceEvent;
import com.vikadata.api.event.AuditSpaceEvent.AuditSpaceArg;
import com.vikadata.api.model.dto.client.ClientOriginInfo;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.model.UnitInfoDTO;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.space.repository.AuditSpaceRepository;
import com.vikadata.api.modular.space.service.ISpaceService;
import com.vikadata.api.modular.template.mapper.TemplateMapper;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.util.InformationUtil;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.NodeEntity;
import com.vikadata.schema.AuditSpaceSchema;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;

import static com.vikadata.api.config.AsyncTaskExecutorConfig.DEFAULT_EXECUTOR_BEAN_NAME;
import static com.vikadata.api.constants.AuditConstants.NODE_DELETED_PATH;
import static com.vikadata.api.constants.AuditConstants.NODE_ID;
import static com.vikadata.api.constants.AuditConstants.NODE_NAME;
import static com.vikadata.api.constants.AuditConstants.NODE_TYPE;
import static com.vikadata.api.constants.AuditConstants.OLD_PARENT_ID;
import static com.vikadata.api.constants.AuditConstants.OLD_PARENT_NAME;
import static com.vikadata.api.constants.AuditConstants.OLD_PRE_NODE_ID;
import static com.vikadata.api.constants.AuditConstants.OLD_PRE_NODE_NAME;
import static com.vikadata.api.constants.AuditConstants.PARENT_ID;
import static com.vikadata.api.constants.AuditConstants.PARENT_NAME;
import static com.vikadata.api.constants.AuditConstants.PRE_NODE_ID;
import static com.vikadata.api.constants.AuditConstants.PRE_NODE_NAME;
import static com.vikadata.api.constants.AuditConstants.SOURCE_NODE_ID;
import static com.vikadata.api.constants.AuditConstants.SOURCE_NODE_NAME;
import static com.vikadata.api.constants.AuditConstants.TEMPLATE_ID;
import static com.vikadata.api.constants.AuditConstants.TEMPLATE_NAME;
import static com.vikadata.api.constants.AuditConstants.UNIT_ID;
import static com.vikadata.api.constants.AuditConstants.UNIT_IDS;
import static com.vikadata.api.constants.AuditConstants.UNIT_NAME;
import static com.vikadata.api.constants.AuditConstants.UNIT_NAMES;
import static com.vikadata.api.enums.audit.AuditSpaceAction.ADD_NODE_ROLE;
import static com.vikadata.api.enums.audit.AuditSpaceAction.CREATE_TEMPLATE;
import static com.vikadata.api.enums.audit.AuditSpaceAction.DISABLE_NODE_ROLE;
import static com.vikadata.api.enums.audit.AuditSpaceAction.ENABLE_NODE_ROLE;

/**
 * <p>
 * 空间审计事件监听器
 * </p>
 *
 * @author Chambers
 * @date 2022/5/25
 */
@Component
public class AuditSpaceListener {

    @Resource
    private ISpaceService iSpaceService;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private TemplateMapper templateMapper;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private AuditSpaceRepository auditSpaceRepository;

    @Async(DEFAULT_EXECUTOR_BEAN_NAME)
    @TransactionalEventListener(fallbackExecution = true, classes = AuditSpaceEvent.class)
    public void onApplicationEvent(AuditSpaceEvent event) {
        // 获取请求来源信息
        ClientOriginInfo clientOriginInfo = InformationUtil.getClientOriginInfo(true, false);

        // 事件参数
        AuditSpaceArg arg = event.getArg();
        String spaceId = arg.getSpaceId();
        AuditSpaceAction action = arg.getAction();
        AuditSpaceCategory category = action.getCategory();
        JSONObject info = arg.getInfo() != null ? arg.getInfo() : JSONUtil.createObj();
        switch (category) {
            case WORK_CATALOG_CHANGE_EVENT:
            case WORK_CATALOG_SHARE_EVENT:
                // 拼接节点相关的信息
                spaceId = this.appendNodeInfo(arg.getNodeId(), action, info);
                break;
            case WORK_CATALOG_PERMISSION_CHANGE_EVENT:
                // 拼接节点相关的信息
                spaceId = this.appendNodeInfo(arg.getNodeId(), action, info);
                // 开启/关闭权限，无组织单元信息
                if (ENABLE_NODE_ROLE.equals(action) || DISABLE_NODE_ROLE.equals(action)) {
                    break;
                }
                // 拼接组织单元信息
                this.appendUnitInfo(action, info);
                break;
            case SPACE_TEMPLATE_EVENT:
                // 拼接模板相关的信息
                this.appendTemplateInfo(arg.getNodeId(), action, info);
                break;
            default:
                break;
        }

        // 查询操作者的成员信息
        MemberEntity member = memberMapper.selectByUserIdAndSpaceIdIgnoreDelete(arg.getUserId(), spaceId);
        // 构建实体
        AuditSpaceSchema schema = AuditSpaceSchema.builder()
                .userId(arg.getUserId())
                .spaceId(spaceId)
                .memberId(member.getId())
                .memberName(member.getMemberName())
                .ipAddress(clientOriginInfo.getIp())
                .userAgent(clientOriginInfo.getUserAgent())
                .category(category.name().toLowerCase())
                .action(action.getAction())
                .info(info)
                .createdAt(LocalDateTime.now())
                .build();
        // 保存数据
        auditSpaceRepository.save(schema);
    }

    private String appendNodeInfo(String nodeId, AuditSpaceAction action, JSONObject info) {
        // 节点基础信息
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
                // 设置父节点信息
                this.setParentNodeInfo(node.getSpaceId(), node.getParentId(), info);
                // 设置前置节点信息
                this.setPreNodeInfo(node.getPreNodeId(), info);
                // 节点复制，设置被复制的源节点信息
                if (info.containsKey(SOURCE_NODE_ID)) {
                    info.set(SOURCE_NODE_NAME, nodeMapper.selectNodeNameByNodeIdIncludeDeleted(info.getStr(SOURCE_NODE_ID)));
                }
                break;
            case DELETE_NODE:
                // 节点删除的路径
                info.set(NODE_DELETED_PATH, StrUtil.nullToEmpty(node.getDeletedPath()));
                break;
            default:
                break;
        }
        return node.getSpaceId();
    }

    private void appendUnitInfo(AuditSpaceAction action, JSONObject info) {
        // 以事件区分，参数包含多个unitId
        boolean multiple = ADD_NODE_ROLE.equals(action);
        List<Long> unitIds = multiple ? info.getJSONArray(UNIT_IDS).toList(Long.class) : Collections.singletonList(info.getLong(UNIT_ID));

        // 查询组织单元视图
        List<UnitInfoDTO> unitInfos = iUnitService.getUnitInfoDTOByUnitIds(unitIds);

        // 补充组织单元信息
        if (multiple) {
            info.set(UNIT_NAMES, unitInfos.stream().map(UnitInfoDTO::getName).collect(Collectors.toList()));
            return;
        }
        UnitInfoDTO unitInfo = unitInfos.stream().findFirst().orElseThrow(() -> new BusinessException("Data Exception"));
        info.set(UNIT_NAME, unitInfo.getName());
    }

    private void appendTemplateInfo(String nodeId, AuditSpaceAction action, JSONObject info) {
        // 创建模板
        if (CREATE_TEMPLATE.equals(action)) {
            // 拼接节点相关的信息
            this.appendNodeInfo(nodeId, action, info);
        }
        String templateName = templateMapper.selectNameByTemplateIdIncludeDelete(info.getStr(TEMPLATE_ID));
        info.set(TEMPLATE_NAME, templateName);
    }

    private void setParentNodeInfo(String spaceId, String parentId, JSONObject info) {
        info.set(PARENT_ID, parentId);
        String rootNodeId = nodeMapper.selectRootNodeIdBySpaceId(spaceId);
        // 判断是否在根目录下创建，是则保存父级节点名称，否则保存为空字符串 ""
        String parentName = rootNodeId.equals(parentId) ? StrUtil.EMPTY : nodeMapper.selectNodeNameByNodeIdIncludeDeleted(parentId);
        info.set(PARENT_NAME, parentName);

        // 节点跨文件夹移动，原本的父级节点名称
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

        // 节点移动或排序，原本位置的前置节点名称
        if (info.containsKey(OLD_PRE_NODE_ID)) {
            String oldPreNodeName = StrUtil.isBlank(info.getStr(OLD_PRE_NODE_ID)) ? StrUtil.EMPTY :
                    nodeMapper.selectNodeNameByNodeIdIncludeDeleted(info.getStr(OLD_PRE_NODE_ID));
            info.set(OLD_PRE_NODE_NAME, oldPreNodeName);
        }
    }
}
