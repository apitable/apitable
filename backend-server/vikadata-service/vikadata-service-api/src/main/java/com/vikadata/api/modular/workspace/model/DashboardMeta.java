package com.vikadata.api.modular.workspace.model;

import java.util.Collection;

import cn.hutool.json.JSONArray;
import lombok.Data;

/**
 * <p>
 * 仪表盘元数据
 * </p>
 *
 * @author Chambers
 * @date 2021/1/27
 */
@Data
public class DashboardMeta {

    private JSONArray layout;

    private Collection<String> installWidgetIds;
}
