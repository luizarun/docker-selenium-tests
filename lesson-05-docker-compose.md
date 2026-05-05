# Lesson 5: Docker Compose - Running Multiple Containers Together

## What You'll Learn

- What Docker Compose is and why you need it
- Write a docker-compose.yml file
- Connect containers so they can talk to each other
- Start everything with one command

---

## Part 1: The Problem We're Solving

From Lesson 4, you saw this error:

```
Error: connect ECONNREFUSED 127.0.0.1:4444
```

**The problem:** Two containers can't find each other using `localhost`.

**The solution:** Docker Compose creates a network where containers find each other by **name**.

---

## Part 2: What is Docker Compose?

**Docker Compose** = A tool to run multiple containers together.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  WITHOUT Docker Compose (painful):                          │
│                                                             │
│  Terminal 1: docker run --network mynet --name selenium ... │
│  Terminal 2: docker run --network mynet --name test ...     │
│  Terminal 3: docker network create mynet                    │
│                                                             │
│  Many commands, easy to mess up!                            │
│                                                             │
│  ───────────────────────────────────────────────────────────│
│                                                             │
│  WITH Docker Compose (easy):                                │
│                                                             │
│  docker-compose up                                          │
│                                                             │
│  One command, everything starts!                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 3: The docker-compose.yml File

Docker Compose uses a YAML file to define your containers.

### Basic Structure

```yaml
version: '3.8'

services:
  service-name-1:
    # configuration for first container
  
  service-name-2:
    # configuration for second container
```

### What Each Part Means

```yaml
version: '3.8'
```
| Part | Meaning |
|------|---------|
| `version` | Which version of Compose file format |
| `'3.8'` | A modern, stable version |

---

```yaml
services:
```
| Part | Meaning |
|------|---------|
| `services` | "Here are the containers I want to run" |

---

```yaml
services:
  selenium:
    image: seleniarm/standalone-chromium
```
| Part | Meaning |
|------|---------|
| `selenium:` | Name of this service (container) |
| `image:` | Which Docker image to use |

---

## Part 4: Our docker-compose.yml

Let's create one for your test setup:

```yaml
version: '3.8'

services:
  # Selenium browser container
  selenium:
    image: seleniarm/standalone-chromium
    ports:
      - "4444:4444"
  
  # Your test container
  test:
    build: .
    depends_on:
      - selenium
    environment:
      - SELENIUM_URL=http://selenium:4444
```

### Line-by-Line Explanation

```yaml
version: '3.8'
```
Compose file format version. Use 3.8 for modern Docker.

---

```yaml
services:
```
Start defining containers.

---

```yaml
  selenium:
```
First container, named "selenium". **This name is important** - it becomes the hostname other containers use to find it!

---

```yaml
    image: seleniarm/standalone-chromium
```
Use the Selenium image from Docker Hub (for Apple Silicon).

---

```yaml
    ports:
      - "4444:4444"
```
Map port 4444. Same as `-p 4444:4444` in docker run.

---

```yaml
  test:
```
Second container, named "test".

---

```yaml
    build: .
```
Build image from Dockerfile in current directory (`.`). Instead of using a pre-built image, build from your Dockerfile.

---

```yaml
    depends_on:
      - selenium
```
| Part | Meaning |
|------|---------|
| `depends_on:` | "Wait for these containers first" |
| `- selenium` | Wait for selenium container to start |

This ensures Selenium starts before your test.

---

```yaml
    environment:
      - SELENIUM_URL=http://selenium:4444
```
| Part | Meaning |
|------|---------|
| `environment:` | Set environment variables |
| `SELENIUM_URL` | Variable name |
| `http://selenium:4444` | Container name, not localhost! |

**Key point:** We use `selenium` (container name) instead of `localhost`.

---

## Part 5: How Containers Find Each Other

Docker Compose creates a **network** automatically. Containers use **service names** as hostnames.

