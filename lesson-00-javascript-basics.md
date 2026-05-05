# Lesson 0: JavaScript & TypeScript Basics for QA Automation

## Why This Lesson?

Before you can write Selenium tests, you need to understand the code you're writing. This lesson teaches you ONLY what you need - not a full JavaScript course.

---

## Part 1: Variables - Storing Data

### What is a Variable?

A **variable** is a container that holds data. Like a labeled box.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   const name = "John";                                      │
│         │        │                                          │
│         │        └── The value stored inside                │
│         └── The label/name of the box                       │
│                                                             │
│   Think of it like:                                         │
│   ┌─────────┐                                               │
│   │ "John"  │  ← Box labeled "name" contains "John"         │
│   └─────────┘                                               │
│      name                                                   │
└─────────────────────────────────────────────────────────────┘
```

### How to Create Variables

```javascript
// Using const - value CANNOT be changed later
const name = "John";
const age = 25;
const isLoggedIn = true;

// Using let - value CAN be changed later
let score = 0;
score = 10;  // This is allowed
score = 20;  // This is allowed

// const vs let
const fixedValue = 100;
fixedValue = 200;  // ❌ ERROR! const cannot be changed

let changingValue = 100;
changingValue = 200;  // ✅ OK! let can be changed
```

### When to Use const vs let

| Use | When |
|-----|------|
| `const` | Value will never change (use this most of the time) |
| `let` | Value will change later |

```javascript
// Examples in real code:
const driver = ...;        // The browser driver - won't change
const pageTitle = ...;     // The title we got - won't change
let retryCount = 0;        // Counter that increases - will change
```

---

## Part 2: Data Types - Kinds of Data

### Basic Types

```javascript
// String - text (always in quotes)
const name = "John";
const message = 'Hello World';
const url = "https://google.com";

// Number - any number
const age = 25;
const price = 19.99;
const port = 4444;

// Boolean - true or false only
const isLoggedIn = true;
const hasError = false;

// Array - a list of things
const fruits = ["apple", "banana", "orange"];
const numbers = [1, 2, 3, 4, 5];
```

### TypeScript Adds Type Annotations

TypeScript lets you specify what TYPE a variable should be:

```typescript
// JavaScript (no types)
const name = "John";
const age = 25;

// TypeScript (with types)
const name: string = "John";
const age: number = 25;
const isLoggedIn: boolean = true;
```

**What does `: string` mean?**

```
const name: string = "John";
            │
            └── "This variable must be a string (text)"
```

**Why use types?**

```typescript
// TypeScript catches mistakes BEFORE you run the code:

const age: number = "twenty-five";  
// ❌ ERROR: Type 'string' is not assignable to type 'number'

// Without types, you'd only find this bug when your code crashes!
```

---

## Part 3: Functions - Reusable Code Blocks

### What is a Function?

A **function** is a reusable set of instructions. Like a recipe.

```
┌─────────────────────────────────────────────────────────────┐
│  WITHOUT a function:                                        │
│                                                             │
│  console.log("Hello John");                                 │
│  console.log("Hello Jane");                                 │
│  console.log("Hello Bob");     ← Repeating same code!       │
│                                                             │
│  WITH a function:                                           │
│                                                             │
│  function sayHello(name) {                                  │
│      console.log("Hello " + name);                          │
│  }                                                          │
│                                                             │
│  sayHello("John");   → prints "Hello John"                  │
│  sayHello("Jane");   → prints "Hello Jane"                  │
│  sayHello("Bob");    → prints "Hello Bob"                   │
└─────────────────────────────────────────────────────────────┘
```

### How to Create a Function

```javascript
// Basic function
function greet() {
    console.log("Hello!");
}

// Calling (using) the function
greet();  // → prints "Hello!"
```

### Function with Parameters

**Parameters** = inputs the function needs

```javascript
// name is a parameter (input)
function greet(name) {
    console.log("Hello " + name);
}

greet("John");  // → prints "Hello John"
greet("Jane");  // → prints "Hello Jane"
```

### Function that Returns Something

```javascript
// This function gives back a value
function add(a, b) {
    return a + b;
}

const result = add(5, 3);  // result = 8
console.log(result);       // → prints 8
```

### TypeScript Function Types

```typescript
// TypeScript version - with types
function greet(name: string): void {
    console.log("Hello " + name);
}
//                  │         │
//                  │         └── Returns nothing (void)
//                  └── name must be a string

function add(a: number, b: number): number {
    return a + b;
}
//              │          │           │
//              │          │           └── Returns a number
//              │          └── b must be a number
//              └── a must be a number
```

---

## Part 4: Arrow Functions - Shorter Way to Write Functions

### Regular Function vs Arrow Function

```javascript
// Regular function
function greet(name) {
    return "Hello " + name;
}

// Arrow function (same thing, shorter)
const greet = (name) => {
    return "Hello " + name;
};

