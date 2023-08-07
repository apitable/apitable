package com.apitable.interfaces.ai.model;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * create AI chatBot from datasheet params.
 *
 * @author Shawn Deng
 */
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class AiCreateParam {

    private String spaceId;

    private String aiId;

    private AiType type;

    private String aiName;

    private List<AiDataSource> dataSources;
}
