package com.vikadata.api.modular.workspace.mapper;

import java.util.ArrayList;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import com.vikadata.api.modular.workspace.model.NodeWidgetDto;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import com.vikadata.api.AbstractMyBatisMapperTest;
import com.vikadata.api.model.dto.widget.WidgetBaseInfo;
import com.vikadata.api.model.dto.widget.WidgetDTO;
import com.vikadata.api.model.vo.widget.WidgetInfo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.jdbc.Sql;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <p>
 *     数据访问层测试：工作台-组件表测试
 * </p>
 * @author wuyitao
 * @date 2022/4/6 2:46 PM
 */
@Disabled
public class WidgetMapperTest extends AbstractMyBatisMapperTest {

    @Autowired
    WidgetMapper widgetMapper;

    @Test
    @Sql("/testdata/widget-data.sql")
    void testSelectCountBySpaceIdAndWidgetIds() {
        Integer count = widgetMapper.selectCountBySpaceIdAndWidgetIds("spc41", CollUtil.newArrayList("wi41"));
        assertThat(count).isEqualTo(1);
    }


    @Test
    @Sql("/testdata/widget-data.sql")
    void testSelectWidgetBaseInfoByWidgetIds() {
        List<WidgetBaseInfo> entities = widgetMapper.selectWidgetBaseInfoByWidgetIds(CollUtil.newArrayList("wi41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql({ "/testdata/widget-data.sql", "/testdata/widget-package-data.sql",
            "/testdata/datasheet-widget-data.sql", "/testdata/node-data.sql"})
    void testSelectInfoBySpaceIdAndNodeType() {
        List<WidgetInfo> entity = widgetMapper.selectInfoBySpaceIdAndNodeType("spc41", 0);
        assertThat(entity).isNotNull();
    }


    @Test
    @Sql({ "/testdata/widget-package-data.sql", "/testdata/widget-data.sql",
            "/testdata/datasheet-widget-data.sql", "/testdata/datasheet-data.sql"})
    void testSelectInfoByNodeId() {
        List<WidgetInfo> entities = widgetMapper.selectInfoByNodeId("ni41");
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql({ "/testdata/widget-data.sql", "/testdata/node-data.sql",
            "/testdata/datasheet-widget-data.sql"})
    void testSelectWidgetDtoByWidgetIds() {
        List<WidgetDTO> entities = widgetMapper.selectWidgetDtoByWidgetIds(CollUtil.newArrayList("wi41"));
        assertThat(entities).isNotEmpty();
    }


    @Test
    @Sql("/testdata/widget-data.sql")
    void testSelectSpaceIdByWidgetIds() {
        List<String> ids = widgetMapper.selectSpaceIdByWidgetIds(CollUtil.newArrayList("wi41"));
        assertThat(ids).isNotEmpty();
    }


    @Test
    @Sql("/testdata/widget-data.sql")
    void testSelectWidgetIdsByNodeId() {
        List<String> ids = widgetMapper.selectWidgetIdsByNodeId("ni41");
        assertThat(ids).isNotEmpty();
    }


    @Test
    @Sql({ "/testdata/widget-data.sql", "/testdata/node-data.sql",
            "/testdata/datasheet-widget-data.sql"})
    void testSelectDataSourceDstIdsByNodeIds() {
        List<String> ids = widgetMapper.selectDataSourceDstIdsByNodeIds(CollUtil.newArrayList("ni41"));
        assertThat(ids).isNotEmpty();
    }

    @Test
    @Sql("/testdata/widget-data.sql")
    void testSelectCountByNodeId() {
        Integer count = widgetMapper.selectCountByNodeId("ni41");
        assertThat(count).isEqualTo(1);
    }

    @Test
    @Sql({"/testdata/widget-data.sql", "/testdata/datasheet-widget-data.sql"})
    void testSelectNodeWidgetDtoByNodeIds(){
        List<String>  nodeIds = new ArrayList<>();
        nodeIds.add("ni41");
        List<NodeWidgetDto> list = widgetMapper.selectNodeWidgetDtoByNodeIds(nodeIds);
        assertThat(list.get(0).getNodeId()).isEqualTo("ni41");
        assertThat(list.get(0).getWidgetName()).isEqualTo("创世组件");
        assertThat(list.get(0).getDstId()).isEqualTo("ni41");
    }
}
