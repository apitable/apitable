package com.vikadata.api.support;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;

import com.vikadata.boot.autoconfigure.spring.SpringContextHolder;
import com.vikadata.define.constants.RedisConstants;

import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.lang.Nullable;

/**
 * <p>
 * 🪄支持魔法值的Redis Key序列化
 * </p>
 *
 * 如果你的缓存值需要环境来区分，可以在定义key值的时候添加一个魔法变量: {redis_env}
 *
 * 举个栗子:
 * before：
 * vikadata:cache:client:version
 *
 * after：
 * vikadata:{redis_env}:cache:client:version
 *
 * 如果spring.profiles.active=local，最终序列化后 vikadata:local:cache:client:version
 *
 * @author Pengap
 * @date 2022/5/26 18:07:57
 */
public class MagicalKeyStringRedisSerializer extends StringRedisSerializer {
    public static final MagicalKeyStringRedisSerializer UTF_8 = new MagicalKeyStringRedisSerializer(StandardCharsets.UTF_8);

    public MagicalKeyStringRedisSerializer(Charset charset) {
        super(charset);
    }

    @Override
    public String deserialize(@Nullable byte[] bytes) {
        return super.deserialize(bytes);
    }

    @Override
    public byte[] serialize(@Nullable String string) {
        // 替换魔法值
        string = StrUtil.format(string, this.getAllMagicalValue());
        return super.serialize(string);
    }

    private Dict getAllMagicalValue() {
        String activeProfile = SpringContextHolder.getActiveProfile();
        return Dict.create().set(RedisConstants.REDIS_ENV, activeProfile);
    }

}
