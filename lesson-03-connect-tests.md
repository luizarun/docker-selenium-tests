# Lesson 3: Connecting Your Test Code to Dockerized Selenium

## What You'll Learn

- What WebDriver, ChromeDriver, and RemoteWebDriver are
- How Selenium WebDriver connects to a Docker container
- Write a simple test that uses the containerized browser
- Understand all the code you're writing (no copy-paste!)

---

## Part 1: Understanding the Terminology

Before we write any code, let's understand what all these terms mean.

### What is Selenium?

**Selenium** = A tool that lets your code control a web browser automatically

```
WITHOUT SELENIUM (Manual Testing):
┌─────────────────────────────────────────────────────────────┐
│  You (human) sit at computer                                │
│       │                                                     │
│       ▼                                                     │
│  Open Chrome → Type URL → Click buttons → Check results     │
│                                                             │
│  Problem: Slow, boring, humans make mistakes                │
└─────────────────────────────────────────────────────────────┘

WITH SELENIUM (Automated Testing):
┌─────────────────────────────────────────────────────────────┐
│  Your code tells Selenium what to do                        │
│       │                                                     │
│       ▼                                                     │
│  Selenium controls Chrome → Types URL → Clicks → Checks     │
│                                                             │
│  Benefit: Fast, consistent, runs 24/7                       │
└─────────────────────────────────────────────────────────────┘
```

---

### What is WebDriver?

**WebDriver** = The "language" that lets your code talk to browsers

Think of it like a translator:

```
┌──────────────┐    WebDriver     ┌──────────────┐
│  Your Code   │ ──────────────►  │   Browser    │
│              │    (translator)  │              │
│ "Click the   │                  │  *clicks*    │
│  login button│                  │              │
└──────────────┘                  └──────────────┘
```

**WebDriver is a STANDARD** - all browser companies agreed to support it:
- Chrome understands WebDriver commands
- Firefox understands WebDriver commands
- Safari understands WebDriver commands

---

### What is ChromeDriver?

**ChromeDriver** = A small program that translates WebDriver commands specifically for Chrome

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Your Code   │ ──► │ ChromeDriver │ ──► │    Chrome    │
│              │     │ (translator) │     │   Browser    │
└──────────────┘     └──────────────┘     └──────────────┘

Each browser needs its own "driver":
- Chrome    → ChromeDriver
- Firefox   → GeckoDriver
- Safari    → SafariDriver
- Edge      → EdgeDriver
```

**The Version Problem:**
- Chrome version 120 needs ChromeDriver version 120
- If they don't match = errors!
- Chrome auto-updates, breaking your tests

**This is why Docker helps** - the container has matching Chrome + ChromeDriver inside.

---

### What is RemoteWebDriver?

Now here's where Docker comes in.

**Regular WebDriver:** Your code talks to a browser on YOUR computer

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR COMPUTER                           │
│                                                             │
│  ┌──────────┐      ┌──────────────┐      ┌──────────┐      │
│  │Your Code │ ───► │ ChromeDriver │ ───► │  Chrome  │      │
│  └──────────┘      └──────────────┘      └──────────┘      │
│                                                             │
│  Everything runs locally on your machine                    │
└─────────────────────────────────────────────────────────────┘
```

**RemoteWebDriver:** Your code talks to a browser SOMEWHERE ELSE (like a Docker container!)

```
┌────────────────────────┐          ┌────────────────────────┐
│     YOUR COMPUTER      │   HTTP   │    DOCKER CONTAINER    │
│                        │  Request │                        │
│  ┌──────────────────┐  │          │  ┌──────────────────┐  │
│  │    Your Code     │  │ ───────► │  │  Selenium Server │  │
│  │                  │  │          │  │        │         │  │
│  │ RemoteWebDriver  │  │          │  │        ▼         │  │
│  │ "Go to google"   │  │          │  │  ChromeDriver    │  │
│  └──────────────────┘  │          │  │        │         │  │
│                        │          │  │        ▼         │  │
│                        │ ◄─────── │  │     Chrome       │  │
│                        │ Response │  └──────────────────┘  │
└────────────────────────┘          └────────────────────────┘
```

