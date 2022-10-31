package com.vikadata.social.wecom.model;

import java.io.Writer;

import cn.hutool.core.bean.BeanUtil;
import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.converters.basic.BooleanConverter;
import com.thoughtworks.xstream.converters.basic.ByteConverter;
import com.thoughtworks.xstream.converters.basic.DateConverter;
import com.thoughtworks.xstream.converters.basic.DoubleConverter;
import com.thoughtworks.xstream.converters.basic.FloatConverter;
import com.thoughtworks.xstream.converters.basic.IntConverter;
import com.thoughtworks.xstream.converters.basic.LongConverter;
import com.thoughtworks.xstream.converters.basic.NullConverter;
import com.thoughtworks.xstream.converters.basic.ShortConverter;
import com.thoughtworks.xstream.converters.basic.StringConverter;
import com.thoughtworks.xstream.converters.collections.CollectionConverter;
import com.thoughtworks.xstream.converters.reflection.PureJavaReflectionProvider;
import com.thoughtworks.xstream.converters.reflection.ReflectionConverter;
import com.thoughtworks.xstream.core.util.QuickWriter;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import com.thoughtworks.xstream.io.xml.PrettyPrintWriter;
import com.thoughtworks.xstream.io.xml.XppDriver;
import com.thoughtworks.xstream.security.NoTypePermission;
import com.thoughtworks.xstream.security.WildcardTypePermission;

/**
 * xml convert converter
 */
public class WxCpIsvXmlMessageStreamTransformer {

    private static final XStream X_STREAM = configWxCpIsvXmlMessage();

    private WxCpIsvXmlMessageStreamTransformer() {
        throw new AssertionError();
    }

    public static WxCpIsvXmlMessage fromXml(String xml) {

        WxCpIsvXmlMessageDto dto = (WxCpIsvXmlMessageDto) X_STREAM.fromXML(xml);
        WxCpIsvXmlMessage wxCpIsvXmlMessage = new WxCpIsvXmlMessage();
        BeanUtil.copyProperties(dto, wxCpIsvXmlMessage);

        return wxCpIsvXmlMessage;

    }

    private static XStream configWxCpIsvXmlMessage() {

        XStream xstream = getInstance();
        xstream.processAnnotations(WxCpIsvXmlMessageDto.class);

        return xstream;

    }

    private static XStream getInstance() {

        XppDriver xppDriver = new XppDriver() {

            @Override
            public HierarchicalStreamWriter createWriter(Writer out) {

                return new PrettyPrintWriter(out, getNameCoder()) {
                    private static final String PREFIX_CDATA = "<![CDATA[";

                    private static final String SUFFIX_CDATA = "]]>";

                    private static final String PREFIX_MEDIA_ID = "<MediaId>";

                    private static final String SUFFIX_MEDIA_ID = "</MediaId>";

                    private static final String PREFIX_REPLACE_NAME = "<ReplaceName>";

                    private static final String SUFFIX_REPLACE_NAME = "</ReplaceName>";

                    @Override
                    protected void writeText(QuickWriter writer, String text) {
                        if (text.startsWith(PREFIX_CDATA) && text.endsWith(SUFFIX_CDATA)) {
                            writer.write(text);
                        }
                        else if (text.startsWith(PREFIX_MEDIA_ID) && text.endsWith(SUFFIX_MEDIA_ID)) {
                            writer.write(text);
                        }
                        else if (text.startsWith(PREFIX_REPLACE_NAME) && text.endsWith(SUFFIX_REPLACE_NAME)) {
                            writer.write(text);
                        }
                        else {
                            super.writeText(writer, text);
                        }

                    }

                    @Override
                    public String encodeNode(String name) {
                        // prevent converting _ to __
                        return name;
                    }
                };

            }

        };

        XStream xstream = new XStream(new PureJavaReflectionProvider(), xppDriver) {

            @Override
            protected void setupConverters() {
                registerConverter(new NullConverter(), PRIORITY_VERY_HIGH);
                registerConverter(new IntConverter(), PRIORITY_NORMAL);
                registerConverter(new FloatConverter(), PRIORITY_NORMAL);
                registerConverter(new DoubleConverter(), PRIORITY_NORMAL);
                registerConverter(new LongConverter(), PRIORITY_NORMAL);
                registerConverter(new ShortConverter(), PRIORITY_NORMAL);
                registerConverter(new BooleanConverter(), PRIORITY_NORMAL);
                registerConverter(new ByteConverter(), PRIORITY_NORMAL);
                registerConverter(new StringConverter(), PRIORITY_NORMAL);
                registerConverter(new DateConverter(), PRIORITY_NORMAL);
                registerConverter(new CollectionConverter(getMapper()), PRIORITY_NORMAL);
                registerConverter(new ReflectionConverter(getMapper(), getReflectionProvider()), PRIORITY_VERY_LOW);
            }
        };
        xstream.ignoreUnknownElements();
        xstream.setMode(XStream.NO_REFERENCES);
        xstream.autodetectAnnotations(true);

        xstream.addPermission(NoTypePermission.NONE);
        xstream.addPermission(new WildcardTypePermission(new String[] {
                "me.chanjar.weixin.**", "cn.binarywang.wx.**", "com.github.binarywang.**", "com.vikadata.**"
        }));
        xstream.setClassLoader(Thread.currentThread().getContextClassLoader());

        return xstream;

    }

}
