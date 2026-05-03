const questions = {
    frontend: [
      {
        question: "What is the purpose of keys in React lists?",
        options: [
          "To uniquely identify elements for efficient re-rendering",
          "To style components",
          "To store component state",
          "To bind event handlers"
        ],
        answer: "To uniquely identify elements for efficient re-rendering"
      },
      {
        question: "What happens if you don't provide a dependency array in useEffect?",
        options: [
          "It runs only once",
          "It runs on every render",
          "It throws an error",
          "It runs only when state changes"
        ],
        answer: "It runs on every render"
      },
      {
        question: "What is the difference between controlled and uncontrolled components?",
        options: [
          "Controlled components use state, uncontrolled use DOM refs",
          "Controlled components use refs, uncontrolled use state",
          "Both are same",
          "Controlled components are faster"
        ],
        answer: "Controlled components use state, uncontrolled use DOM refs"
      },
      {
        question: "What is React reconciliation?",
        options: [
          "Process of updating DOM efficiently",
          "Creating components",
          "Managing state",
          "Handling events"
        ],
        answer: "Process of updating DOM efficiently"
      },
      {
        question: "Which hook is used to memoize a function?",
        options: ["useMemo", "useCallback", "useEffect", "useRef"],
        answer: "useCallback"
      },
      {
        question: "What is the difference between useMemo and useCallback?",
        options: [
          "useMemo memoizes values, useCallback memoizes functions",
          "Both are same",
          "useMemo is faster",
          "useCallback is deprecated"
        ],
        answer: "useMemo memoizes values, useCallback memoizes functions"
      },
      {
        question: "What is event delegation in JavaScript?",
        options: [
          "Attaching event listeners to parent elements",
          "Attaching events to each child",
          "Stopping event propagation",
          "Using async events"
        ],
        answer: "Attaching event listeners to parent elements"
      },
      {
        question: "What is the difference between '==' and '===' in JavaScript?",
        options: [
          "'==' checks value only, '===' checks value and type",
          "'===' checks value only",
          "Both are same",
          "'==' is stricter"
        ],
        answer: "'==' checks value only, '===' checks value and type"
      },
      {
        question: "What is CSS specificity?",
        options: [
          "Priority system to determine which CSS rule applies",
          "Speed of CSS rendering",
          "Number of CSS files",
          "CSS animation type"
        ],
        answer: "Priority system to determine which CSS rule applies"
      },
      {
        question: "What is lazy loading in React?",
        options: [
          "Loading components only when needed",
          "Loading all components at once",
          "Preloading data",
          "Rendering components faster"
        ],
        answer: "Loading components only when needed"
      }
    ],
  
    backend: [
      {
        question: "What is REST primarily based on?",
        options: [
          "Stateful communication",
          "Stateless communication",
          "Persistent connections",
          "Socket programming"
        ],
        answer: "Stateless communication"
      },
      {
        question: "Which HTTP status code indicates a successful resource creation?",
        options: ["200", "201", "204", "302"],
        answer: "201"
      },
      {
        question: "What is the main purpose of middleware in Express?",
        options: [
          "To define database schema",
          "To handle request/response lifecycle",
          "To render UI",
          "To store session permanently"
        ],
        answer: "To handle request/response lifecycle"
      },
      {
        question: "Which property ensures that a REST API does not store client context on the server?",
        options: [
          "Cacheability",
          "Layered system",
          "Statelessness",
          "Uniform interface"
        ],
        answer: "Statelessness"
      },
      {
        question: "What is the primary use of JWT in backend systems?",
        options: [
          "Data encryption",
          "Authentication & authorization",
          "Database indexing",
          "Caching responses"
        ],
        answer: "Authentication & authorization"
      },
      {
        question: "Which HTTP method is idempotent?",
        options: ["POST", "PATCH", "PUT", "CONNECT"],
        answer: "PUT"
      },
      {
        question: "What is the purpose of indexing in databases?",
        options: [
          "To increase storage size",
          "To speed up data retrieval",
          "To encrypt data",
          "To normalize tables"
        ],
        answer: "To speed up data retrieval"
      },
      {
        question: "Which type of database is MongoDB?",
        options: [
          "Relational database",
          "Graph database",
          "Document-oriented NoSQL database",
          "Key-value store only"
        ],
        answer: "Document-oriented NoSQL database"
      },
      {
        question: "What does a 500 HTTP status code represent?",
        options: [
          "Client error",
          "Unauthorized access",
          "Server error",
          "Redirection"
        ],
        answer: "Server error"
      },
      {
        question: "What is rate limiting used for in backend systems?",
        options: [
          "To increase server load",
          "To prevent abuse and DDoS attacks",
          "To store user sessions",
          "To optimize database joins"
        ],
        answer: "To prevent abuse and DDoS attacks"
      }
    ],
  
    dataEngineering: [
      {
        question: "What is the main purpose of ETL in data engineering?",
        options: [
          "To visualize data",
          "To move and transform data from source to destination",
          "To train machine learning models",
          "To design UI"
        ],
        answer: "To move and transform data from source to destination"
      },
      {
        question: "Which component of Apache Hadoop is responsible for resource management?",
        options: ["HDFS", "YARN", "MapReduce", "Hive"],
        answer: "YARN"
      },
      {
        question: "What is the primary advantage of Apache Kafka?",
        options: [
          "Batch processing",
          "Low-latency distributed streaming",
          "Data visualization",
          "Schema design"
        ],
        answer: "Low-latency distributed streaming"
      },
      {
        question: "What is partitioning in distributed data systems?",
        options: [
          "Storing duplicate data",
          "Splitting data across multiple nodes",
          "Compressing data",
          "Encrypting data"
        ],
        answer: "Splitting data across multiple nodes"
      },
      {
        question: "Which file format is optimized for big data processing and supports columnar storage?",
        options: ["CSV", "JSON", "Parquet", "TXT"],
        answer: "Parquet"
      },
      {
        question: "What is schema-on-read?",
        options: [
          "Schema applied while writing data",
          "Schema applied when data is read",
          "No schema required",
          "Schema stored in database only"
        ],
        answer: "Schema applied when data is read"
      },
      {
        question: "Which tool/service is commonly used for serverless ETL on AWS?",
        options: [
          "EC2",
          "AWS Glue",
          "S3",
          "CloudWatch"
        ],
        answer: "AWS Glue"
      },
      {
        question: "What is data skew in distributed processing?",
        options: [
          "Equal data distribution",
          "Uneven distribution causing performance issues",
          "Data encryption issue",
          "Data duplication"
        ],
        answer: "Uneven distribution causing performance issues"
      },
      {
        question: "What is the role of a data warehouse?",
        options: [
          "Transactional processing",
          "Real-time streaming",
          "Analytical querying and reporting",
          "Frontend rendering"
        ],
        answer: "Analytical querying and reporting"
      },
      {
        question: "Which processing model does Apache Spark primarily use?",
        options: [
          "Disk-based processing",
          "In-memory processing",
          "Manual processing",
          "Single-threaded processing"
        ],
        answer: "In-memory processing"
      }
    ],
  
    dataAnalyst: [
      {
        question: "Which type of JOIN returns only matching records from both tables?",
        options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"],
        answer: "INNER JOIN"
      },
      {
        question: "What is the difference between WHERE and HAVING in SQL?",
        options: [
          "WHERE filters before aggregation, HAVING filters after aggregation",
          "HAVING filters before aggregation",
          "Both are same",
          "WHERE is used only with GROUP BY"
        ],
        answer: "WHERE filters before aggregation, HAVING filters after aggregation"
      },
      {
        question: "What does NULL represent in a dataset?",
        options: [
          "Zero value",
          "Empty string",
          "Missing or unknown value",
          "False value"
        ],
        answer: "Missing or unknown value"
      },
      {
        question: "Which measure is most affected by outliers?",
        options: ["Median", "Mode", "Mean", "Range"],
        answer: "Mean"
      },
      {
        question: "What is normalization in databases?",
        options: [
          "Removing duplicate data and organizing tables",
          "Increasing redundancy",
          "Compressing data",
          "Sorting data"
        ],
        answer: "Removing duplicate data and organizing tables"
      },
      {
        question: "What does GROUP BY do in SQL?",
        options: [
          "Sorts data",
          "Filters data",
          "Aggregates data based on columns",
          "Deletes duplicate rows"
        ],
        answer: "Aggregates data based on columns"
      },
      {
        question: "Which chart is best for showing distribution of a continuous variable?",
        options: ["Bar chart", "Pie chart", "Histogram", "Line chart"],
        answer: "Histogram"
      },
      {
        question: "What is the purpose of indexing in SQL?",
        options: [
          "To slow down queries",
          "To speed up data retrieval",
          "To delete data",
          "To join tables"
        ],
        answer: "To speed up data retrieval"
      },
      {
        question: "What is a primary key?",
        options: [
          "A column that can have duplicate values",
          "A unique identifier for each row",
          "A foreign reference",
          "An indexed column only"
        ],
        answer: "A unique identifier for each row"
      },
      {
        question: "What is data cleaning?",
        options: [
          "Deleting all data",
          "Formatting UI",
          "Handling missing, incorrect, or inconsistent data",
          "Creating dashboards"
        ],
        answer: "Handling missing, incorrect, or inconsistent data"
      }
    ],
  
    uiux: [
      {
        question: "What is the primary goal of UX design?",
        options: [
          "Make interfaces visually attractive",
          "Improve user satisfaction and usability",
          "Write efficient code",
          "Increase server performance"
        ],
        answer: "Improve user satisfaction and usability"
      },
      {
        question: "Which principle focuses on reducing user's memory load?",
        options: [
          "Consistency",
          "Recognition over recall",
          "Feedback",
          "Accessibility"
        ],
        answer: "Recognition over recall"
      },
      {
        question: "What is the purpose of a wireframe?",
        options: [
          "Final visual design",
          "Basic structure and layout of a page",
          "Backend logic",
          "Animation design"
        ],
        answer: "Basic structure and layout of a page"
      },
      {
        question: "What is a high-fidelity prototype?",
        options: [
          "Rough sketch of design",
          "Static layout",
          "Interactive design close to final product",
          "Database schema"
        ],
        answer: "Interactive design close to final product"
      },
      {
        question: "What does heuristic evaluation involve?",
        options: [
          "User interviews",
          "Expert review based on usability principles",
          "A/B testing",
          "Code testing"
        ],
        answer: "Expert review based on usability principles"
      },
      {
        question: "Which law states that the time to acquire a target depends on distance and size?",
        options: [
          "Hick’s Law",
          "Fitts’s Law",
          "Jakob’s Law",
          "Miller’s Law"
        ],
        answer: "Fitts’s Law"
      },
      {
        question: "What is A/B testing in UX?",
        options: [
          "Comparing two design variations to determine better performance",
          "Testing backend APIs",
          "Writing two versions of code",
          "Splitting database"
        ],
        answer: "Comparing two design variations to determine better performance"
      },
      {
        question: "What is accessibility in UI/UX?",
        options: [
          "Making design colorful",
          "Ensuring designs are usable by people with disabilities",
          "Improving animations",
          "Optimizing database queries"
        ],
        answer: "Ensuring designs are usable by people with disabilities"
      },
      {
        question: "What is the purpose of user personas?",
        options: [
          "To define database users",
          "To represent target users and their behaviors",
          "To design UI components",
          "To test APIs"
        ],
        answer: "To represent target users and their behaviors"
      },
      {
        question: "Which principle ensures similar elements behave consistently?",
        options: [
          "Hierarchy",
          "Consistency",
          "Contrast",
          "Alignment"
        ],
        answer: "Consistency"
      }
    ]
  };
  
  module.exports = questions;