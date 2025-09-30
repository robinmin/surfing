---
title: "Python Cheatsheet for Seasoned Developers 🐍"
description: "Complete Reference for Seasoned Developers"
externalCSS: ["https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css", "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css"]
customCSS: |
  body {
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          background: linear-gradient(135deg, #f8faff 0%, #f1f7ff 100%);
        }
        .code-section {
          background: rgba(255, 255, 255, 0.8) !important;
          border: 2px solid #7bb8ff !important;
          border-radius: 12px;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .code-section:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(123, 184, 255, 0.3);
          border-color: #6bb3ff;
        }
          .section-title-bar {
            background: linear-gradient(90deg, #7bb8ff, #6bb3ff);
            color: black;
            padding: 6px 12px;
            border-radius: 8px 8px 0 0;
            margin: -2px -2px 8px -2px;
            font-size: 13px;
            font-weight: 600;
            display: flex;
            align-items: center;
          }
        .python-blue {
          color: #3776ab;
        }
        .python-bg {
          background-color: #3776ab;
        }
        pre code {
          font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
          font-size: 10px;
          line-height: 1.4;
        }
        .hljs {
          background: #f8f9fa !important;
          border-radius: 6px;
          padding: 10px !important;
          border: 1px solid #e9ecef;
        }
        .section-header {
          background: linear-gradient(90deg, #3776ab, #2c5f8a);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .print-optimized {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        @media print {
          body {
            background: white !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .code-section {
            box-shadow: none !important;
            border: 2px solid #5ba0f2 !important;
            background: white !important;
          }
          .section-title-bar {
            background: #5ba0f2 !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          @page {
            size: A4 landscape;
            margin: 0.5cm;
          }
        }
        .emoji {
          font-size: 1.2em;
          margin-right: 4px;
        }
        .tag {
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 12px;
          background: linear-gradient(45deg, #3776ab, #2c5f8a);
          color: white;
          display: inline-block;
          margin-left: 8px;
        }
customJS: |
  // Initialize syntax highlighting
          document.addEventListener('DOMContentLoaded', (event) => {
            document.querySelectorAll('pre code').forEach((block) => {
              hljs.highlightElement(block);
            });
          });
  
          // Add some interactive features
          document.addEventListener('DOMContentLoaded', function () {
            // Add click-to-copy functionality
            document.querySelectorAll('pre code').forEach((block) => {
              block.style.cursor = 'pointer';
              block.title = 'Click to copy';
              block.addEventListener('click', function () {
                navigator.clipboard.writeText(this.textContent).then(() => {
                  // Show temporary feedback
                  const originalBg = this.style.backgroundColor;
                  this.style.backgroundColor = '#d4edda';
                  setTimeout(() => {
                    this.style.backgroundColor = originalBg;
                  }, 200);
                });
              });
            });
          });
tags: ["javascript", "typescript", "angular", "css", "html"]
readingTime: 5
wordCount: 941
publishDate: 2025-09-30
draft: false
featured: false
---

<!-- Header -->
    <div class="text-center py-3 bg-white shadow-sm border-b">
      <h1 class="text-2xl font-bold text-gray-800 mb-1">
        <span class="emoji">🐍</span>Python Cheatsheet
        <span class="tag">v3.12+</span>
      </h1>
      <p class="text-gray-600 text-sm">Complete Reference for Seasoned Developers</p>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto p-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <!-- Column 1: Basics -->
        <div class="space-y-1">
          <div class="code-section rounded-xl p-2 shadow-lg print-optimized">
            <div class="section-title-bar">
              <span class="emoji">🔧</span>Variables & References
            </div>
            <pre><code class="python"># Variables are references, not containers
x = [1, 2, 3]
y = x  # y references same object as x
y.append(4)  # modifies x too
print(x)  # [1, 2, 3, 4]

# Identity vs equality
x is y  # True (same object)
x == [1, 2, 3, 4]  # True (same value)

# Mutable default trap
def bad(a, list=[]):  # list created once
    list.append(a)
    return list

# Fix: use None as default
def good(a, list=None):
    if list is None:
        list = []
    list.append(a)
    return list</code></pre>
          </div>

          <div class="code-section rounded-xl p-2 shadow-lg print-optimized">
            <div class="section-title-bar">
              <span class="emoji">📦</span>Collections
            </div>
            <pre><code class="python"># List operations
list = [1, 2, 3]
list.append(4)  # [1, 2, 3, 4]
[0, *list]  # [0, 1, 2, 3, 4] (unpacking)

# Dict operations
d = {'a': 1, 'b': 2}
d.get('c', 0)  # 0 (default if key missing)
{**d, 'c': 3}  # {'a':1, 'b':2, 'c':3} (merge)
d | {'c': 3}   # Same merge (Python 3.9+)

# Set operations
s1, s2 = {1, 2, 3}, {3, 4, 5}
s1 & s2  # {3} (intersection)
s1 | s2  # {1, 2, 3, 4, 5} (union)
s1 - s2  # {1, 2} (difference)</code></pre>
          </div>

          <div class="code-section rounded-xl p-2 shadow-lg print-optimized">
            <div class="section-title-bar">
              <span class="emoji">📁</span>File Operations
            </div>
            <pre><code class="python"># Reading files
with open('file.txt', 'r') as f:
    content = f.read()  # Read entire file

# Line by line (memory efficient)
with open('file.txt', 'r') as f:
    for line in f:
        process(line.strip())

# Writing files
with open('file.txt', 'w') as f:
    f.write('Hello\n')
    f.writelines(['line1\n', 'line2\n'])

# JSON handling
import json
data = json.loads('{"key": "value"}')
json_str = json.dumps(data, indent=2)</code></pre>
          </div>
        </div>

        <!-- Column 2: Control Flow & Functions -->
        <div class="space-y-1">
          <div class="code-section rounded-xl p-2 shadow-lg print-optimized">
            <div class="section-title-bar">
              <span class="emoji">🔄</span>Iteration Patterns
            </div>
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
list(chain.from_iterable([[1, 2], [3, 4]]))

# Group by property
from itertools import groupby
{k: list(g) for k, g in
 groupby(items, key=lambda x: x.prop)}</code></pre>
          </div>

          <div class="code-section rounded-xl p-2 shadow-lg print-optimized">
            <div class="section-title-bar">
              <span class="emoji">🧮</span>Comprehensions
            </div>
            <pre><code class="python"># List comprehension
[x*2 for x in range(10) if x % 2 == 0]
# [0, 4, 8, 12, 16]

# Nested comprehension (matrix transpose)
matrix = [[1, 2, 3], [4, 5, 6]]
[[row[i] for row in matrix] for i in range(3)]
# [[1, 4], [2, 5], [3, 6]]

# Dict comprehension
{x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Set comprehension
{x % 3 for x in range(10)}  # {0, 1, 2}

# Generator expression (memory efficient)
sum(x**2 for x in range(1000000))</code></pre>
          </div>

          <div class="code-section rounded-xl p-2 shadow-lg print-optimized">
            <div class="section-title-bar">
              <span class="emoji">⚙️</span>Data Processing
            </div>
            <pre><code class="python"># Sorting
sorted(items, key=lambda x: x.attr, reverse=True)

# Filtering
list(filter(lambda x: x > 0, items))

# Mapping/transformation
list(map(lambda x: x**2, items))

# Reduce
from functools import reduce
reduce(lambda acc, x: acc + x, items, 0)

# Counter for frequency analysis
from collections import Counter
counts = Counter(['a', 'b', 'a', 'c'])
most_common = counts.most_common(2)

# Named tuples (lightweight classes)
from collections import namedtuple
Point = namedtuple('Point', ['x', 'y'])
p = Point(1, 2)</code></pre>
          </div>
        </div>

        <!-- Column 3: Functions & Advanced -->
        <div class="space-y-1">
          <div class="code-section rounded-xl p-2 shadow-lg print-optimized">
            <div class="section-title-bar">
              <span class="emoji">⚙️</span>Functions & Lambdas
            </div>
            <pre><code class="python"># Args & kwargs
def f(pos, /, pos_or_kw, *, kw_only):
    pass
f(1, 2, kw_only=3)  # valid call

# Type hints
def greet(name: str) -> str:
    return f"Hello {name}"

# Multiple return values (as tuple)
def minmax(items):
    return min(items), max(items)
lo, hi = minmax([1, 2, 3])

# Lambda functions
sort_key = lambda obj: obj.name
squares = list(map(lambda x: x**2, range(5)))

# Partial application
from functools import partial
add5 = partial(add, 5)  # add(5, x)</code></pre>
          </div>

          <div class="code-section rounded-xl p-2 shadow-lg print-optimized">
            <div class="section-title-bar">
              <span class="emoji">🔤</span>String Operations
            </div>
            <pre><code class="python"># f-strings (Python 3.6+)
name, age = "Alice", 30
f"{name} is {age} years old"

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

          <div class="code-section rounded-xl p-2 shadow-lg print-optimized">
            <div class="section-title-bar">
              <span class="emoji">❌</span>Exception Handling
            </div>
            <pre><code class="python"># Basic try/except
try:
    result = risky_operation()
except (TypeError, ValueError) as e:
    print(f"Error: {e}")
else:  # Runs if no exceptions
    print("Success!")
finally:  # Always runs
    cleanup()

# Custom exception
class MyError(Exception):
    pass

# Context managers
with open('file.txt') as f:
    data = f.read()</code></pre>
          </div>

          <div class="code-section rounded-xl p-2 shadow-lg print-optimized">
            <div class="section-title-bar">
              <span class="emoji">📦</span>Modules & Packages
            </div>
            <pre><code class="python"># Importing modules
import math
from datetime import datetime, timedelta
import numpy as np  # Common convention

# Relative imports (in packages)
from . import sibling_module
from ..parent import parent_module

# Creating modules
if __name__ == "__main__":
    # Code runs when module is executed directly
    main()
else:
    # Code runs when imported
    setup()</code></pre>
          </div>
        </div>

        <!-- Column 4: OOP & Modern Features -->
        <div class="space-y-1">
          <div class="code-section rounded-xl p-2 shadow-lg print-optimized">
            <div class="section-title-bar">
              <span class="emoji">🏗️</span>Classes & Methods
            </div>
            <pre><code class="python">class Point:
    # Class variable (shared by all instances)
    instances = 0

    def __init__(self, x, y):
        self.x, self.y = x, y  # instance vars
        Point.instances += 1

    # Regular method (receives self)
    def distance(self):
        return (self.x**2 + self.y**2)**0.5

    # Class method (receives cls)
    @classmethod
    def from_tuple(cls, tup):
        return cls(*tup)

    # Static method (receives nothing)
    @staticmethod
    def origin_distance(x, y):
        return (x**2 + y**2)**0.5

    # Property (access like attribute)
    @property
    def magnitude(self):
        return self.distance()</code></pre>
          </div>

          <div class="code-section rounded-xl p-2 shadow-lg print-optimized">
            <div class="section-title-bar">
              <span class="emoji">🔮</span>Special Methods
            </div>
            <pre><code class="python"># Operator overloading
__add__(self, other)      # self + other
__getitem__(self, key)    # self[key]
__contains__(self, item)  # item in self
__len__(self)             # len(self)
__call__(self, *args)     # self(*args)
__str__(self)             # str(self)
__repr__(self)            # repr(self)
__enter__/__exit__        # with statement
__iter__/__next__         # iteration</code></pre>
          </div>

          <div class="code-section rounded-xl p-2 shadow-lg print-optimized">
            <div class="section-title-bar">
              <span class="emoji">🚀</span>Modern Python Features
            </div>
            <pre><code class="python"># Walrus operator (:=) - Python 3.8+
if (n := len(data)) > 10:
    print(f"Processing {n} items")

# f-strings with = (Python 3.8+)
x, y = 10, 20
print(f"{x=}, {y=}")  # x=10, y=20

# Pattern matching - Python 3.10+
match command.split():
    case ["quit"]:
        return "Exiting"
    case ["load", filename]:
        return f"Loading {filename}"
    case _:  # Default case
        return "Unknown command"

# Structural pattern matching - Python 3.10+
match value:
    case [a, b, *rest]:
        return a + b
    case {'key': value}:
        return value
    case _:
        return default</code></pre>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-white border-t mt-6 py-4">
        <div class="max-w-7xl mx-auto px-4 text-center">
          <p class="text-gray-600 text-xs">
            <span class="emoji">🔗</span>Quick Links:
            <a href="https://python.org" class="python-blue hover:underline">python.org</a> •
            <a href="https://pypi.org" class="python-blue hover:underline">pypi.org</a> •
            <a href="https://docs.python.org" class="python-blue hover:underline">Python Docs</a> •
            <a href="https://peps.python.org" class="python-blue hover:underline">PEPs</a>
          </p>
        </div>
      </div>

      <!-- External JavaScript - Highlight.js -->
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python.min.js"></script>

      <!-- Custom JavaScript -->