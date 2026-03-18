import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const getOpenAI = (): OpenAI => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set in environment variables');
  return new OpenAI({ apiKey });
};

export const generateResumeSummary = async (data: {
  name: string;
  role: string;
  skills: string[];
  experience: string;
}): Promise<string> => {
  const prompt = `Write a professional resume summary for ${data.name}, a ${data.role} with skills in ${data.skills.join(', ')}. Experience: ${data.experience}. Keep it 3-4 sentences, ATS-friendly, and impactful.`;

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() || '';
};

export const improveSection = async (section: string, content: string): Promise<string> => {
  const prompt = `Improve this resume ${section} section to be more impactful, professional, and ATS-friendly. Use strong action verbs. Return only the improved text:\n\n${content}`;

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() || '';
};

export const makeATSFriendly = async (content: string): Promise<string> => {
  const prompt = `Rewrite this resume content to be highly ATS (Applicant Tracking System) friendly. Include relevant keywords, use standard section headings, and ensure proper formatting. Return only the improved content:\n\n${content}`;

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
    temperature: 0.6,
  });

  return response.choices[0]?.message?.content?.trim() || '';
};

export const addActionWords = async (content: string): Promise<string> => {
  const prompt = `Rewrite this resume content replacing weak verbs with strong action words (e.g., Led, Developed, Achieved, Implemented, Optimized). Return only the improved content:\n\n${content}`;

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content?.trim() || '';
};

export const calculateATSScore = async (resumeText: string): Promise<{ score: number; suggestions: string[] }> => {
  const prompt = `Analyze this resume for ATS compatibility and return a JSON object with:
- score: number from 0-100
- suggestions: array of 3-5 specific improvement suggestions

Resume:
${resumeText}

Return only valid JSON.`;

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
    temperature: 0.5,
  });

  try {
    const content = response.choices[0]?.message?.content?.trim() || '{}';
    return JSON.parse(content);
  } catch {
    return { score: 70, suggestions: ['Add more relevant keywords', 'Use standard section headings', 'Quantify achievements'] };
  }
};

export const generateFullResume = async (jobTitle: string, skills: string[], yearsExp: number): Promise<object> => {
  const prompt = `Generate a complete professional resume JSON for a ${jobTitle} with ${yearsExp} years of experience and skills: ${skills.join(', ')}.

Return a JSON object with these fields:
{
  "summary": "professional summary",
  "experience": [{"company": "", "position": "", "startDate": "", "endDate": "", "description": ""}],
  "skills": ["skill1", "skill2"],
  "education": [{"institution": "", "degree": "", "field": "", "startDate": "", "endDate": ""}]
}

Return only valid JSON.`;

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 800,
    temperature: 0.7,
  });

  try {
    const content = response.choices[0]?.message?.content?.trim() || '{}';
    return JSON.parse(content);
  } catch {
    return {};
  }
};
