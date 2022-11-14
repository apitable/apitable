package com.vikadata.api.modular.user.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.user.mapper.UserHistoryMapper;
import com.vikadata.api.user.model.PausedUserHistoryDto;
import com.vikadata.api.user.entity.UserHistoryEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     Data access layer test: user history table test
 * </p>
 */
public class UserHistoryMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    UserHistoryMapper userHistoryMapper;

    @Test
    @Sql("/testdata/user-history-data.sql")
    void testSelectLatest() {
        UserHistoryEntity entity = userHistoryMapper.selectLatest(41L, 1);
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/user-history-data.sql")
    void testSelectUserHistoryDtos() {
        List<PausedUserHistoryDto> entities = userHistoryMapper.selectUserHistoryDtos(LocalDateTime.of(2020, 1, 1, 0, 0), LocalDateTime.now(), 1);
        assertThat(entities).isNotEmpty();
    }

}
