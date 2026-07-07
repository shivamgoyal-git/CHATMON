const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("ERROR: GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

async function test() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
      })
    });
    const data = await response.json();
    console.log("STATUS:", response.status);
    console.log("DATA:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("ERROR:", err);
  }
}

test();
