export const dbName = "VeeKastDB";
export const reqLimit = "16kb";
export const MB = 1024 * 1024;
export const LARGE_UPLOAD_THRESHOLD_BYTES = (process.env.CLOUDINARY_LARGE_UPLOAD_THRESHOLD_MB ? Number(process.env.CLOUDINARY_LARGE_UPLOAD_THRESHOLD_MB) : 100) * MB;
export const CHUNK_SIZE = (process.env.CLOUDINARY_CHUNK_SIZE_MB ? Number(process.env.CLOUDINARY_CHUNK_SIZE_MB) : 6) * MB;
