package com.vikadata.api.modular.space.repository;

import com.vikadata.schema.AuditSpaceSchema;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * <p>
 * audit space repository
 * </p>
 *
 * @author Chambers
 * @date 2022/5/25
 */
public interface AuditSpaceRepository extends MongoRepository<AuditSpaceSchema, Long> {
}
