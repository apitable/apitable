package com.vikadata.api.modular.organization.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractIntegrationTest;
import com.vikadata.api.FileHelper;
import com.vikadata.api.model.vo.organization.TeamTreeVo;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *  组织架构-部门表 服务实现类测试
 * <p>
 *
 * @author liuzijing
 * @date 2022/5/16 16:49
 */
public class TeamServiceImplTest extends AbstractIntegrationTest {

    @Test
    void testGetMemberTeamTree() throws IOException {
        List<Long> teamIds = CollUtil.newArrayList(1279306279580438529L, 1342304314473648129L, 1236159916641619970L, 1283285207447699457L);
        String resourceName = "testdata/orgIsolated-vut-data.sql";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        String sql = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        jdbcTemplate.execute(sql);

        List<TeamTreeVo> treeVos = iTeamService.getMemberTeamTree("spczdmQDfBAn5", teamIds);
        assertThat(treeVos.size()).isEqualTo(3);
    }

    @Test
    void testGetMemberAllTeamsVO() throws IOException {
        List<Long> teamIds = CollUtil.newArrayList(1279306279580438529L, 1342304314473648129L, 1236159916641619970L, 1283285207447699457L);
        String resourceName = "testdata/orgIsolated-vut-data.sql";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        String sql = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        jdbcTemplate.execute(sql);

        List<TeamTreeVo> treeVos = iTeamService.getMemberAllTeamsVO("spczdmQDfBAn5", teamIds);
        assertThat(treeVos.size()).isEqualTo(9);
    }

    @Test
    void testBuild() throws IOException {
        String resourceName = "testdata/orgIsolated-vut-data.sql";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        String sql = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        jdbcTemplate.execute(sql);

        List<TeamTreeVo> treeVos = iTeamService.build("spczdmQDfBAn5", 1279306279580438529L);
        assertThat(treeVos.size()).isEqualTo(13);
    }

    @Test
    void testBuildTree() throws IOException {
        List<Long> teamIds = CollUtil.newArrayList(1279306279580438529L, 1342304314473648129L, 1236159916641619970L, 1283285207447699457L);
        String resourceName = "testdata/orgIsolated-vut-data.sql";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        String sql = IOUtils.toString(inputStream, StandardCharsets.UTF_8);
        jdbcTemplate.execute(sql);

        List<TeamTreeVo> treeVos = iTeamService.buildTree("spczdmQDfBAn5", teamIds);
        assertThat(treeVos.size()).isEqualTo(4);
    }
}

