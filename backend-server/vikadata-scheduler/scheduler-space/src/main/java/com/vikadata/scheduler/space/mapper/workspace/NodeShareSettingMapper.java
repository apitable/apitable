package com.vikadata.scheduler.space.mapper.workspace;

import org.apache.ibatis.annotations.Param;

/**
 * <p>
 *
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/10/16 15:45
 */
public interface NodeShareSettingMapper {

    /**
     * 查询节点开启分享的最后一个操作者
     *
     * @param nodeId 节点ID
     * @return 开启分享的操作者
     * @author Shawn Deng
     * @date 2020/10/16 15:59
     */
    Long selectOpenShareLastOperator(@Param("nodeId") String nodeId);

    /**
     * 更新数据
     *
     * @param nodeId   节点ID
     * @param props    分享选项参数
     * @param creator  创建者
     * @param modifier 最后一次更改者
     * @return 执行结果数
     * @author Shawn Deng
     * @date 2020/10/16 16:03
     */
    int updateByNodeId(@Param("nodeId") String nodeId, @Param("props") String props, @Param("creator") Long creator, @Param("modifier") Long modifier);
}
