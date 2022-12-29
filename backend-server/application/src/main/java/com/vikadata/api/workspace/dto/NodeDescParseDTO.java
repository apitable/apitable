package com.vikadata.api.workspace.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class NodeDescParseDTO {

    private List<String> content;

    private List<String> imageUrl;
}
