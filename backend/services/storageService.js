import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import { logger } from "../utils/logger.js";

class StorageService {
  constructor() {
    this.allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    this.maxFileSize = 10 * 1024 * 1024; // 10MB
  }

  async uploadFile(file, folder = "trackruit", resourceType = "auto") {
    try {
      // Validate file type
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        throw new Error(`File type ${file.mimetype} is not allowed`);
      }

      // Validate file size
      if (file.size > this.maxFileSize) {
        throw new Error(
          `File size ${file.size} exceeds maximum allowed size ${this.maxFileSize}`
        );
      }

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(
        file.path,
        folder,
        resourceType
      );

      logger.info(`File uploaded successfully: ${uploadResult.public_id}`);

      return {
        success: true,
        data: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
          width: uploadResult.width,
          height: uploadResult.height,
          resourceType: uploadResult.resource_type,
        },
      };
    } catch (error) {
      logger.error("File upload error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async uploadResume(file, userId) {
    const folder = `resumes/${userId}`;
    return this.uploadFile(file, folder, "raw");
  }

  async uploadAvatar(file, userId) {
    const folder = `avatars/${userId}`;
    return this.uploadFile(file, folder, "image");
  }

  async uploadDocument(file, userId, documentType) {
    const folder = `documents/${userId}/${documentType}`;
    return this.uploadFile(file, folder, "raw");
  }

  async deleteFile(publicId) {
    try {
      const deleteResult = await deleteFromCloudinary(publicId);

      if (deleteResult.result === "ok") {
        logger.info(`File deleted successfully: ${publicId}`);
        return {
          success: true,
          message: "File deleted successfully",
        };
      } else {
        throw new Error(`Delete failed: ${deleteResult.result}`);
      }
    } catch (error) {
      logger.error("File deletion error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async deleteUserFiles(userId, fileType = "all") {
    try {
      let pattern;
      switch (fileType) {
        case "resumes":
          pattern = `resumes/${userId}/*`;
          break;
        case "avatars":
          pattern = `avatars/${userId}/*`;
          break;
        case "documents":
          pattern = `documents/${userId}/*`;
          break;
        default:
          pattern = `*/${userId}/*`;
      }

      // Note: Cloudinary doesn't support pattern-based deletion in their basic API
      // In a real implementation, you'd list files and delete them individually
      logger.info(`Would delete files matching pattern: ${pattern}`);

      return {
        success: true,
        message: `File deletion for pattern ${pattern} would be implemented`,
      };
    } catch (error) {
      logger.error("Bulk file deletion error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getFileInfo(publicId) {
    try {
      // In Cloudinary, you can get file info using their admin API
      // This is a placeholder implementation
      logger.info(`Getting file info for: ${publicId}`);

      return {
        success: true,
        data: {
          publicId,
          exists: true,
          // Other file metadata would be returned here
        },
      };
    } catch (error) {
      logger.error("Get file info error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  validateFile(file) {
    const errors = [];

    if (!file) {
      errors.push("No file provided");
      return { isValid: false, errors };
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      errors.push(
        `File type ${
          file.mimetype
        } is not allowed. Allowed types: ${this.allowedMimeTypes.join(", ")}`
      );
    }

    if (file.size > this.maxFileSize) {
      errors.push(
        `File size ${(file.size / 1024 / 1024).toFixed(
          2
        )}MB exceeds maximum allowed size ${(
          this.maxFileSize /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  getFileExtension(mimetype) {
    const extensions = {
      "application/pdf": "pdf",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "docx",
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/jpg": "jpg",
    };

    return extensions[mimetype] || "bin";
  }

  generateFileName(originalName, userId, prefix = "file") {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = this.getFileExtension(originalName.split(".").pop());

    return `${prefix}_${userId}_${timestamp}_${randomString}.${extension}`;
  }
}

export const storageService = new StorageService();
export default storageService;
