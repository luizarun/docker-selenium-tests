# Lesson 2: Running Selenium Browser in Docker

## What You'll Learn

- Pull a real Docker image (Selenium Chrome)
- Run a browser inside a container
- Access the browser from your computer
- Understand port mapping

---

## Part 1: Pull the Selenium Chrome Image

In Lesson 1, `docker run` automatically downloaded the image. Now let's do it manually.

### Command: docker pull

**First, check your Mac type:**
- Apple menu () → "About This Mac" → Check "Chip"

**Use the correct image for your Mac:**

| Your Mac | Image to Use |
|----------|-------------|
| Apple Silicon (M1/M2/M3/M4) | `seleniarm/standalone-chromium` |
| Intel | `selenium/standalone-chrome` |

```bash
# For Apple Silicon Mac (M1/M2/M3/M4):
docker pull seleniarm/standalone-chromium

# For Intel Mac:
docker pull selenium/standalone-chrome
```

> **Why different images?** Docker images are built for specific CPU types. Apple Silicon uses ARM64 chips, Intel Macs use AMD64. Using the wrong image will give you an error.

**What this does:**
- Downloads the image from Docker Hub
- Saves it on your computer
- Does NOT run it yet

```
┌─────────────────────────────────────────────────────────────┐
│ docker pull = Download only (like downloading an app)       │
│ docker run  = Download (if needed) + Run                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔨 Hands-On Exercise 1

**Task:** Pull the Selenium Chrome image (use the one for your Mac)

```bash
# Apple Silicon Mac:
docker pull seleniarm/standalone-chromium

# Intel Mac:
docker pull selenium/standalone-chrome
```

**After it finishes, verify by running:**

```bash
docker images
```

**What you should see:**

```
REPOSITORY                     TAG       IMAGE ID       SIZE
selenium/standalone-chrome     latest    xxxxxxxxxxxx   1.2GB
hello-world                    latest    xxxxxxxxxxxx   13.3kB
```

### ✅ Checkpoint

Answer these:
1. How big is the selenium/standalone-chrome image? (check SIZE column)
2. Why is it so much bigger than hello-world?

<details>
<summary>Click to see answers</summary>

1. Around 1.2GB (may vary slightly)
2. Because it contains: Linux OS + Chrome browser + Selenium + Java runtime

</details>

---

## Part 2: Run the Selenium Container

Now let's run it. But this time we need to understand several new options.

### The Full Command

```bash
# Apple Silicon Mac:
docker run -d -p 4444:4444 --name selenium-chrome seleniarm/standalone-chromium

