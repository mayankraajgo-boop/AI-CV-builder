import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const getOpenAI = (): OpenAI => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  return new OpenAI({ apiKey });
};

export interface ATSResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  weakSections: string[];
  strongSections: string[];
  suggestions: string[];
  rewrittenBullets: { original: string; improved: string }[];
  sectionFeedback: { section: string; score: number; feedback: string }[];
}

// ── Full ATS analysis (resume text only, no JD required) ─────────────────────
export const fullATSAnalysis = async (resumeText: string, jobDescription?: string): Promise<ATSResult> => {
  const jdPart = jobDescription
    ? `\nJob Description:\n${jobDescription.slice(0, 1500)}`
    : '';

  const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume${jobDescription ? ' against the job description' : ''} and return a JSON object.

Resume:
${resumeText.slice(0, 3000)}${jdPart}

Return ONLY valid JSON with this exact structure:
{
  "score": <number 0-100>,
  "matchedKeywords": [<up to 15 keywords found in resume>],
  "missingKeywords": [<up to 15 important keywords missing>],
  "weakSections": [<section names that are weak or missing>],
  "strongSections": [<section names that are strong>],
  "suggestions": [<5-7 specific actionable improvement tips>],
  "rewrittenBullets": [
    {"original": "<weak bullet from resume>", "improved": "<stronger rewrite>"},
    {"original": "<weak bullet from resume>", "improved": "<stronger rewrite>"}
  ],
  "sectionFeedback": [
    {"section": "Summary", "score": <0-100>, "feedback": "<specific feedback>"},
    {"section": "Experience", "score": <0-100>, "feedback": "<specific feedback>"},
    {"section": "Skills", "score": <0-100>, "feedback": "<specific feedback>"},
    {"section": "Education", "score": <0-100>, "feedback": "<specific feedback>"}
  ]
}`;

  try {
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1200,
      temperature: 0.4,
    });

    const raw = response.choices[0]?.message?.content?.trim() || '{}';
    // Strip markdown code fences if present
    const clean = raw.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(clean) as ATSResult;
  } catch {
    return fallbackATS(resumeText);
  }
};

// Client-side fallback when OpenAI is unavailable
function fallbackATS(resumeText: string): ATSResult {
  const text = resumeText.toLowerCase();
  const commonKeywords = ['leadership','teamwork','communication','problem-solving','python','javascript','react','node','sql','agile','scrum','management','analysis','development','design'];
  const matched = commonKeywords.filter(k => text.includes(k));
  const missing = commonKeywords.filter(k => !text.includes(k)).slice(0, 8);
  const score = Math.min(40 + matched.length * 4, 85);
  return {
    score,
    matchedKeywords: matched,
    missingKeywords: missing,
    weakSections: ['Summary', 'Achievements'],
    strongSections: ['Experience'],
    suggestions: [
      'Add quantifiable achievements (e.g., "Increased sales by 30%")',
      'Include a professional summary at the top',
      'Use strong action verbs to start bullet points',
      'Add relevant technical skills section',
      'Ensure consistent date formatting',
    ],
    rewrittenBullets: [
      { original: 'Worked on projects', improved: 'Led cross-functional team of 5 to deliver 3 projects on time, reducing costs by 20%' },
      { original: 'Helped customers', improved: 'Resolved 50+ customer inquiries daily, achieving 98% satisfaction rating' },
    ],
    sectionFeedback: [
      { section: 'Summary', score: 50, feedback: 'Add a targeted professional summary highlighting your key value proposition' },
      { section: 'Experience', score: score, feedback: 'Good experience section — add more quantifiable metrics' },
      { section: 'Skills', score: 60, feedback: 'Include both technical and soft skills relevant to your target role' },
      { section: 'Education', score: 70, feedback: 'Education section looks good' },
    ],
  };
}

// ── Other AI services ─────────────────────────────────────────────────────────
export const generateResumeSummary = async (data: { name: string; role: string; skills: string[]; experience: string }): Promise<string> => {
  const prompt = `Write a professional resume summary for ${data.name}, a ${data.role} with skills in ${data.skills.join(', ')}. Experience: ${data.experience}. Keep it 3-4 sentences, ATS-friendly, and impactful.`;
  const response = await getOpenAI().chat.completions.create({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }], max_tokens: 200, temperature: 0.7 });
  return response.choices[0]?.message?.content?.trim() || '';
};

export const improveSection = async (section: string, content: string): Promise<string> => {
  const prompt = `Improve this resume ${section} section to be more impactful, professional, and ATS-friendly. Use strong action verbs. Return only the improved text:\n\n${content}`;
  const response = await getOpenAI().chat.completions.create({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }], max_tokens: 400, temperature: 0.7 });
  return response.choices[0]?.message?.content?.trim() || '';
};

export const generateFullResume = async (jobTitle: string, skills: string[], yearsExp: number): Promise<object> => {
  const prompt = `Generate a complete professional resume JSON for a ${jobTitle} with ${yearsExp} years of experience and skills: ${skills.join(', ')}. Return JSON with: summary, experience[], skills[], education[]. Return only valid JSON.`;
  const response = await getOpenAI().chat.completions.create({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: prompt }], max_tokens: 800, temperature: 0.7 });
  try { return JSON.parse(response.choices[0]?.message?.content?.trim() || '{}'); } catch { return {}; }
};
