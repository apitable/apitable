plugins {
    `java-library`
    `java-gradle-plugin`
    `groovy-gradle-plugin`
}

repositories {
    mavenCentral()
    gradlePluginPortal()
}

val mybatisPlusVersion: String by project
val mybatisPlusGeneratorVersion: String by project
val mysqlVersion: String by project
val beetlVersion: String by project
val hutoolVersion: String by project
val velocityVersion: String by project
val velocityCoreVersion: String by project

dependencies {
    implementation("com.baomidou:mybatis-plus:${mybatisPlusVersion}")
    implementation("com.baomidou:mybatis-plus-generator:${mybatisPlusGeneratorVersion}")
    implementation("org.freemarker:freemarker:2.3.31")
    runtimeOnly("mysql:mysql-connector-java:${mysqlVersion}")
    implementation("cn.hutool:hutool-core:${hutoolVersion}")
}

gradlePlugin {
    plugins {
        create("mybatisGeneratorPlugin") {
            id = "com.vikadata.gradle.plugin.mybatis-generator"
            implementationClass = "com.vikadata.build.mybatis.MybatisGeneratorPlugin"
        }
    }
}

tasks.test {
    useJUnitPlatform()
}
