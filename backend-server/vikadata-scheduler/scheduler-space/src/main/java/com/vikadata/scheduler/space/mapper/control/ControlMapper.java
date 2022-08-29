package com.vikadata.scheduler.space.mapper.control;

import java.util.List;

import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * ControlMapper
 * </p>
 *
 * @author Chambers
 * @date 2021/5/26
 */
public interface ControlMapper {

    List<String> selectControlIdsBySpaceIds(@Param("list") List<String> spaceIds);

    int deleteControl(@Param("list") List<String> controlIds);

    int deleteControlRole(@Param("list") List<String> controlIds);

    int deleteControlSetting(@Param("list") List<String> controlIds);
}
