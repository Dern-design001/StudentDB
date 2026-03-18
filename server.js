const express = require('express');
const neo4j = require('neo4j-driver');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Neo4j Driver Setup
const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

// Verify Connection (non-fatal - server still starts even if DB is unreachable)
driver.verifyConnectivity()
  .then(() => console.log('✅ Connected to Neo4j successfully'))
  .catch((err) => console.warn('⚠️ Neo4j not reachable yet:', err.message));

// API Routes

// 1. Get all students
app.get('/api/students', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      'MATCH (s:Student) RETURN s ORDER BY s.id DESC'
    );
    const students = result.records.map(record => record.get('s').properties);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// 2. Add a new student
app.post('/api/students', async (req, res) => {
  const { id, name, rollNo, timestamp, department, email } = req.body;
  const session = driver.session();
  try {
    const result = await session.run(
      `
      MERGE (u:University {name: 'Centric University'})
      MERGE (d:Department {name: $department})
      MERGE (d)-[:BELONGS_TO]->(u)
      CREATE (s:Student {id: $id, name: $name, rollNo: $rollNo, timestamp: $timestamp, email: $email, department: $department})
      CREATE (s)-[:MEMBER_OF]->(d)
      WITH s, d
      OPTIONAL MATCH (other:Student)-[:MEMBER_OF]->(d)
      WHERE other <> s
      WITH s, other
      FOREACH (o IN CASE WHEN other IS NOT NULL THEN [other] ELSE [] END |
        MERGE (s)-[:CLASSMATE]-(o)
      )
      RETURN s
      `,
      { id, name, rollNo, timestamp, department, email }
    );
    res.status(201).json(result.records[0].get('s').properties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// 3. Delete a student
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const session = driver.session();
  try {
    await session.run(
      'MATCH (s:Student {id: $id}) DETACH DELETE s',
      { id: parseInt(id) }
    );
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

// 4. Serve Frontend
app.use(express.static(path.join(__dirname, 'dist/studentdata/browser')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/studentdata/browser/index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
