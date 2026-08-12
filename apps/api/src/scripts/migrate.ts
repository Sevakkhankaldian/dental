import { loadConfig } from "../config/app-config.service.js";
import { runMigrations } from "../database/migrate.js";

await runMigrations(loadConfig());
process.stdout.write("Database migrations are current.\n");
