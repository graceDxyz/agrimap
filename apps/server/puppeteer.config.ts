import { join } from "path";
import { Configuration } from "puppeteer";

const puppeteerConfig: Configuration = {
  cacheDirectory: join("/", "root", ".cache", "puppeteer"),
};

export default puppeteerConfig;
