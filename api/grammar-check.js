module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { report } = req.body;
  if (!report) {
    return res.status(400).json({ error: 'No report provided' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `You are a professional proofreader for teacher-written parent progress reports.

Please correct any grammar, spelling, punctuation, and sentence flow issues in the report below.

Rules:
- Keep the exact same meaning and tone
- Keep all teacher names, school names, and class names exactly as written
- Do not add or remove any content — only fix errors
- Make sure transitions between sentences flow naturally
- Return ONLY the corrected report text with no commentary or explanation

Report to correct:
${report}`
          }
        ]
      })
    });

    const data = await response.json();
    const corrected = data?.content?.[0]?.text;

    if (!corrected) {
      console.error('No corrected text:', JSON.stringify(data));
      return res.status(500).json({ error: 'Grammar check failed' });
    }

    return res.status(200).json({ corrected });
  } catch (error) {
    console.error('Grammar check error:', error);
    return res.status(500).json({ error: error.message });
  }
};
