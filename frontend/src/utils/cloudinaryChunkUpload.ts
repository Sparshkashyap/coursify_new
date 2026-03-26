type SignedUploadParams = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

type ChunkUploadResult = {
  secure_url: string;
  public_id: string;
};

export const chunkedCloudinaryVideoUpload = async (
  file: File,
  signed: SignedUploadParams,
  onProgress?: (percent: number) => void
): Promise<ChunkUploadResult> => {
  const chunkSize = 20 * 1024 * 1024;
  const totalSize = file.size;
  const uploadId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}`;

  let start = 0;
  let finalResponse: any = null;

  while (start < totalSize) {
    const end = Math.min(start + chunkSize, totalSize);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("file", chunk);
    formData.append("api_key", signed.apiKey);
    formData.append("timestamp", String(signed.timestamp));
    formData.append("signature", signed.signature);
    formData.append("folder", signed.folder);

    const endpoint = `https://api.cloudinary.com/v1_1/${signed.cloudName}/video/upload`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "X-Unique-Upload-Id": uploadId,
        "Content-Range": `bytes ${start}-${end - 1}/${totalSize}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.error?.message || "Chunk upload failed");
    }

    finalResponse = result;
    start = end;

    if (onProgress) {
      const percent = Math.round((end / totalSize) * 100);
      onProgress(percent);
    }
  }

  return {
    secure_url: finalResponse.secure_url,
    public_id: finalResponse.public_id,
  };
};