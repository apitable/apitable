package com.vikadata.api.modular.developer.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.entity.DeveloperEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p> 
 * 数据访问层测试：开发者表测试
 * </p> 
 * @author Shawn Deng 
 * @date 2022/3/30 11:28
 */
class DeveloperMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    private DeveloperMapper developerMapper;

    @Test
    @Sql("/testdata/developer-data.sql")
    void testSelectByUserId() {
        DeveloperEntity entity = developerMapper.selectByUserId(1405421703738732546L);
        assertThat(entity).isNotNull();
        assertThat(entity.getApiKey()).isEqualTo("usk7NTaCamudhiVOCqulStD");
    }

    @Test
    @Sql("/testdata/developer-data.sql")
    void testSelectUserIdByApiKey() {
        Long id = developerMapper.selectUserIdByApiKey("usk9kp7HhcILVhr2V2PfyQW");
        assertThat(id).isEqualTo(1373841089819181057L);
    }
}