// Test SSE endpoint like the browser does
const testSSE = async (url) => {
  console.log(`\n🧪 Testing SSE endpoint: ${url}\n`);
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brief: "Create a simple todo list application with add and delete functionality",
        language: "typescript"
      }),
    });

    console.log(`✅ Response status: ${response.status}`);
    console.log(`✅ Response headers:`, Object.fromEntries(response.headers));

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response body");
    }

    console.log('\n📡 SSE Events received:\n');
    
    let eventCount = 0;
    let timeout = setTimeout(() => {
      console.log('\n⏱️  15 second timeout reached, stopping...');
      reader.cancel();
    }, 15000);

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        clearTimeout(timeout);
        console.log('\n✅ Stream ended gracefully');
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          eventCount++;
          try {
            const data = JSON.parse(line.slice(6));
            console.log(`  ${eventCount}. [${data.type}] ${data.phase}: ${data.message}`);
            
            if (data.type === "complete") {
              console.log('\n✅ Project creation complete!');
              clearTimeout(timeout);
              reader.cancel();
              return;
            }
          } catch (e) {
            console.log(`  ⚠️  Failed to parse: ${line}`);
          }
        }
      }
    }

    console.log(`\n📊 Total events received: ${eventCount}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    throw error;
  }
};

// Test both local and production
(async () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  SSE Endpoint Test');
  console.log('═══════════════════════════════════════════════════════');

  // Test local
  try {
    await testSSE('http://localhost:3001/api/create');
  } catch (e) {
    console.error('Local test failed:', e.message);
  }

  console.log('\n═══════════════════════════════════════════════════════\n');

  // Test production
  try {
    await testSSE('https://neuronix-autonomous-dev.vercel.app/api/create');
  } catch (e) {
    console.error('Production test failed:', e.message);
  }
})();
