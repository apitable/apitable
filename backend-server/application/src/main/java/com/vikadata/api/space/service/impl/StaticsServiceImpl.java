package com.vikadata.api.space.service.impl;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.text.StrSpliter;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.enterprise.control.infrastructure.ControlIdBuilder;
import com.vikadata.api.enterprise.control.infrastructure.ControlType;
import com.vikadata.api.enterprise.control.mapper.ControlMapper;
import com.vikadata.api.enterprise.control.model.ControlTypeDTO;
import com.vikadata.api.space.mapper.StaticsMapper;
import com.vikadata.api.space.model.ControlStaticsVO;
import com.vikadata.api.space.model.DatasheetStaticsVO;
import com.vikadata.api.space.model.NodeStaticsVO;
import com.vikadata.api.space.model.NodeTypeStatics;
import com.vikadata.api.space.service.IStaticsService;
import com.vikadata.api.workspace.mapper.NodeMapper;
import com.vikadata.api.shared.util.DateHelper;
import com.vikadata.core.util.SqlTool;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import static com.vikadata.api.shared.constants.DateFormatConstants.YEARS_MONTH_PATTERN;
import static com.vikadata.core.constants.RedisConstants.GENERAL_STATICS;

/**
 * <p>
 * Statics interface implementation class
 * </p>
 */
@Slf4j
@Service
public class StaticsServiceImpl implements IStaticsService {

    @Resource
    private ControlMapper controlMapper;

    @Resource
    private NodeMapper nodeMapper;

    @Resource
    private StaticsMapper staticsMapper;

    @Resource
    private RedisTemplate<String, Long> redisTemplate;

    @Override
    public long getCurrentMonthApiUsage(String spaceId) {
        // Get the API usage of this month up to yesterday
        Long apiUsageUntilYesterday = this.getCurrentMonthApiUsageUntilYesterday(spaceId);
        // If it is NULL, it indicates that the daily API usage statistics table is empty, and the old method is adopted
        if (apiUsageUntilYesterday == null) {
            Long minId = this.getApiUsageTableMinId();
            // The minimum table ID of this month does not exist, that is, there is no call record
            if (minId == null) {
                return 0;
            }
            return SqlTool.retCount(staticsMapper.countApiUsageBySpaceId(spaceId, minId));
        } else {
            return apiUsageUntilYesterday + this.getTodayApiUsage(spaceId);
        }
    }

    @Override
    public Long getTodayApiUsage(String spaceId) {
        // Get today's API usage cache
        SimpleDateFormat today = new SimpleDateFormat("yyyy-MM-dd");
        String todayKey = StrUtil.format(GENERAL_STATICS, "api" + today.format(new Date()), spaceId);
        Object apiUsageToday = redisTemplate.opsForValue().get(todayKey);
        if (apiUsageToday == null) {
            // Maximum table ID of yesterday's API usage record
            Long yesterdayMaxId = staticsMapper.selectMaxIdByTime(today.format(DateUtil.yesterday()));
            // Get today's API usage
            apiUsageToday = staticsMapper.countByIdGreaterThanAndSpaceId(yesterdayMaxId, spaceId);
            // Update today's api usage cache
            redisTemplate.opsForValue().set(todayKey, Long.valueOf(apiUsageToday.toString()), 2, TimeUnit.HOURS);
        }
        // Return to the space station today's API usage
        return Long.valueOf(apiUsageToday.toString());
    }

    @Override
    public Long getCurrentMonthApiUsageUntilYesterday(String spaceId) {
        // If it is the first day of this month, 0 will be returned directly
        if (ObjectUtil.equals(DateUtil.date(new Date()).getDate(), 1)) {
            return 0L;
        } else {
            // Get the API usage cache of this month before today
            SimpleDateFormat month = new SimpleDateFormat("yyyy-MM");
            String monthKey = StrUtil.format(GENERAL_STATICS, "api" + month.format(new Date()), spaceId);
            Object apiUsageBeforeToday = redisTemplate.opsForValue().get(monthKey);
            if (apiUsageBeforeToday != null) {
                return Long.valueOf(apiUsageBeforeToday.toString());
            }
            // No cache. Query the API usage in this month before today
            SimpleDateFormat today = new SimpleDateFormat("yyyy-MM-dd");
            Long totalSum = staticsMapper.selectTotalSumBySpaceIdAndTimeBetween(spaceId, today.format(DateUtil.beginOfMonth(new Date())), today.format(DateUtil.yesterday()));
            if (totalSum == null) {
                return null;
            }
            // Update the API usage cache of this month before today
            redisTemplate.opsForValue().set(monthKey, totalSum, DateHelper.todayTimeLeft(), TimeUnit.SECONDS);
            return totalSum;
        }
    }