```
┌─────────────────────────────────────────────────────────────┐
│                 Docker Compose Network                      │
│                                                             │
│  ┌──────────────────┐      ┌──────────────────┐            │
│  │  test            │      │  selenium        │            │
│  │  (your test)     │      │  (browser)       │            │
│  │                  │      │                  │            │
│  │  http://selenium │ ───► │  Port 4444 ✅    │            │
│  │  :4444           │      │                  │            │
│  └──────────────────┘      └──────────────────┘            │
│                                                             │
│  "selenium" = hostname of the selenium container           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Before (didn't work):**
```typescript
.usingServer('http://localhost:4444')  // ❌ localhost = self
```

**After (works!):**
```typescript
.usingServer('http://selenium:4444')   // ✅ selenium = other container
```

---

## Part 6: Update Your Test Code

We need to change `localhost` to use an environment variable.

### Why Environment Variable?

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  LOCAL DEVELOPMENT (on your Mac):                           │
│  SELENIUM_URL = http://localhost:4444                       │
│                                                             │
│  DOCKER COMPOSE:                                            │
│  SELENIUM_URL = http://selenium:4444                        │
│                                                             │
│  Same code, different URL depending on where it runs!       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Updated Test Code

```typescript
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
        await driver.get('https://www.google.com');
        const title: string = await driver.getTitle();
        console.log(`Page title: ${title}`);
        console.log('Test completed successfully!');
    } finally {
        await driver.quit();
    }
}

runTest().catch(console.error);
```

### What Changed?

```typescript
// OLD (hardcoded):
.usingServer('http://localhost:4444')

// NEW (flexible):
const seleniumUrl = process.env.SELENIUM_URL || 'http://localhost:4444';
.usingServer(seleniumUrl)
```

| Code | Meaning |
|------|---------|
| `process.env.SELENIUM_URL` | Get value from environment variable |
| `\|\|` | "OR" - if variable doesn't exist, use the fallback |
| `'http://localhost:4444'` | Fallback for local development |

This works in BOTH situations:
- **Local:** No env var set → uses localhost
- **Docker Compose:** SELENIUM_URL set → uses container name

---

## Part 7: Complete Setup

### File Structure

```
docker-selenium-test/
├── docker-compose.yml      ← New file!
├── Dockerfile              ← Already exists
├── package.json            ← Already exists
├── tsconfig.json           ← Already exists
└── test_docker_selenium.ts ← Update this!
```

### docker-compose.yml (Create This)

```yaml
version: '3.8'

services:
  selenium:
    image: seleniarm/standalone-chromium
    ports:
      - "4444:4444"
  
  test:
    build: .
    depends_on:
      - selenium
    environment:
      - SELENIUM_URL=http://selenium:4444
```

### test_docker_selenium.ts (Update This)

```typescript
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
        await driver.get('https://www.google.com');
        const title: string = await driver.getTitle();
        console.log(`Page title: ${title}`);
        console.log('Test completed successfully!');
    } finally {
        await driver.quit();
    }
}

runTest().catch(console.error);
```

---

## Part 8: Docker Compose Commands

### Start Everything

```bash
docker-compose up
```

This:
1. Creates the network
2. Starts selenium container
3. Builds your test image (if needed)
4. Starts test container
5. Shows all logs

### Start in Background

```bash
docker-compose up -d
```

The `-d` means "detached" (background).

### Stop Everything

```bash
docker-compose down
```

Stops and removes all containers.

### Rebuild and Start

```bash
docker-compose up --build
```

If you changed your code, use `--build` to rebuild the image.

---

## 🔨 Hands-On Exercise 1: Create docker-compose.yml

**Task:** Create the docker-compose.yml file in your test folder.

```bash
cd /Users/ludovicus/docker-learning-guide/docker-selenium-test
```

Create `docker-compose.yml` with this content:

```yaml
version: '3.8'

services:
  selenium:
    image: seleniarm/standalone-chromium
    ports:
      - "4444:4444"
  
  test:
    build: .
    depends_on:
      - selenium
    environment:
      - SELENIUM_URL=http://selenium:4444
