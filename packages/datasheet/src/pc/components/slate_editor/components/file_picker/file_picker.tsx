import { useCallback, useRef, useMemo, forwardRef, useEffect } from 'react';
import * as React from 'react';

export interface IPreviewFile extends File {
  preview?: string;
}
interface IFilePickerProps {
  children: React.ReactElement;
  accept?: string | RegExp;
  onChange?: (files: File | IPreviewFile | Array<File | IPreviewFile>) => void;
  limitSize?: number | Array<number>;
  disabled?: boolean;
  needPreview?: boolean;
  onError?: (errorType: 'format' | 'size') => void;
}

export const FilePicker = forwardRef((props: IFilePickerProps, ref) => {
  const { onChange, accept = '*', limitSize, disabled, children, onError, needPreview } = props;

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const refType = typeof ref;
    if (!ref) {
      return ;
    }
    switch (refType) {
      case 'object':
        (ref as React.MutableRefObject<any>).current = input.current;
        break;
      case 'function':
        (ref as (instance: any) => void)(input.current);
        break;
      default:
        break;
    }
  });

  const inputAccept = useMemo(() => {
    return typeof accept === 'string' ? accept : '*';
  }, [accept]);

  const checkFileType = useCallback((file: File) => {
    let reg = accept;
    let pass = true;
    if (!accept || accept === '*') {
      return pass;
    }
    if (typeof accept === 'string') {
      reg = new RegExp(accept, 'i');
      pass = reg.test(file.type);
    } else {
      pass = (reg as RegExp).test(file.name);
    }
    return pass;
  }, [accept]);

  const checkFileSize = useCallback((file: File) => {
    if (!limitSize) {
      return true;
    }
    // size Within the limits
    if (Array.isArray(limitSize)) {
      return file.size > limitSize[0] && file.size < limitSize[1];
    }
    // Limit the maximum value of size 
    return file.size < limitSize;
  }, [limitSize]);

  const addPreview = useCallback((file: File) => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onabort = () => resolve(file);
      reader.onerror = () => resolve(file);
      reader.onload = () => {
        const url = reader.result as string;
        (file as IPreviewFile).preview = url;
        resolve(file);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (!target) {
      return;
    }
    const file = (target as any).files[0];
    if (!checkFileType(file)) {
      onError && onError('format');
      return;
    }
    if (!checkFileSize(file)) {
      onError && onError('size');
      return;
    }

    if (needPreview) {
      addPreview(file)
        .then((result: any) => {
          onChange && onChange(result);
        });
    } else {
      onChange && onChange(file as IPreviewFile);
    }

  }, [onError, onChange, checkFileType, checkFileSize, needPreview, addPreview]);

  const trigger = useCallback(() => {
    if (disabled) {
      return;
    }
    if (input && input.current) {
      input.current.click();
    }
  }, [disabled]);

  const childProps = useMemo(() => {
    const childClick = children.props.onClick;
    const onClick = (e: React.MouseEvent) => {
      trigger();
      if (childClick) {
        childClick(e);
      }
    };

    return { ...children.props, onClick };
  }, [children, trigger]);

  return (<>
    <input ref={input} type="file" accept={inputAccept} contentEditable={false} disabled={disabled} hidden onChange={handleFileChange} />
    {React.cloneElement(children, childProps)}
  </>);
});