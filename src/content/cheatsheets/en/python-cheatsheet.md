---
title: "🐍 Python Cheatsheet | Surfing Cheatsheets"
description: "Comprehensive Python reference for seasoned developers - variables, collections, functions, classes, and modern features"
customCSS: |
  :root {
              --cheat-primary: #2563eb;
              --cheat-bg: #f8f9fa;
              --cheat-card-bg: #ffffff;
              --cheat-font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              --cheat-font-mono: 'Consolas', 'Monaco', 'Courier New', monospace;
          }
  
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
          }
  
          body {
              font-family: var(--cheat-font-family);
              background: var(--cheat-bg);
              color: #333;
              font-size: 11px;
              line-height: 1.3;
              max-width: 1500px;
              margin: 0 auto;
              padding: 10px;
          }
  
          /* Header */
          header {
              text-align: center;
              background: white;
              padding: 10px;
              margin-bottom: 10px;
              border-radius: 5px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
  
          header h1 {
              font-size: 20px;
              color: #2c3e50;
              margin-bottom: 3px;
          }
  
          header p {
              font-size: 11px;
              color: #6b7280;
          }
  
          /* Multi-column layout (like newspaper) */
          .container {
              column-count: 4;
              column-gap: 10px;
          }
  
          /* Responsive columns */
          @media screen and (max-width: 1400px) {
              .container {
                  column-count: 3;
              }
          }
  
          @media screen and (max-width: 1000px) {
              .container {
                  column-count: 2;
              }
          }
  
          @media screen and (max-width: 600px) {
              .container {
                  column-count: 1;
              }
          }
  
          /* Section cards */
          .section {
              background: var(--cheat-card-bg);
              border-radius: 5px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              padding: 8px;
              margin-bottom: 10px;
              break-inside: avoid;
              page-break-inside: avoid;
          }
  
          /* Section headers with simple alternating style */
          .section h2 {
              font-size: 13px;
              font-weight: 600;
              margin: -8px -8px 8px -8px;
              padding: 6px 8px;
              border-radius: 5px 5px 0 0;
              color: #1f2937;
              background: #f3f4f6;
              border-bottom: 2px solid #3b82f6;
          }
  
          /* Alternate style for even sections */
          .section:nth-child(even) h2 {
              background: #e5e7eb;
              border-bottom-color: #6b7280;
          }
  
          /* Code blocks */
          pre {
              background: #f3f4f6;
              border-radius: 4px;
              padding: 6px;
              margin: 4px 0;
              overflow-x: auto;
          }
  
          pre code {
              font-family: var(--cheat-font-mono);
              font-size: 11px;
              line-height: 1.4;
              display: block;
          }
  
          code {
              font-family: var(--cheat-font-mono);
          }
  
          /* Footer */
          footer {
              text-align: center;
              padding: 10px;
              margin-top: 10px;
              font-size: 10px;
              color: #9ca3af;
              background: white;
              border-radius: 5px;
          }
  
          footer a {
              color: inherit;
              text-decoration: none;
          }
  
          footer a:hover {
              color: #6b7280;
          }
  
          /* Remove navigation elements */
          nav, .nav, .navigation, .toc, .sidebar, .menu {
              display: none !important;
          }
  
          /* Print optimizations */
          @media print {
              body {
                  padding: 0;
                  background: white;
                  max-width: none;
              }
  
              .container {
                  column-gap: 5px;
              }
  
              .section {
                  box-shadow: none;
                  border: 1px solid #e5e7eb;
              }
  
              footer {
                  display: none;
              }
  
              @page {
                  size: landscape;
                  margin: 10px;
              }
          }
customJS: |
  document.addEventListener('DOMContentLoaded', () => {
              document.querySelectorAll('pre code').forEach((block) => {
                  hljs.highlightElement(block);
              });
          });
tags: ["javascript", "typescript", "angular", "css", "html"]
readingTime: 5
wordCount: 880
publishDate: 2025-09-30
draft: false
featured: false
---

<header>
        <h1>🐍 Python Cheatsheet</h1>
        <p>Quick Reference for Seasoned Developers</p>
    </header>

    <div class="container">
        <div class="section">
            <h2>Variables & References</h2>
            <pre><code class="python"># Variables are references
x = [1, 2, 3]
y = x  # y references same object
y.append(4)  # modifies x too
print(x)  # [1, 2, 3, 4]

# Identity vs equality
x is y  # True (same object)
x == [1, 2, 3, 4]  # True (value)

# Mutable default trap
def bad(a, lst=[]):  # created once!
    lst.append(a)
    return lst

# Fix: use None
def good(a, lst=None):
    if lst is None:
        lst = []
    lst.append(a)
    return lst</code></pre>
        </div>

        <div class="section">
            <h2>Collections</h2>
            <pre><code class="python"># List operations
lst = [1, 2, 3]
lst.append(4)  # [1, 2, 3, 4]
[0, *lst]  # [0, 1, 2, 3, 4]

# Dict operations
d = {'a': 1, 'b': 2}
d.get('c', 0)  # 0 (default)
{**d, 'c': 3}  # merge
d | {'c': 3}   # Python 3.9+

# Set operations
s1, s2 = {1, 2, 3}, {3, 4, 5}
s1 & s2  # {3}
s1 | s2  # {1, 2, 3, 4, 5}
s1 - s2  # {1, 2}</code></pre>
        </div>

        <div class="section">
            <h2>File Operations</h2>
            <pre><code class="python"># Reading files
with open('file.txt', 'r') as f:
    content = f.read()

# Line by line (efficient)
with open('file.txt', 'r') as f:
    for line in f:
        process(line.strip())

# Writing files
with open('file.txt', 'w') as f:
    f.write('Hello\n')
    f.writelines(['a\n', 'b\n'])

# JSON handling
import json
data = json.loads('{"key": "val"}')
json_str = json.dumps(data, indent=2)</code></pre>
        </div>

        <div class="section">
            <h2>Iteration Patterns</h2>
            <pre><code class="python"># Enumerate with index
for i, val in enumerate(items):
    print(f"{i}: {val}")

# Dict iteration
for k, v in my_dict.items():
    print(f"{k}: {v}")

# Multiple sequences
for x, y in zip(list1, list2):
    print(x, y)

# Flatten nested lists
from itertools import chain
flat = list(chain.from_iterable(
    [[1, 2], [3, 4]]
))

# Group by property
from itertools import groupby
groups = {k: list(g) for k, g in
          groupby(items, key=lambda x: x.prop)}</code></pre>
        </div>

        <div class="section">
            <h2>Comprehensions</h2>
            <pre><code class="python"># List comprehension
evens = [x*2 for x in range(10)
         if x % 2 == 0]
# [0, 4, 8, 12, 16]

# Nested (transpose)
matrix = [[1, 2, 3], [4, 5, 6]]
transposed = [[row[i] for row in matrix]
              for i in range(3)]
# [[1, 4], [2, 5], [3, 6]]

# Dict comprehension
squares = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Set comprehension
mods = {x % 3 for x in range(10)}

# Generator (efficient)
total = sum(x**2 for x in range(1000000))</code></pre>
        </div>

        <div class="section">
            <h2>Data Processing</h2>
            <pre><code class="python"># Sorting
sorted(items, key=lambda x: x.attr,
       reverse=True)

# Filtering
positives = list(filter(
    lambda x: x > 0, items
))

# Mapping
squares = list(map(lambda x: x**2, items))

# Reduce
from functools import reduce
total = reduce(lambda acc, x: acc + x,
               items, 0)

# Counter
from collections import Counter
counts = Counter(['a', 'b', 'a', 'c'])
most_common = counts.most_common(2)

# Named tuples
from collections import namedtuple
Point = namedtuple('Point', ['x', 'y'])
p = Point(1, 2)</code></pre>
        </div>

        <div class="section">
            <h2>Functions & Lambdas</h2>
            <pre><code class="python"># Positional/keyword-only args
def f(pos, /, pos_or_kw, *, kw_only):
    pass
f(1, 2, kw_only=3)  # valid

# Type hints
def greet(name: str) -> str:
    return f"Hello {name}"

# Multiple return values
def minmax(items):
    return min(items), max(items)
lo, hi = minmax([1, 2, 3])

# Lambda functions
sort_key = lambda obj: obj.name
squares = list(map(lambda x: x**2,
                   range(5)))

# Partial application
from functools import partial
add5 = partial(add, 5)</code></pre>
        </div>

        <div class="section">
            <h2>String Operations</h2>
            <pre><code class="python"># f-strings (Python 3.6+)
name, age = "Alice", 30
msg = f"{name} is {age} years old"

# String methods
"  text  ".strip()  # "text"
",".join(["a", "b", "c"])  # "a,b,c"
"a,b,c".split(",")  # ["a", "b", "c"]
"hello".replace("l", "L")  # "heLLo"

# String properties
"abc".isalpha()  # True
"123".isdigit()  # True
"hello".startswith("he")  # True
"hello".endswith("lo")  # True</code></pre>
        </div>

        <div class="section">
            <h2>Exception Handling</h2>
            <pre><code class="python"># Try/except/else/finally
try:
    result = risky_operation()
except (TypeError, ValueError) as e:
    print(f"Error: {e}")
else:  # No exceptions
    print("Success!")
finally:  # Always runs
    cleanup()

# Custom exception
class MyError(Exception):
    pass

# Raising exceptions
raise MyError("Something wrong")

# Context managers
with open('file.txt') as f:
    data = f.read()</code></pre>
        </div>

        <div class="section">
            <h2>Modules & Packages</h2>
            <pre><code class="python"># Importing modules
import math
from datetime import datetime, timedelta
import numpy as np  # convention

# Relative imports
from . import sibling_module
from ..parent import parent_module

# Module guard
if __name__ == "__main__":
    # Runs when executed directly
    main()
else:
    # Runs when imported
    setup()</code></pre>
        </div>

        <div class="section">
            <h2>Classes & Methods</h2>
            <pre><code class="python">class Point:
    # Class variable (shared)
    instances = 0

    def __init__(self, x, y):
        self.x, self.y = x, y
        Point.instances += 1

    # Instance method
    def distance(self):
        return (self.x**2 + self.y**2)**0.5

    # Class method
    @classmethod
    def from_tuple(cls, tup):
        return cls(*tup)

    # Static method
    @staticmethod
    def origin_distance(x, y):
        return (x**2 + y**2)**0.5

    # Property
    @property
    def magnitude(self):
        return self.distance()</code></pre>
        </div>

        <div class="section">
            <h2>Special Methods</h2>
            <pre><code class="python"># Operator overloading
__add__(self, other)      # +
__sub__(self, other)      # -
__mul__(self, other)      # *
__getitem__(self, key)    # self[key]
__setitem__(self, k, v)   # self[k] = v
__contains__(self, item)  # in
__len__(self)             # len()
__call__(self, *args)     # self()
__str__(self)             # str()
__repr__(self)            # repr()
__enter__/__exit__        # with
__iter__/__next__         # iteration</code></pre>
        </div>

        <div class="section">
            <h2>Modern Python Features</h2>
            <pre><code class="python"># Walrus operator (3.8+)
if (n := len(data)) > 10:
    print(f"Processing {n} items")

# f-strings with = (3.8+)
x, y = 10, 20
print(f"{x=}, {y=}")  # x=10, y=20

# Pattern matching (3.10+)
match command.split():
    case ["quit"]:
        return "Exiting"
    case ["load", filename]:
        return f"Loading {filename}"
    case _:
        return "Unknown"

# Structural matching (3.10+)
match value:
    case [a, b, *rest]:
        return a + b
    case {'key': value}:
        return value
    case _:
        return default</code></pre>
        </div>
    </div>

    <footer>
        <a href="https://surfing.salty.vip/">Surfing Cheatsheets</a>
        | <a href="/assets/cheatsheets/en/python-cheatsheet.pdf">📄 PDF</a>
    </footer>