**Why "Remote"?** Because the browser is not on your computer - it's in the container. Your code sends commands over HTTP (network) to reach it.

---

### What is http://localhost:4444?

Let's break this down:

| Part | Meaning |
|------|---------|
| `http://` | The protocol (how to communicate) |
| `localhost` | "This computer" - means your own Mac |
| `:4444` | The port number |

**Wait, you said the browser is in Docker, not on my computer?**

Remember port mapping from Lesson 2?

```bash
docker run -p 4444:4444 ...
             │     │
             │     └── Container's port 4444
             └── Your computer's port 4444
```

So when your code connects to `localhost:4444`:
1. It goes to your computer's port 4444
2. Port mapping redirects it to the container's port 4444
3. Selenium Server inside the container receives it

```
Your Code                Your Mac              Container
    │                       │                      │
    │ "localhost:4444"      │                      │
    │ ────────────────────► │                      │
    │                       │ (port mapping)       │
    │                       │ ──────────────────►  │
    │                       │                      │ Selenium receives it!
```

---

### What is command_executor?

In Python code, you might see:

```python
driver = webdriver.Remote(
    command_executor="http://localhost:4444",  # ← What is this?
    options=webdriver.ChromeOptions()
)
```

**command_executor** = The URL where Selenium Server is running

Think of it as "where should I send my commands?"

```
command_executor = "http://localhost:4444"
                    └── "Send commands to this address"
```

It's called "executor" because it "executes" your commands.

---

### What is ChromeOptions?

**ChromeOptions** = Settings/preferences for how Chrome should behave

```
ChromeOptions = "How do you want Chrome configured?"

Examples:
┌─────────────────────────────────────────────────────────────┐
│  ChromeOptions                                              │
│  ├── headless = true      → Run without visible window     │
│  ├── window-size = 1920x1080  → Set screen size            │
│  ├── disable-gpu          → Don't use graphics card        │
│  ├── no-sandbox           → Required in some containers    │
│  └── accept-insecure-certs → Allow self-signed SSL         │
└─────────────────────────────────────────────────────────────┘
```

**In TypeScript:**

```typescript
const options = new Options();

// Example: Run Chrome without showing window (headless)
options.addArguments('--headless');

// Example: Set window size
options.addArguments('--window-size=1920,1080');
```

**Why do we need it even if empty?**

The code requires you to specify options even if you don't change anything. An empty `Options()` means "use default settings".

---

### What is Builder?

In TypeScript/JavaScript, we use a "Builder" pattern:

```typescript
const driver = await new Builder()
    .forBrowser('chrome')
    .usingServer('http://localhost:4444')
    .setChromeOptions(options)
    .build();
```

**Builder** = A way to construct something step by step

```
Think of it like ordering a burger:

┌────────────────────────────────────────────────────────┐
│  new BurgerBuilder()                                   │
│      .withBun('sesame')      // Step 1: Choose bun    │
│      .withPatty('beef')      // Step 2: Choose meat   │
│      .withCheese('cheddar')  // Step 3: Add cheese    │
│      .withSauce('ketchup')   // Step 4: Add sauce     │
│      .build();               // Final: Make it!       │
└────────────────────────────────────────────────────────┘

Same with WebDriver:

┌────────────────────────────────────────────────────────┐
│  new Builder()                                         │
│      .forBrowser('chrome')    // Step 1: I want Chrome │
│      .usingServer('...')      // Step 2: It's here     │
│      .setChromeOptions(...)   // Step 3: These settings│
│      .build();                // Final: Create it!     │
└────────────────────────────────────────────────────────┘
```

Each step configures one thing, and `.build()` creates the final WebDriver.

---

### Summary Table

