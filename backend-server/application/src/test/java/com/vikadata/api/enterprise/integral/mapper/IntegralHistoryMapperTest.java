package com.vikadata.api.enterprise.integral.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.user.vo.IntegralRecordVO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

public class IntegralHistoryMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    IntegralHistoryMapper historyMapper;

    @Test
    @Sql("/enterprise/sql/integral-history-data.sql")
    void testSelectTotalIntegralValueByUserId() {
        Integer count = historyMapper.selectTotalIntegralValueByUserId(1306146059515744257L);
        assertThat(count).isEqualTo(1000);
    }

    @Test
    @Sql("/enterprise/sql/integral-history-data.sql")
    void testSelectPageByUserId() {
        IPage<IntegralRecordVO> page = historyMapper.selectPageByUserId(new Page<>(), 1306146059515744257L);
        assertThat(page.getTotal()).isEqualTo(1);
    }
    @Test
    @Sql("/enterprise/sql/integral-history-data.sql")
    void testSelectCountByUserIdAndKeyValue() {
        Integer count = historyMapper.selectCountByUserIdAndKeyValue(1306146059515744257L, "key", "value");
        assertThat(count).isEqualTo(1);
    }
    @Test
    @Sql("/enterprise/sql/integral-history-data.sql")
    void testCountUserHistoryNum() {
        historyMapper.selectCountByUserIdAndActionCode(1306146059515744257L, "be_invited_to_reward");
    }

}
