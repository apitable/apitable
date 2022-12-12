package com.vikadata.api.internal.ro;

import java.util.List;

import javax.validation.constraints.Size;

import lombok.Data;

/**
 * @author tao
 */
@Data
public class UrlsWrapperRo {

    @Size(max = 100)
    private List<String> urls;

}
