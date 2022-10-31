package com.vikadata.api.modular.space.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.constants.AuditConstants;
import com.vikadata.api.enums.audit.AuditSpaceCategory;
import com.vikadata.api.enums.exception.ParameterException;
import com.vikadata.api.enums.exception.SubscribeFunctionException;
import com.vikadata.api.helper.PageHelper;
import com.vikadata.api.lang.PageInfo;
import com.vikadata.api.model.vo.organization.UnitInfoVo;
import com.vikadata.api.modular.finance.service.ISpaceSubscriptionService;
import com.vikadata.api.modular.organization.mapper.MemberMapper;
import com.vikadata.api.modular.organization.model.MemberBaseInfoDTO;
import com.vikadata.api.modular.organization.service.IUnitService;
import com.vikadata.api.modular.space.model.SpaceAuditPageParam;
import com.vikadata.api.modular.space.model.vo.SpaceAuditPageVO;
import com.vikadata.api.modular.space.service.ISpaceAuditService;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.core.util.ExceptionUtil;
import com.vikadata.entity.NodeEntity;
import com.vikadata.schema.AuditSpaceSchema;
import com.vikadata.system.config.SystemConfigManager;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import static com.vikadata.api.constants.AuditConstants.UNIT_IDS;

@Slf4j
@Service
public class SpaceAuditServiceImpl implements ISpaceAuditService {

    private static final List<String> showAudits = SystemConfigManager.getConfig().getAudit().entrySet().stream()
            .filter((entry) -> entry.getValue().isShowInAuditLog())
            .map(Entry::getKey).collect(Collectors.toList());

    @Resource
    private ISpaceSubscriptionService iSpaceSubscriptionService;

    @Resource
    private IUnitService iUnitService;

    @Resource
    private MemberMapper memberMapper;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private MongoTemplate mongoTemplate;

    @Override
    public PageInfo<SpaceAuditPageVO> getSpaceAuditPageVO(String spaceId, SpaceAuditPageParam param) {
        Criteria criteria = Criteria.where("spaceId").is(spaceId);
        if (CollUtil.isNotEmpty(param.getMemberIds())) {
            criteria.and("memberId").in(param.getMemberIds());
        }
        if (CollUtil.isNotEmpty(param.getActions())) {
            criteria.and("action").in(param.getActions());
        }
        else if (!showAudits.isEmpty()) {
            criteria.and("action").in(showAudits);
        }

        // Gets the number of days the space subscription plan is available for audit query
        long queryDays = iSpaceSubscriptionService.getPlanAuditQueryDays(spaceId);
        LocalDateTime today = LocalDateTimeUtil.beginOfDay(LocalDateTime.now());
        LocalDateTime beginTime = param.getBeginTime();
        // check start time
        if (beginTime != null) {
            long between = LocalDateTimeUtil.between(beginTime, today, ChronoUnit.DAYS);
            ExceptionUtil.isTrue(queryDays >= between, SubscribeFunctionException.AUDIT_LIMIT);
        }
        else {
            beginTime = today.plusDays(1 - queryDays);
        }
        // check end time
        if (param.getEndTime() != null) {
            ExceptionUtil.isFalse(LocalDateTimeUtil.between(beginTime, param.getEndTime()).isNegative(), ParameterException.INCORRECT_ARG);
            criteria.and("createdAt").gte(beginTime).lte(param.getEndTime());
        }
        else {
            criteria.and("createdAt").gte(beginTime);
        }

        // file search
        String likeName = StrUtil.trim(param.getKeyword());
        if (StrUtil.isNotBlank(likeName)) {
            // fuzzy search node
            List<String> nodeIds = nodeMapper.selectNodeIdBySpaceIdAndNodeNameLikeIncludeDeleted(spaceId, likeName);
            // The result is empty, ending the return
            if (nodeIds.isEmpty()) {
                return PageHelper.build(param.getPageNo(), param.getPageSize(), 0, new ArrayList<>());
            }
            criteria.and("info.nodeId").in(nodeIds);
        }

        // the total number of queries
        Query query = new Query(criteria);
        long count = mongoTemplate.count(query, AuditSpaceSchema.class);
        // The result is empty, ending the return
        if (count == 0) {
            return PageHelper.build(param.getPageNo(), param.getPageSize(), 0, new ArrayList<>());
        }
        // Querying Paging Results
        Pageable pageable = PageRequest.of(param.getPageNo() - 1, param.getPageSize(), Direction.DESC, "_id");
        query.with(pageable);
        List<AuditSpaceSchema> auditSpaceSchemas = mongoTemplate.find(query, AuditSpaceSchema.class);

        List<SpaceAuditPageVO> records = auditSpaceSchemas.isEmpty() ? new ArrayList<>() : this.buildSpaceAuditPageVO(spaceId, auditSpaceSchemas);
        return PageHelper.build(param.getPageNo(), param.getPageSize(), (int) count, records);
    }

