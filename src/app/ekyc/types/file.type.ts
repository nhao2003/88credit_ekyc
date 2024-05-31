export interface FileInput {
  file: Express.Multer.File;
  title: string;
  description: string;
}

export interface FileResponse {
  /**
   * The message associated with the file response.
   */
  message: string;

  /**
   * The details of the file object.
   */
  object: {
    /**
     * The name of the file.
     */
    fileName: string;

    /**
     * The token ID associated with the file.
     */
    tokenId: string;

    /**
     * The description of the file.
     */
    description: string;

    /**
     * The storage type of the file.
     */
    storageType: string;

    /**
     * The title of the file.
     */
    title: string;

    /**
     * The date when the file was uploaded.
     */
    uploadedDate: string;

    /**
     * The hash value of the file.
     */
    hash: string;

    /**
     * The type of the file.
     */
    fileType: string;
  };
}
