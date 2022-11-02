package com.vikadata.scheduler.space.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicInteger;

import javax.annotation.Resource;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xxl.job.core.context.XxlJobHelper;

import com.vikadata.scheduler.space.model.PausedUserHistoryDto;
import com.vikadata.scheduler.space.model.PausedUserHistoryRo;
import com.vikadata.entity.IntegralHistoryEntity;
import com.vikadata.scheduler.space.config.properties.InternalProperties;
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

    @Override
    public void closePausedUser(int limitDays) {
        PausedUserHistoryRo ro = new PausedUserHistoryRo();
        ro.setLimitDays(limitDays);
        List<PausedUserHistoryDto> pausedUserHistoryDtos = getUserHistoryDto(ro);
        XxlJobHelper.log("Number of accounts with cooling-off period: {}", pausedUserHistoryDtos.size());
        if (pausedUserHistoryDtos.size() == 0) {
            return;
        }
        AtomicInteger closeUserCount = new AtomicInteger();
        LocalDateTime now = LocalDateTime.now();
        pausedUserHistoryDtos.forEach(userHistoryDto -> {
            LocalDateTime toBeClosedDate = userHistoryDto.getCreatedAt().plusDays(limitDays)
                    .withHour(0).withMinute(0).withSecond(0);
            XxlJobHelper.log("{}-{}. The pending closing date is: {}", userHistoryDto.getUserId()
                    , userHistoryDto.getNickName(), toBeClosedDate);
            if (now.isAfter(toBeClosedDate)) {
                XxlJobHelper.log("{}-{}. Start closing account.", userHistoryDto.getUserId(), userHistoryDto.getNickName());
                Boolean res = closeUserAccount(userHistoryDto.getUserId());
                closeUserCount.getAndIncrement();
                XxlJobHelper.log("{}-{}. Account Closing Results: {}", userHistoryDto.getUserId()
                        , userHistoryDto.getNickName(), res.toString());
            }
        });
        XxlJobHelper.log("End. The number of closed accounts is {}", closeUserCount.get());
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
        return new ObjectMapper().convertValue(Objects.requireNonNull(responseEntity.getBody()).getData()
                , new TypeReference<List<PausedUserHistoryDto>>() {});
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
        return Objects.requireNonNull(response.getBody()).getSuccess();
    }
}
