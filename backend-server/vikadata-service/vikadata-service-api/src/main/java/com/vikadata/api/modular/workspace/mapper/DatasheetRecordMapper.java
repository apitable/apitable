package com.vikadata.api.modular.workspace.mapper;

import java.util.Collection;
import java.util.List;
import java.util.Set;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.dto.datasheet.DataSheetRecordDto;
import com.vikadata.api.model.dto.datasheet.DataSheetRecordGroupDto;
import com.vikadata.api.model.vo.datasheet.DatasheetRecordVo;
import com.vikadata.entity.DatasheetRecordEntity;

/**
 * <p>
 * 数表记录表 Mapper 接口
 * </p>
 *
 * @author Benson Cheung
 * @since 2019-09-23
 */
public interface DatasheetRecordMapper extends BaseMapper<DatasheetRecordEntity> {

    /**
     * 获取record列表
     *
     * @param dstId 表格ID
     * @return List
     */
    List<DatasheetRecordVo> selectListByDstId(@Param("dstId") String dstId);

    /**
     * 获取指定多条record列表
     *
     * @param dstId 表格ID
     * @param ids   记录ID列表
     * @return List
     */
    List<DatasheetRecordVo> selectListByIds(@Param("dstId") String dstId, @Param("recordList") Set<String> ids);

    /**
     * 统计空间内总记录数
     *
     * @param spaceId 空间ID
     * @return 记录数量
     * @author Chambers
     * @date 2019/11/29
     */
    Long countBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 统计数表的记录数
     *
     * @param dstId 数表ID
     * @return 记录数量
     * @author Chambers
     * @date 2019/12/18
     */
    Integer countByDstId(@Param("dstId") String dstId);

    /**
     * 批量新增多个记录
     *
     * @param entities 记录列表
     * @return 执行结果数
     * @author Chambers
     * @date 2019/12/19
     */
    int insertBatch(@Param("entities") List<DatasheetRecordEntity> entities);

    /**
     * 根据dstId和recordId获取单个recordEntity，可查询已删除的record
     * 场景：用于删除记录后，使用Undo操作进行恢复记录数据
     *
     * @param dstId    表格ID
     * @param recordId 记录ID
     * @return DatasheetRecordEntity
     */
    DatasheetRecordEntity selectByConditionAndDeleted(@Param("dstId") String dstId, @Param("recordId") String recordId);

    /**
     * 根据dstId和recordId获取单个recordVo
     *
     * @param dstId    表格ID
     * @param recordId 记录ID
     * @return DatasheetRecordEntity
     */
    List<DatasheetRecordVo> selectRecordVoByConditions(@Param("dstId") String dstId, @Param("recordId") String recordId);

    /**
     * 更新单条数表记录，支持传入is_deleted参数，即可恢复数据
     *
     * @param userId 用户ID
     * @param record 记录实体参数
     * @return boolean
     */
    boolean updateByConditions(@Param("userId") Long userId, @Param("record") DatasheetRecordEntity record);

    /**
     * 查询数表的记录数
     *
     * @param dstId 数表ID
     * @return 记录总数
     * @author Shawn Deng
     * @date 2020/2/26 15:20
     */
    Integer selectCountByDstId(@Param("dstId") String dstId);

    /**
     * 获取表ID、数据列表
     *
     * @param dstId 数表ID
     * @return dto
     * @author Chambers
     * @date 2020/3/31
     */
    List<DataSheetRecordDto> selectDtoByDstId(@Param("dstId") String dstId);

    /**
     * 获取记录信息
     *
     * @param dstIds 数表ID列表
     * @return dto 列表
     * @author Chambers
     * @date 2020/6/12
     */
    List<DataSheetRecordDto> selectDtoByDstIds(@Param("list") Collection<String> dstIds);

    /**
     * 获取数表ID、及对应的记录ID、数据列表
     *
     * @param dstIds 数表ID列表
     * @return dto
     * @author Chambers
     * @date 2020/4/30
     */
    List<DataSheetRecordGroupDto> selectGroupDtoByDstIds(@Param("list") Collection<String> dstIds);
}
