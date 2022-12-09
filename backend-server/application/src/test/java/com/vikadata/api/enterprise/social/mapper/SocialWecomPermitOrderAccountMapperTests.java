package com.vikadata.api.enterprise.social.mapper;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.social.enums.SocialCpIsvPermitActivateStatus;
import com.vikadata.api.enterprise.social.mapper.SocialWecomPermitOrderAccountMapper;
import com.vikadata.api.enterprise.social.entity.SocialWecomPermitOrderAccountEntity;

import org.springframework.test.context.jdbc.Sql;

/**
 * <p>
 * WeCom service provider interface license account information
 * </p>
 */
class SocialWecomPermitOrderAccountMapperTests extends AbstractMyBatisMapperTest {

    @Resource
    private SocialWecomPermitOrderAccountMapper socialWecomPermitOrderAccountMapper;

    @Test
    @Sql("/testdata/social-wecom-permit-order-account-data.sql")
    void selectByActiveCodesTest() {
        List<SocialWecomPermitOrderAccountEntity> accountEntities = socialWecomPermitOrderAccountMapper
                .selectByActiveCodes("wwxxx123", "wwcorpx123123", Arrays.asList("ac1", "ac2"));
        Assertions.assertTrue(CollUtil.isNotEmpty(accountEntities));
    }

    @Test
    @Sql("/testdata/social-wecom-permit-order-account-data.sql")
    void selectByExpireTimeTest() {
        LocalDateTime expireTime = LocalDateTime.of(2023, 7, 29, 19, 14, 9);
        List<SocialWecomPermitOrderAccountEntity> accountEntities = socialWecomPermitOrderAccountMapper
                .selectByExpireTime("wwxxx123", "wwcorpx123123", expireTime);
        Assertions.assertTrue(CollUtil.isNotEmpty(accountEntities));
    }

    @Test
    @Sql("/testdata/social-wecom-permit-order-account-data.sql")
    void selectActiveCodesTest() {
        List<String> activeCodes = socialWecomPermitOrderAccountMapper
                .selectActiveCodes("wwxxx123", "wwcorpx123123", null);
        Assertions.assertTrue(CollUtil.isNotEmpty(activeCodes));

        activeCodes = socialWecomPermitOrderAccountMapper
                .selectActiveCodes("wwxxx123", "wwcorpx123123",
                        Collections.singletonList(SocialCpIsvPermitActivateStatus.ACTIVATED.getValue()));
        Assertions.assertTrue(CollUtil.isNotEmpty(activeCodes));
    }

    @Test
    @Sql("/testdata/social-wecom-permit-order-account-data.sql")
    void selectActiveCodesByActiveCodesAndStatusTest() {
        List<String> activeCodes = socialWecomPermitOrderAccountMapper
                .selectActiveCodesByActiveCodesAndStatus("wwxxx123", "wwcorpx123123", Arrays.asList("ac1", "ac2"), null);
        Assertions.assertTrue(CollUtil.isNotEmpty(activeCodes));

        activeCodes = socialWecomPermitOrderAccountMapper
                .selectActiveCodesByActiveCodesAndStatus("wwxxx123", "wwcorpx123123", Arrays.asList("ac1", "ac2"),
                        Collections.singletonList(SocialCpIsvPermitActivateStatus.ACTIVATED.getValue()));
        Assertions.assertTrue(CollUtil.isNotEmpty(activeCodes));
    }

    @Test
    @Sql("/testdata/social-wecom-permit-order-account-data.sql")
    void selectCpUserIdsByStatusTest() {
        List<String> cpUserIds = socialWecomPermitOrderAccountMapper.selectCpUserIdsByStatus("wwxxx123", "wwcorpx123123",
                Collections.singletonList(SocialCpIsvPermitActivateStatus.ACTIVATED.getValue()));
        Assertions.assertTrue(CollUtil.isNotEmpty(cpUserIds));
    }

    @Test
    @Sql("/testdata/social-wecom-permit-order-account-data.sql")
    void updateActiveStatusByActiveCodesTest() {
        int result = socialWecomPermitOrderAccountMapper
                .updateActiveStatusByActiveCodes("wwxxx123", "wwcorpx123123", Arrays.asList("ac1", "ac2"),
                        SocialCpIsvPermitActivateStatus.EXPIRED.getValue());
        Assertions.assertNotEquals(0, result);
    }

}
