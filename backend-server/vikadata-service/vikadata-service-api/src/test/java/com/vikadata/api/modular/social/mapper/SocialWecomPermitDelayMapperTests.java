package com.vikadata.api.modular.social.mapper;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.modular.social.enums.SocialCpIsvPermitDelayProcessStatus;
import com.vikadata.api.modular.social.enums.SocialCpIsvPermitDelayType;
import com.vikadata.entity.SocialWecomPermitDelayEntity;

import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * 企微服务商接口许可延时任务处理信息
 * </p>
 * @author 刘斌华
 * @date 2022-08-01 16:55:33
 */
class SocialWecomPermitDelayMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private SocialWecomPermitDelayMapper socialWecomPermitDelayMapper;

    @Test
    @Sql("/testdata/social-wecom-permit-delay-data.sql")
    void selectByProcessStatusesTest() {
        List<SocialWecomPermitDelayEntity> delayEntities = socialWecomPermitDelayMapper.selectByProcessStatuses("wwxxx123", "wwcorpx123123",
                SocialCpIsvPermitDelayType.NOTIFY_BEFORE_TRIAL_EXPIRED.getValue(),
                Collections.singletonList(SocialCpIsvPermitDelayProcessStatus.PENDING.getValue()));
        Assertions.assertTrue(CollUtil.isNotEmpty(delayEntities));
    }

    @Test
    @Sql("/testdata/social-wecom-permit-delay-data.sql")
    void selectBySuiteIdAndProcessStatusTest() {
        List<SocialWecomPermitDelayEntity> delayEntities = socialWecomPermitDelayMapper.selectBySuiteIdAndProcessStatus("wwxxx123",
                SocialCpIsvPermitDelayProcessStatus.PENDING.getValue(), 1, 1);
        Assertions.assertTrue(CollUtil.isNotEmpty(delayEntities));
    }

}
