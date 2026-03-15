const JUDGE0_BASE_URL = process.env.JUDGE0_BASE_URL || 'https://judge0-ce.p.rapidapi.com';

const LANGUAGE_IDS = {
  python: 71,
  java: 62,
};

function validatePayload(body) {
  const { language, code } = body;

  if (!language || !LANGUAGE_IDS[language]) {
    return 'Invalid language. Allowed values: python, java';
  }

  if (!code || typeof code !== 'string') {
    return 'Code is required';
  }

  if (code.length > 20000) {
    return 'Code is too large. Max 20,000 characters';
  }

  return null;
}

async function executeCode(req, res) {
  try {
    const validationError = validatePayload(req.body || {});
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    const { language, code, stdin = '' } = req.body;

    if (!process.env.JUDGE0_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Compiler API is not configured (missing JUDGE0_API_KEY)',
      });
    }

    const submitResponse = await fetch(`${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY,
        'X-RapidAPI-Host': new URL(JUDGE0_BASE_URL).host,
      },
      body: JSON.stringify({
        source_code: code,
        language_id: LANGUAGE_IDS[language],
        stdin,
        cpu_time_limit: 2,
        memory_limit: 128000,
      }),
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      return res.status(502).json({
        success: false,
        message: `Execution provider error: ${errorText}`,
      });
    }

    const result = await submitResponse.json();

    return res.status(200).json({
      success: true,
      data: {
        status: result.status?.description || 'Processed',
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        compileOutput: result.compile_output || '',
        message: result.message || '',
      },
    });
  } catch (error) {
    console.error('Compiler execute error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to execute code right now',
    });
  }
}

module.exports = {
  executeCode,
};
