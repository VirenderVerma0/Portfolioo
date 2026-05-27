import { uploadController } from "@/lib/controllers/uploadController";

export const POST = async (req) => {
  return uploadController.uploadResume(req);
};
