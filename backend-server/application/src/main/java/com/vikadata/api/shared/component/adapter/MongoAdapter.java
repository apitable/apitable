package com.vikadata.api.shared.component.adapter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.json.JSONObject;

import com.vikadata.api.shared.util.information.ClientOriginInfo;
import com.vikadata.api.shared.util.page.PageHelper;
import com.vikadata.api.shared.util.page.PageInfo;
import com.vikadata.api.space.enums.AuditSpaceAction;
import com.vikadata.api.space.model.SpaceAuditDTO;
import com.vikadata.api.space.model.SpaceAuditPageParam;
import com.vikadata.api.space.model.vo.SpaceAuditPageVO;
import com.vikadata.api.space.repository.AuditSpaceRepository;
import com.vikadata.api.workspace.enums.NodeType;
import com.vikadata.api.workspace.repository.NodeRecentlyBrowsedRepository;
import com.vikadata.api.workspace.service.INodeRecentlyBrowsedService;
import com.vikadata.core.util.SpringContextHolder;
import com.vikadata.entity.MemberEntity;
import com.vikadata.schema.AuditSpaceSchema;
import com.vikadata.schema.NodeRecentlyBrowsedSchema;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;


public class MongoAdapter extends AbstractDatasourceAdapter {

    @Override
    public PageInfo<SpaceAuditPageVO> getSpaceAuditPage(String spaceId, SpaceAuditPageParam param) {
        MongoTemplate mongoTemplate = SpringContextHolder.getBean(MongoTemplate.class);
        // Query the total number
        Query query = new Query(this.buildAuditPageCriteria(spaceId, param));
        long count = mongoTemplate.count(query, AuditSpaceSchema.class);
        if (count == 0) {
            return PageHelper.build(param.getPageNo(), param.getPageSize(), 0, new ArrayList<>());
        }
        // Query paging results
        Pageable pageable = PageRequest.of(param.getPageNo() - 1, param.getPageSize(), Direction.DESC, "_id");
        query.with(pageable);
        List<AuditSpaceSchema> schemas = mongoTemplate.find(query, AuditSpaceSchema.class);
        if (schemas.isEmpty()) {
            return PageHelper.build(param.getPageNo(), param.getPageSize(), 0, new ArrayList<>());
        }
        List<SpaceAuditDTO> audits = schemas.stream().map(i -> BeanUtil.copyProperties(i, SpaceAuditDTO.class)).collect(Collectors.toList());
        List<SpaceAuditPageVO> records = super.buildSpaceAuditPageVO(spaceId, audits);
        return PageHelper.build(param.getPageNo(), param.getPageSize(), (int) count, records);
    }

    private Criteria buildAuditPageCriteria(String spaceId, SpaceAuditPageParam param) {
        Criteria criteria = Criteria.where("spaceId").is(spaceId);
        if (CollUtil.isNotEmpty(param.getMemberIds())) {
            criteria.and("memberId").in(param.getMemberIds());
        }

        if (CollUtil.isNotEmpty(param.getActions())) {
            criteria.and("action").in(param.getActions());
        }

        LocalDateTime beginTime = param.getBeginTime();
        if (param.getEndTime() != null) {
            criteria.and("createdAt").gte(beginTime).lte(param.getEndTime());
        }
        else {
            criteria.and("createdAt").gte(beginTime);
        }

        if (CollUtil.isNotEmpty(param.getNodeIds())) {
            criteria.and("info.nodeId").in(param.getNodeIds());
        }
        return criteria;
    }

    @Override
    public void createSpaceAuditRecord(Long userId, String spaceId, AuditSpaceAction action, JSONObject info) {
        MemberEntity member = super.getMember(userId, spaceId);
        ClientOriginInfo clientOriginInfo = super.getClientOriginInfo();
        AuditSpaceSchema schema = AuditSpaceSchema.builder()
                .userId(userId)
                .spaceId(spaceId)
                .memberId(member.getId())
                .memberName(member.getMemberName())
                .ipAddress(clientOriginInfo.getIp())
                .userAgent(clientOriginInfo.getUserAgent())
                .category(action.getCategory().name().toLowerCase())
                .action(action.getAction())
                .info(info)
                .createdAt(LocalDateTime.now())
                .build();
        SpringContextHolder.getBean(AuditSpaceRepository.class).save(schema);
    }

    @Override
    public List<String> getRecentlyVisitNodeIds(Long memberId, NodeType nodeType) {
        NodeRecentlyBrowsedSchema document = SpringContextHolder.getBean(INodeRecentlyBrowsedService.class).getByMemberIdAndNodeType(memberId, nodeType);
        if (null == document || document.getNodeIds().isEmpty()) {
            return new ArrayList<>();
        }
        return CollUtil.reverse(document.getNodeIds());
    }

    @Override
    public void saveOrUpdateNodeVisitRecord(String spaceId, Long memberId, String nodeId, NodeType nodeType) {
        INodeRecentlyBrowsedService iNodeRecentlyBrowsedService = SpringContextHolder.getBean(INodeRecentlyBrowsedService.class);
        NodeRecentlyBrowsedSchema document = iNodeRecentlyBrowsedService.getByMemberIdAndNodeType(memberId, nodeType);
        if (null == document) {
            iNodeRecentlyBrowsedService.saveMemberBrowsedNodeId(memberId, spaceId, nodeId, nodeType);
            return;
        }
        List<String> nodeIds = super.getTheLatestVisitedNodeIds(document.getNodeIds(), nodeId);
        document.setNodeIds(nodeIds);
        SpringContextHolder.getBean(NodeRecentlyBrowsedRepository.class).save(document);
    }

}
