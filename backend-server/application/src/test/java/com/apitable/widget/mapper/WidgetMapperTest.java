package com.apitable.widget.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import cn.hutool.core.collection.CollUtil;
import com.apitable.AbstractMyBatisMapperTest;
import com.apitable.widget.dto.NodeWidgetDto;
import com.apitable.widget.dto.WidgetBaseInfo;
import com.apitable.widget.dto.WidgetDTO;
import com.apitable.widget.vo.WidgetInfo;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

public class WidgetMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    WidgetMapper widgetMapper;

    @Test
    @Sql("/sql/widget-data.sql")
    void testSelectCountBySpaceIdAndWidgetIds() {
        Integer count =
            widgetMapper.selectCountBySpaceIdAndWidgetIds("spc41", CollUtil.newArrayList("wi41"));
        assertThat(count).isEqualTo(1);
    }


    @Test
    @Sql("/sql/widget-data.sql")
    void testSelectWidgetBaseInfoByWidgetIds() {
        List<WidgetBaseInfo> entities =
            widgetMapper.selectWidgetBaseInfoByWidgetIds(CollUtil.newArrayList("wi41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql({"/sql/widget-data.sql", "/sql/widget-package-data.sql",
        "/sql/datasheet-widget-data.sql", "/sql/node-data.sql"})
    void testSelectInfoBySpaceIdAndNodeType() {
        List<WidgetInfo> entity = widgetMapper.selectInfoBySpaceIdAndNodeType("spc41", 0, null);
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql({"/sql/widget-package-data.sql", "/sql/widget-data.sql",
        "/sql/datasheet-widget-data.sql", "/sql/datasheet-data.sql"})
    void testSelectInfoByNodeId() {
        List<WidgetInfo> entities = widgetMapper.selectInfoByNodeId("ni41");
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql({"/sql/widget-data.sql", "/sql/node-data.sql",
        "/sql/datasheet-widget-data.sql"})
    void testSelectWidgetDtoByWidgetIds() {
        List<WidgetDTO> entities =
            widgetMapper.selectWidgetDtoByWidgetIds(CollUtil.newArrayList("wi41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/sql/widget-data.sql")
    void testSelectSpaceIdByWidgetIds() {
        List<String> ids = widgetMapper.selectSpaceIdByWidgetIds(CollUtil.newArrayList("wi41"));
        assertThat(ids).isNotEmpty();
    }


    @Test
    @Sql("/sql/widget-data.sql")
    void testSelectWidgetIdsByNodeId() {
        List<String> ids = widgetMapper.selectWidgetIdsByNodeId("ni41");
        assertThat(ids).isNotEmpty();
    }


    @Test
    @Sql({"/sql/widget-data.sql", "/sql/node-data.sql",
        "/sql/datasheet-widget-data.sql"})
    void testSelectDataSourceDstIdsByNodeIds() {
        List<String> ids =
            widgetMapper.selectDataSourceDstIdsByNodeIds(CollUtil.newArrayList("ni41"));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql({"/sql/widget-data.sql", "/sql/datasheet-widget-data.sql"})
    void testSelectNodeWidgetDtoByNodeIds() {
        List<String> nodeIds = new ArrayList<>();
        nodeIds.add("ni41");
        List<NodeWidgetDto> list = widgetMapper.selectNodeWidgetDtoByNodeIds(nodeIds);
        assertThat(list.get(0).getNodeId()).isEqualTo("ni41");
        assertThat(list.get(0).getWidgetName()).isEqualTo("genesis components");
        assertThat(list.get(0).getDstId()).isEqualTo("ni41");
    }
}
