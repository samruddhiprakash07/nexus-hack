// Initial realistic data for FocusMate AI
export const INITIAL_EXAMS = [
  {
    id: 'exam-1',
    subject: 'Data Structures & Algorithms (CS301)',
    examType: 'Final Semester Exam',
    // 3.5 days from now to trigger the < 5 days urgency boost
    date: new Date(Date.now() + 3.5 * 24 * 60 * 60 * 1000).toISOString(),
    topics: ['AVL & Red-Black Trees', 'Graph Shortest Paths', 'Dynamic Programming', 'NP-Completeness'],
    location: 'Hall B - Engineering Block 3',
    weight: '40% of Final Grade',
  },
  {
    id: 'exam-2',
    subject: 'Operating Systems & Concurrency (CS304)',
    examType: 'Midterm & Viva',
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    topics: ['Process Scheduling', 'Deadlock Detection', 'Virtual Memory & Paging', 'File Systems'],
    location: 'CS Lab 2',
    weight: '25% of Final Grade',
  },
  {
    id: 'exam-3',
    subject: 'Machine Learning & Neural Networks',
    examType: 'Quiz & Project Defense',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    topics: ['Backpropagation', 'Loss Functions & Regularization', 'CNNs & Attention'],
    location: 'Online Portal',
    weight: '20% of Final Grade',
  }
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'Review OS Virtual Memory & Page Replacement (LRU, Clock, Optimal)',
    category: 'Academics',
    priority: 'High',
    duration: 60, // minutes
    completed: false,
    examCritical: true,
    energyNeeded: 'High',
    notes: 'Focus on Belady anomaly and page fault frequency graphs.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Complete DSA Lab: AVL Tree Balancing, Height Calculations & Rotations',
    category: 'Academics',
    priority: 'High',
    duration: 75,
    completed: false,
    examCritical: true,
    energyNeeded: 'High',
    notes: 'Verify Left-Right and Right-Left double rotations test cases.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Solve 3 LeetCode Graph problems (Dijkstra, Topological Sort, Cycle Detection)',
    category: 'Core Coding (Java/DSA)',
    priority: 'High',
    duration: 60,
    completed: false,
    examCritical: true,
    energyNeeded: 'High',
    notes: 'Implement using Java PriorityQueue and adjacency lists.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'System Design Lecture: Distributed Caching, Redis Invalidation Strategies',
    category: 'Courses (PW/Certifications)',
    priority: 'Medium',
    duration: 45,
    completed: true,
    examCritical: false,
    energyNeeded: 'Medium',
    notes: 'Took notes on Cache-Aside vs Write-Through patterns.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'Java Concurrency: Build ThreadPoolExecutor demo with LinkedBlockingQueue',
    category: 'Core Coding (Java/DSA)',
    priority: 'Medium',
    duration: 45,
    completed: false,
    examCritical: false,
    energyNeeded: 'Medium',
    notes: 'Demonstrate worker thread reuse and graceful shutdown.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-6',
    title: 'AWS Practice Quiz: S3 Storage Classes & VPC Subnet routing',
    category: 'Courses (PW/Certifications)',
    priority: 'Low',
    duration: 30,
    completed: false,
    examCritical: false,
    energyNeeded: 'Low',
    notes: 'Target 80%+ score on 25 question practice set.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-7',
    title: '30-minute posture stretching, hydration & evening walk',
    category: 'Personal Goals',
    priority: 'Low',
    duration: 30,
    completed: true,
    examCritical: false,
    energyNeeded: 'Low',
    notes: 'Essential for cognitive recovery between deep study blocks.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-8',
    title: 'Clean up git branch history and organize dotfiles',
    category: 'Personal Goals',
    priority: 'Low',
    duration: 25,
    completed: false,
    examCritical: false,
    energyNeeded: 'Low',
    notes: 'Deprioritize when overwhelmed!',
    createdAt: new Date().toISOString(),
  }
];