    private List<SpaceAuditPageVO> buildSpaceAuditPageVO(String spaceId, List<AuditSpaceSchema> schemas) {
        List<SpaceAuditPageVO> vos = new ArrayList<>();

        Set<Long> operatorMemberIds = new HashSet<>();
        Set<Long> unitIds = new HashSet<>();
        Set<String> nodeIds = new HashSet<>();
        for (AuditSpaceSchema schema : schemas) {
            // add operator's member id
            operatorMemberIds.add(schema.getMemberId());
            JSONObject info = JSONUtil.parseObj(schema.getInfo());
            // add unit id
            if (info.containsKey(AuditConstants.UNIT_IDS)) {
                unitIds.addAll(info.getJSONArray(UNIT_IDS).toList(Long.class));
            }
            else if (info.containsKey(AuditConstants.UNIT_ID)) {
                unitIds.add(info.getLong(AuditConstants.UNIT_ID));
            }
            // add node id
            if (info.containsKey(AuditConstants.NODE_ID)) {
                nodeIds.add(info.getStr(AuditConstants.NODE_ID));
            }
        }

        // Batch querying information about members, organization units, and nodes
        List<MemberBaseInfoDTO> members = memberMapper.selectBaseInfoDTOByIds(operatorMemberIds);
        Map<Long, MemberBaseInfoDTO> memberIdToDTOMap = members.stream().collect(Collectors.toMap(MemberBaseInfoDTO::getId, dto -> dto));
        Map<Long, UnitInfoVo> unitMap = new HashMap<>();
        if (!unitIds.isEmpty()) {
            List<UnitInfoVo> unitInfoList = iUnitService.getUnitInfoList(spaceId, new ArrayList<>(unitIds));
            unitMap = unitInfoList.stream().collect(Collectors.toMap(UnitInfoVo::getUnitId, vo -> vo));
        }
        Map<String, NodeEntity> nodeMap = new HashMap<>();
        if (!nodeIds.isEmpty()) {
            List<NodeEntity> nodeEntities = nodeMapper.selectByNodeIdsIncludeDeleted(nodeIds);
            nodeMap = nodeEntities.stream().collect(Collectors.toMap(NodeEntity::getNodeId, node -> node));
        }

        // paging search
        for (AuditSpaceSchema schema : schemas) {
            SpaceAuditPageVO vo = new SpaceAuditPageVO();
            vo.setCreatedAt(schema.getCreatedAt());
            vo.setAction(schema.getAction());
            // build operator info
            SpaceAuditPageVO.Operator operator = new SpaceAuditPageVO.Operator();
            BeanUtil.copyProperties(memberIdToDTOMap.get(schema.getMemberId()), operator);
            operator.setMemberId(schema.getMemberId());
            vo.setOperator(operator);
            // build audit info
            SpaceAuditPageVO.AuditContent content = new SpaceAuditPageVO.AuditContent();
            JSONObject info = JSONUtil.parseObj(schema.getInfo());
            AuditSpaceCategory category = AuditSpaceCategory.toEnum(schema.getCategory());
            switch (category) {
                case SPACE_CHANGE_EVENT:
                    SpaceAuditPageVO.Space space = new SpaceAuditPageVO.Space();
                    BeanUtil.copyProperties(schema.getInfo(), space);
                    space.setSpaceId(spaceId);
                    content.setSpace(space);
                    break;
                case WORK_CATALOG_CHANGE_EVENT:
                case WORK_CATALOG_SHARE_EVENT:
                case WORK_CATALOG_PERMISSION_CHANGE_EVENT:
                    SpaceAuditPageVO.Node node = new SpaceAuditPageVO.Node();
                    BeanUtil.copyProperties(info, node);
                    NodeEntity nodeEntity = nodeMap.get(info.getStr(AuditConstants.NODE_ID));
                    node.setCurrentNodeIcon(nodeEntity.getIcon());
                    node.setCurrentNodeName(nodeEntity.getNodeName());
                    content.setNode(node);
                    // unit info
                    if (info.containsKey(AuditConstants.UNIT_IDS) || info.containsKey(AuditConstants.UNIT_ID)) {
                        List<Long> ids = info.containsKey(AuditConstants.UNIT_IDS) ? info.getJSONArray(UNIT_IDS).toList(Long.class) : Collections.singletonList(info.getLong(AuditConstants.UNIT_ID));
                        List<SpaceAuditPageVO.Unit> units = new ArrayList<>();
                        for (Long unitId : ids) {
                            SpaceAuditPageVO.Unit unit = new SpaceAuditPageVO.Unit();
                            BeanUtil.copyProperties(unitMap.get(unitId), unit);
                            units.add(unit);
                        }
                        content.setUnits(units);
                        SpaceAuditPageVO.Control control = new SpaceAuditPageVO.Control();
                        BeanUtil.copyProperties(info, control);
                        content.setControl(control);
                    }
                    break;
                case SPACE_TEMPLATE_EVENT:
                    SpaceAuditPageVO.Template template = new SpaceAuditPageVO.Template();
                    BeanUtil.copyProperties(schema.getInfo(), template);
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
}
