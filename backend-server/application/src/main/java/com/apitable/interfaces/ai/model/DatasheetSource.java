package com.apitable.interfaces.ai.model;

import com.apitable.workspace.dto.DatasheetSnapshot;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Datasheet source setting param.
 *
 * @author Shawn Deng
 */
@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class DatasheetSource implements AiDataSource {

    private String datasheetId;

    private Long revision;

    private String viewId;

    private int rows;

    private List<DatasheetSnapshot.Field> fields;
}