| Term | Simple Explanation |
|------|-------------------|
| **Selenium** | Tool to control browsers with code |
| **WebDriver** | The language/protocol browsers understand |
| **ChromeDriver** | Translator program specifically for Chrome |
| **RemoteWebDriver** | Connects to a browser somewhere else (like Docker) |
| **localhost:4444** | Address of Selenium in your Docker container |
| **command_executor** | "Where to send commands" (the URL) |
| **ChromeOptions** | Settings for how Chrome should behave |
| **Builder** | Step-by-step way to create a WebDriver |

---

## Part 2: How Your Tests Connect to Docker

### The Problem Without Docker

When you run Selenium tests normally:

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR COMPUTER                            │
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │  Your Test   │ ──────► │ ChromeDriver │                 │
│  │   Code       │         │ + Chrome     │                 │
│  └──────────────┘         └──────────────┘                 │
│                                                             │
│  Problem: Chrome version must match ChromeDriver version!  │
│  Problem: Different Chrome versions on different machines! │
└─────────────────────────────────────────────────────────────┘
```

### The Solution With Docker

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────────┐         ┌──────────────────────────────┐ │
│  │  Your Test   │         │     DOCKER CONTAINER         │ │
│  │   Code       │ ──────► │  ┌────────────────────────┐  │ │
│  │              │   HTTP  │  │ ChromeDriver + Chrome  │  │ │
│  │ RemoteDriver │ :4444   │  │ (Always matching!)     │  │ │
│  └──────────────┘         │  └────────────────────────┘  │ │
│                           └──────────────────────────────┘ │
│                                                             │
│  Solution: Chrome & ChromeDriver are bundled together!     │
│  Solution: Same container = Same versions everywhere!      │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 2: Local WebDriver vs Remote WebDriver

### Local WebDriver (What You Might Have Used Before)

```java
// Java example
WebDriver driver = new ChromeDriver();  // Uses Chrome installed on YOUR computer
```

```python
# Python example
driver = webdriver.Chrome()  # Uses Chrome installed on YOUR computer
```

**Problems:**
- Needs Chrome installed on your computer
- Needs matching ChromeDriver version
- Different results on different machines

---

### Remote WebDriver (Connects to Docker Container)

```java
// Java example
WebDriver driver = new RemoteWebDriver(
    new URL("http://localhost:4444"),    // ← Container address!
    new ChromeOptions()
);
```

```python
# Python example
driver = webdriver.Remote(
    command_executor="http://localhost:4444",  # ← Container address!
    options=webdriver.ChromeOptions()
)
```

**Benefits:**
- Uses Chrome inside the container
- Always matching versions
- Same environment everywhere

---

## Part 3: The Connection Explained

When you use `RemoteWebDriver` with `http://localhost:4444`:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  Your Test Code                     Docker Container                │
│  ┌─────────────────────┐           ┌─────────────────────┐         │
│  │                     │   HTTP    │                     │         │
│  │ RemoteWebDriver     │ ────────► │  Selenium Server    │         │
│  │                     │  Request  │  (listening on 4444)│         │
│  │ "Go to google.com"  │           │         │           │         │
│  │                     │           │         ▼           │         │
│  │                     │           │  ┌─────────────┐    │         │
│  │                     │           │  │   Chrome    │    │         │
│  │                     │ ◄──────── │  │   Browser   │    │         │
│  │                     │  Response │  └─────────────┘    │         │
│  └─────────────────────┘           └─────────────────────┘         │
│                                                                     │
│  localhost:4444 works because of -p 4444:4444 port mapping!        │
└─────────────────────────────────────────────────────────────────────┘
```

**Step by step:**
1. Your test says "Go to google.com"
2. RemoteWebDriver sends HTTP request to `localhost:4444`
3. Port mapping routes it to container's port 4444
4. Selenium Server inside container receives the request
5. Selenium tells Chrome to open google.com
6. Chrome does it
7. Response goes back to your test

---

## Part 4: CI/CD Connection

In CI/CD (GitHub Actions), the URL changes slightly:

```
LOCAL DEVELOPMENT:
┌─────────────────────────────────────────────────────────────┐
│  Your Mac                                                   │
│                                                             │
│  Test → http://localhost:4444 → Container                   │
│                                                             │
│  Why localhost? Container runs on YOUR computer             │
└─────────────────────────────────────────────────────────────┘

