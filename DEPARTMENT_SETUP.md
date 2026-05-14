# Quick Department Setup

Use this to quickly add all departments to your system.

## Method 1: Using Browser Console

1. Login as IQAC Coordinator
2. Open browser console (F12)
3. Copy and paste this code:

```javascript
const departments = [
  { name: "Computer Science and Business Systems", code: "CSBS" },
  { name: "Computer and Communication Engineering", code: "CCE" },
  { name: "Computer Science and Engineering", code: "CSE" },
  { name: "Artificial Intelligence and Machine Learning", code: "AIML" },
  { name: "Artificial Intelligence and Data Science", code: "AIDS" },
  { name: "Electronics and Communication Engineering", code: "ECE" },
  { name: "VLSI Design", code: "VLSI" },
  { name: "Mechanical Engineering", code: "MECH" },
  { name: "Biotechnology", code: "BIOTECH" },
  { name: "Humanities and Sciences", code: "H&S" }
];

const token = localStorage.getItem('token');

async function createDepartments() {
  for (const dept of departments) {
    try {
      const response = await fetch('http://localhost:8080/iqac/department', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dept)
      });
      const data = await response.json();
      console.log(`✅ Created: ${dept.name}`, data);
    } catch (error) {
      console.error(`❌ Failed: ${dept.name}`, error);
    }
  }
  console.log('✅ All departments created!');
}

createDepartments();
```

## Method 2: Using Postman/cURL

Send POST requests to `http://localhost:8080/iqac/department` with:

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

**Body (for each department):**
```json
{ "name": "Computer Science and Business Systems", "code": "CSBS" }
{ "name": "Computer and Communication Engineering", "code": "CCE" }
{ "name": "Computer Science and Engineering", "code": "CSE" }
{ "name": "Artificial Intelligence and Machine Learning", "code": "AIML" }
{ "name": "Artificial Intelligence and Data Science", "code": "AIDS" }
{ "name": "Electronics and Communication Engineering", "code": "ECE" }
{ "name": "VLSI Design", "code": "VLSI" }
{ "name": "Mechanical Engineering", "code": "MECH" }
{ "name": "Biotechnology", "code": "BIOTECH" }
{ "name": "Humanities and Sciences", "code": "H&S" }
```

## Method 3: Using Dashboard

1. Go to Departments section
2. Click "Add New"
3. Enter department name and code
4. Repeat for all 10 departments

After adding departments, they will appear in the dropdown when creating HODs or Faculty.
