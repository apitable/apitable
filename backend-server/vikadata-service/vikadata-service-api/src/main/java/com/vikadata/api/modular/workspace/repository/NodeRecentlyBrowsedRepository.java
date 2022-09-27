package com.vikadata.api.modular.workspace.repository;

import com.vikadata.schema.NodeRecentlyBrowsedSchema;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * <p>
 * recently browsed node mongo repository
 * </p>
 */
@Repository
public interface NodeRecentlyBrowsedRepository extends MongoRepository<NodeRecentlyBrowsedSchema, String> {
    @Query("{ 'memberId' : ?0, 'nodeType': ?1 }")
    NodeRecentlyBrowsedSchema findByMemberIdAndNodeType(Long memberId, Integer nodeType);
}