CI/CD (GitHub Actions):
┌─────────────────────────────────────────────────────────────┐
│  GitHub's Server                                            │
│                                                             │
│  Test → http://selenium:4444 → Selenium Container           │
│                                                             │
│  Why "selenium"? That's the container's name in the         │
│  docker-compose or GitHub Actions service                   │
└─────────────────────────────────────────────────────────────┘
```

We'll learn more about this in Docker Compose lesson.

---

## 🔨 Hands-On Exercise 1: Start the Container

First, make sure your Selenium container is running:

```bash
# Check if it's already running
docker ps
```

**If you see selenium-chrome running:** Skip to Exercise 2

**If it's not running or doesn't exist:**

```bash
# Remove old container if exists
docker rm -f selenium-chrome 2>/dev/null

# Start fresh container (Apple Silicon)
docker run -d -p 4444:4444 --name selenium-chrome seleniarm/standalone-chromium

# Intel Mac users use:
# docker run -d -p 4444:4444 --name selenium-chrome selenium/standalone-chrome
```

**Verify it's running:**

```bash
docker ps
```

You should see `selenium-chrome` with status `Up`.

---

## 🔨 Hands-On Exercise 2: Test the Connection Manually

Before writing code, let's test the connection using curl (a command-line tool).

```bash
curl http://localhost:4444/status
```

**What you should see:**

```json
{"value":{"ready":true,"message":"Selenium Grid ready."...}}
```

**What this means:**
- `ready: true` = Selenium is ready to accept test connections
- Your test code will connect to this same URL

---

## 🔨 Hands-On Exercise 3: Choose Your Language

What programming language do you use for your tests?

### Option A: Python

Create a file called `test_docker_selenium.py`:

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# Connect to the Docker container
options = Options()
driver = webdriver.Remote(
    command_executor="http://localhost:4444",
    options=options
)

# Run a simple test
driver.get("https://www.google.com")
print(f"Page title: {driver.title}")

# Clean up
driver.quit()
print("Test completed successfully!")
```

**Run it:**

```bash
pip install selenium
python test_docker_selenium.py
```

---

### Option B: Java (Maven)

Create a file called `TestDockerSelenium.java`:

```java
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import java.net.URL;

public class TestDockerSelenium {
    public static void main(String[] args) throws Exception {
        // Connect to the Docker container
        ChromeOptions options = new ChromeOptions();
        WebDriver driver = new RemoteWebDriver(
            new URL("http://localhost:4444"),
            options
        );
        
        // Run a simple test
        driver.get("https://www.google.com");
        System.out.println("Page title: " + driver.getTitle());
        
        // Clean up
        driver.quit();
        System.out.println("Test completed successfully!");
    }
}
```

---

### Option C: JavaScript (Node.js)

Create a file called `test_docker_selenium.js`:

```javascript
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTest() {
    // Connect to the Docker container
    let driver = await new Builder()
        .forBrowser('chrome')
        .usingServer('http://localhost:4444')
        .setChromeOptions(new chrome.Options())
        .build();
    
    try {
        // Run a simple test
        await driver.get('https://www.google.com');
        let title = await driver.getTitle();
        console.log(`Page title: ${title}`);
        console.log('Test completed successfully!');
    } finally {
        await driver.quit();
    }
}

runTest();
```

**Run it:**

```bash
npm install selenium-webdriver
node test_docker_selenium.js
```

---

### Option D: TypeScript

**Step 1:** Create a project folder and initialize

```bash
mkdir docker-selenium-test
cd docker-selenium-test
npm init -y
```

**Step 2:** Install dependencies

```bash
npm install selenium-webdriver
npm install --save-dev typescript @types/selenium-webdriver ts-node
```

**What are we installing?**