export const OCR_SAMPLE_PRESETS = [
  {
    id: 'preset-dsa',
    title: 'Assignment 4: Advanced Graph Algorithms & Spanning Trees',
    subtitle: 'Department of Computer Science • Dr. Vance',
    category: 'Academics',
    dateDetected: 'Due: Oct 20, 2026',
    documentType: 'Lecture Handout & Lab Sheet',
    previewVisual: {
      header: 'CS301 DATA STRUCTURES & ALGORITHMS - LAB ASSIGNMENT 04',
      snippet: '1. Implement Kruskal\'s Algorithm using Disjoint Set Union (Path Compression & Rank)\n2. Proof of correctness: Prim\'s greedy cut property\n3. Benchmark Dijkstra vs Bellman-Ford with negative edge weights\n4. Submit zipped source code and PDF benchmark report to Portal',
      confidence: '98.4% OCR Confidence',
    },
    tasks: [
      {
        title: 'Implement Kruskal\'s Algorithm with Disjoint Set Union (DSU)',
        category: 'Core Coding (Java/DSA)',
        duration: 50,
        priority: 'High',
        examCritical: true,
      },
      {
        title: 'Write formal proof for Prim\'s Greedy Cut Property',
        category: 'Academics',
        duration: 35,
        priority: 'Medium',
        examCritical: true,
      },
      {
        title: 'Benchmark Dijkstra vs Bellman-Ford on dense graphs with negative weights',
        category: 'Core Coding (Java/DSA)',
        duration: 45,
        priority: 'High',
        examCritical: true,
      },
      {
        title: 'Format code documentation & upload PDF report to portal',
        category: 'Academics',
        duration: 20,
        priority: 'Medium',
        examCritical: false,
      }
    ]
  },
  {
    id: 'preset-os',
    title: 'OS Midterm Prep: Concurrency, Deadlocks & Memory Management',
    subtitle: 'Faculty Syllabus & Exam Review Blueprint',
    category: 'Academics',
    dateDetected: 'Exam Date: Nov 02, 2026',
    documentType: 'Handwritten Syllabus Blueprint',
    previewVisual: {
      header: 'OPERATING SYSTEMS - HIGH YIELD EXAM BLUEPRINT',
      snippet: '• Chapter 5: CPU Scheduling (Round Robin quantum tuning, Multilevel Feedback)\n• Chapter 6: Deadlock 4 Coffman conditions, Banker\'s Algorithm matrix problems\n• Chapter 7: Memory Hierarchy, TLB hit ratio math, Page Replacement (LRU, FIFO, Clock)\n• Chapter 8: File Allocation Tables vs Inodes structure',
      confidence: '96.2% OCR Confidence',
    },
    tasks: [
      {
        title: 'Solve 3 numericals on Banker\'s Algorithm Safe State verification',
        category: 'Academics',
        duration: 40,
        priority: 'High',
        examCritical: true,
      },
      {
        title: 'Draw and memorize TLB hit ratio and effective access time equations',
        category: 'Academics',
        duration: 30,
        priority: 'Medium',
        examCritical: true,
      },
      {
        title: 'Review Producer-Consumer condition variables and Semaphore implementation',
        category: 'Core Coding (Java/DSA)',
        duration: 45,
        priority: 'High',
        examCritical: true,
      }
    ]
  },
  {
    id: 'preset-project',
    title: 'Full-Stack Capstone Milestone 2 Deliverables',
    subtitle: 'Sprint Board & Architecture Checklist',
    category: 'Courses (PW/Certifications)',
    dateDetected: 'Review Date: In 6 Days',
    documentType: 'Engineering Sprint Spec',
    previewVisual: {
      header: 'MICROSERVICES & CLOUD BACKEND - SPRINT 2 DELIVERABLES',
      snippet: '• Auth Service: JWT Bearer validation with Redis blacklist cache\n• Database: PostgreSQL index optimization for composite queries\n• Observability: Add OpenTelemetry tracing and structured JSON logs\n• Docker: Multi-stage Dockerfile shrinking node image < 150MB',
      confidence: '99.1% OCR Confidence',
    },
    tasks: [
      {
        title: 'Implement Redis token blacklist for instant logout invalidation',
        category: 'Core Coding (Java/DSA)',
        duration: 55,
        priority: 'High',
        examCritical: false,
      },
      {
        title: 'Audit PostgreSQL slow queries and add compound B-Tree indexes',
        category: 'Courses (PW/Certifications)',
        duration: 40,
        priority: 'Medium',
        examCritical: false,
      },
      {
        title: 'Optimize Dockerfile using alpine multi-stage build pattern',
        category: 'Courses (PW/Certifications)',
        duration: 30,
        priority: 'Low',
        examCritical: false,
      }
    ]
  }
];

