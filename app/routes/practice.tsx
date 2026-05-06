import { useState, useEffect, useRef } from "react";
import Navbar from "~/components/Navbar";
import ScoreCircle from "~/components/Scorecircle";

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryKey =
  | "aptitude" | "frontend" | "backend" | "database" | "javascript" | "python"
  | "cpp" | "java" | "typescript" | "reactnative" | "dsa";

type Step = "home" | "quiz" | "results";

interface MCQ {
  q: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
}

interface CategoryConfig {
  label: string;
  desc: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  color: string;
  bg: string;
  border: string;
  comingSoon?: boolean;
  icon: React.ReactNode;
}

// ─── Category Config ──────────────────────────────────────────────────────────

const categories: Record<CategoryKey, CategoryConfig> = {
  aptitude: {
    label: "Aptitude",
    desc: "Logical reasoning, quantitative ability & problem solving",
    difficulty: "Beginner",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.2)",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  },
  frontend: {
    label: "Frontend",
    desc: "HTML, CSS, React, browser APIs and UI concepts",
    difficulty: "Intermediate",
    color: "#60a5fa",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  },
  backend: {
    label: "Backend",
    desc: "APIs, authentication, server architecture & security",
    difficulty: "Intermediate",
    color: "#a78bfa",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>,
  },
  database: {
    label: "Database",
    desc: "SQL, NoSQL, normalization, indexing & transactions",
    difficulty: "Intermediate",
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  },
  javascript: {
    label: "JavaScript",
    desc: "Core JS, closures, async patterns, ES6+ and the event loop",
    difficulty: "Intermediate",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.22)",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
  python: {
    label: "Python",
    desc: "Python fundamentals, OOP, decorators & data structures",
    difficulty: "Beginner",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.2)",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
  },
  cpp: {
    label: "C++",
    desc: "Pointers, memory management, OOP and STL",
    difficulty: "Advanced",
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
    comingSoon: true,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  },
  java: {
    label: "Java",
    desc: "JVM, OOP, collections framework and concurrency",
    difficulty: "Intermediate",
    color: "#fb923c",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.2)",
    comingSoon: true,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
  },
  typescript: {
    label: "TypeScript",
    desc: "Types, interfaces, generics and advanced TS patterns",
    difficulty: "Intermediate",
    color: "#818cf8",
    bg: "rgba(129,140,248,0.08)",
    border: "rgba(129,140,248,0.2)",
    comingSoon: true,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  },
  reactnative: {
    label: "React Native",
    desc: "Mobile components, navigation, and native modules",
    difficulty: "Intermediate",
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.08)",
    border: "rgba(34,211,238,0.2)",
    comingSoon: true,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  },
  dsa: {
    label: "DSA",
    desc: "Arrays, trees, graphs, sorting, and dynamic programming",
    difficulty: "Advanced",
    color: "#e879f9",
    bg: "rgba(232,121,249,0.08)",
    border: "rgba(232,121,249,0.2)",
    comingSoon: true,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21l-4-4 4-4m10 8l4-4-4-4M9.5 3l5 18" /></svg>,
  },
};

// ─── Question Banks ───────────────────────────────────────────────────────────