| Package | Purpose |
|---------|---------|
| `selenium-webdriver` | The Selenium library to control browsers |
| `typescript` | TypeScript compiler |
| `@types/selenium-webdriver` | TypeScript type definitions for Selenium |
| `ts-node` | Run TypeScript files directly without compiling first |

**Step 3:** Create TypeScript config

Create a file called `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist"
  }
}
```

**Step 4:** Create test file

Create a file called `test_docker_selenium.ts`:

```typescript
import { Builder, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

async function runTest(): Promise<void> {
    // Connect to the Docker container
    const options = new Options();
    
    const driver: WebDriver = await new Builder()
        .forBrowser('chrome')
        .usingServer('http://localhost:4444')
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
```

### Line-by-Line Explanation

Let's understand every line:

```typescript
import { Builder, WebDriver } from 'selenium-webdriver';
```
| Part | Meaning |
|------|---------|
| `import` | Bring in code from another file/package |
| `{ Builder, WebDriver }` | The specific things we need |
| `from 'selenium-webdriver'` | The package we installed with npm |

---

```typescript
import { Options } from 'selenium-webdriver/chrome';
```
Importing Chrome-specific options from the selenium-webdriver package.

---

```typescript
async function runTest(): Promise<void> {
```
| Part | Meaning |
|------|---------|
| `async` | This function will wait for things (browser operations are slow) |
| `function runTest()` | Create a function named "runTest" |
| `: Promise<void>` | TypeScript type - means "returns nothing, but asynchronously" |

---

