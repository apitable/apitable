package com.vikadata.api.modular.vcode.mapper;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.dto.vcode.VCodeDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：V码系统-V码记录表测试
 * </p>
 *
 * @author wuyitao
 * @date 2022/4/5 5:38 PM
 */
@Disabled
public class VCodeUsageMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    VCodeUsageMapper vCodeUsageMapper;

    @Test
    @Sql("/testdata/code-usage-data.sql")
    void testCountByCodeAndType() {
        Integer count = vCodeUsageMapper.countByCodeAndType("41", 0, 41L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({ "/testdata/code-usage-data.sql", "/testdata/code-data.sql" })
    void testSelectInvitorUserId() {
        VCodeDTO entity = vCodeUsageMapper.selectInvitorUserId(41L);
        assertThat(entity).isNotNull();
    }

}
