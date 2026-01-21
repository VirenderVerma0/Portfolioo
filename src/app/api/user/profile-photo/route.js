import { userController } from "@/lib/controllers/userController";

export const PATCH = (req) => userController.updateProfilePhoto(req);
