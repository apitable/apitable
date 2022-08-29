package com.vikadata.scheduler.space.service.impl;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;

import javax.annotation.Resource;

import cn.hutool.core.date.DateUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;

import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.scheduler.space.config.properties.ConfigProperties;
import com.vikadata.scheduler.space.mapper.integral.IntegralHistoryMapper;
import com.vikadata.scheduler.space.model.IntegralStaticsDto;
import com.vikadata.scheduler.space.service.IStaticsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 统计接口实现类
 * </p>
 *
 * @author Chambers
 * @date 2021/7/11
 */
@Service
public class StaticsServiceImpl implements IStaticsService {

    @Resource
    private IntegralHistoryMapper integralHistoryMapper;

    @Resource
    private ConfigProperties properties;

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @Override
    public void vCodeStatistics(String dstId) {
        LocalDateTime today = LocalDateTime.of(LocalDate.now(ZoneId.of("+8")), LocalTime.MIN);
        LocalDateTime yesterday = today.plusDays(-1);
        IntegralStaticsDto staticsDto = integralHistoryMapper.selectDto(yesterday, today);
        boolean exist = staticsDto != null;
        // 构建数据
        JSONObject data = JSONUtil.createObj();
        data.set("datetime", DateUtil.format(yesterday, "yyyy-MM-dd"));
        data.set("issuedAmount", exist ? staticsDto.getIssuedAmount() : 0);
        data.set("consumption", exist ? staticsDto.getConsumption() : 0);
        data.set("dimension", "daily");
        // 保存到维格表
        vikaOperations.saveStatisticsData(dstId, data.toString());
    }
}
