package com.vikadata.boot.autoconfigure.swagger;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.builders.RequestParameterBuilder;
import springfox.documentation.schema.ScalarType;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.service.RequestParameter;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger文档配置
 *
 * @author Shawn Deng
 * @date 2021-01-08 00:03:23
 */
@Configuration(proxyBeanMethods = false)
public class DocketAutoConfiguration {

    public final SwaggerProperties properties;

    public DocketAutoConfiguration(SwaggerProperties properties) {
        this.properties = properties;
    }

    @Bean
    @ConditionalOnMissingBean(Docket.class)
    public Docket createApiDoc() {
        return new Docket(DocumentationType.OAS_30)
            .select()
            .apis(RequestHandlerSelectors.basePackage(properties.getBasePackage()))
            .paths(pathSelect())
            .build()
            .host(properties.getHost())
            .apiInfo(apiInfo())
            .ignoredParameterTypes(ignoredParameterTypes())
            .globalRequestParameters(globalRequestParameters())
            .useDefaultResponseMessages(properties.isUseDefaultResponseMessages());
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
            .title(properties.getTitle())
            .description(properties.getDescription())
            .license(properties.getLicense())
            .termsOfServiceUrl(properties.getTermsOfServiceUrl())
            .version(properties.getVersion())
            .contact(new Contact(properties.getContact().getName(), properties.getContact().getUrl(), properties.getContact().getEmail()))
            .build();
    }

    /**
     * API的路径
     */
    private Predicate<String> pathSelect() {
        ArrayList<Predicate<String>> basePaths = Stream.of(properties.getBasePaths())
            .reduce(new ArrayList<>(), (predicates, basePath) -> {
                predicates.add(PathSelectors.ant(basePath));
                return predicates;
            }, (predicates, item) -> {
                predicates.addAll(item);
                return predicates;
            });
        ArrayList<Predicate<String>> excludePaths = Stream.of(properties.getExcludePaths())
            .reduce(new ArrayList<>(), (predicates, basePath) -> {
                predicates.add(PathSelectors.ant(basePath));
                return predicates;
            }, (predicates, item) -> {
                predicates.addAll(item);
                return predicates;
            });
        Predicate<String> andPredicates = basePaths.stream().reduce(path -> true, Predicate::and);
        Predicate<String> notPredicates = excludePaths.stream().reduce(path -> false, Predicate::or).negate();
        return andPredicates.and(notPredicates);
    }

    /**
     * 要忽略的参数类型
     */
    private Class<?>[] ignoredParameterTypes() {
        Class<?>[] array = new Class[properties.getIgnoredParameterTypes().size()];
        return properties.getIgnoredParameterTypes().toArray(array);
    }

    private List<RequestParameter> globalRequestParameters() {
        return properties.getGlobalOperationParameters().stream()
            .map(parameter ->
                new RequestParameterBuilder()
                    .name(parameter.getName())
                    .description(parameter.getDescription())
                    .in(parameter.getParameterType())
                    .required(parameter.getRequired())
                    .query(q -> q.defaultValue(parameter.getModelRef()))
                    .query(q -> q.model(m -> m.scalarModel(ScalarType.STRING)))
                    .build()
            ).collect(Collectors.toList());
    }
}
