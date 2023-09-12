export const handleDownload = (json: object, name: string) => {
  const jsonData = JSON.stringify(json);
  const blobData = new Blob([jsonData], { type: 'application/json' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blobData);
  downloadLink.download = name;
  downloadLink.click();
};
