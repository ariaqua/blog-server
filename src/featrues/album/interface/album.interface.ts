export interface MulterFileType {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface MulterFile {
  id?: number;
  url: string;
}
