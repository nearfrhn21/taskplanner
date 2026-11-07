// Realistic sample data for first launch
import { format, addDays } from 'date-fns';

const today = new Date();
const todayStr = format(today, 'yyyy-MM-dd');
const tomorrowStr = format(addDays(today, 1), 'yyyy-MM-dd');
const inThreeDaysStr = format(addDays(today, 3), 'yyyy-MM-dd');
const inFiveDaysStr = format(addDays(today, 5), 'yyyy-MM-dd');
const yesterdayStr = format(addDays(today, -1), 'yyyy-MM-dd');

// Lightweight sample SVG diagram as dataUrl image
const sampleDiagramSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="%23f8fafc"><rect width="100%" height="100%" fill="%230f172a"/><text x="50" y="60" fill="%2338bdf8" font-family="sans-serif" font-size="22" font-weight="bold">Binary Search Tree Architecture</text><circle cx="300" cy="130" r="30" fill="%236366f1"/><text x="300" y="137" fill="white" font-size="18" text-anchor="middle" font-weight="bold">50</text><line x1="280" y1="150" x2="200" y2="210" stroke="%2394a3b8" stroke-width="3"/><line x1="320" y1="150" x2="400" y2="210" stroke="%2394a3b8" stroke-width="3"/><circle cx="200" cy="230" r="26" fill="%2310b981"/><text x="200" y="236" fill="white" font-size="16" text-anchor="middle" font-weight="bold">25</text><circle cx="400" cy="230" r="26" fill="%23f59e0b"/><text x="400" y="236" fill="white" font-size="16" text-anchor="middle" font-weight="bold">75</text><line x1="185" y1="250" x2="140" y2="300" stroke="%2394a3b8" stroke-width="2"/><circle cx="140" cy="315" r="20" fill="%23ec4899"/><text x="140" y="321" fill="white" font-size="14" text-anchor="middle">10</text><line x1="215" y1="250" x2="250" y2="300" stroke="%2394a3b8" stroke-width="2"/><circle cx="250" cy="315" r="20" fill="%23ec4899"/><text x="250" y="321" fill="white" font-size="14" text-anchor="middle">35</text><line x1="385" y1="250" x2="350" y2="300" stroke="%2394a3b8" stroke-width="2"/><circle cx="350" cy="315" r="20" fill="%23ec4899"/><text x="350" y="321" fill="white" font-size="14" text-anchor="middle">60</text><line x1="415" y1="250" x2="460" y2="300" stroke="%2394a3b8" stroke-width="2"/><circle cx="460" cy="315" r="20" fill="%23ec4899"/><text x="460" y="321" fill="white" font-size="14" text-anchor="middle">90</text><text x="50" y="380" fill="%2394a3b8" font-family="sans-serif" font-size="14">Course Reference Diagram - CS204</text></svg>`;

// Minimal valid sample PDF base64 (one page PDF text)
const samplePdfData = `data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMiAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDQgMCBSCi9SZXNvdXJjZXMgPDwKL0ZvbnQgPDwKL0YxIDUgMCBSCj4+Cj4+Cj4+CmVuZG9iago0IDAgb2JqCjw8Ci9MZW5ndGggMTI4Cj4+CnN0cmVhbQpCVAovRjEgMjQgVGYKNTAgNzAwIFRECihFRFVQTEFOIFNUVURFTlQgUkVGRUVOQ0UgR1VJREVbMSAwIDAgMV0pIFRqCjAgLTMwIFRECi9GMSAxMiBUZgooVGhpcyBpcyBhIHJlZmVyZW5jZSBkb2N1bWVudCBhdHRhY2hlZCB0byB5b3VyIHN0dWRlbnQgdGFzay4pIFRqCkVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY4IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDAwMDAwMDI1MCAwMDAwMCBuIAowMDAwMDAwNDMwIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNTIxCiUlRU9G`;

export const INITIAL_COURSES = [
  { id: 'c1', name: 'Computer Science', code: 'CS204', color: 'indigo' },
  { id: 'c2', name: 'Organic Chemistry', code: 'CHEM301', color: 'emerald' },
  { id: 'c3', name: 'Linear Algebra', code: 'MATH210', color: 'sky' },
  { id: 'c4', name: 'World History', code: 'HIST105', color: 'amber' },
  { id: 'c5', name: 'Macroeconomics', code: 'ECON201', color: 'purple' },
];

export const INITIAL_TASKS = [
  {
    id: 'task-1',
    title: 'CS204: Implement Self-Balancing AVL & Red-Black Tree in C++',
    course: 'Computer Science',
    courseCode: 'CS204',
    courseColor: 'indigo',
    workingDate: todayStr,
    dueDate: tomorrowStr,
    priority: 'urgent',
    status: 'todo',
    estimatedHours: 4,
    description: `Assignment Objective:
Implement a generic self-balancing binary search tree supporting:
1. Insertion with tree rotation (LL, RR, LR, RL cases).
2. Deletion with height-rebalancing.
3. In-order, Pre-order, and Level-order iterator traversal.
4. Stress-test against 100,000 random integers and verify O(log n) lookup.

