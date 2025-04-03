import axios from 'axios';

export async function validateCustomRule(ruleText: string): Promise<{ valid: boolean; reason: string }> {
  const prompt = `
You are a strict and helpful programming standards assistant.

The following string is a user-defined coding rule that will be applied during automated code review.

Evaluate whether this rule is:
1. Written in valid and meaningful English
2. Clear and understandable
3. A reasonable and enforceable guideline for coding standards

If the rule is vague, nonsensical, or looks like random words (e.g., “abc xyz helloWOrkd”), reject it.

Respond in the following JSON format:

{
  "valid": true or false,
  "reason": "Brief explanation of your decision, be positive and helpful"
}

Rule:
"""
${ruleText}
"""
`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a strict and helpful programming standards assistant.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const jsonString = response.data.choices[0].message.content.trim();

    // Parse response from OpenAI (expected to be a JSON string)
    const result = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.error('Rule validation error:', error);
    return {
      valid: false,
      reason: 'Error while validating rule. Please try again.',
    };
  }
}