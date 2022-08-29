package com.vikadata.api.modular.statics.service.impl;

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

import com.vikadata.api.control.ControlIdBuilder;
import com.vikadata.api.control.ControlType;
import com.vikadata.api.modular.control.mapper.ControlMapper;
import com.vikadata.api.modular.control.model.ControlTypeDTO;
import com.vikadata.api.modular.statics.mapper.StaticsMapper;
import com.vikadata.api.modular.statics.model.ControlStaticsVO;
import com.vikadata.api.modular.statics.model.DatasheetStaticsVO;
import com.vikadata.api.modular.statics.model.NodeStaticsVO;
import com.vikadata.api.modular.statics.model.NodeTypeStatics;
import com.vikadata.api.modular.statics.service.IStaticsService;
import com.vikadata.api.modular.workspace.mapper.NodeMapper;
import com.vikadata.api.util.DateTool;
import com.vikadata.core.util.SqlTool;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.thymeleaf.util.ObjectUtils;

import static com.vikadata.api.constants.DateFormatConstants.YEARS_MONTH_PATTERN;
import static com.vikadata.define.constants.RedisConstants.GENERAL_STATICS;

/**
 * <p>
 * 统计接口实现类
 * </p>
 *
 * @author Chambers
 * @date 2021/6/18
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
        // 获取到昨天为止本月API用量
        Long apiUsageUntilYesterday = this.getCurrentMonthApiUsageUntilYesterday(spaceId);
        // 如果为NULL，说明API用量日统计表为空，则采取旧方法
        if (apiUsageUntilYesterday == null) {
            Long minId = this.getApiUsageTableMinId();
            // 本月最小表ID不存在，即没有调用记录
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
        // 获取今日API用量缓存
        SimpleDateFormat today = new SimpleDateFormat("yyyy-MM-dd");
        String todayKey = StrUtil.format(GENERAL_STATICS, "api" + today.format(new Date()), spaceId);
        Object apiUsageToday = redisTemplate.opsForValue().get(todayKey);
        if (apiUsageToday == null) {
            // 昨日API用量记录最大表ID
            Long yesterdayMaxId = staticsMapper.selectMaxIdByTime(today.format(DateUtil.yesterday()));
            // 获取今日API用量
            apiUsageToday = staticsMapper.countByIdGreaterThanAndSpaceId(yesterdayMaxId, spaceId);
            // 更新今日api用量缓存
            redisTemplate.opsForValue().set(todayKey, Long.valueOf(apiUsageToday.toString()), 2, TimeUnit.HOURS);
        }
        // 返回空间站今日API用量
        return Long.valueOf(apiUsageToday.toString());
    }

    @Override
    public Long getCurrentMonthApiUsageUntilYesterday(String spaceId) {
        // 如果是本月1号，则直接返回0
        if (ObjectUtil.equals(DateUtil.date(new Date()).getDate(), 1)) {
            return 0L;
        } else {
            // 获取今天以前本月API用量缓存
            SimpleDateFormat month = new SimpleDateFormat("yyyy-MM");
            String monthKey = StrUtil.format(GENERAL_STATICS, "api" + month.format(new Date()), spaceId);
            Object apiUsageBeforeToday = redisTemplate.opsForValue().get(monthKey);
            if (apiUsageBeforeToday != null) {
                return Long.valueOf(apiUsageBeforeToday.toString());
            }
            // 没有缓存，查询今日以前本月API用量
            SimpleDateFormat today = new SimpleDateFormat("yyyy-MM-dd");
            Long totalSum = staticsMapper.selectTotalSumBySpaceIdAndTimeBetween(spaceId, today.format(DateUtil.beginOfMonth(new Date())), today.format(DateUtil.yesterday()));
            if (totalSum == null) {
                return null;
            }
            // 更新今日以前本月API用量缓存
            redisTemplate.opsForValue().set(monthKey, totalSum, DateTool.todayTimeLeft(), TimeUnit.SECONDS);
            return totalSum;
        }
    }

    private Long getApiUsageTableMinId() {
        // 获取 API用量表 本月最小的ID
        LocalDateTime now = LocalDateTime.now();
        String key = StrUtil.format(GENERAL_STATICS, "api-usage-min-id", DateTool.formatFullTime(now, YEARS_MONTH_PATTERN));
        Long id = redisTemplate.opsForValue().get(key);
        if (id != null) {
            return id;
        }
        // 本月最小ID不存在，查询上个月的最小ID，减少查询量
        String lastMonthKey = StrUtil.format(GENERAL_STATICS, "api-usage-min-id",
                DateTool.formatFullTime(now.plusMonths(-1), YEARS_MONTH_PATTERN));
        Long lastMonthMinId = redisTemplate.opsForValue().get(lastMonthKey);
        // 若上个月的最小表ID也不存在，直接查询最大表ID
        if (lastMonthMinId == null) {
            id = staticsMapper.selectMaxId();
        }
        else {
            id = staticsMapper.selectApiUsageMinIdByCreatedAt(lastMonthMinId, DateTool.getStartTimeOfMonth());
        }
        // 保留当月缓存
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
        // 文件权限
        if (typeToControlIdsMap.containsKey(ControlType.NODE.getVal())) {
            List<String> nodeIds = typeToControlIdsMap.get(ControlType.NODE.getVal());
            // 过滤根节点和逻辑删除的节点数量
            vo.setNodeRoleCount(nodeMapper.countByNodeIds(nodeIds));
        }
        // 列权限
        List<String> controlIds = typeToControlIdsMap.get(ControlType.DATASHEET_FIELD.getVal());
        if (CollUtil.isEmpty(controlIds)) {
            return vo;
        }
        // 每张表中多少个列权限
        Map<String, Integer> counts = new HashMap<>(controlIds.size());
        // 获取列权限们所在的表
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
        // 非回收站中的表dstIds
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
