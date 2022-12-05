package com.vikadata.api.shared.component.adapter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;

import com.vikadata.api.organization.mapper.MemberMapper;
import com.vikadata.api.organization.dto.MemberBaseInfoDTO;
import com.vikadata.api.organization.service.IUnitService;
import com.vikadata.api.organization.vo.UnitInfoVo;
import com.vikadata.api.shared.constants.AuditConstants;
import com.vikadata.api.shared.util.information.ClientOriginInfo;
import com.vikadata.api.shared.util.information.InformationUtil;
import com.vikadata.api.space.enums.AuditSpaceCategory;
import com.vikadata.api.space.dto.SpaceAuditDTO;
import com.vikadata.api.space.vo.SpaceAuditPageVO;
import com.vikadata.api.workspace.mapper.NodeMapper;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.api.organization.entity.MemberEntity;
import com.vikadata.entity.NodeEntity;


public abstract class AbstractDatasourceAdapter implements DatasourceAdapter {

    private static final int RECENTLY_NODE_ID_LENGTH = 10;

    protected ClientOriginInfo getClientOriginInfo() {
        return InformationUtil.getClientOriginInfo(true, false);
    }

    protected MemberEntity getMember(Long userId, String spaceId) {
        return SpringContextHolder.getBean(MemberMapper.class).selectByUserIdAndSpaceIdIgnoreDelete(userId, spaceId);
    }

    /**
     * step:
     * 1. iterate audits, record object id
     * 2. batch query information from db
     * 3. iterate audits, build page view
     */
    protected List<SpaceAuditPageVO> buildSpaceAuditPageVO(String spaceId, List<SpaceAuditDTO> audits) {
        Set<Long> operatorMemberIds = new HashSet<>();
        Set<Long> unitIds = new HashSet<>();
        Set<String> nodeIds = new HashSet<>();
        // Iterate audits, record object id
        for (SpaceAuditDTO audit : audits) {
            operatorMemberIds.add(audit.getMemberId());
            JSONObject info = JSONUtil.parseObj(audit.getInfo());
            if (info.containsKey(AuditConstants.UNIT_IDS)) {
                unitIds.addAll(info.getJSONArray(AuditConstants.UNIT_IDS).toList(Long.class));
            }
            else if (info.containsKey(AuditConstants.UNIT_ID)) {
                unitIds.add(info.getLong(AuditConstants.UNIT_ID));
            }
            if (info.containsKey(AuditConstants.NODE_ID)) {
                nodeIds.add(info.getStr(AuditConstants.NODE_ID));
            }
        }

        // Batch querying information about members, organization units, and nodes
        List<MemberBaseInfoDTO> members = SpringContextHolder.getBean(MemberMapper.class).selectBaseInfoDTOByIds(operatorMemberIds);
        Map<Long, MemberBaseInfoDTO> memberIdToDTOMap = members.stream().collect(Collectors.toMap(MemberBaseInfoDTO::getId, dto -> dto));
        Map<Long, UnitInfoVo> unitMap = new HashMap<>();
        if (!unitIds.isEmpty()) {
            List<UnitInfoVo> unitInfoList = SpringContextHolder.getBean(IUnitService.class).getUnitInfoList(spaceId, new ArrayList<>(unitIds));
            unitMap = unitInfoList.stream().collect(Collectors.toMap(UnitInfoVo::getUnitId, vo -> vo));
        }
        Map<String, NodeEntity> nodeMap = new HashMap<>();
        if (!nodeIds.isEmpty()) {
            List<NodeEntity> nodeEntities = SpringContextHolder.getBean(NodeMapper.class).selectByNodeIdsIncludeDeleted(nodeIds);
            nodeMap = nodeEntities.stream().collect(Collectors.toMap(NodeEntity::getNodeId, node -> node));
        }

        // Build page view
        return this.buildAuditPageViews(spaceId, audits, memberIdToDTOMap, unitMap, nodeMap);
    }

