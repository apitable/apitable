import { SegmentType, FieldType, t, Strings } from '@apitable/core';
import { Message } from 'pc/components/common';

export const useEnhanceTextClick = () => {
  const handleClick = (type: SegmentType | FieldType, text: string) => {
    let url = '';
    switch (type) {
      case SegmentType.Email:
      case FieldType.Email:
        url = `mailto:${text}`;
        break;
      case FieldType.Phone:
        url = `tel:${text}`;
        break;
      case SegmentType.Url:
      case FieldType.URL:
      default:
        try {
        // Verifying Address Legitimacy with URL Constructors
          const testURL = new URL(text);
          if (testURL.protocol && !/^javascript:/i.test(testURL.protocol)) {
            url = testURL.href;
          } else {
            Message.error({ content: t(Strings.message_invalid_url) });
            return;
          }
        } catch (error) {
          // No protocol header, add http protocol header by default
          try {
            const testURL = new URL(`http://${text}`);
            url = testURL.href;
          } catch (error) {
            Message.error({ content: t(Strings.message_invalid_url) });
            return;
          }
        }
    }
    if (url) {
      try {
        console.log('open:', url);
        const newWindow = window.open(url, '_blank', 'noopener=yes,noreferrer=yes');
        newWindow && ((newWindow as any).opener = null);
      } catch (error) {
        Message.error({ content: t(Strings.message_invalid_url) });
      }
    } else {
      Message.error({ content: t(Strings.message_invalid_url) });
    }
  };
  return handleClick;
};
