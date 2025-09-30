---
title: "Python Cheatsheet — Optimized, Responsive, Printable"
customCSS: |
  :root{
        --font-stack: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif, "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
        --mono-stack: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        --bg: #0f1220;
        --card: #151a2d;
        --ink: #eef1f7;
        --muted: #b8c1d9;
        --accent: #66d9ef;
        --accent-2: #a6e22e;
        --border: #2a3253;
        --code-bg: #0b0e1a;
        --link: #7cc1ff;
        --link-hover: #a7d5ff;
        --gap: 1.2rem;
        --radius: 10px;
        --shadow: 0 6px 20px rgba(0,0,0,.25);
        --maxw: 1200px;
        --h1: 1.85rem;
        --h2: 1.2rem;
        --h3: 1.05rem;
        --text: 0.95rem;
        --code: 0.9rem;
      }
  
      html, body {
        height: 100%;
        background: var(--bg);
        color: var(--ink);
        font-family: var(--font-stack);
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
  
      a { color: var(--link); text-decoration: none; }
      a:hover { color: var(--link-hover); text-decoration: underline; }
  
      header {
        max-width: var(--maxw);
        margin: 1rem auto 0.5rem;
        padding: 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      header h1 {
        font-size: --h1;
        font-size: var(--h1);
        margin: 0;
        letter-spacing: 0.2px;
      }
      .subtitle {
        color: var(--muted);
        font-size: 0.95rem;
        margin-top: 0.25rem;
      }
  
      .toolbar {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .btn {
        appearance: none;
        border: 1px solid var(--border);
        background: var(--card);
        color: var(--ink);
        border-radius: 8px;
        padding: 0.5rem 0.8rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: transform .05s ease-in-out, background .2s ease, border-color .2s ease;
      }
      .btn:hover { background: #1a2040; border-color: #3a4475; }
      .btn:active { transform: translateY(1px); }
  
      main {
        max-width: var(--maxw);
        margin: 0 auto;
        padding: 0 1rem 2rem;
      }
  
      /* Responsive multi-column layout with balancing */
      .columns {
        column-gap: var(--gap);
        column-fill: balance;
        /* default mobile: 1 col via column-count */
        column-count: 1;
      }
      @media (min-width: 640px) { .columns { column-count: 2; } }   /* Tablet */
      @media (min-width: 1024px) { .columns { column-count: 3; } }  /* Desktop */
      @media (min-width: 1440px) { .columns { column-count: 4; } }  /* Large */
  
      section.card {
        display: inline-block;  /* important for CSS columns */
        width: 100%;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 0.9rem 1rem;
        margin: 0 0 var(--gap);
        box-shadow: var(--shadow);
        break-inside: avoid;
        -webkit-column-break-inside: avoid;
        -moz-column-break-inside: avoid;
      }
  
      h2 {
        font-size: var(--h2);
        margin: 0 0 0.5rem;
        color: var(--accent);
      }
      h3 {
        font-size: var(--h3);
        margin: 0.75rem 0 0.25rem;
        color: var(--accent-2);
      }
      p, ul, ol { margin: 0.25rem 0; font-size: var(--text); color: var(--ink); }
      ul { padding-left: 1.1rem; }
      li { margin: 0.15rem 0; }
  
      code, pre, kbd, samp {
        font-family: var(--mono-stack);
        font-size: var(--code);
      }
      pre {
        background: var(--code-bg);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 0.8rem;
        margin: 0.5rem 0 0.75rem;
        box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);
        /* Ensure no horizontal scrolling */
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow-x: hidden;
        overflow-y: visible;
        max-width: 100%;
      }
      pre code {
        white-space: pre-wrap;
        word-break: break-word;
        display: block;
        max-width: 100%;
      }
      code.inline {
        background: rgba(255,255,255,0.06);
        padding: 0.05rem 0.3rem;
        border-radius: 6px;
        border: 1px solid var(--border);
      }
  
      footer {
        max-width: var(--maxw);
        margin: 0 auto 2rem;
        padding: 0 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--muted);
        font-size: 0.9rem;
        gap: 1rem;
      }
      .footer-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
  
      /* Print optimizations */
      @page { size: A4 portrait; margin: 12mm; }
      @media print {
        :root {
          --bg: #ffffff;
          --card: #ffffff;
          --ink: #000000;
          --muted: #444;
          --border: #bbb;
          --code-bg: #f4f6fa;
          --shadow: none;
        }
        body { background: #fff; color: #000; }
        header, .toolbar, .footer-actions .btn-print-hint { display: none !important; }
        .columns { column-count: 4; column-gap: 10mm; }
        section.card {
          box-shadow: none;
          border-color: #ccc;
          break-inside: avoid-page;
          page-break-inside: avoid;
        }
        pre { break-inside: avoid-page; page-break-inside: avoid; }
        a { color: #000; text-decoration: none; }
      }
  
  /* Place any user overrides below. This block loads last to ensure highest priority. */
      /* Example:
      :root { --accent: #ffd166; --accent-2: #ef476f; }
      body { font-size: 15px; }
      */
customJS: |
  hljs.highlightAll();
      document.getElementById('year').textContent = new Date().getFullYear();
tags: ["javascript", "typescript", "angular", "css", "html"]
readingTime: 7
wordCount: 1233
publishDate: 2025-09-30
draft: false
featured: false
---

<header>
    <div>
      <h1>Python Cheatsheet</h1>
      <div class="subtitle">Concise reference for everyday Python. Responsive, balanced columns. Printable.</div>
    </div>
    <div class="toolbar">
      <button class="btn" type="button" onclick="window.print()">Download PDF</button>
      <a class="btn" href="#top">Top</a>
    </div>
  </header>

  <main id="top">
    <div class="columns">

      <!-- 1. Variables & References -->
      <section class="card" aria-labelledby="sec-vars">
        <h2 id="sec-vars">Variables & References</h2>
        <ul>
          <li>Everything is an object; names bind to objects (references).</li>
          <li><span class="inline">==</span> compares value; <span class="inline">is</span> compares identity.</li>
          <li>Immutable: int, float, bool, str, tuple, frozenset; Mutable: list, dict, set, bytearray.</li>
        </ul>
        <pre><code class="language-python">x = 10
y = x          # y references same int object as x
x is y         # True (small ints may be interned)
x == y         # True (values equal)

a = [1, 2]
b = a
b.append(3)
a               # [1, 2, 3] (same list)

# Multiple assignment, unpacking
i, j, k = 1, 2, 3
head, *mid, tail = [0, 1, 2, 3, 4]   # head=0, mid=[1,2,3], tail=4

# Scope
name = "outer"
def f():
    global name
    name = "modified global"

def g():
    x = "enclosed"
    def h():
        nonlocal x
        x = "changed enclosed"
    h()
    return x  # "changed enclosed"</code></pre>
      </section>

      <!-- 2. Collections -->
      <section class="card" aria-labelledby="sec-collections">
        <h2 id="sec-collections">Collections</h2>
        <ul>
          <li>Built-ins: list, tuple, dict, set; from collections: Counter, defaultdict, deque, namedtuple.</li>
          <li>Prefer dict and set literal syntax for performance.</li>
        </ul>
        <pre><code class="language-python"># Lists and tuples
nums = [1, 2, 3]
nums += [4]
first, *rest = nums

point = (10, 20)

# Sets and dicts
s = {1, 2, 3}
s.add(3)         # no effect
d = {"a": 1, "b": 2}
d.get("c", 0)    # 0

# Useful collections
from collections import Counter, defaultdict, deque, namedtuple

cnt = Counter("banana")        # Counter({'a':3,'n':2,'b':1})
dd = defaultdict(int)
dd["x"] += 1                   # default 0 => 1

q = deque([1,2,3]); q.appendleft(0); q.pop()

Point = namedtuple("Point", "x y")
p = Point(2, 3); p.x  # 2</code></pre>
        <h3>pathlib and glob</h3>
        <pre><code class="language-python">from pathlib import Path
root = Path(".")
py_files = list(root.glob("**/*.py"))
for path in py_files:
    if path.stat().st_size &gt; 0:
        pass</code></pre>
      </section>

      <!-- 3. File Operations -->
      <section class="card" aria-labelledby="sec-files">
        <h2 id="sec-files">File Operations</h2>
        <ul>
          <li>Use context managers to ensure closure.</li>
          <li>Use <span class="inline">pathlib.Path</span> for paths; specify encoding.</li>
        </ul>
        <pre><code class="language-python">from pathlib import Path

# Read text
p = Path("notes.txt")
text = p.read_text(encoding="utf-8")

# Write text
p.write_text("Hello\n", encoding="utf-8")

# Buffered reading
with p.open("r", encoding="utf-8", newline="") as f:
    for line in f:
        process(line.rstrip("\n"))

# Binary
data = Path("img.bin").read_bytes()
Path("copy.bin").write_bytes(data)

# JSON / CSV
import json, csv
cfg = json.loads(Path("config.json").read_text(encoding="utf-8"))
Path("out.json").write_text(json.dumps(cfg, indent=2), encoding="utf-8")

with open("data.csv", newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    rows = list(reader)</code></pre>
      </section>

      <!-- 4. Iteration Patterns -->
      <section class="card" aria-labelledby="sec-iteration">
        <h2 id="sec-iteration">Iteration Patterns</h2>
        <ul>
          <li>Prefer iterables and generators; avoid indexing when not required.</li>
        </ul>
        <pre><code class="language-python"># enumerate, zip
for i, val in enumerate(["a", "b", "c"], start=1):
    pass

for a, b in zip([1,2], [3,4]):
    pass

# iter/next
it = iter([10,20])
next(it)  # 10

# itertools
import itertools as it
it.islice(range(10), 3)               # 0,1,2
list(it.chain([1,2], [3,4]))          # [1,2,3,4]
list(it.product("ab", repeat=2))      # ('a','a'), ...

# groupby (input must be sorted by key)
from itertools import groupby
data = sorted(["aa","ab","ba"], key=lambda s: s[0])
for key, grp in groupby(data, key=lambda s: s[0]):
    items = list(grp)</code></pre>
      </section>

      <!-- 5. Comprehensions -->
      <section class="card" aria-labelledby="sec-comprehensions">
        <h2 id="sec-comprehensions">Comprehensions</h2>
        <ul>
          <li>List, dict, set, generator comprehensions; add conditionals and nesting.</li>
        </ul>
        <pre><code class="language-python"># List
squares = [x*x for x in range(10) if x % 2 == 0]

# Dict
mapping = {c: ord(c) for c in "abc"}

# Set
uniq = {x % 3 for x in range(10)}

# Generator (lazy)
gen = (x*x for x in range(1_000_000))

# Nested
pairs = [(i, j) for i in range(3) for j in range(3) if i != j]</code></pre>
      </section>

      <!-- 6. Data Processing -->
      <section class="card" aria-labelledby="sec-data">
        <h2 id="sec-data">Data Processing</h2>
        <ul>
          <li>Use built-ins: sum, min, max, sorted, any, all.</li>
          <li>Prefer <span class="inline">key=</span> functions and generators.</li>
        </ul>
        <pre><code class="language-python">nums = [3, 1, 4, 1, 5, 9]
total = sum(nums)
mx = max(nums)
sorted_nums = sorted(nums, reverse=True)

# any/all with conditions
has_neg = any(x &lt; 0 for x in nums)
all_small = all(x &lt; 10 for x in nums)

# key and custom sort
words = ["apple", "bee", "carrot"]
sorted_by_len = sorted(words, key=len)

# map/filter/reduce
from functools import reduce
evens = list(filter(lambda x: x % 2 == 0, nums))
doubled = list(map(lambda x: x*2, nums))
prod = reduce(lambda a, b: a*b, nums, 1)

# statistics
import statistics as stats
mean = stats.mean(nums)
median = stats.median(nums)</code></pre>
      </section>

      <!-- 7. Functions & Lambdas -->
      <section class="card" aria-labelledby="sec-functions">
        <h2 id="sec-functions">Functions & Lambdas</h2>
        <ul>
          <li>Use annotations; prefer keyword-only and positional-only when helpful.</li>
          <li>Default args evaluated once; avoid mutable defaults.</li>
        </ul>
        <pre><code class="language-python">def add(a: int, b: int = 0, /, *, scale: float = 1.0) -> float:
    """Positional-only a,b; keyword-only scale."""
    return (a + b) * scale

# Avoid mutable default
def append_safe(x, arr=None):
    arr = [] if arr is None else arr
    arr.append(x)
    return arr

# *args, **kwargs
def log(*args, **kwargs):
    print(*args, **kwargs)

# Closure
def make_adder(n):
    def add(x): return x + n
    return add

plus3 = make_adder(3); plus3(7)  # 10

# Lambda
square = lambda x: x*x
</code></pre>
      </section>

      <!-- 8. String Operations -->
      <section class="card" aria-labelledby="sec-strings">
        <h2 id="sec-strings">String Operations</h2>
        <ul>
          <li>Use f-strings; prefer join/split; normalize with casefold.</li>
        </ul>
        <pre><code class="language-python">name, n = "Ada", 3
f"Hello, {name}! {n=}"         # 'Hello, Ada! n=3'
f"{n:04d}"                     # zero-padded
f"{3.14159:.2f}"               # '3.14'

" :: ".join(["a", "b", "c"])
"  spaced  ".strip()
"Ümlaut".casefold()            # aggressive lowercasing
"2025-09-30".split("-")

# Translation table
tbl = str.maketrans({"-": "/", "_": " "})
"2025-09-30_report".translate(tbl)

# Regular expressions
import re
m = re.search(r"(\w+)@([\w.]+)", "me@example.com")
user, host = m.groups() if m else (None, None)</code></pre>
      </section>

      <!-- 9. Exception Handling -->
      <section class="card" aria-labelledby="sec-exceptions">
        <h2 id="sec-exceptions">Exception Handling</h2>
        <ul>
          <li>Use precise exceptions; leverage else/finally; chain with raise from.</li>
        </ul>
        <pre><code class="language-python">try:
    x = int("42")
except ValueError as e:
    raise RuntimeError("Bad input") from e
else:
    print("No error")
finally:
    cleanup()

# Context managers
from contextlib import suppress, ExitStack
with suppress(FileNotFoundError):
    open("maybe.txt").read()

# Custom exception
class ConfigError(Exception): pass</code></pre>
      </section>

      <!-- 10. Modules & Packages -->
      <section class="card" aria-labelledby="sec-modules">
        <h2 id="sec-modules">Modules & Packages</h2>
        <ul>
          <li>Use absolute imports; organize with __init__.py; expose API via __all__.</li>
        </ul>
        <pre><code class="language-python"># Imports
import math
from math import sqrt as root
from pathlib import Path

# Package structure:
# mypkg/
#   __init__.py
#   utils.py
#   core/
#     __init__.py
#     model.py

# mypkg/__init__.py
from .utils import helper
__all__ = ["helper"]</code></pre>
        <h3>Virtual environments</h3>
        <pre><code class="language-python"># Shell
# python -m venv .venv
# source .venv/bin/activate  (Windows: .venv\Scripts\activate)
# python -m pip install -U pip</code></pre>
      </section>

      <!-- 11. Classes & Methods -->
      <section class="card" aria-labelledby="sec-classes">
        <h2 id="sec-classes">Classes & Methods</h2>
        <ul>
          <li>Use dataclasses for data containers; properties for computed attributes.</li>
          <li>Class vs static methods; prefer composition over inheritance.</li>
        </ul>
        <pre><code class="language-python">class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    @property
    def mag(self) -> float:
        return (self.x**2 + self.y**2) ** 0.5

    def scale(self, k: float) -> "Vector":
        return Vector(self.x*k, self.y*k)

    @classmethod
    def zero(cls) -> "Vector":
        return cls(0.0, 0.0)

    @staticmethod
    def dot(a: "Vector", b: "Vector") -> float:
        return a.x*b.x + a.y*b.y</code></pre>
        <h3>Dataclasses</h3>
        <pre><code class="language-python">from dataclasses import dataclass, field

@dataclass(slots=True)
class User:
    name: str
    roles: list[str] = field(default_factory=list)

u = User("Ada"); u.roles.append("admin")</code></pre>
      </section>

      <!-- 12. Special Methods -->
      <section class="card" aria-labelledby="sec-dunder">
        <h2 id="sec-dunder">Special Methods</h2>
        <ul>
          <li>Implement dunder methods to integrate with Python protocols.</li>
        </ul>
        <pre><code class="language-python">class Box:
    def __init__(self, items=None): self._items = list(items or [])

    # Representation
    def __repr__(self): return f"Box({self._items!r})"
    def __str__(self):  return ", ".join(map(str, self._items))

    # Container protocol
    def __len__(self): return len(self._items)
    def __iter__(self): return iter(self._items)
    def __getitem__(self, i): return self._items[i]

    # Callable
    def __call__(self, item): self._items.append(item)

    # Comparison
    def __eq__(self, other): return list(self) == list(other)

    # Context manager
    def __enter__(self): return self
    def __exit__(self, exc_type, exc, tb): return False</code></pre>
      </section>

      <!-- 13. Modern Python Features -->
      <section class="card" aria-labelledby="sec-modern">
        <h2 id="sec-modern">Modern Python Features</h2>
        <ul>
          <li>Type hints, structural pattern matching, assignment expressions, enums, pathlib, asyncio.</li>
        </ul>
        <h3>Type Hints</h3>
        <pre><code class="language-python">from typing import Iterable, Iterator, Optional, Any

def take(n: int, seq: Iterable[Any]) -> list[Any]:
    out: list[Any] = []
    for i, x in enumerate(seq):
        if i == n: break
        out.append(x)
    return out</code></pre>
        <h3>Pattern Matching (3.10+)</h3>
        <pre><code class="language-python">def classify(x):
    match x:
        case {"status": 200, "data": data}:
            return ("ok", data)
        case [a, b, *rest] if a == b:
            return "starts-with-duplicate"
        case int(n) if n &gt; 0:
            return "positive-int"
        case _:
            return "unknown"</code></pre>
        <h3>Assignment Expression (:=)</h3>
        <pre><code class="language-python"># Read lines until empty
while (line := input().strip()):
    print(line.upper())</code></pre>
        <h3>Enum</h3>
        <pre><code class="language-python">from enum import Enum, auto

class Color(Enum):
    RED = auto()
    GREEN = auto()
    BLUE = auto()</code></pre>
        <h3>Asyncio</h3>
        <pre><code class="language-python">import asyncio

async def fetch(n: int) -> int:
    await asyncio.sleep(0.1)
    return n * 2

async def main():
    results = await asyncio.gather(*(fetch(i) for i in range(5)))
    print(results)

# asyncio.run(main())</code></pre>
      </section>

    </div>
  </main>

  <footer>
    <div>© <span id="year"></span> Python Cheatsheet</div>
    <div class="footer-actions">
      <a class="btn" href="#" onclick="window.print(); return false;">Download PDF</a>
      <span class="btn btn-print-hint" title="Tip">Use your browser's Print to PDF</span>
    </div>
  </footer>

  <!-- Highlight.js JS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" integrity="sha512-oRBBiX9CjQj2bFf4lBVJQ9Hw6JymD5O/4QzH8D3k2kSybzYzKpQvEn2kz3X8fXOjrqzqRj50Ma07kKcH3mS9JQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>