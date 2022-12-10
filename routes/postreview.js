import express from "express";
import sql from "mysql2/promise";

import * as auth from "../auth.js";
import * as sv from "../server.js";

export const router = express.Router();

