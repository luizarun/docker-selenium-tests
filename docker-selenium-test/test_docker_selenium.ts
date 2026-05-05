import { Builder, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

async function runTest(): Promise<void> {
    const options = new Options();
    
    // Use environment variable, fallback to localhost for local development
    const seleniumUrl = process.env.SELENIUM_URL || 'http://localhost:4444';
    
    console.log(`Connecting to Selenium at: ${seleniumUrl}`);
    
    const driver: WebDriver = await new Builder()
        .forBrowser('chrome')
        .usingServer(seleniumUrl)
        .setChromeOptions(options)
        .build();
    
    try {
        // Run a simple test
        await driver.get('https://www.google.com');
        const title: string = await driver.getTitle();
        console.log(`Page title: ${title}`);
        console.log('Test completed successfully!');
    } finally {
        // Always clean up
        await driver.quit();
    }
}

// Run the test
runTest().catch(console.error);