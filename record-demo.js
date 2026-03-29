import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  // Ensure videos directory exists
  if (!fs.existsSync('videos')) {
    fs.mkdirSync('videos');
  }

  console.log('Starting browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    recordVideo: { 
        dir: 'videos/',
        size: { width: 1280, height: 720 }
    }
  });
  
  const page = await context.newPage();
  console.log('Navigating to http://localhost:4321...');
  
  try {
    await page.goto('http://localhost:4321', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    console.log('Recording demo (scrolling)...');
    // Auto-scroll demo
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 400);
      await page.waitForTimeout(1000);
    }

    console.log('Demo finished. Saving video...');
  } catch (error) {
    console.error('Error during recording:', error);
  } finally {
    await context.close();
    await browser.close();
    console.log('Process complete. Check the ./videos/ directory.');
  }
})();
