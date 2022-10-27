export interface IFileInterface {
  /** Field name specified in the form */
  fieldName: string;
  /** Name of the file on the user's computer */
  originalName: string;
  /** Mime type of the file */
  mimetype: string;
  /** Size of the file in bytes */
  size?: number;
  /** The folder to which the file has been saved (DiskStorage) */
  destination: string;
  /** The name of the file within the destination (DiskStorage) */
  filename: string;
  /** Location of the uploaded file (DiskStorage) */
  path: string;
}