export const SYLLABUS_QUIZZES = {
  dsa: {
    title: 'Data Structures & Algorithms',
    badge: 'Core CS301',
    description: 'Self-balancing trees, graph shortest paths, dynamic programming invariants.',
    questions: [
      {
        id: 'q1',
        topic: 'Self-Balancing Trees (AVL)',
        question: 'In an AVL Tree, after inserting a node into the right subtree of a left child (LR case), which rotations are required to restore balance?',
        options: [
          'Single Left Rotation at root',
          'Left rotation on child, followed by Right rotation on parent',
          'Single Right Rotation at parent',
          'Right rotation on child, followed by Left rotation on parent'
        ],
        correctIndex: 1,
        explanation: 'For a Left-Right (LR) imbalance in an AVL tree, you first perform a Left Rotation on the left child node to transform it into a Left-Left (LL) case, followed by a Right Rotation on the unbalanced node (parent).',
        weakTopicTask: 'Practice AVL Tree Double Rotations (LR & RL cases) on paper'
      },
      {
        id: 'q2',
        topic: 'Graph Algorithms (Dijkstra)',
        question: 'Why does Dijkstra’s algorithm fail to guarantee the shortest path on graphs with negative edge weights?',
        options: [
          'It cannot visit nodes with degree higher than 2',
          'It assumes that once a node is settled/visited, its distance is finalized and cannot be decreased',
          'Priority queues cannot store negative integers',
          'It gets stuck in infinite loops only on directed acyclic graphs'
        ],
        correctIndex: 1,
        explanation: 'Dijkstra relies on a greedy property: once a node is popped from the priority queue (settled), its recorded distance is assumed to be minimal. A negative edge encountered later could lower a distance that was already deemed final, violating this invariant. Bellman-Ford solves this.',
        weakTopicTask: 'Study Bellman-Ford Algorithm and why it handles negative edges vs Dijkstra'
      },
      {
        id: 'q3',
        topic: 'Dynamic Programming (0/1 Knapsack)',
        question: 'When optimizing the space complexity of the 0/1 Knapsack problem from 2D table O(N*W) to 1D array O(W), in what direction must the inner weight loop run?',
        options: [
          'From weight 0 up to max capacity W',
          'From max capacity W down to current item weight w_i',
          'Any order because values are independent',
          'In randomized order to prevent cache thrashing'
        ],
        correctIndex: 1,
        explanation: 'In 0/1 Knapsack, iterating backward (from W down to weight) ensures each item is used at most once, preventing values updated in the current step from overwriting values needed from the previous step (which would inadvertently simulate the Unbounded Knapsack problem).',
        weakTopicTask: 'Re-implement 1D array space-optimized 0/1 Knapsack in Java'
      },
      {
        id: 'q4',
        topic: 'Amortized Complexity (Dynamic Array)',
        question: 'When a dynamic array (like Java ArrayList) doubles its capacity upon reaching full size, what is the amortized time complexity of an append (add) operation?',
        options: [
          'O(N)',
          'O(log N)',
          'O(1)',
          'O(N log N)'
        ],
        correctIndex: 2,
        explanation: 'Although doubling the array and copying elements takes O(N) when it triggers, this resize occurs very infrequently. Across N operations, the total resize cost is O(N), yielding an amortized O(1) time per append.',
        weakTopicTask: 'Review Amortized Analysis methods (Accounting & Potential method)'
      }
    ]
  },
  os: {
    title: 'Operating Systems & Concurrency',
    badge: 'Core CS304',
    description: 'Deadlock avoidance, virtual memory page replacement, race conditions.',
    questions: [
      {
        id: 'os-1',
        topic: 'Deadlock Conditions',
        question: 'Which of the following is NOT one of the four essential Coffman conditions necessary for a deadlock to occur?',
        options: [
          'Mutual Exclusion',
          'Hold and Wait',
          'Preemption Allowed',
          'Circular Wait'
        ],
        correctIndex: 2,
        explanation: 'The condition is NO Preemption: resources cannot be forcibly confiscated from a process holding them; they must be released voluntarily. If preemption is allowed, deadlocks can be broken.',
        weakTopicTask: 'Revise 4 Coffman Deadlock Conditions and Deadlock Prevention strategies'
      },
      {
        id: 'os-2',
        topic: 'Virtual Memory (Belady\'s Anomaly)',
        question: 'What is Belady\'s Anomaly in page replacement algorithms?',
        options: [
          'Thrashing occurs when CPU utilization is near 100%',
          'Allocating MORE page frames results in MORE page faults for certain reference strings (e.g. in FIFO)',
          'LRU requires exponential hardware registers to maintain timestamps',
          'A page fault always triggers a system reboot when RAM is full'
        ],
        correctIndex: 1,
        explanation: 'Belady\'s Anomaly is the counter-intuitive phenomenon where increasing the number of physical page frames results in an increased number of page faults. It can occur in FIFO, but never in Stack algorithms like LRU or Optimal.',
        weakTopicTask: 'Solve Belady\'s Anomaly numerical example using 3 vs 4 page frames'
      },
      {
        id: 'os-3',
        topic: 'Synchronization & Concurrency',
        question: 'What is the primary difference between a Counting Semaphore and a Mutex lock?',
        options: [
          'A Mutex has an ownership concept (only the locking thread can unlock it), whereas a Semaphore can be signaled by any thread',
          'Semaphores only work on single-core processors',
          'Mutexes cannot be used in multi-threaded programs',
          'Semaphores require busy-waiting spinlocks exclusively'
        ],
        correctIndex: 0,
        explanation: 'A Mutex is an ownership lock: only the thread that acquired the mutex can release it. A Semaphore is a signaling mechanism (counter): any thread can call signal/post, making it suitable for producer-consumer coordination.',
        weakTopicTask: 'Write a Producer-Consumer thread coordination program using Semaphores'
      }
    ]
  },
  ml: {
    title: 'Machine Learning & AI Foundations',
    badge: 'CS410 Elective',
    description: 'Gradient descent, regularization, bias-variance tradeoff, attention.',
    questions: [
      {
        id: 'ml-1',
        topic: 'Overfitting & Regularization',
        question: 'How does L1 Regularization (Lasso) differ fundamentally from L2 Regularization (Ridge) in terms of learned weights?',
        options: [
          'L1 drives many non-essential weights to exactly zero (inducing sparsity), while L2 shrinks weights toward zero without setting them to exact zero',
          'L1 can only be applied to classification tasks',
          'L2 causes gradients to explode on large datasets',
          'L1 increases the number of trainable parameters'
        ],
        correctIndex: 0,
        explanation: 'Due to the diamond geometry of the L1 penalty (|w|), optimal points frequently intersect the axes where parameters equal zero. Hence, L1 performs automated feature selection by creating sparse weight vectors.',
        weakTopicTask: 'Review mathematical derivation of L1 vs L2 regularization gradients'
      },
      {
        id: 'ml-2',
        topic: 'Neural Networks & Optimization',
        question: 'Why is the Leaky ReLU activation function preferred over standard ReLU in deep networks vulnerable to the "Dying ReLU" problem?',
        options: [
          'It bounds outputs between -1 and 1',
          'It provides a small non-zero slope for negative inputs, preventing neurons from becoming permanently inactive',
          'It eliminates the need for backpropagation',
          'It is strictly linear across all domains'
        ],
        correctIndex: 1,
        explanation: 'Standard ReLU has zero gradient for x < 0. If a large gradient updates weights such that the neuron never activates, its gradient stays zero forever (dead neuron). Leaky ReLU uses f(x) = ax (e.g., 0.01x) for x < 0 to keep gradients alive.',
        weakTopicTask: 'Compare Activation Functions: ReLU, Leaky ReLU, GELU, and Swish'
      }
    ]
  }
};
