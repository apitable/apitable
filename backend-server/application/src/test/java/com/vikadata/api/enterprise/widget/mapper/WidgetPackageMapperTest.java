package com.vikadata.api.enterprise.widget.mapper;

import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.enterprise.widget.mapper.WidgetPackageMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @author wuyitao
 * @date 2022/4/6 2:46 PM
 */
public class WidgetPackageMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    WidgetPackageMapper widgetPackageMapper;


    @Test
    @Sql("/testdata/widget-package-data.sql")
    void givenWidgetBodyWhenUpdateWidgetPackageThen() {
        int count = widgetPackageMapper.updateWidgetBodyById(41L, "{}");
        assertThat(count).isEqualTo(1);
    }

    //
    // @Test
    // @Sql("")
    // void testSelectWidgetStoreList() {
    //     widgetPackageMapper.selectWidgetStoreList();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("")
    // void testSelectByPackageIdsIncludeDelete() {
    //     widgetPackageMapper.selectByPackageIdsIncludeDelete();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("")
    // void testSelectIdByPackageId() {
    //     widgetPackageMapper.selectIdByPackageId();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("")
    // void testSelectStatusByPackageId() {
    //     widgetPackageMapper.selectStatusByPackageId();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("")
    // void testCountNumByPackageId() {
    //     widgetPackageMapper.countNumByPackageId();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("")
    // void testSelectWidgetByPackageId() {
    //     widgetPackageMapper.selectWidgetByPackageId();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("")
    // void testSelectWidgetStatusByPackageId() {
    //     widgetPackageMapper.selectWidgetStatusByPackageId();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("")
    // void testSelectWidgetPackageInfoByPackageIdOrSpaceId() {
    //     widgetPackageMapper.selectWidgetPackageInfoByPackageIdOrSpaceId();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("")
    // void testSelectWidgetTemplatePackageList() {
    //     widgetPackageMapper.selectWidgetTemplatePackageList();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("")
    // void testSelectWidgetSpaceBy() {
    //     widgetPackageMapper.selectWidgetSpaceBy();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("")
    // void testSelectMaxWidgetSort() {
    //     widgetPackageMapper.selectMaxWidgetSort();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("")
    // void testSelectGlobalWidgetSort() {
    //     widgetPackageMapper.selectGlobalWidgetSort();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("")
    // void testCountByIssuedIdArchive() {
    //     widgetPackageMapper.countByIssuedIdArchive();
    //     assertThat();
    // }
    //
    //
    // @Test
    // @Sql("")
    // void testCountByAuditSubmitResultArchive() {
    //     widgetPackageMapper.countByAuditSubmitResultArchive();
    //     assertThat();
    // }
    //
    // @Test
    // @Sql("")
    // void testSelectByFatherWidgetIdAndVersion() {
    //     widgetPackageMapper.selectByFatherWidgetIdAndVersion();
    //     assertThat();
    // }
}
