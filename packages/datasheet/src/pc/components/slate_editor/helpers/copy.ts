export const copy = (text: string, editorData?: string) => {
  const handleCopy = (e: ClipboardEvent) => {
    e.clipboardData?.setData('text/plain', text);
    if (editorData) {
      e.clipboardData?.setData(
        'application/vika-editor-data',
        window.btoa(encodeURIComponent(editorData))
      );
    }
    e.preventDefault();
  };
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.setAttribute('style', 'position: "absolute"; left: "-9999px";');
  window.document.body.appendChild(el);
  let selection = document.getSelection();
  let selected: any = null;
  if (selection) {
    selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  }
  el.select();
  let success = false;
  document.addEventListener('copy', handleCopy);
  try {
    const successful = document.execCommand('copy');
    success = !!successful;
  } catch (err) {
    success = false;
  }
  window.document.body.removeChild(el);
  if (selected && document.getSelection) {
    selection = document.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(selected);
    }
  }
  document.removeEventListener('copy', handleCopy);
  return success ? Promise.resolve() : Promise.reject();
};
