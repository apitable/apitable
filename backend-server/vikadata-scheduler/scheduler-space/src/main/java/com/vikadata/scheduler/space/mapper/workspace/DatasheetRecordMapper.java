package com.vikadata.scheduler.space.mapper.workspace;

import com.vikadata.scheduler.space.model.DataSheetRecordDto;
import com.vikadata.scheduler.space.model.DataSheetRecordInfo;
import org.apache.ibatis.annotations.Param;

import java.util.Collection;
import java.util.List;

/**
 * <p>
 * 工作台-数表记录表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @since 2020/4/16
 */
public interface DatasheetRecordMapper {

    /**
     * 获取数表ID、数据列表
     *
     * @param nodeIds 数表节点ID列表
     * @return dto
     * @author Chambers
     * @date 2020/4/23
     */
    List<DataSheetRecordDto> selectDtoByNodeIds(@Param("list") Collection<String> nodeIds);

    /**
     * 获取记录信息
     *
     * @param nodeIds 数表节点ID列表
     * @return dto
     * @author Chambers
     * @date 2020/7/17
     */
    List<DataSheetRecordInfo> selectInfoByNodeIds(@Param("list") Collection<String> nodeIds);

    /**
     * 修改 data
     *
     * @param id   表ID
     * @param data data
     * @author Chambers
     * @date 2020/7/17
     */
    void updateDataById(@Param("id") Long id, @Param("data") String data);

    /**
     * 替换 field_updated_info 的 fieldUpdatedMap，删除 data 中指定字段键值对
     *
     * @param id              表ID
     * @param fldIds          字段ID 列表
     * @param fieldUpdatedMap fieldUpdatedMap
     * @author Chambers
     * @date 2020/12/28
     */
    void updateMetaByJsonOp(@Param("id") Long id, @Param("list") List<String> fldIds, @Param("fieldUpdatedMap") Object fieldUpdatedMap);
}
