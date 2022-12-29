package com.vikadata.build.mybatis;

import java.io.File;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import com.baomidou.mybatisplus.generator.config.converts.MySqlTypeConvert;
import com.baomidou.mybatisplus.generator.config.querys.MySqlQuery;
import com.baomidou.mybatisplus.generator.config.rules.DateType;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;
import com.baomidou.mybatisplus.generator.fill.Column;
import org.gradle.api.DefaultTask;
import org.gradle.api.file.DirectoryProperty;
import org.gradle.api.tasks.OutputDirectory;
import org.gradle.api.tasks.TaskAction;

import static com.baomidou.mybatisplus.generator.config.TemplateType.CONTROLLER;
import static com.baomidou.mybatisplus.generator.config.TemplateType.MAPPER;
import static com.baomidou.mybatisplus.generator.config.TemplateType.SERVICE;
import static com.baomidou.mybatisplus.generator.config.TemplateType.SERVICEIMPL;
import static com.baomidou.mybatisplus.generator.config.TemplateType.XML;

/**
 *
 * @author Shawn Deng
 * @date 2021-09-28 11:46:33
 */
public class MybatisGeneratorTask extends DefaultTask {

    private final DirectoryProperty destination;

    public MybatisGeneratorTask() {
        this.destination = getProject().getObjects().directoryProperty();
        this.destination.set(getProject().getLayout().getProjectDirectory().dir("src/main"));
    }

    @OutputDirectory
    public DirectoryProperty getDestination() {
        return this.destination;
    }

    @TaskAction
    void execute() {
        String outputDir = destination.get().getAsFile().getAbsolutePath();
        FastAutoGenerator
                .create(
                        new DataSourceConfig.Builder("jdbc:mysql://vika-mysql-8.cstoexorttus.rds.cn-northwest-1.amazonaws.com.cn:3306/vikadata?characterEncoding=utf8&autoReconnect=true&useSSL=true&tinyInt1isBit=true",
                                "vika_developer", "develop@vikadata#189")
                                .dbQuery(new MySqlQuery())
                                .schema("vikadata")
                                .typeConvert(new MySqlTypeConvert())
                )
                .globalConfig(builder -> builder
                        .author("mybatis-plus-generator")
                        .disableOpenDir()
                        .dateType(DateType.TIME_PACK)
                        .outputDir(outputDir + File.separator + "java")
                )
                .packageConfig(builder -> builder
                        .parent("com.vikadata")
                )
                .strategyConfig(builder -> builder
                        .addTablePrefix("vika_")
                        .addExclude("vika_db_changelog", "vika_db_changelog_lock")
                        .entityBuilder().enableLombok().enableChainModel()
                        .formatFileName("%sEntity")
                        .logicDeleteColumnName("is_deleted")
                        .naming(NamingStrategy.underline_to_camel)
                        .nameConvert(new NameConvert())
                        .idType(IdType.ASSIGN_ID)
                        .addTableFills(
                                new Column("created_by", FieldFill.INSERT),
                                new Column("updated_by", FieldFill.INSERT_UPDATE)
                        )
                )
                .templateConfig(builder -> builder
                        .entity("templates/self-entity.java")
                        .disable(CONTROLLER, SERVICE, SERVICEIMPL, MAPPER, XML)
                )
                .templateEngine(new FreemarkerTemplateEngine())
                .execute();
    }
}
