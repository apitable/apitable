package com.vikadata.api.workspace.mapper;

import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.NodeVisitRecordEntity;

public interface NodeVisitRecordMapper {

    String selectNodeIdsByMemberIdAndNodeType(@Param("memberId") Long memberId, @Param("nodeType") Integer nodeType);

    int insert(@Param("entity") NodeVisitRecordEntity entity);

    int updateNodeIdsByMemberIdAndNodeType(@Param("nodeIdsStr") String nodeIdsStr, @Param("memberId") Long memberId, @Param("nodeType") Integer nodeType);

}
