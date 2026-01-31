import express from "express";
import {
  getGlobalTheme,
  updateGlobalTheme
} from "../controllers/preferencesController.js";

const router = express.Router();

router.get("/theme", getGlobalTheme);
router.put("/theme", updateGlobalTheme);

export default router;
