package com.apitable.starter.swagger.autoconfigure;

import springfox.documentation.swagger.web.DocExpansion;
import springfox.documentation.swagger.web.ModelRendering;
import springfox.documentation.swagger.web.OperationsSorter;
import springfox.documentation.swagger.web.TagsSorter;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * swagger ui properties
 * @author Shawn Deng
 */
@ConfigurationProperties(prefix = "vikadata-starter.swagger.ui-config")
public class SwaggerUiProperties {

    /**
     * submit methods
     **/
    private String[] submitMethods;

    private Boolean deepLinking;
    private Boolean displayOperationId;
    private Integer defaultModelsExpandDepth;
    private Integer defaultModelExpandDepth;
    private ModelRendering defaultModelRendering;

    /**
     * whether show request duration, default false
     */
    private Boolean displayRequestDuration;

    private DocExpansion docExpansion;

    private Object filter;
    private Integer maxDisplayedTags;
    private OperationsSorter operationsSorter = OperationsSorter.ALPHA;
    private Boolean showExtensions;
    private Boolean showCommonExtensions;
    private TagsSorter tagsSorter;

    /**
     * Network
     */
    private String validatorUrl;

    public String[] getSubmitMethods() {
        return submitMethods;
    }

    public void setSubmitMethods(String[] submitMethods) {
        this.submitMethods = submitMethods;
    }

    public Boolean getDeepLinking() {
        return deepLinking;
    }

    public void setDeepLinking(Boolean deepLinking) {
        this.deepLinking = deepLinking;
    }

    public Boolean getDisplayOperationId() {
        return displayOperationId;
    }

    public void setDisplayOperationId(Boolean displayOperationId) {
        this.displayOperationId = displayOperationId;
    }

    public Integer getDefaultModelsExpandDepth() {
        return defaultModelsExpandDepth;
    }

    public void setDefaultModelsExpandDepth(Integer defaultModelsExpandDepth) {
        this.defaultModelsExpandDepth = defaultModelsExpandDepth;
    }

    public Integer getDefaultModelExpandDepth() {
        return defaultModelExpandDepth;
    }

    public void setDefaultModelExpandDepth(Integer defaultModelExpandDepth) {
        this.defaultModelExpandDepth = defaultModelExpandDepth;
    }

    public ModelRendering getDefaultModelRendering() {
        return defaultModelRendering;
    }

    public void setDefaultModelRendering(ModelRendering defaultModelRendering) {
        this.defaultModelRendering = defaultModelRendering;
    }

    public Boolean getDisplayRequestDuration() {
        return displayRequestDuration;
    }

    public void setDisplayRequestDuration(Boolean displayRequestDuration) {
        this.displayRequestDuration = displayRequestDuration;
    }

    public DocExpansion getDocExpansion() {
        return docExpansion;
    }

    public void setDocExpansion(DocExpansion docExpansion) {
        this.docExpansion = docExpansion;
    }

    public Object getFilter() {
        return filter;
    }

    public void setFilter(Object filter) {
        this.filter = filter;
    }

    public Integer getMaxDisplayedTags() {
        return maxDisplayedTags;
    }

    public void setMaxDisplayedTags(Integer maxDisplayedTags) {
        this.maxDisplayedTags = maxDisplayedTags;
    }

    public OperationsSorter getOperationsSorter() {
        return operationsSorter;
    }

    public void setOperationsSorter(OperationsSorter operationsSorter) {
        this.operationsSorter = operationsSorter;
    }

    public Boolean getShowExtensions() {
        return showExtensions;
    }

    public void setShowExtensions(Boolean showExtensions) {
        this.showExtensions = showExtensions;
    }

    public Boolean getShowCommonExtensions() {
        return showCommonExtensions;
    }

    public void setShowCommonExtensions(Boolean showCommonExtensions) {
        this.showCommonExtensions = showCommonExtensions;
    }

    public TagsSorter getTagsSorter() {
        return tagsSorter;
    }

    public void setTagsSorter(TagsSorter tagsSorter) {
        this.tagsSorter = tagsSorter;
    }

    public String getValidatorUrl() {
        return validatorUrl;
    }

    public void setValidatorUrl(String validatorUrl) {
        this.validatorUrl = validatorUrl;
    }
}