    private List<SpaceAuditPageVO> buildAuditPageViews(String spaceId, List<SpaceAuditDTO> audits,
            Map<Long, MemberBaseInfoDTO> memberIdToDTOMap, Map<Long, UnitInfoVo> unitMap, Map<String, NodeEntity> nodeMap) {
        List<SpaceAuditPageVO> vos = new ArrayList<>();
        for (SpaceAuditDTO audit : audits) {
            SpaceAuditPageVO vo = new SpaceAuditPageVO();
            vo.setCreatedAt(audit.getCreatedAt());
            vo.setAction(audit.getAction());
            // Build operator info
            SpaceAuditPageVO.Operator operator = new SpaceAuditPageVO.Operator();
            BeanUtil.copyProperties(memberIdToDTOMap.get(audit.getMemberId()), operator);
            operator.setMemberId(audit.getMemberId());
            vo.setOperator(operator);
            // Build audit info
            SpaceAuditPageVO.AuditContent content = new SpaceAuditPageVO.AuditContent();
            JSONObject info = JSONUtil.parseObj(audit.getInfo());
            AuditSpaceCategory category = AuditSpaceCategory.toEnum(audit.getCategory());
            switch (category) {
                case SPACE_CHANGE_EVENT:
                    SpaceAuditPageVO.Space space = new SpaceAuditPageVO.Space();
                    BeanUtil.copyProperties(audit.getInfo(), space);
                    space.setSpaceId(spaceId);
                    content.setSpace(space);
                    break;
                case WORK_CATALOG_CHANGE_EVENT:
                case WORK_CATALOG_SHARE_EVENT:
                case WORK_CATALOG_PERMISSION_CHANGE_EVENT:
                    // Append node info
                    this.appendNodeInfo(content, nodeMap, info);
                    // Append unit and control info
                    this.appendUnitAndControlInfo(content, unitMap, info);
                    break;
                case SPACE_TEMPLATE_EVENT:
                    SpaceAuditPageVO.Template template = new SpaceAuditPageVO.Template();
                    BeanUtil.copyProperties(audit.getInfo(), template);
                    content.setTemplate(template);
                    break;
                default:
                    break;
            }
            vo.setBody(content);
            vos.add(vo);
        }
        return vos;
    }

    private void appendNodeInfo(SpaceAuditPageVO.AuditContent content, Map<String, NodeEntity> nodeMap, JSONObject info) {
        SpaceAuditPageVO.Node node = new SpaceAuditPageVO.Node();
        BeanUtil.copyProperties(info, node);
        NodeEntity nodeEntity = nodeMap.get(info.getStr(AuditConstants.NODE_ID));
        node.setCurrentNodeIcon(nodeEntity.getIcon());
        node.setCurrentNodeName(nodeEntity.getNodeName());
        content.setNode(node);
    }

    private void appendUnitAndControlInfo(SpaceAuditPageVO.AuditContent content, Map<Long, UnitInfoVo> unitMap, JSONObject info) {
        if (!info.containsKey(AuditConstants.UNIT_IDS) && !info.containsKey(AuditConstants.UNIT_ID)) {
            return;
        }
        List<Long> ids = info.containsKey(AuditConstants.UNIT_IDS) ? info.getJSONArray(AuditConstants.UNIT_IDS).toList(Long.class) : Collections.singletonList(info.getLong(AuditConstants.UNIT_ID));
        List<SpaceAuditPageVO.Unit> units = new ArrayList<>();
        for (Long unitId : ids) {
            SpaceAuditPageVO.Unit unit = new SpaceAuditPageVO.Unit();
            BeanUtil.copyProperties(unitMap.get(unitId), unit);
            units.add(unit);
        }
        content.setUnits(units);
        // Append control info
        SpaceAuditPageVO.Control control = new SpaceAuditPageVO.Control();
        BeanUtil.copyProperties(info, control);
        content.setControl(control);
    }

    protected List<String> getTheLatestVisitedNodeIds(List<String> originNodeIds, String nodeId) {
        // filter current node id
        List<String> nodeIds = originNodeIds.stream().filter(i -> !nodeId.equals(i)).collect(Collectors.toList());
        if (nodeIds.size() >= RECENTLY_NODE_ID_LENGTH) {
            nodeIds.remove(0);
        }
        nodeIds.add(nodeId);
        return nodeIds;
    }
}
