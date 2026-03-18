export default async function handler(req, res) {
res.setHeader(‘Access-Control-Allow-Origin’, ‘*’);
res.setHeader(‘Access-Control-Allow-Methods’, ‘POST, OPTIONS’);
res.setHeader(‘Access-Control-Allow-Headers’, ‘Content-Type’);

if (req.method === ‘OPTIONS’) return res.status(200).end();
if (req.method !== ‘POST’) return res.status(405).json({ error: ‘Method not allowed’ });

const { report, targetLang, langName } = req.body || {};

if (!report || !targetLang || !langName) {
return res.status(400).json({ error: ‘Missing required fields’ });
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
return res.status(500).json({ error: ‘API key not configured’ });
}

try {
const response = await fetch(‘https://api.anthropic.com/v1/messages’, {
method: ‘POST’,
headers: {
‘Content-Type’: ‘application/json’,
‘x-api-key’: apiKey,
‘anthropic-version’: ‘2023-06-01’,
},
body: JSON.stringify({
model: ‘claude-opus-4-6’,
max_tokens: 2000,
messages: [{
role: ‘user’,
content: `You are a professional bilingual educator. Translate the following parent progress report from English to ${langName}.

RULES:

- Translate ALL text including all prompt content
- Keep warm, professional, educational tone
- Preserve all emoji exactly
- Keep blank lines (_______________) exactly as-is
- Keep names, dates, school names unchanged
- Output ONLY the translated report, nothing else

REPORT:
${report}`
}]
})
});

```
const responseText = await response.text();

if (!response.ok) {
  console.error('Anthropic error:', response.status, responseText);
  return res.status(502).json({
    error: `API error ${response.status}: ${responseText.substring(0, 300)}`
  });
}

const data = JSON.parse(responseText);
const translated = data?.content?.[0]?.text;

if (!translated) {
  return res.status(502).json({ error: 'No translation returned' });
}

return res.status(200).json({ translated });
```

} catch (err) {
console.error(‘Translation error:’, err.message);
return res.status(500).json({ error: ’Translation failed: ’ + err.message });
}
}
