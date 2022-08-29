package com.vikadata.api.modular.vcode.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.vo.vcode.VCodePageVo;
import com.vikadata.entity.CodeEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：V码系统-V码表测试
 * </p>
 * @author wuyitao
 * @date 2022/4/5 5:38 PM
 */
@Disabled
public class VCodeMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    VCodeMapper vCodeMapper;

    @Test
    @Sql("/testdata/code-data.sql")
    void testCountByCode() {
        Integer count = vCodeMapper.countByCode("41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/code-data.sql")
    void testSelectByCode() {
        CodeEntity entity = vCodeMapper.selectByCode("41");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql("/testdata/code-data.sql")
    void testSelectAvailableTimesByCode() {
        Integer time = vCodeMapper.selectAvailableTimesByCode("41");
        assertThat(time).isEqualTo(-1);
    }

    @Test
    @Sql("/testdata/code-data.sql")
    void testSelectCodeByTypeAndRefId() {
        String code = vCodeMapper.selectCodeByTypeAndRefId(1, 1L);
        assertThat(code).isEqualTo("41");
    }

    @Test
    @Sql("/testdata/code-data.sql")
    void testSelectTypeByCode() {
        Integer type = vCodeMapper.selectTypeByCode("41");
        assertThat(type).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/code-data.sql")
    void testCountByActivityId() {
        Integer count = vCodeMapper.countByActivityId(1L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/code-data.sql")
    void testGetAvailableCode() {
        List<String> codes = vCodeMapper.getAvailableCode(1L);
        assertThat(codes).isNotEmpty();
    }

    @Test
    @Sql({ "/testdata/code-data.sql", "/testdata/code-usage-data.sql" })
    void testGetAcquiredCode() {
        String code = vCodeMapper.getAcquiredCode(1L, 41L);
        assertThat(code).isEqualTo("41");
    }

    @Test
    @Sql("/testdata/code-data.sql")
    void testSelectDetailInfo() {
        IPage<VCodePageVo> entities = vCodeMapper.selectDetailInfo(new Page<>(), 0, 41L);
        assertThat(entities).isNotNull();
    }

    @Test
    @Sql({ "/testdata/code-data.sql", "/testdata/code-coupon-template-data.sql" })
    void testSelectIntegral() {
        Integer count = vCodeMapper.selectIntegral("45");
        assertThat(count).isEqualTo(100);
    }

}
