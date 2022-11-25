package com.apitable.starter.swagger.autoconfigure;

import java.util.ArrayList;
import java.util.List;

import springfox.documentation.service.ParameterType;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * swagger properties
 * @author Shawn Deng
 */
@ConfigurationProperties(prefix = "vikadata-starter.swagger")
public class SwaggerProperties {

    private boolean enabled = false;

    private String host = "http://localhost:8080";

    private String title;

    private String description;

    private String termsOfServiceUrl;

    private Contact contact;

    private String license;

    private String licenseUrl;

    private String version;

    private String basePackage;

    private String[] basePaths = new String[] {"/**"};

    private String[] excludePaths = new String[]{};

    private List<Class<?>> ignoredParameterTypes = new ArrayList<>();

    private List<GlobalOperationParameter> globalOperationParameters = new ArrayList<>();

    private boolean useDefaultResponseMessages;

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTermsOfServiceUrl() {
        return termsOfServiceUrl;
    }

    public void setTermsOfServiceUrl(String termsOfServiceUrl) {
        this.termsOfServiceUrl = termsOfServiceUrl;
    }

    public Contact getContact() {
        return contact;
    }

    public void setContact(Contact contact) {
        this.contact = contact;
    }

    public String getLicense() {
        return license;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public String getLicenseUrl() {
        return licenseUrl;
    }

    public void setLicenseUrl(String licenseUrl) {
        this.licenseUrl = licenseUrl;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getBasePackage() {
        return basePackage;
    }

    public void setBasePackage(String basePackage) {
        this.basePackage = basePackage;
    }

    public String[] getBasePaths() {
        return basePaths;
    }

    public void setBasePaths(String[] basePaths) {
        this.basePaths = basePaths;
    }

    public String[] getExcludePaths() {
        return excludePaths;
    }

    public void setExcludePaths(String[] excludePaths) {
        this.excludePaths = excludePaths;
    }

    public List<Class<?>> getIgnoredParameterTypes() {
        return ignoredParameterTypes;
    }

    public void setIgnoredParameterTypes(List<Class<?>> ignoredParameterTypes) {
        this.ignoredParameterTypes = ignoredParameterTypes;
    }

    public List<GlobalOperationParameter> getGlobalOperationParameters() {
        return globalOperationParameters;
    }

    public void setGlobalOperationParameters(List<GlobalOperationParameter> globalOperationParameters) {
        this.globalOperationParameters = globalOperationParameters;
    }

    public boolean isUseDefaultResponseMessages() {
        return useDefaultResponseMessages;
    }

    public void setUseDefaultResponseMessages(boolean useDefaultResponseMessages) {
        this.useDefaultResponseMessages = useDefaultResponseMessages;
    }

    public static class Contact {

        private String name;

        private String url;

        private String email;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    public static class GlobalOperationParameter {
        private String name;

        private String description;

        private String modelRef;

        private ParameterType parameterType;

        private Boolean required;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getModelRef() {
            return modelRef;
        }

        public void setModelRef(String modelRef) {
            this.modelRef = modelRef;
        }

        public ParameterType getParameterType() {
            return parameterType;
        }

        public void setParameterType(ParameterType parameterType) {
            this.parameterType = parameterType;
        }

        public Boolean getRequired() {
            return required;
        }

        public void setRequired(Boolean required) {
            this.required = required;
        }
    }
}