# Intel Mac:
docker run -d -p 4444:4444 --name selenium-chrome selenium/standalone-chrome
```

**Don't just copy-paste!** Let's understand each piece:

---

### Piece 1: `docker run`

```bash
docker run
```

**What it does:** Creates a container from an image and starts it

You already know this from Lesson 1 when you ran `docker run hello-world`

---

### Piece 2: `-d` (Detached Mode)

```bash
docker run -d
```

**What it does:** Run in **d**etached mode (background)

```
WITHOUT -d:
┌─────────────────────────────────────────┐
│ Terminal                                │
│                                         │
│ $ docker run seleniarm/standalone...    │
│ Starting Selenium...                    │
│ Selenium ready...                       │
│ (cursor stuck here, can't type)         │  ← Terminal is BLOCKED
│ █                                       │
└─────────────────────────────────────────┘

WITH -d:
┌─────────────────────────────────────────┐
│ Terminal                                │
│                                         │
│ $ docker run -d seleniarm/standalone... │
│ a1b2c3d4e5f6...                         │  ← Returns container ID
│ $                                       │  ← You can type again!
│ █                                       │
└─────────────────────────────────────────┘
```

**When to use:** When you want the container to run in the background so you can keep using your terminal.

---

### Piece 3: `-p 4444:4444` (Port Mapping)

```bash
docker run -d -p 4444:4444
```

**What it does:** **P**ort mapping - connects your computer to the container

**Format:** `-p YOUR_COMPUTER_PORT:CONTAINER_PORT`

```
The Selenium container runs Chrome inside it. 
But you can't access it unless you "open a door" between your computer and the container.

WITHOUT PORT MAPPING:
┌─────────────────┐         ┌─────────────────┐
│  Your Computer  │   ❌    │    Container    │
│                 │ blocked │  Chrome on 4444 │
└─────────────────┘         └─────────────────┘

WITH -p 4444:4444:
┌──────────────────┐         ┌──────────────────┐
│  YOUR COMPUTER   │         │    CONTAINER     │
│                  │         │                  │
│   Port 4444 ◄────────────────► Port 4444     │
│                  │         │  (Selenium runs  │
│                  │         │   on this port)  │
└──────────────────┘         └──────────────────┘

Now when you visit http://localhost:4444 on your computer,
it goes to port 4444 inside the container!
```

**Why 4444?** Selenium Grid always runs on port 4444 by default. That's the standard.

**Can you use different numbers?**

```bash
# Yes! Example:
-p 5555:4444

# This means:
# Your computer port 5555 → Container port 4444
# You'd visit http://localhost:5555 instead
```

---

### Piece 4: `--name selenium-chrome` (Container Name)

```bash
docker run -d -p 4444:4444 --name selenium-chrome
```

**What it does:** Gives your container a human-readable name

```
WITHOUT --name:
$ docker ps
CONTAINER ID   IMAGE                           NAMES
a1b2c3d4e5f6   seleniarm/standalone-chromium   quirky_einstein  ← Random name!

$ docker stop a1b2c3d4e5f6   ← Have to use long ID
$ docker logs quirky_einstein ← Or remember random name


WITH --name selenium-chrome:
$ docker ps
CONTAINER ID   IMAGE                           NAMES
a1b2c3d4e5f6   seleniarm/standalone-chromium   selenium-chrome  ← Your name!

$ docker stop selenium-chrome  ← Easy to remember!
$ docker logs selenium-chrome  ← Makes sense!
```

**Can you name it anything?** Yes! These are all valid:

```bash
--name selenium-chrome
--name my-browser
--name test-browser-1
--name bob
```

---

### Piece 5: `seleniarm/standalone-chromium` (The Image)

```bash
docker run -d -p 4444:4444 --name selenium-chrome seleniarm/standalone-chromium
```

**What it does:** Specifies which image to create the container from

This is what you downloaded with `docker pull`

---

### Full Picture

```
docker run -d -p 4444:4444 --name selenium-chrome seleniarm/standalone-chromium
│          │  │            │                      │
│          │  │            │                      └── IMAGE: What to run
│          │  │            │
│          │  │            └── NAME: Call it "selenium-chrome"
│          │  │
│          │  └── PORT: Connect my 4444 to container's 4444
│          │
│          └── DETACHED: Run in background
│
└── COMMAND: Create and start a container
```

---

## 🔨 Hands-On Exercise 2

**Task:** Run the Selenium container (use the image for your Mac)

```bash
# Apple Silicon Mac:
docker run -d -p 4444:4444 --name selenium-chrome seleniarm/standalone-chromium

# Intel Mac:
docker run -d -p 4444:4444 --name selenium-chrome selenium/standalone-chrome
```

**Verify it's running:**

```bash
docker ps
```

**What you should see:**

```
CONTAINER ID   IMAGE                          STATUS         PORTS                    NAMES
abc123def456   selenium/standalone-chrome     Up 10 seconds  0.0.0.0:4444->4444/tcp   selenium-chrome
```

### ✅ Checkpoint

Answer these:
1. What does the STATUS column show?
2. What does `0.0.0.0:4444->4444/tcp` mean?

<details>
<summary>Click to see answers</summary>

1. "Up X seconds" - meaning the container is running
2. Your computer's port 4444 is connected to container's port 4444

</details>

---

## Part 3: Access the Browser

The Selenium container has a web interface! Let's see it.

### 🔨 Hands-On Exercise 3

**Task:** Open your web browser and go to:

```
http://localhost:4444
```

**What you should see:**

- Selenium Grid dashboard
- Shows "Sessions" and available browsers

```
┌─────────────────────────────────────────────────────────────┐
│                    SELENIUM GRID                            │
│                                                             │
│  Sessions: 0 of 1                                          │
│  ┌─────────────┐                                           │
│  │   Chrome    │  Ready ✅                                 │
│  └─────────────┘                                           │
└─────────────────────────────────────────────────────────────┘
```

**This is the same thing your Selenium tests connect to!**

---

## Part 4: View Container Logs

Want to see what's happening inside the container?

### Command: docker logs

```bash
docker logs selenium-chrome
```

This shows everything the container has printed - useful for debugging.

### 🔨 Hands-On Exercise 4

**Task:** View the logs

```bash
docker logs selenium-chrome
```

**Look for these lines:**

```
Started Selenium Standalone
Selenium Grid ready
```

---

## Part 5: Stop and Remove the Container

When you're done, clean up.

### Stop the container:

```bash
docker stop selenium-chrome
```

### Remove the container:

```bash
docker rm selenium-chrome
```

### Verify it's gone:

```bash
docker ps -a
```

The selenium-chrome container should not appear anymore.

---

## 🔨 Hands-On Challenge

**Complete these tasks on your own:**

### Task 1: Start Fresh
```bash
# Remove the old container if it exists
docker rm -f selenium-chrome 2>/dev/null

# Run a new one (use the image for your Mac)
# Apple Silicon:
docker run -d -p 4444:4444 --name my-browser seleniarm/standalone-chromium

# Intel:
docker run -d -p 4444:4444 --name my-browser selenium/standalone-chrome
```

Notice: We used `--name my-browser` instead of `--name selenium-chrome`

### Task 2: Check Status
Run the command to see running containers. What's the name of your container?

### Task 3: Access It
Open `http://localhost:4444` in your browser. Does it work?

### Task 4: View Logs
Run the command to see logs. Can you find "Selenium Grid ready"?

### Task 5: Clean Up
Stop and remove the container.

### Task 6: Verify
Confirm no containers are running.

---

## Challenge Answers

Write your answers here before checking:

| Task | Command You Used |
|------|-----------------|
| Task 2 | |
| Task 4 | |
| Task 5 | |
| Task 6 | |

<details>
<summary>Click to check your answers</summary>

| Task | Correct Command |
|------|-----------------|
| Task 2 | `docker ps` (container name: my-browser) |
| Task 4 | `docker logs my-browser` |
| Task 5 | `docker stop my-browser && docker rm my-browser` or `docker rm -f my-browser` |
| Task 6 | `docker ps -a` (should show no selenium containers) |

</details>

---

## Summary

What you learned:

| Command | What It Does |
|---------|-------------|
| `docker pull <image>` | Download image only |
| `docker run -d` | Run in background |
| `docker run -p 4444:4444` | Map port from computer to container |
| `docker run --name xxx` | Give container a custom name |
| `docker logs <name>` | View container output |
| `docker stop <name>` | Stop a running container |
| `docker rm <name>` | Remove a stopped container |
| `docker rm -f <name>` | Force remove (stop + remove) |

---

## Quick Reference Card

```
┌────────────────────────────────────────────────────────────┐
│                 LESSON 2 CHEAT SHEET                       │
├────────────────────────────────────────────────────────────┤
│ Download image:        docker pull <image>                 │
│ Run in background:     docker run -d <image>               │
│ Map ports:             docker run -p HOST:CONTAINER        │
│ Name container:        docker run --name myname            │
│ View logs:             docker logs <name>                  │
│ Stop container:        docker stop <name>                  │
│ Remove container:      docker rm <name>                    │
│ Force remove:          docker rm -f <name>                 │
├────────────────────────────────────────────────────────────┤
│ Selenium Grid UI:      http://localhost:4444               │
└────────────────────────────────────────────────────────────┘
```

---

## Next Lesson

**Lesson 3: Connecting Your Test Code to Dockerized Selenium**
- Write actual Selenium test that uses the container
- Run tests against the containerized browser
