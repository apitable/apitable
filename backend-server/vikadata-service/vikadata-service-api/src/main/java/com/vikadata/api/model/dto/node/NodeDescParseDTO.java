package com.vikadata.api.model.dto.node;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * <p>
 * 节点描述解析对象
 * </p>
 *
 * @author zoe zheng
 * @date 2020/5/19 3:12 下午
 */
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class NodeDescParseDTO {

    private List<String> content;

    private List<String> imageUrl;
}
