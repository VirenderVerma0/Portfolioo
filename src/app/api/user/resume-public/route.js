import { userController } from "@/lib/controllers/userController";

export const GET = async () => {
  return userController.getPublicResume();
};
