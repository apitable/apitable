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

package com.apitable.space.service.impl;

import static com.apitable.core.constants.RedisConstants.GENERAL_STATICS;
import static com.apitable.shared.constants.DateFormatConstants.YEARS_MONTH_PATTERN;
import static java.time.temporal.TemporalAdjusters.firstDayOfMonth;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.text.StrSpliter;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.apitable.control.infrastructure.ControlIdBuilder;
import com.apitable.control.infrastructure.ControlType;
import com.apitable.control.mapper.ControlMapper;
import com.apitable.control.model.ControlTypeDTO;
import com.apitable.core.constants.RedisConstants;
import com.apitable.core.util.SqlTool;
import com.apitable.shared.util.DateHelper;
import com.apitable.space.dto.ControlStaticsDTO;
import com.apitable.space.dto.DatasheetStaticsDTO;
import com.apitable.space.dto.NodeStaticsDTO;
import com.apitable.space.dto.NodeTypeStaticsDTO;
import com.apitable.space.mapper.StaticsMapper;
import com.apitable.space.service.IStaticsService;
import com.apitable.workspace.enums.ViewType;
import com.apitable.workspace.mapper.NodeMapper;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * <p>
 * Statics interface implementation class.
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

    @Value("${SKIP_USAGE_VERIFICATION:false}")
    private Boolean skipUsageVerification;

    @Override
    public long getCurrentMonthApiUsage(String spaceId) {
        if (Boolean.TRUE.equals(skipUsageVerification)) {
            return 0;
        }
        // Get the API usage of this month up to yesterday
        Long apiUsageUntilYesterday = this.getCurrentMonthApiUsageUntilYesterday(spaceId);
        // If it is NULL, it indicates that the daily API usage statistics table is empty, and the old method is adopted
        if (apiUsageUntilYesterday == null) {
            return this.getCurrentMonthApiUsageWithCache(spaceId);
        } else {
            return apiUsageUntilYesterday + this.getTodayApiUsage(spaceId);
        }
    }

    @Override
    public Long getTodayApiUsage(String spaceId) {
        // Get today's API usage cache
        SimpleDateFormat today = new SimpleDateFormat("yyyy-MM-dd");
        String todayKey =
            StrUtil.format(GENERAL_STATICS, "api" + today.format(new Date()), spaceId);
        Object apiUsageToday = redisTemplate.opsForValue().get(todayKey);
        if (apiUsageToday == null) {
            // Maximum table ID of yesterday's API usage record
            Long yesterdayMaxId =
                staticsMapper.selectMaxIdByTime(today.format(DateUtil.yesterday()));
            // Get today's API usage
            apiUsageToday = staticsMapper.countByIdGreaterThanAndSpaceId(yesterdayMaxId, spaceId);
            // Update today's api usage cache
            redisTemplate.opsForValue()
                .set(todayKey, Long.valueOf(apiUsageToday.toString()), 2, TimeUnit.HOURS);
        }
        // Return to the space station today's API usage
        return Long.valueOf(apiUsageToday.toString());
    }

    @Override
    public Long getCurrentMonthApiUsageUntilYesterday(String spaceId) {
        // If it is the first day of this month, 0 will be returned directly
        if (ObjectUtil.equals(LocalDateTime.now().getDayOfMonth(), 1)) {
            return 0L;
        } else {
            // Get the API usage cache of this month before today
            SimpleDateFormat month = new SimpleDateFormat("yyyy-MM");
            String monthKey =
                StrUtil.format(GENERAL_STATICS, "api" + month.format(new Date()), spaceId);
            Object apiUsageBeforeToday = redisTemplate.opsForValue().get(monthKey);
            if (apiUsageBeforeToday != null) {
                return Long.valueOf(apiUsageBeforeToday.toString());
            }
            // No cache. Query the API usage in this month before today
            SimpleDateFormat today = new SimpleDateFormat("yyyy-MM-dd");
            Long totalSum = staticsMapper.selectTotalSumBySpaceIdAndTimeBetween(spaceId,
                today.format(DateUtil.beginOfMonth(new Date())),
                today.format(DateUtil.yesterday()));
            if (totalSum == null) {
                return null;
            }
            // Update the API usage cache of this month before today
            redisTemplate.opsForValue()
                .set(monthKey, totalSum, DateHelper.todayTimeLeft(), TimeUnit.SECONDS);
            return totalSum;
        }
    }

    private Long getCurrentMonthApiUsageWithCache(String spaceId) {
        Long minId = this.getApiUsageTableMinId();
        // The minimum table ID of this month does not exist, that is, there is no call record
        if (minId == null) {
            return 0L;
        }
        // Get today's API usage cache
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        String cacheKey =
            StrUtil.format(GENERAL_STATICS, "api-" + format.format(new Date()), spaceId);
        Object apiUsageToday = redisTemplate.opsForValue().get(cacheKey);
        if (apiUsageToday == null) {
            apiUsageToday = staticsMapper.countApiUsageBySpaceId(spaceId, minId);
            redisTemplate.opsForValue()
                .set(cacheKey, Long.valueOf(apiUsageToday.toString()), 2, TimeUnit.HOURS);
        }
        return Long.valueOf(apiUsageToday.toString());
    }

    private Long getApiUsageTableMinId() {
        // Get the minimum ID of the API consumption table this month
        LocalDateTime now = LocalDateTime.now();
        String key = StrUtil.format(GENERAL_STATICS, "api-usage-min-id",
            DateHelper.formatFullTime(now, YEARS_MONTH_PATTERN));
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
        } else {
            LocalDateTime startDayOfMonth = now.with(firstDayOfMonth());
            id = staticsMapper.selectApiUsageMinIdByCreatedAt(lastMonthMinId, startDayOfMonth);
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
        Long recordCount = getDatasheetRecordTotalCountBySpaceIdFromCache(spaceId);
        if (null != recordCount) {
            return recordCount;
        }
        recordCount = SqlTool.retCount(staticsMapper.countRecordsBySpaceId(spaceId));
        // save in cache
        redisTemplate.opsForValue()
            .setIfAbsent(RedisConstants.getGeneralStaticsOfRecordKey(spaceId), recordCount, 1L,
                TimeUnit.HOURS);
        return recordCount;
    }

    @Override
    public Long getDatasheetRecordTotalCountBySpaceIdFromCache(String spaceId) {
        Object value = redisTemplate.opsForValue()
            .get(RedisConstants.getGeneralStaticsOfRecordKey(spaceId));
        if (null != value) {
            return Long.valueOf(value.toString());
        }
        return null;
    }

    @Override
    public long getTotalFileSizeBySpaceId(String spaceId) {
        List<Integer> fileSizes = staticsMapper.selectFileSizeBySpaceId(spaceId);
        return fileSizes.stream().filter(Objects::nonNull).mapToLong(Integer::intValue).sum();
    }

    @Override
    public ControlStaticsDTO getFieldRoleTotalCountBySpaceId(String spaceId) {
        ControlStaticsDTO vo = new ControlStaticsDTO(0L, 0L);
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
        } else {
            count = notRubbishedDstIds.stream()
                .map(counts::get)
                .reduce(Integer::sum).orElse(0);
        }
        vo.setFieldRoleCount((long) count);
        return vo;
    }

    @Override
    public NodeStaticsDTO getNodeStaticsBySpaceId(String spaceId) {
        return staticsMapper.selectNodeStaticsBySpaceId(spaceId);
    }

    @Override
    public List<NodeTypeStaticsDTO> getNodeTypeStaticsBySpaceId(String spaceId) {
        return staticsMapper.selectNodeTypeStaticsBySpaceId(spaceId);
    }

    @Override
    public DatasheetStaticsDTO getDatasheetStaticsBySpaceId(String spaceId) {
        DatasheetStaticsDTO viewCacheVo = getDatasheetStaticsBySpaceIdFromCache(spaceId);
        if (null != viewCacheVo) {
            return viewCacheVo;
        }
        DatasheetStaticsDTO viewVO = new DatasheetStaticsDTO();
        List<String> objects = staticsMapper.selectDstViewStaticsBySpaceId(spaceId);
        if (CollUtil.isNotEmpty(objects)) {
            objects.stream()
                .flatMap(o -> JSONUtil.parseArray(o).stream())
                .collect(Collectors.groupingBy(Object::toString, Collectors.counting()))
                .forEach((k, v) -> {
                    ViewType viewType = ViewType.of(Integer.parseInt(k));
                    if (null != viewType) {
                        switch (viewType) {
                            case KANBAN:
                                viewVO.setKanbanViews(v);
                                break;
                            case GALLERY:
                                viewVO.setGalleryViews(v);
                                break;
                            case CALENDAR:
                                viewVO.setCalendarViews(v);
                                break;
                            case GANTT:
                                viewVO.setGanttViews(v);
                                break;
                            default:
                                break;
                        }
                    }
                });
        }
        setDatasheetStaticsBySpaceIdToCache(spaceId, viewVO);
        return viewVO;
    }

    @Override
    public DatasheetStaticsDTO getDatasheetStaticsBySpaceIdFromCache(String spaceId) {
        String key = RedisConstants.getGeneralStaticsOfViewKey(spaceId);
        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            Map<Object, Object> entries = redisTemplate.boundHashOps(key).entries();
            if (null == entries) {
                return null;
            }
            return DatasheetStaticsDTO.mapToBean(entries);
        }
        return null;
    }

    @Override
    public void setDatasheetStaticsBySpaceIdToCache(String spaceId, DatasheetStaticsDTO viewVo) {
        String key = RedisConstants.getGeneralStaticsOfViewKey(spaceId);
        redisTemplate.opsForHash().putAll(key, viewVo.toMap());
        redisTemplate.boundValueOps(key).expire(1L, TimeUnit.HOURS);
    }

    @Override
    public void updateDatasheetViewCountStaticsBySpaceId(String spaceId,
                                                         Map<Integer, Long> viewCount) {
        if (null == viewCount) {
            return;
        }
        String cacheKey = RedisConstants.getGeneralStaticsOfViewKey(spaceId);
        if (!Boolean.TRUE.equals(redisTemplate.hasKey(cacheKey))) {
            log.warn("ViewStatisticCacheNotFound:{}", cacheKey);
            return;
        }
        for (Integer subKey : viewCount.keySet()) {
            Object value = redisTemplate.opsForHash().get(cacheKey, subKey);
            if (null != value) {
                // increment not serialization
                redisTemplate.opsForHash()
                    .put(cacheKey, subKey,
                        Long.parseLong(value.toString()) + viewCount.get(subKey));
            } else {
                log.warn("ViewStatisticCacheNotFound:{}:{}", cacheKey, subKey);
            }
        }
    }

    @Override
    public void updateDatasheetRecordCountStaticsBySpaceId(String spaceId, Long count) {
        if (null == count) {
            return;
        }
        String key = RedisConstants.getGeneralStaticsOfRecordKey(spaceId);
        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            redisTemplate.opsForValue().increment(key, count);
        } else {
            log.warn("RecordStatisticCacheNotFound:{}", key);
        }
    }

    @Override
    public void deleteDatasheetRecordCountStatistics(String spaceId) {
        String key = RedisConstants.getGeneralStaticsOfRecordKey(spaceId);
        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            redisTemplate.delete(key);
        }
    }
}
