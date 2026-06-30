/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static index.html
const isProduction = process.env.NODE_ENV === "production";
const publicDir = isProduction ? path.join(process.cwd(), "dist") : process.cwd();

// Serve static assets
app.use(express.static(publicDir));

// Fallback all routes to the single index.html file
app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Museu Virtual de Fósseis server listening on http://0.0.0.0:${PORT}`);
});
