import {defineConfig} from '@playwright/test';
import {existsSync} from 'node:fs';
// Cloud sandboxes ship a preinstalled Chromium; elsewhere run `npx playwright install chromium`.
const executablePath=process.env.PW_CHROMIUM||(existsSync('/opt/pw-browsers/chromium')?'/opt/pw-browsers/chromium':undefined);
export default defineConfig({
 testDir:'tests/browser',testMatch:'**/*.spec.mjs',fullyParallel:true,reporter:'list',
 use:{baseURL:'http://localhost:4173',launchOptions:{executablePath}},
 webServer:{command:'node tests/browser/static-server.mjs',url:'http://localhost:4173/robots.txt',reuseExistingServer:!process.env.CI}
});
