package com.vikadata.api.model.dto.base;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * Map DTO
 * </p>
 *
 * @author Chambers
 * @date 2021/4/9
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class MapDTO {

    private String key;

    private Object value;
}
