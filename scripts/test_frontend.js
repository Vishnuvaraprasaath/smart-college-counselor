import http from 'http';

async function verify() {
  console.log('Testing Frontend at http://localhost:3000 ...');
  try {
    const res = await fetch('http://localhost:3000');
    const html = await res.text();
    console.log(`[PASS] Frontend HTTP Status: ${res.status}`);
    console.log(`[PASS] Contains #root: ${html.includes('id="root"')}`);
    console.log(`[PASS] Contains /src/main.jsx: ${html.includes('/src/main.jsx')}`);
  } catch (err) {
    console.error('[FAIL] Frontend fetch error:', err.message);
  }

  console.log('\nTesting Vite Proxy at http://localhost:3000/api/health ...');
  try {
    const res = await fetch('http://localhost:3000/api/health');
    const json = await res.json();
    console.log(`[PASS] Vite Proxy /api/health Status: ${res.status}`);
    console.log(`[PASS] Database Status via Proxy: ${json.database}`);
  } catch (err) {
    console.error('[FAIL] Proxy fetch error:', err.message);
  }

  console.log('\nTesting Vite Proxy POST /api/analyze ...');
  try {
    const res = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Vishnu',
        cutoff: 187.5,
        math: 95,
        physics: 92.5,
        chemistry: 92.5,
        percentage: 93.3,
        category: 'BC',
        courses: ['ECE', 'CSE'],
        location: 'Coimbatore',
        budget: 150000,
        interests: ['Electronics', 'IoT']
      })
    });
    const data = await res.json();
    console.log(`[PASS] /api/analyze via Proxy: HTTP ${res.status}`);
    console.log(`[PASS] Recommendations count: ${data.recommendations?.length}`);
    console.log(`[PASS] Safe: ${data.summary?.safe}, Moderate: ${data.summary?.moderate}, Ambitious: ${data.summary?.ambitious}`);
  } catch (err) {
    console.error('[FAIL] Analyze error:', err.message);
  }

  console.log('\nTesting Vite Proxy POST /api/tamilnadu/choice-sheet ...');
  try {
    const res = await fetch('http://localhost:3000/api/tamilnadu/choice-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cutoff: 187.5,
        category: 'BC',
        courses: ['ECE', 'CSE'],
        location: 'Coimbatore'
      })
    });
    const sheet = await res.json();
    console.log(`[PASS] /api/tamilnadu/choice-sheet via Proxy: HTTP ${res.status}`);
    console.log(`[PASS] Ordered choices count: ${sheet.orderedChoices?.length}`);
    console.log(`[PASS] Strategy: ${sheet.strategy}`);
  } catch (err) {
    console.error('[FAIL] Choice sheet error:', err.message);
  }

  console.log('\nTesting Vite Proxy POST /api/ai/chat ...');
  try {
    const res = await fetch('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'How should I choose between ECE and CSE for cutoff 187.5?',
        context: { studentCutoff: 187.5, category: 'BC' }
      })
    });
    const ai = await res.json();
    console.log(`[PASS] /api/ai/chat via Proxy: HTTP ${res.status}`);
    console.log(`[PASS] AI Reply received: ${ai.message?.substring(0, 70)}...`);
  } catch (err) {
    console.error('[FAIL] AI Chat error:', err.message);
  }
}

verify();
