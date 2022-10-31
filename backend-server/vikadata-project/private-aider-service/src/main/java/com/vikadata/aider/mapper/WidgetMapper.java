package com.vikadata.aider.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

public interface WidgetMapper {

    int addDatasheetWidgetSourceData();

    List<String> selectMirrorIdHavingResourceMeta();

    int addMirrorResourceMeta(@Param("mirrorIds") List<String> mirrorIds);
}
