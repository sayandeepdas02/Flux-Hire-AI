// Hardcoded MCQ questions for Round 1
// Questions 1-20: Single correct answer
// Questions 21-30: Double correct answers

export const MCQ_QUESTIONS = [
    // Q1-Q20: Single Correct
    {
        questionNumber: 1,
        questionText: "Which isolation level prevents dirty reads but allows non-repeatable reads and phantom reads?",
        options: ["Serializable", "Repeatable Read", "Read Committed", "Read Uncommitted"],
        correctIndices: [2],
        type: "single"
    },
    {
        questionNumber: 2,
        questionText: "Which scheduling algorithm can cause convoy effect?",
        options: ["Round Robin", "Shortest Job First", "First Come First Serve", "Multilevel Queue"],
        correctIndices: [2],
        type: "single"
    },
    {
        questionNumber: 3,
        questionText: "Which protocol maps IP addresses to MAC addresses?",
        options: ["DNS", "ARP", "DHCP", "ICMP"],
        correctIndices: [1],
        type: "single"
    },
    {
        questionNumber: 4,
        questionText: "Why are B+ Trees preferred over B Trees?",
        options: ["Faster inserts", "Better cache locality", "All data stored only in leaves", "Less memory usage"],
        correctIndices: [2],
        type: "single"
    },
    {
        questionNumber: 5,
        questionText: "Which causes thrashing?",
        options: ["High CPU utilization", "Excessive page faults", "Low I/O operations", "High disk throughput"],
        correctIndices: [1],
        type: "single"
    },
    {
        questionNumber: 6,
        questionText: "What does git reset --soft HEAD~1 do?",
        options: ["Deletes the last commit permanently", "Removes last commit but keeps changes staged", "Removes last commit and unstages changes", "Reverts the last commit"],
        correctIndices: [1],
        type: "single"
    },
    {
        questionNumber: 7,
        questionText: "Which HTTP status code is not cacheable by default?",
        options: ["200", "301", "304", "403"],
        correctIndices: [3],
        type: "single"
    },
    {
        questionNumber: 8,
        questionText: "Which issue occurs if a semaphore is initialized incorrectly?",
        options: ["Deadlock", "Livelock", "Starvation", "Race Condition"],
        correctIndices: [0],
        type: "single"
    },
    {
        questionNumber: 9,
        questionText: "Which ACID property ensures partial updates are never persisted?",
        options: ["Isolation", "Atomicity", "Durability", "Consistency"],
        correctIndices: [1],
        type: "single"
    },
    {
        questionNumber: 10,
        questionText: "Which OSI layer handles encryption and compression?",
        options: ["Transport", "Network", "Presentation", "Session"],
        correctIndices: [2],
        type: "single"
    },
    {
        questionNumber: 11,
        questionText: "Which architecture improves scalability via event decoupling?",
        options: ["Monolithic", "Layered", "Event-Driven", "Client-Server"],
        correctIndices: [2],
        type: "single"
    },
    {
        questionNumber: 12,
        questionText: "Which join is generally most expensive?",
        options: ["Index Scan", "Hash Join", "Nested Loop Join", "Merge Join"],
        correctIndices: [2],
        type: "single"
    },
    {
        questionNumber: 13,
        questionText: "Which page replacement algorithm suffers from Belady's anomaly?",
        options: ["LRU", "Optimal", "FIFO", "LFU"],
        correctIndices: [2],
        type: "single"
    },
    {
        questionNumber: 14,
        questionText: "Which command safely applies a commit from another branch?",
        options: ["git merge", "git rebase", "git cherry-pick", "git stash"],
        correctIndices: [2],
        type: "single"
    },
    {
        questionNumber: 15,
        questionText: "Which attack exploits trusting user-provided URLs?",
        options: ["XSS", "CSRF", "SSRF", "SQL Injection"],
        correctIndices: [2],
        type: "single"
    },
    {
        questionNumber: 16,
        questionText: "Best data structure for implementing an LRU cache?",
        options: ["Stack + Queue", "HashMap + Doubly Linked List", "TreeMap", "Priority Queue"],
        correctIndices: [1],
        type: "single"
    },
    {
        questionNumber: 17,
        questionText: "Which system call creates a new process in Unix?",
        options: ["exec()", "spawn()", "fork()", "clone()"],
        correctIndices: [2],
        type: "single"
    },
    {
        questionNumber: 18,
        questionText: "Which normal form removes transitive dependency?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correctIndices: [2],
        type: "single"
    },
    {
        questionNumber: 19,
        questionText: "Which TCP mechanism controls congestion?",
        options: ["Sliding Window", "Flow Control", "Slow Start", "Port Allocation"],
        correctIndices: [2],
        type: "single"
    },
    {
        questionNumber: 20,
        questionText: "Best DB for high-write time-series data?",
        options: ["MySQL", "PostgreSQL", "MongoDB", "InfluxDB"],
        correctIndices: [3],
        type: "single"
    },

    // Q21-Q30: Double Correct
    {
        questionNumber: 21,
        questionText: "Clustered index properties:",
        options: ["Table data is physically sorted", "Only one clustered index allowed", "Always faster than non-clustered", "Stored separately from data"],
        correctIndices: [0, 1],
        type: "double"
    },
    {
        questionNumber: 22,
        questionText: "Necessary conditions for deadlock:",
        options: ["Mutual Exclusion", "Preemption", "Hold and Wait", "Circular Wait"],
        correctIndices: [0, 2],
        type: "double"
    },
    {
        questionNumber: 23,
        questionText: "Transport layer protocols:",
        options: ["TCP", "UDP", "ICMP", "ARP"],
        correctIndices: [0, 1],
        type: "double"
    },
    {
        questionNumber: 24,
        questionText: "Commands that modify commit history:",
        options: ["git revert", "git rebase", "git reset", "git fetch"],
        correctIndices: [1, 2],
        type: "double"
    },
    {
        questionNumber: 25,
        questionText: "Improve horizontal scalability:",
        options: ["Load Balancing", "Vertical Scaling", "Stateless Services", "Single Leader DB"],
        correctIndices: [0, 2],
        type: "double"
    },
    {
        questionNumber: 26,
        questionText: "WAL guarantees:",
        options: ["Atomicity", "Isolation", "Durability", "Consistency"],
        correctIndices: [0, 2],
        type: "double"
    },
    {
        questionNumber: 27,
        questionText: "Correct thread statements:",
        options: ["Threads share address space", "Threads have separate heap", "Context switch cheaper than process", "Each thread has its own PID"],
        correctIndices: [0, 2],
        type: "double"
    },
    {
        questionNumber: 28,
        questionText: "Reduce TTFB:",
        options: ["CDN", "Server-Side Rendering", "Client-Side Caching", "HTTP Keep-Alive"],
        correctIndices: [0, 1],
        type: "double"
    },
    {
        questionNumber: 29,
        questionText: "Authentication mechanisms:",
        options: ["OAuth", "JWT", "HTTPS", "AES"],
        correctIndices: [0, 1],
        type: "double"
    },
    {
        questionNumber: 30,
        questionText: "Eventual consistency required for:",
        options: ["Payment transactions", "Social media likes", "Distributed caching", "Inventory management"],
        correctIndices: [1, 2],
        type: "double"
    }
];

export function getQuestionsForSession() {
    return MCQ_QUESTIONS.map(q => ({
        questionNumber: q.questionNumber,
        questionText: q.questionText,
        options: q.options,
        type: q.type
    }));
}

export function getCorrectAnswers() {
    return MCQ_QUESTIONS.map(q => ({
        questionNumber: q.questionNumber,
        correctIndices: q.correctIndices
    }));
}