```

---

## 🔨 Hands-On Exercise 2: Update Test Code

**Task:** Update your test file to use the environment variable.

Update `test_docker_selenium.ts`:

```typescript
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
        await driver.get('https://www.google.com');
        const title: string = await driver.getTitle();
        console.log(`Page title: ${title}`);
        console.log('Test completed successfully!');
    } finally {
        await driver.quit();
    }
}

runTest().catch(console.error);
```

---

## 🔨 Hands-On Exercise 3: Stop Old Containers

**Task:** Stop any old containers that might conflict.

```bash
docker stop selenium-chrome 2>/dev/null
docker rm selenium-chrome 2>/dev/null
```

---

## 🔨 Hands-On Exercise 4: Run with Docker Compose

**Task:** Start everything!

```bash
docker-compose up --build
```

**What you should see:**

```
Creating network "docker-selenium-test_default" with the default driver
Creating docker-selenium-test_selenium_1 ... done
Creating docker-selenium-test_test_1     ... done
Attaching to docker-selenium-test_selenium_1, docker-selenium-test_test_1
selenium_1  | Starting Selenium...
test_1      | Connecting to Selenium at: http://selenium:4444
test_1      | Page title: Google
test_1      | Test completed successfully!
docker-selenium-test_test_1 exited with code 0
```

---

## Part 9: Troubleshooting

### Problem: Selenium not ready yet

Sometimes test starts before Selenium is ready.

**Solution:** Add a wait/retry in docker-compose.yml or test code.

For docker-compose.yml, add healthcheck:

```yaml
services:
  selenium:
    image: seleniarm/standalone-chromium
    ports:
      - "4444:4444"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4444/status"]
      interval: 5s
      timeout: 5s
      retries: 10
  
  test:
    build: .
    depends_on:
      selenium:
        condition: service_healthy
    environment:
      - SELENIUM_URL=http://selenium:4444
```

This waits for Selenium to be truly ready before starting tests.

---

## Part 10: CI/CD Preview

In GitHub Actions, you'd use Docker Compose like this:

```yaml
name: Run Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Run tests with Docker Compose
        run: docker-compose up --build --abort-on-container-exit
```

The `--abort-on-container-exit` stops everything when your test container exits.

---

## Summary

| Concept | Explanation |
|---------|-------------|
| **Docker Compose** | Tool to run multiple containers together |
| **docker-compose.yml** | File that defines your containers |
| **services:** | The containers you want to run |
| **image:** | Use existing image from Docker Hub |
| **build:** | Build image from Dockerfile |
| **depends_on:** | Start this container after another |
| **environment:** | Set environment variables |
| **Container names as hostnames** | `http://selenium:4444` instead of localhost |

---

## Quick Reference Card

```
┌────────────────────────────────────────────────────────────────┐
│                   LESSON 5 CHEAT SHEET                         │
├────────────────────────────────────────────────────────────────┤
│ Start all containers:       docker-compose up                  │
│ Start in background:        docker-compose up -d               │
│ Start with rebuild:         docker-compose up --build          │
│ Stop all containers:        docker-compose down                │
│ View logs:                  docker-compose logs                │
│ View specific logs:         docker-compose logs test           │
├────────────────────────────────────────────────────────────────┤
│ Containers find each other by SERVICE NAME:                   │
│                                                                │
│   services:                                                    │
│     selenium:    ← Other containers use "selenium" as hostname│
│     test:        ← Other containers use "test" as hostname    │
├────────────────────────────────────────────────────────────────┤
│ localhost inside container = that container only              │
│ service-name inside network = the other container             │
└────────────────────────────────────────────────────────────────┘
```

---

## What You Accomplished

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  BEFORE (Lesson 4):                                         │
│  docker run my-selenium-test  →  ❌ ECONNREFUSED            │
│                                                             │
│  ───────────────────────────────────────────────────────────│
│                                                             │
│  AFTER (Lesson 5):                                          │
│  docker-compose up  →  ✅ Test passed!                      │
│                                                             │
│  Both containers on same network, finding each other by     │
│  name!                                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Next Lesson

**Lesson 6: CI/CD Integration**
- Run your Docker tests in GitHub Actions
- Automate test runs on every push
- Real-world CI/CD pipeline
