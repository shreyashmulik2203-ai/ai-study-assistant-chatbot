import { NoteDocument } from '../types';

export const SAMPLE_NOTES: NoteDocument[] = [
  {
    id: 'dbms-core',
    title: 'DBMS: Normalization, ACID & Indexing',
    subject: 'Database Management Systems',
    uploadDate: '2026-10-20',
    pageCount: 6,
    charCount: 3840,
    isPreloaded: true,
    content: `# Chapter 4: Database Management Systems (DBMS)

## 1. Normalization in Relational Databases
Normalization is the systematic approach of decomposing tables to eliminate data redundancy and avoid anomalies (Insertion, Update, and Deletion anomalies).

### Normal Forms Hierarchy:
1. **First Normal Form (1NF)**:
   - Every column must contain atomic (indivisible) values.
   - Each column must have unique names and no repeating groups.
   - Example: A student cannot have multiple phone numbers in a single column separated by commas.

2. **Second Normal Form (2NF)**:
   - Must be in 1NF.
   - No partial dependency: Every non-prime attribute must be fully functionally dependent on the primary key, not on any subset of a composite candidate key.

3. **Third Normal Form (3NF)**:
   - Must be in 2NF.
   - No transitive dependency: Non-prime attributes must not depend on other non-prime attributes ($X \\to Y$ where neither $X$ is a superkey nor $Y$ is a prime attribute).

4. **Boyce-Codd Normal Form (BCNF)**:
   - Stricter version of 3NF.
   - For every functional dependency $X \\to Y$, $X$ must be a super key.

## 2. Transactions and ACID Properties
A transaction is a single logical unit of database work consisting of one or more SQL statements.

- **Atomicity**: The "All or Nothing" rule. Either all operations of the transaction execute successfully, or the entire transaction is rolled back. Managed by the Transaction Manager using log records.
- **Consistency**: The database must remain in a valid state before and after the transaction execution, preserving integrity constraints (e.g., account balance $\\ge 0$).
- **Isolation**: Concurrent transactions must execute without interfering with one another. Handled by the Concurrency Control Manager using Two-Phase Locking (2PL) or Timestamp Ordering.
- **Durability**: Once a transaction commits, its modifications are permanently saved on disk, surviving power outages and crashes. Managed by the Recovery Manager using Write-Ahead Logging (WAL).

## 3. Database Indexing
Indexing speeds up data retrieval operations without scanning every row in a table.

- **B-Trees vs B+ Trees**:
  - In B-Trees, search keys and data pointers are stored in both internal nodes and leaf nodes.
  - In B+ Trees, data pointers are exclusively stored in leaf nodes, which are linked together in a doubly-linked list. Internal nodes only store routing keys.
  - B+ Trees are preferred in databases (MySQL InnoDB, PostgreSQL) because leaf node traversal facilitates high-speed range queries ($O(\\log N)$ lookup followed by sequential leaf scan).

## 4. SQL vs NoSQL
- SQL (Relational): Structured schema, ACID compliance, vertical scaling, table/foreign key joins (e.g., PostgreSQL, MySQL).
- NoSQL (Non-relational): Flexible/dynamic schema, BASE model (Basically Available, Soft state, Eventual consistency), horizontal scaling, document/key-value/graph models (e.g., MongoDB, Redis).`
  },
  {
    id: 'os-core',
    title: 'Operating Systems: Processes, Deadlocks & Memory',
    subject: 'Operating Systems',
    uploadDate: '2026-10-18',
    pageCount: 5,
    charCount: 3420,
    isPreloaded: true,
    content: `# Operating Systems: Core Principles

## 1. Process Management & PCB
A process is a program in execution. Its execution state is tracked inside the **Process Control Block (PCB)**, which contains:
- Process ID (PID)
- Program Counter (PC)
- CPU Registers & Stack Pointer
- Process State (New, Ready, Running, Waiting, Terminated)
- Memory management info and I/O status

## 2. CPU Scheduling Algorithms
- **First Come First Served (FCFS)**: Non-preemptive. Suffers from the Convoy Effect (short processes waiting behind a long burst process).
- **Shortest Job First (SJF)**: Optimal average waiting time, but can cause starvation for longer jobs.
- **Round Robin (RR)**: Preemptive scheduling with a fixed time quantum ($q$). Fair and suitable for time-sharing systems.

## 3. Deadlock Conditions (Coffman Conditions)
A deadlock occurs when a set of processes are blocked because each process holds a resource and waits for another resource held by another process.
All four conditions must hold simultaneously:
1. **Mutual Exclusion**: At least one resource must be non-shareable.
2. **Hold and Wait**: A process holds at least one resource and is waiting to acquire additional resources held by other processes.
3. **No Preemption**: Resources cannot be forcibly seized; only released voluntarily.
4. **Circular Wait**: A closed chain of processes exists such that $P_0$ waits for $P_1$, $P_1$ waits for $P_2$, ..., $P_n$ waits for $P_0$.

### Banker's Algorithm:
Used for deadlock avoidance. Tests for safe states by simulating resource allocation against maximum claim vectors before granting requests.

## 4. Virtual Memory & Paging
Virtual memory decouples logical address space from physical memory.
- Logical addresses are split into **Page Number ($p$)** and **Page Offset ($d$)**.
- Page Table translates page numbers into physical frame numbers.
- **Page Fault**: Occurs when a referenced page is not loaded into physical RAM. The OS fetches it from secondary storage (swap space).
- Page Replacement Algorithms: FIFO, LRU (Least Recently Used), Optimal (Belady's Anomaly applies to FIFO).`
  },
  {
    id: 'cn-core',
    title: 'Computer Networks: OSI Model & Protocols',
    subject: 'Computer Networks',
    uploadDate: '2026-10-15',
    pageCount: 5,
    charCount: 3100,
    isPreloaded: true,
    content: `# Computer Networks: Protocols & Architecture

## 1. OSI 7-Layer Reference Model
1. **Physical Layer**: Bit transmission over physical medium (cables, radio waves, optical fiber). Data unit: Bits.
2. **Data Link Layer**: Node-to-node framing, error detection (CRC), and MAC addressing. Data unit: Frames.
3. **Network Layer**: Host-to-host packet routing, logical IP addressing (IPv4/IPv6). Data unit: Packets.
4. **Transport Layer**: End-to-end reliable delivery, port addressing, flow & congestion control. Data unit: Segments.
5. **Session Layer**: Dialog control, session synchronization, token management.
6. **Presentation Layer**: Syntax translation, encryption/decryption (TLS/SSL), data compression.
7. **Application Layer**: User network interfaces (HTTP, DNS, SMTP, FTP).

## 2. TCP vs UDP
- **Transmission Control Protocol (TCP)**:
  - Connection-oriented (Three-Way Handshake: SYN $\\to$ SYN-ACK $\\to$ ACK).
  - Reliable delivery with sequence numbers, checksums, and acknowledgments.
  - Features Congestion Control (Slow Start, Congestion Avoidance, Fast Retransmit).
- **User Datagram Protocol (UDP)**:
  - Connectionless and lightweight.
  - No handshakes, ordering guarantees, or congestion throttling.
  - Used for real-time streaming, online gaming, VoIP, and DNS queries.

## 3. IP Addressing and Subnetting
- IPv4: 32-bit address represented in dotted decimal notation ($4$ octets).
- Subnet Mask separates Network ID from Host ID (e.g., /24 denotes 24 network bits, 8 host bits = 254 usable hosts).
- NAT (Network Address Translation): Maps multiple private RFC 1918 IPs to a single public IP to conserve IPv4 space.`
  },
  {
    id: 'dsa-core',
    title: 'Data Structures & Algorithms: Trees, Graphs & Complexity',
    subject: 'Data Structures',
    uploadDate: '2026-10-12',
    pageCount: 6,
    charCount: 3600,
    isPreloaded: true,
    content: `# Data Structures & Algorithms

## 1. Asymptotic Notations
- **Big-O ($O$)**: Tight upper bound (worst-case scenario).
- **Big-Omega ($\\Omega$)**: Lower bound (best-case scenario).
- **Big-Theta ($\\Theta$)**: Tight bound (average or matching bounds).

## 2. Tree Data Structures
- **Binary Search Tree (BST)**:
  - For any node $N$: keys in left subtree $< N.key <$ keys in right subtree.
  - Average time complexity: $O(\\log N)$ for Search, Insert, Delete.
  - Worst case: $O(N)$ when skewed.
- **AVL Tree**:
  - Self-balancing BST where balance factor $|height(left) - height(right)| \\le 1$.
  - Rebalanced using single (LL, RR) or double (LR, RL) rotations. Guaranteed $O(\\log N)$ operations.

## 3. Graph Algorithms
- **Breadth-First Search (BFS)**: Uses a Queue. Computes shortest path in unweighted graphs. Time: $O(V + E)$.
- **Depth-First Search (DFS)**: Uses a Stack (or recursion). Used for topological sorting and cycle detection. Time: $O(V + E)$.
- **Dijkstra's Algorithm**: Greedy algorithm for single-source shortest path with non-negative edge weights using a Min-Heap. Time: $O((V + E) \\log V)$.`
  }
];
