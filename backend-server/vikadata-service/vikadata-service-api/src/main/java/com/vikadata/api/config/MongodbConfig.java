package com.vikadata.api.config;


import javax.annotation.Resource;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.mongo.MongoProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.convert.DbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * <p>
 * MongoDB config
 * </p>
 *
 * @author Chambers
 * @date 2021/11/17
 */
@Configuration(proxyBeanMethods = false)
@ConditionalOnClass(MongoClient.class)
@EnableMongoRepositories("com.vikadata.api.modular.*.repository")
public class MongodbConfig extends AbstractMongoClientConfiguration {

    @Resource
    private MongoProperties properties;

    @Bean
    @Override
    public MappingMongoConverter mappingMongoConverter(MongoDatabaseFactory mongoDatabaseFactory,
            MongoCustomConversions customConversions, MongoMappingContext mappingContext) {

        DbRefResolver dbRefResolver = new DefaultDbRefResolver(mongoDatabaseFactory);
        MappingMongoConverter converter = new MappingMongoConverter(dbRefResolver, mappingContext);
        converter.setCustomConversions(customConversions);
        converter.setCodecRegistryProvider(mongoDatabaseFactory);
        // do not generate suffix with _class
        converter.setTypeMapper(new DefaultMongoTypeMapper(null));
        return converter;
    }

    @Override
    public MongoClient mongoClient() {
        if (properties.getUri() != null) {
            return MongoClients.create(properties.getUri());
        }
        return super.mongoClient();
    }

    @Override
    protected String getDatabaseName() {
        return properties.getMongoClientDatabase();
    }
}
