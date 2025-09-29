---
title: "JavaScript ES6+ Quick Reference"
description: "Essential JavaScript ES6+ features and syntax for modern web development"
publishDate: 2025-09-29
tags: ["javascript", "es6", "programming", "reference"]
category: "Programming Languages"
topic: "JavaScript"
difficulty: "intermediate"
format: "markdown"
generatedBy: "AI Assistant"
featured: true
draft: false
---

A comprehensive guide to modern JavaScript features and syntax.

## Variables and Declarations

```javascript
// ES6+ variable declarations
const constant = "immutable";
let mutable = "can change";

// Destructuring
const { name, age } = person;
const [first, second] = array;
```

## Arrow Functions

```javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Multiple lines
const complexFunction = (data) => {
  const processed = data.map(item => item * 2);
  return processed.reduce((sum, item) => sum + item, 0);
};
```

## Template Literals

```javascript
const name = "World";
const greeting = `Hello, ${name}!`;

// Multi-line strings
const multiline = `
  Line 1
  Line 2
  Line 3
`;
```

## Array Methods

```javascript
const numbers = [1, 2, 3, 4, 5];

// Map, filter, reduce
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

// Find methods
const found = numbers.find(n => n > 3);
const foundIndex = numbers.findIndex(n => n > 3);
const exists = numbers.some(n => n > 10);
const all = numbers.every(n => n > 0);
```

## Object Methods

```javascript
// Object.keys, values, entries
const obj = { a: 1, b: 2, c: 3 };
const keys = Object.keys(obj);
const values = Object.values(obj);
const entries = Object.entries(obj);

// Object spread
const newObj = { ...obj, d: 4 };

// Object.assign
const merged = Object.assign({}, obj1, obj2);
```

## Promises and Async/Await

```javascript
// Promise
const fetchData = () => {
  return fetch('/api/data')
    .then(response => response.json())
    .catch(error => console.error(error));
};

// Async/await
const fetchDataAsync = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};
```

## Classes

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  static createAdult(name) {
    return new Person(name, 18);
  }
}

class Developer extends Person {
  constructor(name, age, language) {
    super(name, age);
    this.language = language;
  }

  code() {
    return `${this.name} codes in ${this.language}`;
  }
}
```

## Modules

```javascript
// export.js
export const PI = 3.14159;
export function calculateArea(radius) {
  return PI * radius * radius;
}

export default class Circle {
  constructor(radius) {
    this.radius = radius;
  }
}

// import.js
import Circle, { PI, calculateArea } from './export.js';
import * as MathUtils from './export.js';
```

## Modern Operators

```javascript
// Nullish coalescing
const value = null ?? 'default';

// Optional chaining
const street = user?.address?.street;

// Logical assignment operators
obj.prop ||= 'default';
obj.prop &&= 'update';
obj.prop ??= 'fallback';
```

This cheatsheet covers the most essential ES6+ features for modern JavaScript development!