Make sure memory leaks are checked using Valgrind or AddressSanitizer.
Submission guidelines:
- Zip code and report into firstname_lastname_lab4.zip
- Include runtime benchmark graphs.`,
    subtasks: [
      { id: 's1', title: 'Write node rotation routines', completed: true },
      { id: 's2', title: 'Implement insert with balancing logic', completed: true },
      { id: 's3', title: 'Implement delete & re-balance operations', completed: false },
      { id: 's4', title: 'Run valgrind memory leak checks', completed: false },
      { id: 's5', title: 'Generate benchmark analysis charts', completed: false }
    ],
    attachments: [
      {
        id: 'att-1',
        name: 'BST_Architecture_Diagram.svg',
        type: 'image/svg+xml',
        size: 1420,
        dataUrl: sampleDiagramSvg,
        createdAt: '2026-11-05'
      },
      {
        id: 'att-2',
        name: 'CS204_Lab4_Specification.pdf',
        type: 'application/pdf',
        size: 28400,
        dataUrl: samplePdfData,
        createdAt: '2026-11-05'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'CHEM301: Organic Synthesis Lab Report - Aspirin Crystallization',
    course: 'Organic Chemistry',
    courseCode: 'CHEM301',
    courseColor: 'emerald',
    workingDate: tomorrowStr,
    dueDate: inThreeDaysStr,
    priority: 'high',
    status: 'todo',
    estimatedHours: 3,
    description: `Write a comprehensive laboratory report detailing the esterification reaction of salicylic acid with acetic anhydride in the presence of concentrated sulfuric acid catalyst.

Key sections needed:
- Abstract & Reaction Mechanism
- Materials & Safety Protocols
- Stoichiometric Calculations & Theoretical Yield
- Actual Yield and Melting Point Determination (Mel-Temp apparatus)
- IR Spectroscopy peak analysis (look for C=O stretch at 1680 cm⁻¹ and 1750 cm⁻¹)
- Discussion of impurities and percent error.`,
    subtasks: [
      { id: 's1', title: 'Calculate percent yield from raw mass', completed: true },
      { id: 's2', title: 'Annotate IR spectrum peaks', completed: false },
      { id: 's3', title: 'Draft discussion and error sources', completed: false },
      { id: 's4', title: 'Proofread APA citations', completed: false }
    ],
    attachments: [
      {
        id: 'att-3',
        name: 'Lab_Protocol_Esterification.pdf',
        type: 'application/pdf',
        size: 32000,
        dataUrl: samplePdfData,
        createdAt: '2026-11-06'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'HIST105: Term Paper Draft - Social Dynamics of Industrialization',
    course: 'World History',
    courseCode: 'HIST105',
    courseColor: 'amber',
    workingDate: inThreeDaysStr,
    dueDate: inFiveDaysStr,
    priority: 'medium',
    status: 'todo',
    estimatedHours: 6,
    description: `Topic: How the shift from agrarian cottage industry to urban mechanized textile mills in Manchester (1780-1840) transformed working-class family structures and catalyzed early labor legislation.

Primary sources to cite:
1. Sadler Committee Report (1832) on child labor conditions.
2. Friedrich Engels, 'The Condition of the Working Class in England' (1845).
3. Factory Act of 1833 legislative records.

Target word count: 2,500 - 3,000 words.
Chicago Manual of Style footnotes required.`,
    subtasks: [
      { id: 's1', title: 'Gather primary source excerpts', completed: true },
      { id: 's2', title: 'Write Thesis and Outline', completed: true },
      { id: 's3', title: 'Draft Section 1: Pre-industrial family units', completed: false },
      { id: 's4', title: 'Draft Section 2: Mill urbanization', completed: false },
      { id: 's5', title: 'Draft Section 3: Legislative response', completed: false }
    ],
    attachments: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-4',
    title: 'MATH210: Eigenvalues and Spectral Theorem Problem Set 5',
    course: 'Linear Algebra',
    courseCode: 'MATH210',
    courseColor: 'sky',
    workingDate: yesterdayStr,
    dueDate: todayStr,
    priority: 'urgent',
    status: 'completed',
    estimatedHours: 2.5,
    description: `Problems from Chapter 7:
- Exercise 7.1: Compute characteristic polynomials for 3x3 symmetric matrices.
- Exercise 7.3: Diagonalize matrix A and compute A^10 using spectral decomposition.
- Exercise 7.7: Proof that real symmetric matrices possess orthogonal eigenvectors for distinct eigenvalues.`,
    subtasks: [
      { id: 's1', title: 'Problem 7.1', completed: true },
      { id: 's2', title: 'Problem 7.3', completed: true },
      { id: 's3', title: 'Problem 7.7 proof', completed: true }
    ],
    attachments: [],
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_SETTINGS = {
  studentName: 'Alex Student',
  studentEmail: 'student@university.edu',
  studentPhone: '+1 (555) 234-5678', // can be international e.g. 62812345678 or +1...
  reminderThresholdDays: 2, // notify tasks due within 2 days
  autoCheckAlerts: true,
  soundEnabled: true,
  theme: 'light'
};
