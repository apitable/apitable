package com.vikadata.api.handler.mybatis;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * <p>
 * 用以将mysql存储的String类型数组，转换为数组的自定义转换器，转换为String[]的类型数据
 * 注意：mysql存储的String类型数组数据去除[]，示例数据：A，B，C，D
 * </p>
 *
 * @author Benson Cheung
 * @date 2019/11/13 11:02
 */
public class StringArrayTypeHandler extends BaseTypeHandler<String[]> {

	@Override
	public void setNonNullParameter(PreparedStatement ps, int i, String[] parameter, JdbcType jdbcType) throws SQLException {
		ps.setString(i, String.join(",", parameter));
	}

	@Override
	public String[] getNullableResult(ResultSet rs, String columnName) throws SQLException {
		String str = rs.getString(columnName);
		if (rs.wasNull()) {
			return null;
		}

		return str.split(",");
	}

	@Override
	public String[] getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
		String str = rs.getString(columnIndex);
		if (rs.wasNull()) {
			return null;
		}

		return str.split(",");
	}

	@Override
	public String[] getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
		String str = cs.getString(columnIndex);
		if (cs.wasNull()) {
			return null;
		}
		return str.split(",");
	}
}
