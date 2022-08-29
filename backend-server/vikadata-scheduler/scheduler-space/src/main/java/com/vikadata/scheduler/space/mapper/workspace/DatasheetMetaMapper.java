package com.vikadata.scheduler.space.mapper.workspace;

import java.time.LocalDateTime;
import java.util.List;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.scheduler.space.model.DataSheetMetaDto;
import com.vikadata.scheduler.space.model.ForeignDatasheetDto;

/**
 * <p>
 * 工作台-数表元数据表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/3/12
 */
public interface DatasheetMetaMapper {

    /**
     * 逻辑删除数表元数据
     *
     * @param nodeIds 节点ID列表
     * @return 删除数
     * @author Chambers
     * @date 2020/3/12
     */
    int updateIsDeletedByNodeIds(@Param("list") List<String> nodeIds);

    /**
     * 获取数表ID、元数据
     *
     * @param nodeIds 节点ID列表
     * @return dto
     * @author Chambers
     * @date 2020/4/23
     */
    List<DataSheetMetaDto> selectDtoByNodeIds(@Param("list") List<String> nodeIds);

    /**
     * 模糊查询 meta 内容
     *
     * @param keyword 关键词
     * @return 节点ID列表
     * @author Chambers
     * @date 2020/5/7
     */
    List<String> selectNodeIdByMetaLike(@Param("keyword") String keyword);

    /**
     * 修改 meta
     *
     * @param nodeId 节点ID
     * @param meta   最新meta
     * @author Chambers
     * @date 2020/5/7
     */
    void updateMetaByNodeId(@Param("nodeId") String nodeId, @Param("meta") String meta);

    /**
     * 向指定字段的 property 新增 datasheetId 值
     *
     * @param nodeId 节点ID
     * @param fldIds 字段ID 列表
     * @author Chambers
     * @date 2020/12/28
     */
    void updateMetaByJsonInsert(@Param("nodeId") String nodeId, @Param("list") List<String> fldIds);

    /**
     * 查询最后创建的表ID (由于方法由 java 迁移至 nest，后者较前者小得多，故条件加入 id < 1203232065516998658)
     *
     * @return ID
     * @author Chambers
     * @date 2021/7/8
     */
    Long selectMaxId();

    /**
     * 获取指定创建时间之后，最小表ID
     *
     * @param createdAt 创建时间
     * @return ID
     * @author Chambers
     * @date 2021/7/8
     */
    Long selectMinIdAfterCreatedAt(@Param("createdAt") LocalDateTime createdAt);

    /**
     * 查询所有神奇关联数据
     *
     * @param spaceId 空间站ID
     * @param nextId  下一次开始查询的数据Id
     * @param page    分页对象
     * @author Pengap
     * @date 2022/1/21 17:42:19
     */
    IPage<ForeignDatasheetDto> selectForeignDatasheetIdsByPage(@Param("spaceId") String spaceId, @Param("nextId") Long nextId, Page<ForeignDatasheetDto> page);

    /**
     * 查询空间站数表视图配置
     *
     * @param spaceId           空间站Id
     * @param selectFixDataMode 选择修复数据
     * @return 数表视图配置数据集合
     * @author Pengap
     * @date 2022/4/14 15:22:52
     */
    List<DataSheetMetaDto> selectMetaDataByFixMode(@Param("spaceId") String spaceId, @Param("selectFixDataMode") Integer selectFixDataMode);

    /**
     * 修改「模版」视图排序信息
     *
     * @param viewIndex 视图下标
     * @return 影响行数
     * @author Pengap
     * @date 2022/4/14 21:03:26
     */
    int updateTemplateViewSortInfo(@Param("dstId") String dstId, @Param("viewIndex") Integer viewIndex);
}
