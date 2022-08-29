package com.vikadata.api.modular.organization.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.annotation.Resource;

import cn.hutool.core.collection.CollUtil;
import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.FileHelper;
import com.vikadata.api.model.vo.organization.SubUnitResultVo;
import com.vikadata.api.modular.organization.service.IOrganizationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *  组织单元 服务接口实现测试
 * <p>
 *
 * @author liuzijing
 * @date 2022/5/16 16:27
 */
public class OrganizationServiceImplTest extends AbstractIntegrationTest {

    @Resource
    private IOrganizationService iOrganizationService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void testLoadMemberFirstTeams() throws IOException {
        List<Long> teamIds = CollUtil.newArrayList(1279306279580438529L, 1342304314473648129L, 1236159916641619970L, 1283285207447699457L);
        String resourceName = "testdata/orgIsolated-vut-data.sql";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        String sql = IOUtils.toString(inputStream);
        jdbcTemplate.execute(sql);

        SubUnitResultVo subUnitResultVo = iOrganizationService.loadMemberFirstTeams("spczdmQDfBAn5", teamIds);
        assertThat(subUnitResultVo.getTeams().size()).isEqualTo(0);
    }
}
