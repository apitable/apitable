package com.vikadata.api.enterprise.social.mapper;

import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.social.enums.SocialCpIsvPermitDelayProcessStatus;
import com.vikadata.api.enterprise.social.enums.SocialCpIsvPermitDelayType;
import com.vikadata.api.enterprise.social.entity.SocialWecomPermitDelayEntity;

import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * WeCom service provider interface permission delay task processing information
 * </p>
 */
class SocialWecomPermitDelayMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private SocialWecomPermitDelayMapper socialWecomPermitDelayMapper;

    @Test
    @Sql("/enterprise/sql/social-wecom-permit-delay-data.sql")
    void selectByProcessStatusesTest() {
        List<SocialWecomPermitDelayEntity> delayEntities = socialWecomPermitDelayMapper.selectByProcessStatuses("wwxxx123", "wwcorpx123123",
                SocialCpIsvPermitDelayType.NOTIFY_BEFORE_TRIAL_EXPIRED.getValue(),
                Collections.singletonList(SocialCpIsvPermitDelayProcessStatus.PENDING.getValue()));
        Assertions.assertTrue(CollUtil.isNotEmpty(delayEntities));
    }

    @Test
    @Sql("/enterprise/sql/social-wecom-permit-delay-data.sql")
    void selectBySuiteIdAndProcessStatusTest() {
        List<SocialWecomPermitDelayEntity> delayEntities = socialWecomPermitDelayMapper.selectBySuiteIdAndProcessStatus("wwxxx123",
                SocialCpIsvPermitDelayProcessStatus.PENDING.getValue(), 1, 1);
        Assertions.assertTrue(CollUtil.isNotEmpty(delayEntities));
    }

}