const questionBank: Record<string, MCQ[]> = {
  aptitude: [
    { q: "A train covers 360 km in 4 hours. What is its speed in m/s?", options: ["25", "30", "20", "35"], answer: 0 },
    { q: "What percentage of 80 is 20?", options: ["20%", "25%", "30%", "15%"], answer: 1 },
    { q: "A bag has 3 red, 4 blue, 5 green balls. Probability of picking blue?", options: ["1/3", "1/4", "2/5", "1/6"], answer: 0 },
    { q: "5 workers finish a job in 8 days. How many workers to finish in 4 days?", options: ["8", "10", "12", "6"], answer: 1 },
    { q: "Next in series: 2, 6, 18, 54, ___?", options: ["162", "108", "216", "180"], answer: 0 },
    { q: "A shopkeeper marks a price 40% above cost and gives 20% discount. Profit %?", options: ["12%", "10%", "14%", "16%"], answer: 0 },
    { q: "If 12 men can do a piece of work in 20 days, how long will 15 men take?", options: ["14 days", "16 days", "18 days", "20 days"], answer: 1 },
    { q: "Find the odd one out: 3, 7, 11, 14, 19", options: ["3", "14", "11", "19"], answer: 1 },
    { q: "If COMPUTER is coded as RFUVQNPC, what is MEDICINE coded as?", options: ["MFEJDJOF", "NFEJDJOF", "MFEJDJOH", "NFEJDJOH"], answer: 1 },
    { q: "Two numbers are in ratio 3:5, their LCM is 60. Sum of the numbers?", options: ["32", "36", "40", "48"], answer: 1 },
    { q: "A cistern has leak that can empty it in 10 hrs. A tap fills at 4 L/min. Cistern holds 2400L. Will it be filled?", options: ["Yes, fully filled", "No, it will never fill", "Filled in 20 hrs", "Filled in 15 hrs"], answer: 1 },
    { q: "The sum of first 20 natural numbers is:", options: ["200", "210", "190", "220"], answer: 1 },
    { q: "If A is taller than B, C is taller than A, D is taller than C. Who is shortest?", options: ["A", "B", "C", "D"], answer: 1 },
    { q: "A clock shows 3:30. What is the angle between hour and minute hands?", options: ["75°", "90°", "105°", "60°"], answer: 0 },
    { q: "4 years ago, ratio of ages of P and Q was 3:4. After 8 years it will be 5:6. Current age of P?", options: ["16", "20", "24", "28"], answer: 1 },
    { q: "What is 15% of 15% of 1000?", options: ["22.5", "225", "2.25", "0.225"], answer: 0 },
    { q: "If all Blooms are Flowers and all Flowers are Trees, which is definitely true?", options: ["All Trees are Blooms", "All Blooms are Trees", "All Trees are Flowers", "No Blooms are Trees"], answer: 1 },
    { q: "A boat travels 36 km upstream in 6 hrs, downstream in 4 hrs. Speed of stream?", options: ["1.5 km/h", "2 km/h", "2.5 km/h", "3 km/h"], answer: 0 },
    { q: "In a group of 70 people, 37 like tea and 52 like coffee. Both are liked by minimum how many?", options: ["15", "17", "19", "21"], answer: 2 },
    { q: "ΔPQR ~ ΔXYZ and area ratio is 4:9. If PQ = 12 cm, XY = ?", options: ["18 cm", "16 cm", "9 cm", "8 cm"], answer: 0 },
  ],

  frontend: [
    { q: "What does the `DOCTYPE` declaration do in HTML?", options: ["Defines page title", "Tells browser which HTML version is used", "Links CSS file", "Declares JavaScript"], answer: 1 },
    { q: "Which CSS property controls the order of elements in a flex container?", options: ["z-index", "align-items", "order", "flex-direction"], answer: 2 },
    { q: "What is the output of `typeof null` in JavaScript?", options: ["'null'", "'undefined'", "'object'", "'boolean'"], answer: 2 },
    { q: "Which React hook is used for side effects like data fetching?", options: ["useState", "useEffect", "useContext", "useRef"], answer: 1 },
    { q: "What does CSS `position: sticky` do?", options: ["Fixes element to viewport always", "Removes element from flow", "Sticks element when scrolled past its offset", "Same as position: fixed"], answer: 2 },
    { q: "In the CSS box model, what does `box-sizing: border-box` change?", options: ["Padding is excluded from width", "Border and padding included in element's total width", "Margin is included in width", "Nothing changes"], answer: 1 },
    { q: "What is event delegation in JavaScript?", options: ["Firing events on multiple elements simultaneously", "Attaching a single event listener to parent to handle child events", "Preventing event bubbling", "Creating custom events"], answer: 1 },
    { q: "Which HTTP status code means 'Resource Not Found'?", options: ["400", "401", "403", "404"], answer: 3 },
    { q: "What is the purpose of the `key` prop in React lists?", options: ["Styling list items", "Help React identify which items changed", "Setting item order", "Providing accessibility"], answer: 1 },
    { q: "What does `localStorage.setItem()` do?", options: ["Stores data only for session", "Stores data permanently in browser", "Stores data on server", "Creates a cookie"], answer: 1 },
    { q: "What does `defer` attribute on a `<script>` tag do?", options: ["Loads script asynchronously", "Delays script execution until DOM is parsed", "Loads script after CSS", "Skips script loading"], answer: 1 },
    { q: "Which CSS unit is relative to the font size of the root element?", options: ["em", "rem", "vh", "vw"], answer: 1 },
    { q: "What is the Virtual DOM?", options: ["A browser feature", "Direct manipulation of real DOM", "Lightweight in-memory representation of the real DOM", "A CSS rendering engine"], answer: 2 },
    { q: "What does CORS stand for?", options: ["Cross-Origin Resource Sharing", "Cross-Origin Request System", "Client-Origin Resource Sharing", "Cross-Object Response System"], answer: 0 },
    { q: "Which pseudo-class selects an element when it receives keyboard focus?", options: [":active", ":hover", ":focus", ":visited"], answer: 2 },
    { q: "What is the default `display` value of a `<div>` element?", options: ["inline", "block", "inline-block", "flex"], answer: 1 },
    { q: "What does `Promise.all()` do?", options: ["Runs promises sequentially", "Returns first resolved promise", "Waits for all promises to resolve", "Ignores rejected promises"], answer: 2 },
    { q: "What is semantic HTML?", options: ["HTML with inline styles", "HTML using elements that convey meaning", "HTML optimized for search engines only", "HTML without class names"], answer: 1 },
    { q: "Which method removes the last element of an array in JavaScript?", options: ["shift()", "pop()", "splice()", "slice()"], answer: 1 },
    { q: "What is lazy loading in the context of web images?", options: ["Loading all images on page load", "Loading images only when they enter the viewport", "Compressing images before loading", "Loading images from cache"], answer: 1 },
  ],

  backend: [
    { q: "Which HTTP method is used to update a resource partially?", options: ["PUT", "POST", "PATCH", "DELETE"], answer: 2 },
    { q: "What does REST stand for?", options: ["Remote Execution State Transfer", "Representational State Transfer", "Resource Exchange State Technology", "Reliable State Transfer"], answer: 1 },
    { q: "What is middleware in Node.js/Express?", options: ["Database connection layer", "Function that executes between request and response", "HTML template engine", "Static file server"], answer: 1 },
    { q: "What does JWT stand for?", options: ["JavaScript Web Token", "JSON Web Token", "Java Web Transfer", "JSON Wire Transfer"], answer: 1 },
    { q: "Which status code means 'Unauthorized - authentication required'?", options: ["400", "401", "403", "404"], answer: 1 },
    { q: "What is the main difference between PUT and POST?", options: ["POST is idempotent, PUT is not", "PUT is idempotent, POST is not", "Both are idempotent", "Neither is idempotent"], answer: 1 },
    { q: "What is a webhook?", options: ["A scheduled task on server", "HTTP callback triggered by an event", "A load balancer endpoint", "A WebSocket connection"], answer: 1 },
    { q: "Which of these is NOT a valid HTTP caching header?", options: ["Cache-Control", "ETag", "Last-Modified", "Data-Store"], answer: 3 },
    { q: "What is rate limiting in APIs?", options: ["Limiting server memory", "Restricting number of requests a client can make in a time period", "Limiting response payload size", "Throttling database writes"], answer: 1 },
    { q: "What does ACID stand for in database transactions?", options: ["Atomicity, Consistency, Isolation, Durability", "Asynchronous, Consistent, Isolated, Distributed", "Atomic, Concurrent, Independent, Durable", "Accurate, Consistent, Isolated, Durable"], answer: 0 },
    { q: "What is the purpose of an API gateway?", options: ["Direct database access", "Single entry point for all client requests", "Render HTML pages", "Store session data"], answer: 1 },
    { q: "Which authentication method sends credentials on every request as a header?", options: ["OAuth 2.0", "JWT", "Basic Auth", "SAML"], answer: 2 },
    { q: "What is horizontal scaling?", options: ["Increasing CPU/RAM of existing server", "Adding more servers to distribute load", "Optimizing application code", "Increasing database storage"], answer: 1 },
    { q: "What does idempotent mean for HTTP methods?", options: ["Method always returns 200", "Multiple identical requests produce same result as one", "Method cannot be cached", "Method requires authentication"], answer: 1 },
    { q: "What is the primary use of Redis?", options: ["Relational database storage", "In-memory data structure store / cache", "Message queue only", "File storage"], answer: 1 },
    { q: "What is GraphQL primarily used for?", options: ["Only querying databases", "Flexible API query language for precise data fetching", "WebSocket communication", "File upload handling"], answer: 1 },
    { q: "What is a microservice?", options: ["A very small monolith", "Independent service responsible for a single business function", "A tiny virtual machine", "A minimal frontend framework"], answer: 1 },
    { q: "What does HTTPS provide over HTTP?", options: ["Faster data transfer", "Encrypted communication via TLS/SSL", "Better caching", "Persistent connections"], answer: 1 },
    { q: "What is connection pooling?", options: ["Storing multiple database schemas", "Reusing existing database connections instead of creating new ones", "Load balancing between databases", "Caching query results"], answer: 1 },
    { q: "Which tool is commonly used for API documentation and testing?", options: ["Figma", "Swagger / OpenAPI", "Webpack", "Docker"], answer: 1 },
  ],

  database: [
    { q: "Which SQL clause filters rows AFTER grouping?", options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], answer: 1 },
    { q: "What type of JOIN returns only matching rows from both tables?", options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"], answer: 2 },
    { q: "What is database normalization?", options: ["Speeding up queries with indexes", "Organizing data to reduce redundancy and improve integrity", "Replicating data across servers", "Compressing database files"], answer: 1 },
    { q: "Which normal form eliminates transitive dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], answer: 2 },
    { q: "What is a PRIMARY KEY constraint?", options: ["Allows duplicate values", "Must be NOT NULL and unique — uniquely identifies each row", "Can be NULL", "Links to another table"], answer: 1 },
    { q: "What does a FOREIGN KEY enforce?", options: ["Row uniqueness", "Referential integrity between tables", "Column uniqueness", "Index creation"], answer: 1 },
    { q: "What is an index in a database?", options: ["A backup of the table", "Data structure that speeds up data retrieval", "A query execution plan", "A constraint on columns"], answer: 1 },
    { q: "What does the `EXPLAIN` keyword do in SQL?", options: ["Returns table structure", "Shows query execution plan", "Runs a slow query faster", "Encrypts query output"], answer: 1 },
    { q: "Which NoSQL database type is best for storing graph data?", options: ["Document store", "Column store", "Key-value store", "Graph database"], answer: 3 },
    { q: "What is a database deadlock?", options: ["When a query takes too long", "When two transactions each wait for the other to release a lock", "When the database runs out of storage", "When connection pool is exhausted"], answer: 1 },
    { q: "What does `SELECT DISTINCT` do?", options: ["Selects only NULL values", "Returns unique rows, removing duplicates", "Selects a specific number of rows", "Selects rows in a specific order"], answer: 1 },
    { q: "Which of these is a type of NoSQL database?", options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"], answer: 2 },
    { q: "What is a stored procedure?", options: ["Scheduled backup", "Pre-compiled set of SQL statements stored in the database", "Trigger on table events", "Index creation script"], answer: 1 },
    { q: "What is database sharding?", options: ["Encrypting database columns", "Horizontal partitioning of data across multiple database instances", "Backing up data to cloud", "Creating read replicas"], answer: 1 },
    { q: "What does the CAP theorem state?", options: ["Databases can be consistent, available, and partition-tolerant simultaneously", "Distributed systems can only guarantee 2 of: Consistency, Availability, Partition tolerance", "All databases must be ACID-compliant", "NoSQL databases lack consistency"], answer: 1 },
    { q: "What is the difference between DELETE and TRUNCATE?", options: ["No difference", "DELETE removes specific rows and can be rolled back; TRUNCATE removes all rows faster", "TRUNCATE can use WHERE clause", "DELETE is faster than TRUNCATE"], answer: 1 },
    { q: "What is an ORM?", options: ["A database type", "A tool mapping objects in code to database tables", "A SQL optimization technique", "A database backup strategy"], answer: 1 },
    { q: "In SQL, what does `GROUP BY` do?", options: ["Sorts results alphabetically", "Groups rows sharing a value for aggregate functions", "Filters rows before selection", "Joins multiple tables"], answer: 1 },
    { q: "What is eventual consistency in distributed databases?", options: ["Data is immediately consistent after every write", "All replicas will become consistent over time without immediate synchronization", "Transactions always succeed", "Reads always return the latest write"], answer: 1 },
    { q: "Which SQL aggregate function returns the number of rows?", options: ["SUM()", "AVG()", "COUNT()", "MAX()"], answer: 2 },
  ],

  javascript: [
    { q: "What is the output of `typeof null`?", options: ["'null'", "'undefined'", "'object'", "'boolean'"], answer: 2 },
    { q: "Which of the following is NOT a JavaScript data type?", options: ["Symbol", "BigInt", "Float", "undefined"], answer: 2 },
    { q: "What does `===` check compared to `==`?", options: ["Only value equality", "Only type equality", "Both value AND type equality (strict)", "Reference equality"], answer: 2 },
    { q: "What is a closure in JavaScript?", options: ["A function that has no return value", "A function that retains access to its outer scope's variables", "An immediately invoked function", "A function assigned to a variable"], answer: 1 },
    { q: "What does `Array.prototype.map()` return?", options: ["The original array modified", "A new array with results of calling a function on each element", "A filtered array", "undefined"], answer: 1 },
    { q: "What is hoisting in JavaScript?", options: ["Moving code to the bottom of the file", "Moving declarations to the top of their scope before execution", "Removing unused variables", "Converting types automatically"], answer: 1 },
    { q: "What is the difference between `var`, `let`, and `const`?", options: ["No difference in modern JS", "var is function-scoped, let/const are block-scoped; const cannot be reassigned", "let is globally scoped", "const values can be changed"], answer: 1 },
    { q: "What does `Promise.all()` do if one promise rejects?", options: ["Returns the resolved promises", "Immediately rejects with that error", "Waits for all to settle", "Returns undefined for rejected ones"], answer: 1 },
    { q: "What is the event loop in JavaScript?", options: ["A for loop that handles DOM events", "Mechanism that handles async operations by monitoring call stack and callback queue", "The DOM event system", "A loop for iterating over DOM nodes"], answer: 1 },
    { q: "What does `this` refer to in an arrow function?", options: ["The arrow function itself", "The global object", "It inherits `this` from its enclosing lexical scope", "undefined always"], answer: 2 },
    { q: "What is the spread operator (`...`) used for?", options: ["Loop iteration", "Expanding an iterable into individual elements", "Creating closures", "Defining default parameters"], answer: 1 },
    { q: "What does `Array.prototype.reduce()` do?", options: ["Reduces array length by 1", "Filters array elements", "Executes a reducer function on each element, accumulating a single result", "Sorts the array"], answer: 2 },
    { q: "What is `NaN` in JavaScript?", options: ["null value for numbers", "A number type representing an invalid/unrepresentable number", "An error type", "undefined cast to number"], answer: 1 },
    { q: "What is a JavaScript module?", options: ["A function that runs automatically", "A file with exportable/importable code to organize functionality", "A class definition", "A built-in browser API"], answer: 1 },
    { q: "What does `async/await` do?", options: ["Runs code on a separate thread", "Makes asynchronous promise-based code look and behave synchronously", "Blocks the main thread", "Creates a new JavaScript engine"], answer: 1 },
    { q: "What does `Object.freeze()` do?", options: ["Prevents new properties and changes to existing properties", "Makes object immutable deeply", "Converts object to string", "Removes all object properties"], answer: 0 },
    { q: "What is the prototype chain?", options: ["A linked list data structure", "Mechanism by which objects inherit properties from other objects", "A CSS selector chain", "Call stack representation"], answer: 1 },
    { q: "What does the `delete` operator do?", options: ["Removes a variable from memory", "Removes an object's property", "Clears array elements", "Deletes a function"], answer: 1 },
    { q: "What is destructuring in JavaScript?", options: ["Breaking down objects or arrays into individual variables", "Deleting object properties", "Converting between data types", "Removing duplicates from arrays"], answer: 0 },
    { q: "What does `localStorage` vs `sessionStorage` differ in?", options: ["localStorage is faster", "sessionStorage persists across browser restarts; localStorage doesn't", "localStorage persists until cleared; sessionStorage clears when tab closes", "No difference"], answer: 2 },
  ],

  python: [
    { q: "What is Python's Global Interpreter Lock (GIL)?", options: ["A security feature for Python files", "A mutex that allows only one thread to execute Python bytecode at a time", "A memory management technique", "A module import lock"], answer: 1 },
    { q: "What is the difference between a list and a tuple in Python?", options: ["Lists allow duplicates, tuples don't", "Tuples are mutable, lists are immutable", "Lists are mutable, tuples are immutable", "No practical difference"], answer: 2 },
    { q: "What does a Python decorator do?", options: ["Adds color to output", "Wraps a function to extend its behavior without modifying it", "Creates a class instance", "Imports a module"], answer: 1 },
    { q: "What is `*args` used for in a Python function?", options: ["Keyword arguments", "Pass variable number of positional arguments", "Mark required arguments", "Multiply arguments"], answer: 1 },
    { q: "What does `__init__` do in a Python class?", options: ["Destroys the object", "Imports the class", "Initializes a new instance of the class", "Defines class-level variables"], answer: 2 },
    { q: "What is a Python generator?", options: ["Random number creator", "Function that yields values lazily, one at a time", "A type of list comprehension", "A class decorator"], answer: 1 },
    { q: "What does the `with` statement do in Python?", options: ["Loops over a collection", "Manages context (setup and teardown) like opening and auto-closing files", "Catches exceptions", "Creates a conditional block"], answer: 1 },
    { q: "What is list comprehension in Python?", options: ["A way to document lists", "Concise syntax to create lists: `[expr for item in iterable]`", "A list sorting method", "A list deduplication technique"], answer: 1 },
    { q: "What is the difference between `deepcopy` and `copy`?", options: ["No difference", "copy creates shallow copy (nested objects referenced), deepcopy copies everything recursively", "deepcopy is faster", "copy copies everything deeply"], answer: 1 },
    { q: "What does `@staticmethod` do in Python?", options: ["Makes a method that auto-updates", "Defines a method that doesn't receive `self` or `cls`, belongs to the class namespace", "Creates a class-level variable", "Prevents inheritance"], answer: 1 },
    { q: "What is the output of `bool([])` in Python?", options: ["True", "False", "None", "Error"], answer: 1 },
    { q: "What does `zip()` do in Python?", options: ["Compresses files", "Combines multiple iterables into tuples of corresponding elements", "Sorts two lists simultaneously", "Merges two dictionaries"], answer: 1 },
    { q: "What is a lambda function in Python?", options: ["A named recursive function", "An anonymous single-expression function defined with `lambda`", "A loop shorthand", "A class method shorthand"], answer: 1 },
    { q: "What does `isinstance(obj, cls)` do?", options: ["Creates a new instance", "Checks if obj is an instance of cls or its subclass", "Imports a class", "Converts obj to cls type"], answer: 1 },
    { q: "What is duck typing in Python?", options: ["A design pattern", "An object's suitability is determined by methods/properties, not its type", "A testing technique", "A performance optimization"], answer: 1 },
    { q: "What does `enumerate()` do in Python?", options: ["Counts items in a list", "Returns (index, value) pairs when iterating", "Sorts a list with indices", "Creates a numbered dictionary"], answer: 1 },
    { q: "What is `**kwargs` used for in Python?", options: ["Multiply keyword args", "Pass variable number of keyword arguments as a dictionary", "Define default values", "Import keyword modules"], answer: 1 },
    { q: "What is Python's `None` equivalent to in terms of boolean?", options: ["True", "False", "0", "'' (empty string)"], answer: 1 },
    { q: "What is method resolution order (MRO) in Python?", options: ["The order methods run in a loop", "The order Python searches for methods in the class hierarchy (C3 linearization)", "How Python sorts class methods", "The order of method decoration"], answer: 1 },
    { q: "What does `set()` data structure guarantee?", options: ["Ordered elements", "Unique elements, no duplicates", "Sorted elements", "Indexed access"], answer: 1 },
  ],
};

// ─── Timer Hook ───────────────────────────────────────────────────────────────

function useTimer(seconds: number, active: boolean, onExpire: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) return;
    ref.current = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) { onExpire(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [active]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return { remaining, formatted: fmt(remaining), reset: () => setRemaining(seconds) };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Practice() {
  const [step, setStep] = useState<Step>("home");
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [expandedReview, setExpandedReview] = useState<number | null>(0);

  const TOTAL_SECS = 20 * 60;
  const { remaining, formatted: timerFormatted } = useTimer(
    TOTAL_SECS,
    step === "quiz",
    () => submitQuiz()
  );

  const timerPct = (remaining / TOTAL_SECS) * 100;
  const timerColor = remaining > 300 ? "#4ade80" : remaining > 120 ? "#fbbf24" : "#f87171";

  const startQuiz = (key: CategoryKey) => {
    const qs = questionBank[key];
    if (!qs) return;
    setActiveCategory(key);
    setQuestions(qs);
    setCurrentQ(0);
    setSelected(new Array(qs.length).fill(null));
    setFlagged(new Set());
    setStep("quiz");
  };

  const submitQuiz = () => setStep("results");

  const answeredCount = selected.filter((s) => s !== null).length;
  const progress = Math.round(((currentQ + 1) / Math.max(questions.length, 1)) * 100);

  const score = selected.reduce<number>((acc, ans, i) => {
    if (ans !== null && questions[i] && ans === questions[i].answer) return acc + 1;
    return acc;
  }, 0);

  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const cfg = activeCategory ? categories[activeCategory] : null;

  const gradeInfo =
    pct >= 80 ? { label: "Excellent", color: "#4ade80", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)" }
    : pct >= 60 ? { label: "Good", color: "#fbbf24", bg: "rgba(251,191,36,0.1)", border: "rgba(251,191,36,0.2)" }
    : { label: "Needs Practice", color: "#f87171", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" };

  const availableKeys: CategoryKey[] = ["aptitude", "frontend", "backend", "database", "javascript", "python"];
  const comingSoonKeys: CategoryKey[] = ["cpp", "java", "typescript", "reactnative", "dsa"];

  // ── HOME ──────────────────────────────────────────────────────────────────────
  if (step === "home") return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: "rgba(5,8,22,0.85)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4"><Navbar /></div>
      </div>

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-blue-600/6 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-violet-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <p className="eyebrow mb-3">Practice Zone</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3" style={{ letterSpacing: "-0.03em" }}>
            Sharpen Your Skills
          </h1>
          <p className="text-sm text-white/40 leading-relaxed max-w-lg mx-auto">
            20 multiple-choice questions per topic. Timed, scored, and reviewed with instant feedback.
          </p>
          <div className="flex items-center justify-center gap-4 mt-5 text-xs text-white/30">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              20 Questions
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              20-Min Timer
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Instant Feedback
            </span>
          </div>
        </div>

        {/* Available Categories */}
        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: "0.06s" }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-4">Available Now</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableKeys.map((key) => {
              const c = categories[key];
              return (
                <button
                  key={key}
                  onClick={() => startQuiz(key)}
                  className="group relative p-5 rounded-2xl text-left transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "#0a0f1e",
                    border: `1px solid rgba(255,255,255,0.07)`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.border = `1px solid ${c.border}`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.4)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.border = `1px solid rgba(255,255,255,0.07)`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `none`;
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
                  >
                    {c.icon}
                  </div>

                  {/* Title + badges */}
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-bold text-white">{c.label}</span>
                    <span
                      className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{
                        background:
                          c.difficulty === "Beginner" ? "rgba(52,211,153,0.1)" :
                          c.difficulty === "Advanced" ? "rgba(248,113,113,0.1)" :
                          "rgba(251,191,36,0.1)",
                        color:
                          c.difficulty === "Beginner" ? "#34d399" :
                          c.difficulty === "Advanced" ? "#f87171" :
                          "#fbbf24",
                      }}
                    >
                      {c.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-white/35 leading-relaxed mb-4">{c.desc}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/25 font-medium">20 questions · 20 min</span>
                    <span
                      className="text-xs font-semibold transition-colors duration-150"
                      style={{ color: c.color }}
                    >
                      Start →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.12s" }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-4">Coming Soon</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {comingSoonKeys.map((key) => {
              const c = categories[key];
              return (
                <div
                  key={key}
                  className="relative p-5 rounded-2xl overflow-hidden"
                  style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  {/* Coming soon overlay */}
                  <div className="absolute inset-0 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl"
                    style={{ background: "rgba(5,8,22,0.55)" }}>
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Coming Soon
                    </div>
                  </div>

                  <div className="opacity-30">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
                      {c.icon}
                    </div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-bold text-white">{c.label}</span>
                      <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
                        {c.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-white/30 leading-relaxed mb-4">{c.desc}</p>
                    <span className="text-[10px] text-white/20 font-medium">20 questions · 20 min</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );

  // ── QUIZ ──────────────────────────────────────────────────────────────────────
  if (step === "quiz") return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Sticky quiz header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: "rgba(5,8,22,0.92)", borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="max-w-3xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Category pill */}
            <div className="flex items-center gap-3 min-w-0">
              {cfg && (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}
                >
                  {cfg.icon}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{cfg?.label} Practice</p>
                <p className="text-[10px] text-white/30">Q{currentQ + 1} of {questions.length} · {answeredCount} answered</p>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative w-7 h-7">
                <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
                  <circle cx="14" cy="14" r="11" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" fill="none" />
                  <circle cx="14" cy="14" r="11" stroke={timerColor} strokeWidth="2.5" fill="none"
                    strokeDasharray={`${2 * Math.PI * 11}`}
                    strokeDashoffset={`${2 * Math.PI * 11 * (1 - timerPct / 100)}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
                  />
                </svg>
              </div>
              <span className="text-sm font-mono font-bold tabular-nums" style={{ color: timerColor }}>
                {timerFormatted}
              </span>
            </div>

            {/* Submit button */}
            <button
              onClick={() => { if (confirm("Submit quiz now?")) submitQuiz(); }}
              className="shrink-0 px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-all duration-150"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: "0 2px 12px rgba(59,130,246,0.3)" }}
            >
              Submit
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-2.5 w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: `${(answeredCount / questions.length) * 100}%`,
                background: cfg ? `linear-gradient(90deg, ${cfg.color}99, ${cfg.color})` : "linear-gradient(90deg, #3b82f6, #6366f1)",
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Question number dots */}
        <div className="flex flex-wrap gap-1.5 mb-8">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className="w-7 h-7 rounded-lg text-[10px] font-bold transition-all duration-150"
              style={{
                background:
                  i === currentQ
                    ? cfg?.bg ?? "rgba(59,130,246,0.15)"
                    : selected[i] !== null
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(255,255,255,0.04)",
                border:
                  i === currentQ
                    ? `1px solid ${cfg?.border ?? "rgba(59,130,246,0.3)"}`
                    : selected[i] !== null
                    ? "1px solid rgba(34,197,94,0.2)"
                    : "1px solid rgba(255,255,255,0.07)",
                color:
                  i === currentQ
                    ? cfg?.color ?? "#60a5fa"
                    : selected[i] !== null
                    ? "#4ade80"
                    : "rgba(255,255,255,0.3)",
              }}
            >
              {flagged.has(i) ? "⚑" : i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <div
          key={currentQ}
          className="rounded-2xl p-7 mb-5 animate-fade-in-up"
          style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.065)" }}
        >
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-2">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: cfg ? cfg.bg : "rgba(59,130,246,0.15)", color: cfg?.color ?? "#60a5fa", border: `1px solid ${cfg?.border ?? "rgba(59,130,246,0.25)"}` }}
              >
                {currentQ + 1}
              </span>
              <span className="text-xs text-white/30">of {questions.length}</span>
            </div>
            <button
              onClick={() => setFlagged((prev) => { const n = new Set(prev); n.has(currentQ) ? n.delete(currentQ) : n.add(currentQ); return n; })}
              className="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all duration-150"
              style={{
                background: flagged.has(currentQ) ? "rgba(251,191,36,0.12)" : "rgba(255,255,255,0.04)",
                border: flagged.has(currentQ) ? "1px solid rgba(251,191,36,0.25)" : "1px solid rgba(255,255,255,0.07)",
                color: flagged.has(currentQ) ? "#fbbf24" : "rgba(255,255,255,0.3)",
              }}
            >
              {flagged.has(currentQ) ? "⚑ Flagged" : "⚐ Flag"}
            </button>
          </div>

          <p className="text-base font-semibold text-white leading-relaxed mb-7">
            {questions[currentQ]?.q}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {questions[currentQ]?.options.map((opt, oi) => {
              const isSelected = selected[currentQ] === oi;
              const labels = ["A", "B", "C", "D"];
              return (
                <button
                  key={oi}
                  onClick={() => setSelected((prev) => { const n = [...prev]; n[currentQ] = oi; return n; })}
                  className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-left transition-all duration-150"
                  style={{
                    background: isSelected ? (cfg?.bg ?? "rgba(59,130,246,0.1)") : "rgba(255,255,255,0.025)",
                    border: isSelected ? `1px solid ${cfg?.border ?? "rgba(59,130,246,0.35)"}` : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: isSelected ? `0 0 0 1px ${cfg?.border ?? "rgba(59,130,246,0.15)"}` : "none",
                  }}
                  onMouseEnter={(e) => { if (!isSelected) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; } }}
                  onMouseLeave={(e) => { if (!isSelected) { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; } }}
                >
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: isSelected ? (cfg?.color ? `${cfg.color}22` : "rgba(59,130,246,0.2)") : "rgba(255,255,255,0.05)",
                      color: isSelected ? (cfg?.color ?? "#60a5fa") : "rgba(255,255,255,0.35)",
                      border: isSelected ? `1px solid ${cfg?.border ?? "rgba(59,130,246,0.3)"}` : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {labels[oi]}
                  </span>
                  <span className="text-sm flex-1" style={{ color: isSelected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)" }}>
                    {opt}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: cfg?.color ?? "#60a5fa" }}>
                      <svg className="w-2.5 h-2.5 text-[#050816]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            className="px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
          >
            ← Prev
          </button>

          {currentQ < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQ((q) => q + 1)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-150"
              style={{ background: cfg ? `linear-gradient(135deg, ${cfg.color}cc, ${cfg.color})` : "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: `0 4px 16px ${cfg?.color ?? "#3b82f6"}33` }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => { if (confirm("Submit and see your results?")) submitQuiz(); }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-150"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", boxShadow: "0 4px 16px rgba(34,197,94,0.3)" }}
            >
              Submit Quiz →
            </button>
          )}
        </div>
      </div>
    </main>
  );

  // ── RESULTS ───────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: "rgba(5,8,22,0.85)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4"><Navbar /></div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <p className="eyebrow mb-2">Quiz Results</p>
            <h1 className="text-3xl font-bold text-white tracking-tight" style={{ letterSpacing: "-0.03em" }}>Your Score</h1>
            {cfg && <p className="text-sm text-white/35 mt-1">{cfg.label} · 20 Questions</p>}
          </div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold self-start"
            style={{ background: gradeInfo.bg, border: `1px solid ${gradeInfo.border}`, color: gradeInfo.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: gradeInfo.color }} />
            {gradeInfo.label}
          </div>
        </div>

        {/* Score cards row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="rounded-2xl p-5 text-center animate-fade-in-up col-span-1"
            style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.065)", animationDelay: "0.05s" }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-4">Score</p>
            <ScoreCircle score={pct} size={88} />
            <p className="text-xs text-white/25 mt-2">{score}/{questions.length}</p>
          </div>

          <div className="col-span-2 rounded-2xl p-5 animate-fade-in-up"
            style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.065)", animationDelay: "0.1s" }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-4">Breakdown</p>
            <div className="space-y-3">
              {[
                { label: "Correct", count: score, color: "#4ade80", bg: "rgba(34,197,94,0.1)" },
                { label: "Incorrect", count: questions.length - score - selected.filter(s => s === null).length, color: "#f87171", bg: "rgba(239,68,68,0.1)" },
                { label: "Skipped", count: selected.filter(s => s === null).length, color: "#94a3b8", bg: "rgba(148,163,184,0.1)" },
              ].map(({ label, count, color, bg }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/50">{label}</span>
                      <span className="font-semibold text-white/70">{count}</span>
                    </div>
                    <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-1 rounded-full transition-all duration-700"
                        style={{ width: `${(count / questions.length) * 100}%`, background: color, opacity: 0.7 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question review */}
        <div className="rounded-2xl overflow-hidden animate-fade-in-up"
          style={{ background: "#0a0f1e", border: "1px solid rgba(255,255,255,0.065)", animationDelay: "0.15s" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/35">Question Review</p>
            <span className="text-xs text-white/25">{score} correct answers highlighted</span>
          </div>

          {questions.map((q, i) => {
            const userAns = selected[i];
            const correct = q.answer;
            const isCorrect = userAns === correct;
            const isSkipped = userAns === null;
            const isOpen = expandedReview === i;
            const labels = ["A", "B", "C", "D"];

            return (
              <div key={i} style={{ borderBottom: i < questions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <button
                  className="w-full px-6 py-4 flex items-center gap-4 text-left transition-colors hover:bg-white/[0.015]"
                  onClick={() => setExpandedReview(isOpen ? null : i)}
                >
                  {/* Status icon */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      background: isSkipped ? "rgba(148,163,184,0.1)" : isCorrect ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                      border: isSkipped ? "1px solid rgba(148,163,184,0.2)" : isCorrect ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(239,68,68,0.25)",
                    }}
                  >
                    {isSkipped ? (
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    ) : isCorrect ? (
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-white/25 font-medium mr-2">Q{i + 1}</span>
                    <span className="text-sm text-white/65 truncate">{q.q}</span>
                  </div>

                  <svg className="w-4 h-4 text-white/20 shrink-0 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <div className="space-y-2 pt-3">
                      {q.options.map((opt, oi) => {
                        const isUserChoice = userAns === oi;
                        const isCorrectOpt = oi === correct;
                        return (
                          <div
                            key={oi}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm"
                            style={{
                              background:
                                isCorrectOpt ? "rgba(34,197,94,0.08)" :
                                isUserChoice && !isCorrectOpt ? "rgba(239,68,68,0.08)" :
                                "rgba(255,255,255,0.02)",
                              border:
                                isCorrectOpt ? "1px solid rgba(34,197,94,0.2)" :
                                isUserChoice && !isCorrectOpt ? "1px solid rgba(239,68,68,0.2)" :
                                "1px solid rgba(255,255,255,0.05)",
                            }}
                          >
                            <span
                              className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                              style={{
                                background: isCorrectOpt ? "rgba(34,197,94,0.15)" : isUserChoice ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
                                color: isCorrectOpt ? "#4ade80" : isUserChoice ? "#f87171" : "rgba(255,255,255,0.3)",
                              }}
                            >
                              {labels[oi]}
                            </span>
                            <span style={{ color: isCorrectOpt ? "#4ade80" : isUserChoice && !isCorrectOpt ? "#f87171" : "rgba(255,255,255,0.5)" }}>
                              {opt}
                            </span>
                            <div className="ml-auto flex items-center gap-1.5">
                              {isCorrectOpt && <span className="text-[9px] text-green-400 font-semibold uppercase tracking-wider">Correct</span>}
                              {isUserChoice && !isCorrectOpt && <span className="text-[9px] text-red-400 font-semibold uppercase tracking-wider">Your answer</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <button
            onClick={() => { setStep("home"); setActiveCategory(null); }}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white/85 transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            ← All Topics
          </button>
          {activeCategory && (
            <button
              onClick={() => startQuiz(activeCategory)}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{ background: cfg ? `linear-gradient(135deg, ${cfg.color}cc, ${cfg.color})` : "linear-gradient(135deg, #3b82f6, #6366f1)", boxShadow: `0 4px 20px ${cfg?.color ?? "#3b82f6"}33` }}
            >
              Retry →
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
