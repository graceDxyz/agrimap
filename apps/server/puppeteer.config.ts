import { join } from "path";
import { Configuration } from "puppeteer";

const puppeteerConfig: Configuration = {
  cacheDirectory: join(__dirname, "node_modules", ".cache", "puppeteer"),
};

export default puppeteerConfig;
