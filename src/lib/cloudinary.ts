import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export { cloudinary };

export async function uploadToCloudinary(file: Buffer, options: { folder?: string; resourceType?: 'image'|'raw'|'auto' } = {}) {
  return new Promise<{ url: string; publicId: string; size?: number; width?: number; height?: number }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: options.folder || 'agrifusion', resource_type: options.resourceType || 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result!.secure_url, publicId: result!.public_id, size: result!.bytes, width: result!.width, height: result!.height });
      }
    );
    stream.end(file);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}
