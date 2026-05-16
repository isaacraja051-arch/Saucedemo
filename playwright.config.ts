import { defineConfig, devices } from '@playwright/test';
// If you want to use dotenv for environment variables, uncomment this line:
// import * as dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['allure-playwright']],
  use: {
    baseURL: 'https://www.saucedemo.com/',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    
  ],
});
