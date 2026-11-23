import { Router } from "express";
import * as userService from "./User.service.js";
import {
  authenticate,
  authorize,
  validation,
} from "../../middlewares/index.js";
import {
  updateProfileSchema,
  userIdSchema,
} from "../../Common/Validators/user.validators.js";

const userController = Router();

userController.get("/profile", authenticate, async (req, res, next) => {
  const data = await userService.getProfileService(req.user);
  res.status(200).json(data);
});

userController.put(
  "/update",
  authenticate,
  validation(updateProfileSchema),
  async (req, res, next) => {
    const user = await userService.updateProfileService(req.user, req.body);
    res.status(200).json({ userData: user });
  },
);

userController.get(
  "/listall",
  authenticate,
  authorize,
  async (req, res, next) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  },
);

userController.delete(
  "/:id",
  authenticate,
  validation(userIdSchema),
  async (req, res, next) => {
    const userData = await userService.deletUserAcountSoft(
      req.user,
      req.params.id,
    );
    res.status(200).json({ userData });
  },
);

export default userController;
