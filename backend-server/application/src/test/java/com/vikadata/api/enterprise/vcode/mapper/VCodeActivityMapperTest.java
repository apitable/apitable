package com.vikadata.api.enterprise.vcode.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.vcode.mapper.VCodeActivityMapper;
import com.vikadata.api.enterprise.vcode.vo.VCodeActivityPageVo;
import com.vikadata.api.enterprise.vcode.vo.VCodeActivityVo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 * VCode Activity Mapper Test
 * </p>
 */
@Disabled
public class VCodeActivityMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    VCodeActivityMapper vCodeActivityMapper;

    @Test
    @Sql("/testdata/code-activity-data.sql")
    void testSelectAllScene() {
        List<String> strings = vCodeActivityMapper.selectAllScene();
        assertThat(strings).isNotEmpty();
    }

    @Test
    @Sql("/testdata/code-activity-data.sql")
    void testSelectIdByScene() {
        Long id = vCodeActivityMapper.selectIdByScene("test");
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/testdata/code-activity-data.sql")
    void testCountById() {
        Integer count = vCodeActivityMapper.countById(41L);
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql("/testdata/code-activity-data.sql")
    void testSelectBaseInfo() {
        List<VCodeActivityVo> entities = vCodeActivityMapper.selectBaseInfo("test");
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql("/testdata/code-activity-data.sql")
    void testSelectDetailInfo() {
        IPage<VCodeActivityPageVo> entities = vCodeActivityMapper.selectDetailInfo(new Page<>(), "test", "ai41");
        assertThat(entities).isNotNull();
    }

    @Test
    @Sql({ "/testdata/code-activity-data.sql", "/testdata/wechat-mp-qrcode-data.sql"})
    void testCountQrCodeByIdAndAppId() {
        Integer count = vCodeActivityMapper.countQrCodeByIdAndAppId(41L, "wx41");
        assertThat(count).isEqualTo(1);
    }

}