    private Long getApiUsageTableMinId() {
        // Get the minimum ID of the API consumption table this month
        LocalDateTime now = LocalDateTime.now();
        String key = StrUtil.format(GENERAL_STATICS, "api-usage-min-id", DateHelper.formatFullTime(now, YEARS_MONTH_PATTERN));
        Long id = redisTemplate.opsForValue().get(key);
        if (id != null) {
            return id;
        }
        // The minimum ID of this month does not exist. Query the minimum ID of last month to reduce the query volume
        String lastMonthKey = StrUtil.format(GENERAL_STATICS, "api-usage-min-id",
                DateHelper.formatFullTime(now.plusMonths(-1), YEARS_MONTH_PATTERN));
        Long lastMonthMinId = redisTemplate.opsForValue().get(lastMonthKey);
        // If the minimum table ID of last month does not exist, query the maximum table ID directly
        if (lastMonthMinId == null) {
            id = staticsMapper.selectMaxId();
        }
        else {
            id = staticsMapper.selectApiUsageMinIdByCreatedAt(lastMonthMinId, DateHelper.getStartTimeOfMonth());
        }
        // Keep the cache of the month
        redisTemplate.opsForValue().set(key, id, 33, TimeUnit.DAYS);
        return id;
    }

    @Override
    public long getMemberTotalCountBySpaceId(String spaceId) {
        return SqlTool.retCount(staticsMapper.countMemberBySpaceId(spaceId));
    }

    @Override
    public long getTeamTotalCountBySpaceId(String spaceId) {
        return SqlTool.retCount(staticsMapper.countTeamBySpaceId(spaceId));
    }

    @Override
    public long getAdminTotalCountBySpaceId(String spaceId) {
        return SqlTool.retCount(staticsMapper.countSubAdminBySpaceId(spaceId));
    }

    @Override
    public long getDatasheetRecordTotalCountBySpaceId(String spaceId) {
        return SqlTool.retCount(staticsMapper.countRecordsBySpaceId(spaceId));
    }

    @Override
    public long getTotalFileSizeBySpaceId(String spaceId) {
        List<Integer> fileSizes = staticsMapper.selectFileSizeBySpaceId(spaceId);
        return fileSizes.stream().filter(Objects::nonNull).mapToLong(Integer::intValue).sum();
    }

    @Override
    public ControlStaticsVO getFieldRoleTotalCountBySpaceId(String spaceId) {
        ControlStaticsVO vo = new ControlStaticsVO(0L, 0L);
        List<ControlTypeDTO> controls = controlMapper.selectControlTypeDTO(spaceId);
        if (controls.isEmpty()) {
            return vo;
        }
        Map<Integer, List<String>> typeToControlIdsMap = controls.stream()
                .collect(Collectors.groupingBy(ControlTypeDTO::getControlType,
                        Collectors.mapping(ControlTypeDTO::getControlId, Collectors.toList())));
        // File Permission
        if (typeToControlIdsMap.containsKey(ControlType.NODE.getVal())) {
            List<String> nodeIds = typeToControlIdsMap.get(ControlType.NODE.getVal());
            // Filter the number of root nodes and logically deleted nodes
            vo.setNodeRoleCount(nodeMapper.countByNodeIds(nodeIds));
        }
        // Column Permissions
        List<String> controlIds = typeToControlIdsMap.get(ControlType.DATASHEET_FIELD.getVal());
        if (CollUtil.isEmpty(controlIds)) {
            return vo;
        }
        // How many column permissions in each table
        Map<String, Integer> counts = new HashMap<>(controlIds.size());
        // Get the table of column permissions
        List<String> dstIds = controlIds.stream()
                .map(controlId -> {
                    List<String> ids = StrSpliter.split(controlId, ControlIdBuilder.SYMBOL,
                                    0, true, true);
                    if (CollUtil.isNotEmpty(ids)) {
                        String dstId = ids.get(0);
                        counts.merge(dstId, 1, Integer::sum);
                        return dstId;
                    }
                    return controlId;
                })
                .distinct()
                .collect(Collectors.toList());
        // Table dst Ids in non recycle bin
        List<String> notRubbishedDstIds = nodeMapper.selectNodeIdByNodeIds(dstIds);
        int count;
        if (notRubbishedDstIds.size() == counts.size()) {
            count = controlIds.size();
        }
        else {
            count = notRubbishedDstIds.stream()
                    .map(counts::get)
                    .reduce(Integer::sum).orElse(0);
        }
        vo.setFieldRoleCount((long) count);
        return vo;
    }

    @Override
    public NodeStaticsVO getNodeStaticsBySpaceId(String spaceId) {
        return staticsMapper.selectNodeStaticsBySpaceId(spaceId);
    }

    @Override
    public List<NodeTypeStatics> getNodeTypeStaticsBySpaceId(String spaceId) {
        return staticsMapper.selectNodeTypeStaticsBySpaceId(spaceId);
    }

    @Override
    public DatasheetStaticsVO getDatasheetStaticsBySpaceId(String spaceId) {
        DatasheetStaticsVO viewVO = new DatasheetStaticsVO();
        List<String> objects = staticsMapper.selectDstViewStaticsBySpaceId(spaceId);
        if (CollUtil.isNotEmpty(objects)) {
            objects.stream()
                    .flatMap(o -> JSONUtil.parseArray(o).stream())
                    .collect(Collectors.groupingBy(Object::toString, Collectors.counting()))
                    .forEach((k, v) -> {
                        switch (k) {
                            case "2":
                                viewVO.setKanbanViews(v);
                                break;
                            case "3":
                                viewVO.setGalleryViews(v);
                                break;
                            case "5":
                                viewVO.setCalendarViews(v);
                                break;
                            case "6":
                                viewVO.setGanttViews(v);
                                break;
                        }
                    });
        }
        return viewVO;
    }
}