```typescript
const options = new Options();
```
Create Chrome options with default settings (we're not customizing anything).

---

```typescript
const driver: WebDriver = await new Builder()
```
| Part | Meaning |
|------|---------|
| `const driver` | Create a variable called "driver" |
| `: WebDriver` | TypeScript type - this is a WebDriver object |
| `await` | Wait for this to complete before continuing |
| `new Builder()` | Start building a WebDriver step by step |

---

```typescript
    .forBrowser('chrome')
```
"I want to control Chrome browser" (not Firefox, not Safari)

---

```typescript
    .usingServer('http://localhost:4444')
```
"Connect to Selenium at this address" (your Docker container!)

---

```typescript
    .setChromeOptions(options)
```
"Use these Chrome settings" (our default options from above)

---

```typescript
    .build();
```
"Okay, now actually create the WebDriver with all those settings"

---

```typescript
try {
```
"Try to do the following, and if anything fails, handle it gracefully"

---

```typescript
    await driver.get('https://www.google.com');
```
| Part | Meaning |
|------|---------|
| `await` | Wait for this to complete |
| `driver.get(...)` | Tell the browser to go to this URL |
| `'https://www.google.com'` | The website to open |

---

```typescript
    const title: string = await driver.getTitle();
```
| Part | Meaning |
|------|---------|
| `driver.getTitle()` | Ask the browser "what's the page title?" |
| `await` | Wait for the answer |
| `const title: string` | Store the answer in a variable called "title" |

---

```typescript
    console.log(`Page title: ${title}`);
```
Print the title to your terminal. The `${title}` inserts the variable's value.

---

```typescript
} finally {
    await driver.quit();
}
```
| Part | Meaning |
|------|---------|
| `finally` | "No matter what happens (success or error), always do this" |
| `driver.quit()` | Close the browser and clean up |

**Why finally?** If your test crashes, the browser would stay open forever. `finally` ensures we always close it.

---

```typescript
runTest().catch(console.error);
```
| Part | Meaning |
|------|---------|
| `runTest()` | Call our function to run the test |
| `.catch(console.error)` | If anything fails, print the error |

---

### Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    What happens when you run it:            │
│                                                             │
│  1. Build WebDriver → connects to localhost:4444            │
│                          │                                  │
│  2. driver.get()    → browser opens google.com              │
│                          │                                  │
│  3. getTitle()      → browser returns "Google"              │
│                          │                                  │
│  4. console.log()   → prints "Page title: Google"           │
│                          │                                  │
│  5. driver.quit()   → browser closes                        │
└─────────────────────────────────────────────────────────────┘
```

---

**Step 5:** Run the test

```bash
npx ts-node test_docker_selenium.ts
```

**What is npx ts-node?**

| Part | Meaning |
|------|---------|
| `npx` | Run a package without installing it globally |
| `ts-node` | A tool that runs TypeScript files directly |
| `test_docker_selenium.ts` | Your test file |

**Expected output:**

```
Page title: Google
Test completed successfully!
```

---

### TypeScript with Playwright (Alternative)

If you prefer Playwright over Selenium, you can also connect to Docker:

```typescript
import { chromium } from 'playwright';

async function runTest(): Promise<void> {
    // Connect to Docker container running Playwright
    const browser = await chromium.connect('ws://localhost:4444');
    
    const page = await browser.newPage();
    await page.goto('https://www.google.com');
    
    console.log(`Page title: ${await page.title()}`);
    
    await browser.close();
    console.log('Test completed successfully!');
}

runTest().catch(console.error);
```

Note: Playwright requires a different Docker image. We'll cover this in a later lesson.

---

## 🔨 Hands-On Exercise 4: Watch It Happen

While your test runs, watch the Selenium Grid dashboard:

1. Open `http://localhost:4444` in your browser
2. Run your test
3. Watch the "Sessions" count go from 0 → 1 → 0

```
Before test:          During test:          After test:
┌────────────┐       ┌────────────┐        ┌────────────┐
│ Sessions   │       │ Sessions   │        │ Sessions   │
│    0/1     │  →    │    1/1     │   →    │    0/1     │
└────────────┘       └────────────┘        └────────────┘
```

---

## Part 5: What Happens If Container Is Not Running?

Let's see what error you get:

### 🔨 Hands-On Exercise 5: Simulate Failure

**Step 1:** Stop the container

```bash
docker stop selenium-chrome
```

**Step 2:** Try to run your test again

You should get an error like:

```
ConnectionRefusedError: [Errno 61] Connection refused
```

or

```
WebDriverException: Could not start a new session
```

**Why?** Your test tried to connect to `localhost:4444`, but nothing is listening there anymore!

**Step 3:** Start the container again

```bash
docker start selenium-chrome
```

**Step 4:** Run your test again - it should work now.

**Lesson:** Always make sure your Selenium container is running before running tests!

---

## Summary

| Concept | Explanation |
|---------|-------------|
| **Local WebDriver** | Uses browser on your computer. `new ChromeDriver()` |
| **Remote WebDriver** | Connects to browser in container. `new RemoteWebDriver(URL, options)` |
| **localhost:4444** | Address of Selenium in Docker (when running locally) |
| **Port 4444** | Standard port for Selenium Grid |
| **Container must be running** | Or you get "Connection refused" |

---

## Quick Reference Card

```
┌────────────────────────────────────────────────────────────────┐
│                   LESSON 3 CHEAT SHEET                         │
├────────────────────────────────────────────────────────────────┤
│ Check container running:    docker ps                          │
│ Start stopped container:    docker start selenium-chrome       │
│ Check Selenium ready:       curl http://localhost:4444/status  │
├────────────────────────────────────────────────────────────────┤
│ Python connection:                                             │
│   driver = webdriver.Remote(                                   │
│       command_executor="http://localhost:4444",                │
│       options=webdriver.ChromeOptions()                        │
│   )                                                            │
├────────────────────────────────────────────────────────────────┤
│ Java connection:                                               │
│   WebDriver driver = new RemoteWebDriver(                      │
│       new URL("http://localhost:4444"),                        │
│       new ChromeOptions()                                      │
│   );                                                           │
├────────────────────────────────────────────────────────────────┤
│ Selenium Grid UI:           http://localhost:4444              │
└────────────────────────────────────────────────────────────────┘
```

---

## Next Lesson

**Lesson 4: Creating Your First Dockerfile**
- Build your own Docker image
- Package your test code in a container
- Understand Dockerfile instructions
