package com.apitable.workspace.model;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.core.io.ClassPathResource;

/**
 * datasheet objects.
 *
 * @author Shawn Deng
 */
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder(toBuilder = true)
public class DatasheetObject {

    private Datasheet.Meta meta;

    private Datasheet.Records records;

    public static Datasheet.Meta loadMetaFile(ClassPathResource resource) {

        return null;
    }


}
