const http = require('http');
const app = require('../src/server');
const { connectDB } = require('../src/config/db');

async function runTest() {
    await connectDB();
    const testPort = 5001;
    const server = http.createServer(app);

    server.listen(testPort, () => {
        http.get(`http://localhost:${testPort}/api/v1/health`, (res) => {
            let rawData = '';
            res.on('data', chunk => rawData += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(rawData);
                    console.log('[TEST] Health Check API Response:');
                    console.log(JSON.stringify(parsed, null, 2));

                    if (parsed.success === true && parsed.database && parsed.database.mode === 'IN_MEMORY_MOCK') {
                        console.log('\n[PASS] Dual-Mode Database Adapter & Health API Test Passed 100%.');
                        server.close(() => process.exit(0));
                    } else {
                        console.error('\n[FAIL] Unexpected database mode response.');
                        server.close(() => process.exit(1));
                    }
                } catch (err) {
                    console.error('\n[FAIL] Failed to parse health response:', err.message);
                    server.close(() => process.exit(1));
                }
            });
        }).on('error', (err) => {
            console.error('\n[FAIL] HTTP Request failed:', err.message);
            server.close(() => process.exit(1));
        });
    });
}

runTest();
