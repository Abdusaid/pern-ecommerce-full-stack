import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes.js";
import preferencesRoutes from "./routes/preferencesRoutes.js";
import { sql } from "./config/db.js";
import {aj} from "./lib/arcjet.js"
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000 ;
const __dirname = path.resolve();

app.use(express.json({limit: '10mb'})); // Increase limit for base64 images
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false,
})); // helmet is used to secure the app by setting various HTTP headers
app.use(morgan("dev")); // morgan is used to log HTTP requests to the console

// Apply arcjet rate-limit to all routes
app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if(decision.isDenied()) {
      if(decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too many requests"});
      } else if(decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied"});
      } else {
        res.status(403).json({ error: "Forbidden"});
      }
      return;
    }

    // check for spoofed bots
    if(decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: "Spoofed bot detected"});
      return;
    }

    next();
  } catch (error) {
    console.error("Error in Arcjet middleware: ", error);
    next(error);
  }
})
// PATH: Routes -> Controllers
app.use("/api/students", studentRoutes);
app.use("/api/preferences", preferencesRoutes);

if(process.env.NODE_ENV === "production") {
  // serve react app
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  })
}

async function initDB() {
   try {
      await sql `
        CREATE TABLE IF NOT EXISTS students (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          image TEXT NOT NULL,
          image_data TEXT,
          description TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql `
        CREATE TABLE IF NOT EXISTS user_preferences (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) UNIQUE NOT NULL,
          theme VARCHAR(50) DEFAULT 'forest',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
    console.log('Database initialized successfully!');
   } catch(error) {
    console.error("Error initializing database:", error);
   }
}

initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
})
