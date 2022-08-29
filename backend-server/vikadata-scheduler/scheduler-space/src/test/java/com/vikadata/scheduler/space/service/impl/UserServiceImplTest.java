package com.vikadata.scheduler.space.service.impl;

import java.io.IOException;
import java.io.InputStream;

import javax.annotation.Resource;

import com.amazonaws.util.IOUtils;
import groovy.util.logging.Slf4j;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.AbstractIntegrationTest;
import com.vikadata.FileHelper;
import com.vikadata.scheduler.space.SchedulerSpaceApplication;
import com.vikadata.scheduler.space.mapper.integral.IntegralHistoryMapper;
import com.vikadata.scheduler.space.service.IUserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


/**
 * <p>
 *  v币数据清洗测试
 * <p>
 *
 * @author liuzijing
 * @date 2022/4/8 16:40
 */
@Disabled("no assertion")
@Slf4j
@SpringBootTest(classes = SchedulerSpaceApplication.class)
public class UserServiceImplTest extends AbstractIntegrationTest {

    @Resource
    private IUserService userService;

    @Resource
    private IntegralHistoryMapper integralHistoryMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void testIntegralCreated() throws IOException {
        String  resourceName = "testdata/integral-history-data.sql";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        String sql = IOUtils.toString(inputStream);
        jdbcTemplate.execute(sql);

        assertThat(integralHistoryMapper.selectIntegralCoverUser().size()).isEqualTo(1);
        userService.integralClean();
        assertThat(integralHistoryMapper.selectIntegralCoverUser().size()).isEqualTo(0);
    }
}