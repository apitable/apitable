package com.vikadata.aider.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * 小程序相关 mapper
 * </p>
 *
 * @author Chambers
 * @date 2022/1/28
 */
public interface WidgetMapper {

    int addDatasheetWidgetSourceData();

    List<String> selectMirrorIdHavingResourceMeta();

    int addMirrorResourceMeta(@Param("mirrorIds") List<String> mirrorIds);
}
