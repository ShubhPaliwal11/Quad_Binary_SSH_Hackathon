import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mock Mi Band Data
  app.get("/api/band-data", (req, res) => {
    const hourlySteps = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      steps: Math.floor(Math.random() * 800) + 100,
    }));

    res.json({
      steps: 8245,
      distance: 5.2,
      calories: 320,
      goal: 10000,
      spo2: 97.5,
      currentHeartRate: 89,
      battery: 85,
      isConnected: true,
      hourlySteps,
      lastSync: new Date().toISOString(),
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
