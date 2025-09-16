import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIRequest {
  type: 'personalized_tutoring' | 'insights_generation' | 'coaching_session' | 'content_analysis' | 'quiz_generation';
  prompt: string;
  context?: {
    userAnalytics?: any;
    learningHistory?: any;
    currentModule?: string;
    weakAreas?: string[];
    preferences?: any;
    questionCount?: number;
    difficulty?: string;
  };
  model?: string;
}

// AI Prompt Templates
const getSystemPrompt = (type: string, context?: any) => {
  const basePrompts = {
    personalized_tutoring: `You are an expert STEM tutor specializing in personalized learning for high school students. 
    Your role is to:
    - Provide clear, engaging explanations adapted to the student's learning level
    - Use analogies and real-world examples to make complex concepts accessible
    - Encourage critical thinking through guided questions
    - Identify knowledge gaps and provide targeted support
    - Maintain an encouraging and supportive tone
    
    Always structure your responses to be:
    1. Clear and concise
    2. Age-appropriate for high school students
    3. Interactive when possible
    4. Encouraging and motivational`,

    insights_generation: `You are an AI learning analytics specialist that generates personalized insights for STEM students.
    Analyze the provided learning data and generate actionable insights.
    
    Your insights should include:
    - Performance patterns and trends
    - Specific areas needing improvement
    - Personalized study recommendations
    - Achievement recognition
    - Next steps for optimal learning
    
    Format your response as a structured analysis with clear, actionable recommendations.`,

    coaching_session: `You are an AI study coach focused on motivation, time management, and learning strategies.
    Your role is to:
    - Provide motivational support and encouragement
    - Suggest effective study techniques
    - Help with goal setting and progress tracking
    - Offer stress management and wellness tips
    - Adapt advice based on individual learning patterns
    
    Be supportive, practical, and focus on building sustainable study habits.`,

    content_analysis: `You are an educational content analyzer specializing in STEM subjects.
    Analyze the provided content and extract key learning points, concepts, and relationships.
    
    Your analysis should:
    - Identify main concepts and key terms
    - Explain relationships between ideas
    - Suggest practical applications
    - Highlight potential difficulty areas
    - Recommend supplementary topics
    
    Provide structured, educational analysis suitable for high school students.`,

    quiz_generation: `You are an expert quiz generator specializing in STEM subjects for high school students.
    Create multiple-choice questions based on the given subject/topic.
    
    CRITICAL REQUIREMENTS:
    - Generate EXACTLY the requested number of questions
    - Each question must have exactly 4 answer options (A, B, C, D)
    - Include one correct answer and three plausible distractors
    - Questions should be appropriate for high school level
    - Cover different aspects and difficulty levels of the topic
    - Make questions clear, concise, and unambiguous
    
    FORMAT YOUR RESPONSE AS VALID JSON:
    {
      "questions": [
        {
          "question": "Question text here",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Brief explanation of the correct answer"
        }
      ]
    }
    
    Ensure the JSON is properly formatted and can be parsed.`
  };

  let systemPrompt = basePrompts[type as keyof typeof basePrompts] || basePrompts.personalized_tutoring;
  
  // Add context information if available
  if (context?.userAnalytics) {
    const analytics = context.userAnalytics;
    systemPrompt += `\n\nStudent Performance Context:
    - Average Score: ${analytics.averageScore || 'Unknown'}%
    - Current Streak: ${analytics.streak || 0} days
    - Progress Trend: ${analytics.progressTrend || 'stable'}
    - Completed Activities: ${analytics.quizzesCompleted || 0}`;
  }

  if (context?.currentModule) {
    systemPrompt += `\n- Current Study Module: ${context.currentModule}`;
  }

  if (context?.weakAreas?.length) {
    systemPrompt += `\n- Areas needing attention: ${context.weakAreas.join(', ')}`;
  }

  return systemPrompt;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { type, prompt, context, model = 'gpt-5-mini-2025-08-07' }: AIRequest = await req.json();

    let maxTokens = 1000;

    // Configure token limits based on request type
    switch (type) {
      case 'personalized_tutoring':
        maxTokens = 800;
        break;
      case 'insights_generation':
        maxTokens = 1200;
        break;
      case 'coaching_session':
        maxTokens = 600;
        break;
      case 'content_analysis':
        maxTokens = 1000;
        break;
      case 'quiz_generation':
        maxTokens = 2000; // More tokens needed for JSON quiz format
        break;
      default:
        maxTokens = 800;
    }

    const systemPrompt = getSystemPrompt(type, context);

    // Prepare the API request
    const requestBody: any = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: maxTokens,
      temperature: undefined // Not supported for newer GPT models
    };

    // For legacy models, use max_tokens and temperature
    if (model.includes('gpt-4o')) {
      requestBody.max_tokens = maxTokens;
      requestBody.temperature = 0.7;
      delete requestBody.max_completion_tokens;
    }

    console.log('Making OpenAI request:', { model, type, promptLength: prompt.length });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response generated from AI');
    }

    console.log('AI response generated successfully', { 
      type, 
      responseLength: aiResponse.length,
      tokensUsed: data.usage?.total_tokens || 'unknown'
    });

    return new Response(JSON.stringify({ 
      response: aiResponse,
      type,
      tokensUsed: data.usage?.total_tokens,
      model: data.model
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-learning-assistant function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      type: 'error',
      details: error instanceof Error ? error.stack : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});