package com.vikadata.api.shared.component.adapter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.metadata.OrderItem;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.vikadata.api.shared.util.information.ClientOriginInfo;
import com.vikadata.api.shared.util.page.PageHelper;
import com.vikadata.api.shared.util.page.PageInfo;
import com.vikadata.api.space.enums.AuditSpaceAction;
import com.vikadata.api.space.mapper.SpaceAuditMapper;
import com.vikadata.api.space.model.SpaceAuditDTO;
import com.vikadata.api.space.model.SpaceAuditPageParam;
import com.vikadata.api.space.model.vo.SpaceAuditPageVO;
import com.vikadata.api.workspace.enums.NodeType;
import com.vikadata.api.workspace.mapper.NodeVisitRecordMapper;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.entity.MemberEntity;
import com.vikadata.entity.NodeVisitRecordEntity;
import com.vikadata.entity.SpaceAuditEntity;

public class MysqlAdapter extends AbstractDatasourceAdapter {

    private static final String COMMA = ",";

    private static final String DEFAULT_DESCEND_COLUMNS = "id";

    @Override
    public PageInfo<SpaceAuditPageVO> getSpaceAuditPage(String spaceId, SpaceAuditPageParam param) {
        Page<SpaceAuditEntity> page = new Page<>(param.getPageNo(), param.getPageSize());
        page.addOrder(OrderItem.descs(DEFAULT_DESCEND_COLUMNS));
        IPage<SpaceAuditEntity> result = SpringContextHolder.getBean(SpaceAuditMapper.class).selectSpaceAuditPage(page, spaceId, param);
        if (result.getTotal() == 0) {
            return PageHelper.build(param.getPageNo(), param.getPageSize(), 0, new ArrayList<>());
        }
        List<SpaceAuditDTO> audits = result.getRecords().stream().map(i -> BeanUtil.copyProperties(i, SpaceAuditDTO.class)).collect(Collectors.toList());
        List<SpaceAuditPageVO> records = super.buildSpaceAuditPageVO(spaceId, audits);
        return new PageInfo<>(param.getPageNo(), param.getPageSize(), (int) result.getTotal(), records);
    }

    @Override
    public void createSpaceAuditRecord(Long userId, String spaceId, AuditSpaceAction action, JSONObject info) {
        MemberEntity member = super.getMember(userId, spaceId);
        ClientOriginInfo clientOriginInfo = super.getClientOriginInfo();
        SpaceAuditEntity entity = SpaceAuditEntity.builder()
                .id(IdWorker.getId())
                .spaceId(spaceId)
                .memberId(member.getId())
                .memberName(member.getMemberName())
                .ipAddress(clientOriginInfo.getIp())
                .userAgent(clientOriginInfo.getUserAgent())
                .category(action.getCategory().name().toLowerCase())
                .action(action.getAction())
                .info(info.toString())
                .createdBy(userId)
                .createdAt(LocalDateTime.now())
                .build();
        SpringContextHolder.getBean(SpaceAuditMapper.class).insert(entity);
    }

    @Override
    public List<String> getRecentlyVisitNodeIds(Long memberId, NodeType nodeType) {
        String nodeIdsStr = SpringContextHolder.getBean(NodeVisitRecordMapper.class).selectNodeIdsByMemberIdAndNodeType(memberId, nodeType.getNodeType());
        if (nodeIdsStr == null) {
            return new ArrayList<>();
        }
        return CollUtil.reverse(CollUtil.toList(nodeIdsStr.split(COMMA)));
    }

    @Override
    public void saveOrUpdateNodeVisitRecord(String spaceId, Long memberId, String nodeId, NodeType nodeType) {
        NodeVisitRecordMapper nodeVisitRecordMapper = SpringContextHolder.getBean(NodeVisitRecordMapper.class);
        String nodeIdsStr = nodeVisitRecordMapper.selectNodeIdsByMemberIdAndNodeType(memberId, nodeType.getNodeType());
        if (nodeIdsStr == null) {
            NodeVisitRecordEntity entity = NodeVisitRecordEntity.builder()
                    .id(IdWorker.getId())
                    .spaceId(spaceId)
                    .memberId(memberId)
                    .nodeType(nodeType.getNodeType())
                    .nodeIds(nodeId)
                    .build();
            nodeVisitRecordMapper.insert(entity);
            return;
        }
        List<String> nodeIds = super.getTheLatestVisitedNodeIds(CollUtil.toList(nodeIdsStr.split(COMMA)), nodeId);
        nodeVisitRecordMapper.updateNodeIdsByMemberIdAndNodeType(String.join(COMMA, nodeIds), memberId, nodeType.getNodeType());
    }
}
