package com.vikadata.api.space.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.space.mapper.SpaceInviteRecordMapper;
import com.vikadata.entity.SpaceInviteRecordEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author wuyitao
 * @date 2022/4/5 1:14 AM
 */
public class SpaceInviteRecordMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    SpaceInviteRecordMapper spaceInviteRecordMapper;

    @Test
    @Sql("/sql/space-invite-record-data.sql")
    void testSelectByInviteToken() {
        SpaceInviteRecordEntity entity = spaceInviteRecordMapper.selectByInviteToken("token");
        assertThat(entity).isNotNull();
    }

}
