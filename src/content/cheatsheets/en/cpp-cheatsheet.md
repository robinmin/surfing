---
title: "C++ Cheatsheet for Experienced Developers"
externalCSS: ["https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/github.min.css"]
externalJS: ["https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js"]
customCSS: |
  /* Base page styling */
          body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              font-size: 11px;
              line-height: 1.3;
              margin: 0;
              padding: 6px;
              color: #333;
              background: linear-gradient(135deg, #f8faff 0%, #f1f7ff 100%);
          }
  
          h1 {
              font-size: 20px;
              margin: 0 0 6px 0;
              text-align: center;
              padding: 8px;
              background: white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              border-bottom: 3px solid #659ad2;
              color: #1a1a1a;
          }
  
          /* Column layout */
          .container {
              display: flex;
              flex-direction: row;
              width: 100%;
              gap: 4px;
          }
  
          .column {
              width: 25%;
              padding: 0;
          }
  
          /* Section styling with card design */
          .code-section {
              background: rgba(255, 255, 255, 0.9);
              border: 2px solid #659ad2;
              border-radius: 8px;
              margin-bottom: 4px;
              padding: 0;
              box-shadow: 0 2px 8px rgba(101, 154, 210, 0.15);
              break-inside: avoid;
              page-break-inside: avoid;
          }
  
          h2 {
              font-size: 13px;
              margin: 0;
              padding: 5px 8px;
              background: linear-gradient(90deg, #659ad2, #5589c7);
              color: white;
              border-radius: 6px 6px 0 0;
              font-weight: 600;
          }
  
          h3 {
              font-size: 11px;
              margin: 6px 8px 3px 8px;
              padding: 3px 0;
              color: #1a1a1a;
              font-weight: 600;
              border-bottom: 1px solid #e0e0e0;
          }
  
          /* Code styling */
          pre {
              margin: 0 8px 6px 8px;
              padding: 6px;
              border-radius: 4px;
              font-size: 9.5px;
              line-height: 1.3;
              overflow: hidden;
              background: #f8f9fa !important;
              border: 1px solid #e9ecef;
          }
  
          code {
              font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
          }
  
          /* Utility classes */
          .note {
              font-style: italic;
              color: #666;
              font-size: 9px;
          }
  
          .warning {
              color: #c92a2a;
              font-weight: bold;
              font-size: 9px;
          }
  
          @media print {
              body {
                  background: white !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
              }
  
              pre {
                  white-space: pre-wrap;
              }
  
              .code-section {
                  box-shadow: none !important;
                  border: 2px solid #659ad2 !important;
                  background: white !important;
              }
  
              h2 {
                  background: #659ad2 !important;
                  -webkit-print-color-adjust: exact;
                  color-adjust: exact;
              }
  
              @page {
                  size: A4 landscape;
                  margin: 0.5cm;
              }
          }
customJS: "hljs.highlightAll();"
tags: ["javascript", "typescript", "angular", "css", "html"]
readingTime: 6
wordCount: 1071
publishDate: 2025-09-30
draft: false
featured: false
---

<h1>C++ Cheatsheet for Experienced Developers</h1>
    <div class="container">
        <!-- Column 1 -->
        <div class="column">
            <div class="code-section">
                <h2>Memory Management & RAII</h2>
                <h3>Smart Pointers</h3>
                <pre><code class="language-cpp">// Unique ownership
auto p1 = std::make_unique&lt;T&gt;(args);
auto p2 = std::unique_ptr&lt;T&gt;(new T(args));

// Shared ownership
auto sp = std::make_shared&lt;T&gt;(args);
auto wp = std::weak_ptr&lt;T&gt;(sp); // Non-owning

// Using weak_ptr
if (auto locked = wp.lock()) {
    // Use locked as shared_ptr
}

// Custom deleters
auto del = [](T* p) {
    // Custom cleanup logic
    delete p;
};
std::unique_ptr&lt;T, decltype(del)&gt; p(new T(), del);</code></pre>

                <h3>Resource Management</h3>
                <pre><code class="language-cpp">// RAII pattern
class Resource {
private:
    FILE* handle;
public:
    Resource(const char* filename)
        : handle(fopen(filename, "r")) {
        if (!handle)
            throw std::runtime_error("File error");
    }
    ~Resource() {
        if (handle) fclose(handle);
    }
    // Prevent copying
    Resource(const Resource&) = delete;
    Resource& operator=(const Resource&) = delete;

    // Allow moving
    Resource(Resource&& other) noexcept
        : handle(other.handle) {
        other.handle = nullptr;
    }
    Resource& operator=(Resource&& other) noexcept {
        if (this != &other) {
            if (handle) fclose(handle);
            handle = other.handle;
            other.handle = nullptr;
        }
        return *this;
    }
};</code></pre>
            </div>

            <div class="code-section">
                <h2>Templates & Metaprogramming</h2>
                <h3>SFINAE & Type Traits</h3>
                <pre><code class="language-cpp">// SFINAE pattern
template &lt;typename T,
          typename = std::enable_if_t&lt;
              std::is_integral_v&lt;T&gt;&gt;&gt;
void func(T value) { /*...*/ }

// Concepts (C++20)
template &lt;std::integral T&gt;
void func(T value) { /*...*/ }

// Type traits
static_assert(std::is_same_v&lt;T, U&gt;);
if constexpr (std::is_arithmetic_v&lt;T&gt;) {
    // For arithmetic types
} else {
    // For other types
}</code></pre>

                <h3>Variadic Templates</h3>
                <pre><code class="language-cpp">// Recursive variadic templates
template&lt;typename T&gt;
void print(const T& t) {
    std::cout &lt;&lt; t &lt;&lt; '\n';
}

template&lt;typename T, typename... Args&gt;
void print(const T& t, const Args&... args) {
    std::cout &lt;&lt; t &lt;&lt; ' ';
    print(args...);
}

// Fold expressions (C++17)
template&lt;typename... Args&gt;
auto sum(Args... args) {
    return (args + ...); // Unary right fold
}</code></pre>
            </div>
        </div>

        <!-- Column 2 -->
        <div class="column">
            <div class="code-section">
                <h2>Modern C++ Features</h2>
                <h3>Move Semantics</h3>
                <pre><code class="language-cpp">// Perfect forwarding
template&lt;typename T, typename... Args&gt;
std::unique_ptr&lt;T&gt; make(Args&&... args) {
    return std::unique_ptr&lt;T&gt;(
        new T(std::forward&lt;Args&gt;(args)...));
}

// Move operations
class Widget {
    std::vector&lt;int&gt; data;
public:
    // Move constructor
    Widget(Widget&& other) noexcept
        : data(std::move(other.data)) {}

    // Move assignment
    Widget& operator=(Widget&& other) noexcept {
        if (this != &other)
            data = std::move(other.data);
        return *this;
    }
};</code></pre>

                <h3>Lambdas & Closures</h3>
                <pre><code class="language-cpp">// Basic lambda
auto add = [](int a, int b) { return a + b; };

// Lambda with capture
int multiplier = 5;
auto times = [multiplier](int x) {
    return x * multiplier;
};

// Mutable lambda
auto counter = [count = 0]() mutable {
    return ++count;
};

// Generic lambda (C++14)
auto generic = [](auto x, auto y) { return x + y; };

// Lambda with explicit return type
auto divide = [](double a, double b) -> double {
    return a / b;
};

// Capture with initialization (C++14)
auto func = [ptr = std::make_unique&lt;int&gt;(42)]() {
    return *ptr;
};</code></pre>

                <h3>Structured Bindings (C++17)</h3>
                <pre><code class="language-cpp">// With array
int arr[3] = {1, 2, 3};
auto [a, b, c] = arr;

// With tuple
auto [name, age] = std::make_tuple("Alice", 30);

// With pair (common in map operations)
auto [iter, success] = myMap.insert({key, value});

// With struct
struct Point { int x, y; };
Point p{1, 2};
auto [px, py] = p;</code></pre>

                <h3>Range-Based For Loop</h3>
                <pre><code class="language-cpp">// Basic usage
for (const auto& item : container) { /*...*/ }

// With structured bindings (C++17)
for (const auto& [key, value] : map) { /*...*/ }

// With initialization (C++20)
for (std::vector v{1,2,3}; auto& elem : v) {
    /*...*/
}</code></pre>
            </div>
        </div>

        <!-- Column 3 -->
        <div class="column">
            <div class="code-section">
                <h2>STL & Algorithms</h2>
                <h3>Algorithm Patterns</h3>
                <pre><code class="language-cpp">// Finding elements
auto it = std::find_if(begin(c), end(c),
    [](const auto& x) { return x > 10; });

// Transforming elements
std::transform(begin(src), end(src), begin(dest),
    [](const auto& x) { return x * 2; });

// Functional operations
auto sum = std::accumulate(begin(c), end(c), 0);
auto product = std::accumulate(begin(c), end(c), 1,
    std::multiplies&lt;&gt;());

// Removing elements (erase-remove idiom)
// Note: remove_if doesn't change container size
auto new_end = std::remove_if(begin(v), end(v),
    [](int x) { return x % 2 == 0; });
v.erase(new_end, end(v));

// Sorting with custom comparator
std::sort(begin(v), end(v),
    [](const auto& a, const auto& b) {
        return a.priority > b.priority;
    });</code></pre>

                <h3>Containers & Iterators</h3>
                <pre><code class="language-cpp">// Container adaptors
std::priority_queue&lt;T, std::vector&lt;T&gt;, Compare&gt; pq;
std::stack&lt;T&gt; stack;
std::queue&lt;T&gt; queue;

// Using iterators
auto it = container.begin();
std::advance(it, 5);    // Move forward by 5
auto dist = std::distance(container.begin(), it);

// Iterator adapters
auto rbegin = container.rbegin();  // Reverse
std::back_inserter(container);     // Insert at end

// C++20 ranges
auto view = std::ranges::views::filter(
    container, [](const auto& x) {
        return x > 0;
    });</code></pre>

                <h3>Concurrency</h3>
                <pre><code class="language-cpp">// Thread creation
std::thread t([](int x) {
    /* thread work */
}, 42);
t.join();  // Wait for thread completion

// Mutex and lock
std::mutex mtx;
{
    std::lock_guard&lt;std::mutex&gt; lock(mtx);
    // Critical section
}

// More flexible locking
std::unique_lock&lt;std::mutex&gt; lock(mtx,
    std::defer_lock);  // Don't lock yet
// ... some code ...
lock.lock();  // Now lock

// Condition variable
std::condition_variable cv;
cv.wait(lock, []{ return ready; });
cv.notify_one();  // Wake one waiting thread</code></pre>
            </div>
        </div>

        <!-- Column 4 -->
        <div class="column">
            <div class="code-section">
                <h2>Classes & OOP</h2>
                <h3>Special Member Functions</h3>
                <pre><code class="language-cpp">class MyClass {
public:
    // Constructor
    MyClass() = default;

    // Custom constructor (explicit prevents implicit)
    explicit MyClass(int val) : value(val) {}

    // Destructor
    ~MyClass() = default;

    // Copy operations
    MyClass(const MyClass&) = delete;  // No copying
    MyClass& operator=(const MyClass&) = delete;

    // Move operations
    MyClass(MyClass&&) noexcept = default;
    MyClass& operator=(MyClass&&) noexcept = default;

private:
    int value = 0;
};</code></pre>

                <h3>Inheritance Patterns</h3>
                <pre><code class="language-cpp">// Abstract base class
class Shape {
public:
    virtual ~Shape() = default;  // Virtual destructor
    virtual double area() const = 0;  // Pure virtual
    virtual void draw() const {
        // Default implementation
    }
};

// CRTP pattern (static polymorphism)
template&lt;typename Derived&gt;
class Base {
public:
    void interface() {
        static_cast&lt;Derived*&gt;(this)->implementation();
    }
protected:
    // Default implementation if needed
    void implementation() { /* default */ }
};</code></pre>

                <h3>Type Deduction</h3>
                <pre><code class="language-cpp">// auto vs decltype
auto x = expr;  // Type from initialization
decltype(expr) y;  // Type of expr (no evaluation)

// Function return type deduction (C++14)
auto func() { return value; }

// Trailing return type
auto func() -> decltype(expr) { return expr; }

// decltype(auto) (C++14)
decltype(auto) f() { return (x); }  // Returns ref

// Forwarding references
template&lt;typename T&gt;
void f(T&& param);  // Universal/forwarding ref</code></pre>

                <h3>Common Patterns & Idioms</h3>
                <pre><code class="language-cpp">// Const-correctness
void func(const T& arg) const noexcept;

// Rule of zero/five
// Either:
// 1. Define no special members (zero)
// or
// 2. Define all five: destructor, copy ctor,
//    copy assign, move ctor, move assign

// Prevent narrowing conversions
T x{narrower};  // Error if narrowing occurs

// Make non-copyable but movable
X(const X&) = delete;
X& operator=(const X&) = delete;
X(X&&) = default;
X& operator=(X&&) = default;

// Virtual inheritance (diamond problem)
class B : public virtual A { /*...*/ };

// const member function overloading
T& operator[](size_t idx);
const T& operator[](size_t idx) const;</code></pre>
            </div>
        </div>
    </div>