// Even shorter arrow function (one line)
const greet = (name) => "Hello " + name;
```

### When You'll See Arrow Functions

```typescript
// In Selenium tests, you might see:
runTest().catch((error) => console.error(error));
//              │
//              └── Arrow function that takes error and prints it
```

---

## Part 5: async/await - Waiting for Slow Things

### The Problem

Some operations take time:
- Opening a website = slow (needs to load)
- Getting page title = slow (needs to read from browser)
- Taking a screenshot = slow (needs to capture)

```
┌─────────────────────────────────────────────────────────────┐
│  WITHOUT waiting:                                           │
│                                                             │
│  driver.get("https://google.com");  // Started loading...   │
│  const title = driver.getTitle();    // Page not loaded yet!│
│  console.log(title);                 // title is undefined! │
│                                                             │
│  WITH waiting (async/await):                                │
│                                                             │
│  await driver.get("https://google.com");  // Wait until done│
│  const title = await driver.getTitle();    // Wait for title│
│  console.log(title);                       // Got it!       │
└─────────────────────────────────────────────────────────────┘
```

### How async/await Works

```typescript
// Step 1: Mark the function as "async"
async function runTest() {
    // Step 2: Use "await" to wait for slow things
    await driver.get("https://google.com");
    const title = await driver.getTitle();
    console.log(title);
}
```

**What do they mean?**

| Keyword | Meaning |
|---------|---------|
| `async` | "This function will have waiting inside it" |
| `await` | "Wait here until this completes, then continue" |

### Visual Explanation

```
async function runTest() {
    console.log("Starting...");
    
    await driver.get("https://google.com");
    │     └── Start loading Google
    └── WAIT HERE until Google is fully loaded
    
    console.log("Google loaded!");
    
    const title = await driver.getTitle();
    │             └── Ask browser for title
    └── WAIT HERE until browser gives us the title
    
    console.log(title);  // Now we have it!
}

Timeline:
┌────────────────────────────────────────────────────────────┐
│ "Starting..."                                              │
│      │                                                     │
│      ▼                                                     │
│ await driver.get(...)  ─────────────────┐                  │
│                                         │ (loading...)     │
│                                         │                  │
│ ◄───────────────────────────────────────┘ (done!)          │
│      │                                                     │
│      ▼                                                     │
│ "Google loaded!"                                           │
│      │                                                     │
│      ▼                                                     │
│ await driver.getTitle()  ───────┐                          │
│                                 │ (getting title...)       │
│ ◄───────────────────────────────┘ (done!)                  │
│      │                                                     │
│      ▼                                                     │
│ "Google"                                                   │
└────────────────────────────────────────────────────────────┘
```

### Promise<void> - What Does It Mean?

```typescript
async function runTest(): Promise<void> {
    //                     │
    //                     └── "This async function returns nothing"
}

async function getTitle(): Promise<string> {
    //                      │
    //                      └── "This async function returns a string"
}
```

**Promise** = "I promise to give you a value later (when I'm done)"

---

## Part 6: import - Using Code from Packages

### What is import?

When you `npm install selenium-webdriver`, you download code someone else wrote. `import` lets you use that code.

```typescript
import { Builder, WebDriver } from 'selenium-webdriver';
│        │                        │
│        │                        └── Package name (what you npm installed)
│        │
│        └── Specific things you want from that package
│
└── Keyword to bring in external code
```

### Visual Explanation

```
┌─────────────────────────────────────────────────────────────┐
│  Package: selenium-webdriver                                │
│  (thousands of lines of code)                               │
│                                                             │
│  Contains many things:                                      │
│  - Builder        ← You need this                          │
│  - WebDriver      ← You need this                          │
│  - By                                                       │
│  - until                                                    │
│  - Key                                                      │
│  - ... hundreds more                                        │
└─────────────────────────────────────────────────────────────┘
              │
              │  import { Builder, WebDriver }
              │  (only import what you need)
              ▼
