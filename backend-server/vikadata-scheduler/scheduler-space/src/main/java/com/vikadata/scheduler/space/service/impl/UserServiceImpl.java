package com.vikadata.scheduler.space.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import javax.annotation.Resource;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xxl.job.core.context.XxlJobHelper;

import com.vikadata.define.dtos.PausedUserHistoryDto;
import com.vikadata.define.ros.PausedUserHistoryRo;
import com.vikadata.entity.IntegralHistoryEntity;
import com.vikadata.scheduler.space.config.properties.InternalProperties;
import com.vikadata.scheduler.space.mapper.integral.IntegralHistoryMapper;
import com.vikadata.scheduler.space.model.ResponseDataDto;
import com.vikadata.scheduler.space.service.IUserService;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class UserServiceImpl implements IUserService {

    @Resource
    private RestTemplate restTemplate;

    @Resource
    private InternalProperties internalProperties;

    @Resource
    private IntegralHistoryMapper integralHistoryMapper;

    @Override
    public void closePausedUser(int limitDays) {
        PausedUserHistoryRo ro = new PausedUserHistoryRo();
        ro.setLimitDays(limitDays);
        List<PausedUserHistoryDto> pausedUserHistoryDtos = getUserHistoryDto(ro);
        XxlJobHelper.log("冷静期账号数量：{}", pausedUserHistoryDtos.size());
        if (pausedUserHistoryDtos.size() == 0) {
            return;
        }
        AtomicInteger closeUserCount = new AtomicInteger();
        LocalDateTime now = LocalDateTime.now();
        pausedUserHistoryDtos.forEach(userHistoryDto -> {
            LocalDateTime toBeClosedDate = userHistoryDto.getCreatedAt().plusDays(limitDays)
                    .withHour(0).withMinute(0).withSecond(0);
            XxlJobHelper.log("{}-{} 的待关闭日期为：{}", userHistoryDto.getUserId()
                    , userHistoryDto.getNickName(), toBeClosedDate);
            if (now.isAfter(toBeClosedDate)) {
                XxlJobHelper.log("{}-{} 开始关闭账号...", userHistoryDto.getUserId(), userHistoryDto.getNickName());
                Boolean res = closeUserAccount(userHistoryDto.getUserId());
                closeUserCount.getAndIncrement();
                XxlJobHelper.log("{}-{} 账号关闭结果: {}", userHistoryDto.getUserId()
                        , userHistoryDto.getNickName(), res.toString());
            }
        });
        XxlJobHelper.log("结束, 关闭账号数量为：{}", closeUserCount.get());
    }

    @Override
    public void integralClean() {
        // 获取V币积分被覆盖用户
        List<Long> integralCoverUsers = integralHistoryMapper.selectIntegralCoverUser();

        for (Long integralCoverUser : integralCoverUsers) {
            // 查询当前用户的积分变更记录
            List<IntegralHistoryEntity> records = integralHistoryMapper.selectIntegralCoverUserRecordByUserId(integralCoverUser);
            int totalIntegral = 0;
            for (IntegralHistoryEntity record : records) {
                int originIntegral = totalIntegral;
                if (record.getAlterType() == 0) {
                    totalIntegral += record.getAlterIntegral();
                }
                else {
                    totalIntegral -= record.getAlterIntegral();
                }
                if (originIntegral != record.getOriginIntegral()) {
                    integralHistoryMapper.updateIntegralRecord(record.getId(), originIntegral, totalIntegral);
                }
                XxlJobHelper.log("userid: {} origin_integral: {} alter_type: {} alter_integral: {} total_integral: {}", record.getUserId(),
                        record.getOriginIntegral(), record.getAlterType(), record.getAlterIntegral(), record.getTotalIntegral());
            }
        }
    }

    private List<PausedUserHistoryDto> getUserHistoryDto(PausedUserHistoryRo ro) {
        String url = internalProperties.getDomain() + internalProperties.getGetPausedUserHistoryInfoURL();
        ResponseEntity<ResponseDataDto<List<PausedUserHistoryDto>>> responseEntity =
                restTemplate.exchange(
                        url,
                        HttpMethod.POST,
                        new HttpEntity<>(ro),
                        new ParameterizedTypeReference<ResponseDataDto<List<PausedUserHistoryDto>>>() {}
                );
        List<PausedUserHistoryDto> historyDtos = new ObjectMapper().convertValue(responseEntity.getBody().getData()
                , new TypeReference<List<PausedUserHistoryDto>>() {});
        return historyDtos;
    }

    private Boolean closeUserAccount(Long userId) {
        String url = internalProperties.getDomain() + internalProperties.getClosePausedUserURL().replace("{userId}", String.valueOf(userId));
        ResponseEntity<ResponseDataDto> response = restTemplate.postForEntity(url, null, ResponseDataDto.class);
        ResponseEntity<ResponseDataDto<Boolean>> responseEntity =
                restTemplate.exchange(
                        url,
                        HttpMethod.POST,
                        null,
                        new ParameterizedTypeReference<ResponseDataDto<Boolean>>() {}
                );
        return response.getBody().getSuccess();
    }
}
