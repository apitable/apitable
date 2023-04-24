package com.apitable.widget.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.widget.dto.LastSubmitWidgetVersionDTO;
import com.apitable.widget.entity.WidgetPackageReleaseEntity;
import com.apitable.widget.ro.WidgetStoreListRo;
import com.apitable.widget.vo.WidgetReleaseListVo;
import com.apitable.widget.vo.WidgetStoreListInfo;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class WidgetPackageReleaseMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    WidgetPackageReleaseMapper widgetPackageReleaseMapper;

    @Test
    @Sql("/sql/widget-package-release-data.sql")
    void testSelectReleaseShaToId() {
        Long id = widgetPackageReleaseMapper.selectReleaseShaToId("41", 0);
        assertThat(id).isEqualTo(41L);
    }

    @Test
    @Sql("/sql/widget-package-release-data.sql")
    void testSelectReleasePage() {
        IPage<WidgetReleaseListVo> page =
            widgetPackageReleaseMapper.selectReleasePage(new Page<>(), "wpk41");
        assertThat(page.getTotal()).isEqualTo(1);
    }

    @Test
    @Sql({"/sql/widget-package-auth-space-data.sql",
        "/sql/widget-package-data.sql"
        , "/sql/widget-package-release-data.sql"})
    void testSelectWaitReviewWidgetList() {
        List<WidgetStoreListInfo> entities =
            widgetPackageReleaseMapper.selectWaitReviewWidgetList(new WidgetStoreListRo());
        assertThat(entities).isNotEmpty();
    }

    @Test
    @Sql({"/sql/widget-package-auth-space-data.sql",
        "/sql/widget-package-data.sql"
        , "/sql/widget-package-release-data.sql"})
    void testSelectLastWidgetVersionInfoByFatherWidgetId() {
        LastSubmitWidgetVersionDTO entity =
            widgetPackageReleaseMapper.selectLastWidgetVersionInfoByFatherWidgetId("wi0");
        assertThat(entity).isNotNull();
    }

    @Test
    @Sql({"/sql/widget-package-data.sql",
        "/sql/widget-package-release-data.sql"})
    void testSelectByFatherWidgetIdAndVersion() {
        WidgetPackageReleaseEntity entity =
            widgetPackageReleaseMapper.selectByFatherWidgetIdAndVersion("wi0", "1.0.0");
        assertThat(entity).isNotNull();
    }

}
