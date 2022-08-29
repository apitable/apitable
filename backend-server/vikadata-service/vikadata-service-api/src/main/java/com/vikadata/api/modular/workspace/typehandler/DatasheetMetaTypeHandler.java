package com.vikadata.api.modular.workspace.typehandler;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import com.vikadata.api.modular.workspace.model.DatasheetSnapshot.Meta;

/**
 * datasheet meta解析
 * @author Shawn Deng
 * @date 2021-04-01 21:22:27
 */

@MappedTypes(Meta.class)
@MappedJdbcTypes(JdbcType.VARCHAR)
public class DatasheetMetaTypeHandler extends BaseTypeHandler<Meta> {

    private static final ObjectMapper mapper = new ObjectMapper();

    static {
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    private Meta parse(String json) {
        try {
            return mapper.readValue(json, Meta.class);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private String toJSON(Meta object) {
        try {
            return mapper.writeValueAsString(object);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Meta parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, toJSON(parameter));
    }

    @Override
    public Meta getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String sqlJson = rs.getString(columnName);
        if (null != sqlJson) {
            return parse(sqlJson);
        }
        return null;
    }

    @Override
    public Meta getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String sqlJson = rs.getString(columnIndex);
        if (null != sqlJson) {
            return parse(sqlJson);
        }
        return null;
    }

    @Override
    public Meta getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String sqlJson = cs.getString(columnIndex);
        if (null != sqlJson) {
            return parse(sqlJson);
        }
        return null;
    }
}
