package com.vikadata.scheduler.space.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.Resource;

import com.amazonaws.util.IOUtils;
import groovy.util.logging.Slf4j;
import org.junit.jupiter.api.Test;

import com.vikadata.AbstractIntegrationTest;
import com.vikadata.FileHelper;
import com.vikadata.scheduler.space.SchedulerSpaceApplication;
import com.vikadata.scheduler.space.mapper.developer.ApiStatisticsMapper;
import com.vikadata.scheduler.space.model.SpaceApiUsageDto;
import com.vikadata.scheduler.space.service.IApiStatisticsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

/**
 * <p>
 *  API统计服务测试
 * <p>
 *
 * @author liuzijing
 * @date 2022/5/26
 */
@Slf4j
@SpringBootTest(classes = SchedulerSpaceApplication.class)
public class ApiStatisticsServiceImplTest  extends AbstractIntegrationTest {

    @Resource
    private ApiStatisticsMapper apiStatisticsMapper;

    @Resource
    private IApiStatisticsService apiStatisticsService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void SyncApiUsageDailyData(){
        List<SpaceApiUsageDto> spaceApiUsageDtoList = new ArrayList<>();
        SpaceApiUsageDto spaceApiUsageDto = new SpaceApiUsageDto();
        spaceApiUsageDto.setSpaceId("spc4fjVmXhzs1");
        spaceApiUsageDto.setStatisticsTime("2022-05-27");
        spaceApiUsageDto.setTotalCount(100L);
        spaceApiUsageDto.setSuccessCount(99L);
        spaceApiUsageDtoList.add(spaceApiUsageDto);

        assertThat(apiStatisticsMapper.selectLastApiUsageDailyRecord()).isNull();
        apiStatisticsService.syncApiUsageDailyData(spaceApiUsageDtoList);
        assertThat(apiStatisticsMapper.selectLastApiUsageDailyRecord()).isNotNull();
    }

    @Test
    void SyncApiUsageMonthlyData(){
        List<SpaceApiUsageDto> spaceApiUsageDtoList = new ArrayList<>();
        SpaceApiUsageDto spaceApiUsageDto = new SpaceApiUsageDto();
        spaceApiUsageDto.setSpaceId("spc4fjVmXhzs1");
        spaceApiUsageDto.setStatisticsTime("2022-05");
        spaceApiUsageDto.setTotalCount(100L);
        spaceApiUsageDto.setSuccessCount(99L);
        spaceApiUsageDtoList.add(spaceApiUsageDto);

        assertThat(apiStatisticsMapper.selectLastApiUsageMonthlyRecord()).isNull();
        apiStatisticsService.syncApiUsageMonthlyData(spaceApiUsageDtoList);
        assertThat(apiStatisticsMapper.selectLastApiUsageMonthlyRecord()).isNotNull();
    }

    @Test
    void spaceApiUsageDailyStatistics() throws IOException {
        String  resourceName = "testdata/api-usage-statistics-data.sql";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        String sql = IOUtils.toString(inputStream);
        jdbcTemplate.execute(sql);

        assertThat(apiStatisticsMapper.selectLastApiUsageDailyRecord()).isNull();
        apiStatisticsService.spaceApiUsageDailyStatistics();
        assertThat(apiStatisticsMapper.selectLastApiUsageDailyRecord()).isNotNull();
    }

    @Test
    void spaceApiUsageMonthlyStatistics() throws ParseException, IOException {
        String  resourceName = "testdata/api-usage-statistics-data.sql";
        InputStream inputStream = FileHelper.getInputStreamFromResource(resourceName);
        String sql = IOUtils.toString(inputStream);
        jdbcTemplate.execute(sql);

        assertThat(apiStatisticsMapper.selectLastApiUsageMonthlyRecord()).isNull();
        apiStatisticsService.spaceApiUsageMonthlyStatistics();
        assertThat(apiStatisticsMapper.selectLastApiUsageMonthlyRecord()).isNotNull();
    }
}
