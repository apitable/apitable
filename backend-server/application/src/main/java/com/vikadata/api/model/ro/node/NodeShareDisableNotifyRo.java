package com.vikadata.api.model.ro.node;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 节点分享关闭通知请求参数
 * </p>
 *
 * @author Chambers
 * @date 2021/3/3
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NodeShareDisableNotifyRo {

    private String nodeId;

    private List<String> shareIds;
}