┌─────────────────────────────────────────────────────────────┐
│  Your file: test_docker_selenium.ts                         │
│                                                             │
│  Now you can use Builder and WebDriver!                     │
└─────────────────────────────────────────────────────────────┘
```

### Importing from Subfolders

```typescript
import { Options } from 'selenium-webdriver/chrome';
//                      │                    │
//                      │                    └── /chrome subfolder
//                      └── The main package
```

This imports Chrome-specific code from inside the selenium-webdriver package.

---

## Part 7: try/catch/finally - Handling Errors

### What Happens When Code Fails?

```javascript
// If this fails, your whole program crashes!
driver.get("https://invalid-url-asdfghjkl.com");
```

### try/catch Prevents Crashes

```typescript
try {
    // Try to do this
    driver.get("https://invalid-url.com");
} catch (error) {
    // If it fails, do this instead
    console.log("Something went wrong:", error);
}
// Program continues running (didn't crash!)
```

### try/finally - Always Clean Up

```typescript
try {
    await driver.get("https://google.com");
    // ... do stuff ...
} finally {
    // This ALWAYS runs, even if there was an error
    await driver.quit();  // Always close the browser
}
```

**Why finally?**

```
┌─────────────────────────────────────────────────────────────┐
│  Scenario 1: Everything works                               │
│  ────────────────────────────────                           │
│  try { open browser, do test }  ✅ Success                  │
│  finally { close browser }       ✅ Runs → browser closed   │
│                                                             │
│  Scenario 2: Something fails                                │
│  ────────────────────────────────                           │
│  try { open browser, do test }  ❌ Error on test            │
│  finally { close browser }       ✅ Still runs → closed!    │
│                                                             │
│  Without finally, a failed test leaves browser open forever!│
└─────────────────────────────────────────────────────────────┘
```

---

## Part 8: console.log - Printing Output

### What is console.log?

It prints messages to your terminal.

```javascript
console.log("Hello World");     // → Hello World
console.log(123);               // → 123
console.log(true);              // → true
```

### Printing Variables

```javascript
const name = "John";
const age = 25;

console.log(name);              // → John
console.log("Name is:", name);  // → Name is: John
console.log(`Name: ${name}, Age: ${age}`);  // → Name: John, Age: 25
```

### Template Literals (Backticks)

```javascript
// Using + to join strings (old way)
console.log("Hello " + name + ", you are " + age);

// Using template literals (modern way, easier)
console.log(`Hello ${name}, you are ${age}`);
//          │       │
//          │       └── ${} inserts variable value
//          └── Backticks (not quotes!)
```

The backtick is this key: ` (usually under Esc key)

---

## Part 9: Putting It All Together

Now let's understand the Selenium test code:

```typescript
import { Builder, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

async function runTest(): Promise<void> {
    const options = new Options();
    
    const driver: WebDriver = await new Builder()
        .forBrowser('chrome')
        .usingServer('http://localhost:4444')
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

### Line-by-Line With Your New Knowledge

| Line | What It Means | Concept You Learned |
|------|---------------|---------------------|
| `import { Builder... }` | Bring in Builder and WebDriver from selenium package | Part 6: import |
| `async function runTest()` | Create a function that will have "await" inside | Part 5: async |
| `: Promise<void>` | This function returns nothing (but asynchronously) | Part 5: Promise |
| `const options = new Options()` | Create a variable for Chrome settings | Part 1: const |
| `const driver: WebDriver` | Create a variable, must be a WebDriver type | Part 2: Types |
| `await new Builder()...build()` | Wait for WebDriver to be created | Part 5: await |
| `try {` | Try to do the following... | Part 7: try |
| `await driver.get(...)` | Wait for browser to open URL | Part 5: await |
| `const title: string` | Create variable that must be text | Part 2: Types |
| `console.log(\`...\`)` | Print message with variable inside | Part 8: console.log |
| `} finally {` | No matter what, always do this... | Part 7: finally |
| `await driver.quit()` | Wait for browser to close | Part 5: await |
| `runTest().catch(...)` | Call the function, print any errors | Part 4: Arrow function |

---

## Quick Reference Card

```
┌────────────────────────────────────────────────────────────────┐
│              JAVASCRIPT/TYPESCRIPT CHEAT SHEET                 │
├────────────────────────────────────────────────────────────────┤
│ VARIABLES                                                      │
│   const name = "John";     // Can't change                     │
│   let count = 0;           // Can change                       │
├────────────────────────────────────────────────────────────────┤
│ TYPES (TypeScript)                                             │
│   const name: string = "John";                                 │
│   const age: number = 25;                                      │
│   const active: boolean = true;                                │
├────────────────────────────────────────────────────────────────┤
│ FUNCTIONS                                                      │
│   function greet(name: string): void {                         │
│       console.log(`Hello ${name}`);                            │
│   }                                                            │
├────────────────────────────────────────────────────────────────┤
│ ASYNC/AWAIT                                                    │
│   async function test(): Promise<void> {                       │
│       await slowThing();  // Wait for it                       │
│   }                                                            │
├────────────────────────────────────────────────────────────────┤
│ IMPORTS                                                        │
│   import { Something } from 'package-name';                    │
├────────────────────────────────────────────────────────────────┤
│ TRY/FINALLY                                                    │
│   try {                                                        │
│       // Do risky thing                                        │
│   } finally {                                                  │
│       // Always clean up                                       │
│   }                                                            │
├────────────────────────────────────────────────────────────────┤
│ CONSOLE.LOG                                                    │
│   console.log("text");                                         │
│   console.log(`Value: ${variable}`);                           │
└────────────────────────────────────────────────────────────────┘
```

---

## What's Next?

Now that you understand the code, go back to **Lesson 3** and try the test again. It should make much more sense now!
