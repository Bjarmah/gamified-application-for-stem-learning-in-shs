import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are an AI tutor for Senior High School STEM students. Your task is to generate curriculum-aligned educational content that adapts to the student's difficulty level. The subject matter is based on the topic provided.

Constraints:

Difficulty levels:
- Beginner: simple language, analogies, step-by-step explanations, short examples.
- Intermediate: more detailed explanations, scientific terminology, real-world applications, moderate exercises.
- Advanced: in-depth explanations, advanced terminology, critical thinking questions, higher-order exercises.

Content format: JSON object with fields:
{
  "title": "Module Title",
  "description": "Brief module summary", 
  "content": {
    "lesson": "Main lesson explanation with detailed content",
    "examples": ["Example 1 with detailed explanation", "Example 2 with detailed explanation"],
    "exercises": ["Exercise 1 with clear instructions", "Exercise 2 with clear instructions"],
    "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
    "realWorldApplications": ["Application 1", "Application 2"]
  },
  "difficulty": "Beginner | Intermediate | Advanced",
  "estimatedTime": 30,
  "prerequisites": ["prerequisite1", "prerequisite2"],
  "tags": ["tag1", "tag2", "tag3"]
}

The generated module must match the Senior High School STEM curriculum for Ghana and the Philippines.
Make the explanation engaging, clear, and student-friendly, while maintaining accuracy.
Your role is to always produce content instantly and at the right difficulty level so students learn effectively.`;

serve(async (req) => {
  console.log('Generate adaptive content function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      topic, 
      subject_id, 
      user_id, 
      difficulty, 
      context 
    } = await req.json();

    console.log('Request data:', { topic, subject_id, user_id, difficulty });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!topic || !subject_id || !user_id) {
      throw new Error('Missing required parameters: topic, subject_id, user_id');
    }

    // Create content generation request record
    const { data: requestData, error: requestError } = await supabase
      .from('content_generation_requests')
      .insert({
        user_id,
        topic,
        subject_id,
        difficulty_level: difficulty || 'intermediate',
        learning_context: context || {},
        generation_status: 'processing'
      })
      .select()
      .single();

    if (requestError) {
      console.error('Error creating request record:', requestError);
      throw new Error('Failed to create content generation request');
    }

    const startTime = Date.now();

    // Generate AI content
    const prompt = `Generate a comprehensive STEM learning module for the topic: "${topic}".
    
    Target difficulty level: ${difficulty || 'intermediate'}
    
    Context: The student is studying ${topic} as part of their Senior High School STEM education. 
    ${context?.currentPerformance ? `Current performance: ${context.currentPerformance}` : ''}
    ${context?.weakAreas ? `Areas needing focus: ${context.weakAreas.join(', ')}` : ''}
    
    Please provide detailed, curriculum-aligned content that matches the specified difficulty level.`;

    console.log('Calling OpenAI with prompt:', prompt.substring(0, 200) + '...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const aiResponse = await response.json();
    const generatedContent = aiResponse.choices[0].message.content;

    console.log('OpenAI response received, length:', generatedContent.length);

    // Parse JSON content
    let parsedContent;
    try {
      parsedContent = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback: create structured content
      parsedContent = {
        title: topic,
        description: `Learn about ${topic}`,
        content: {
          lesson: generatedContent,
          examples: [],
          exercises: [],
          keyPoints: [],
          realWorldApplications: []
        },
        difficulty: difficulty || 'intermediate',
        estimatedTime: 30,
        prerequisites: [],
        tags: [topic.toLowerCase()]
      };
    }

    const processingTime = Date.now() - startTime;

    // Save AI-generated module
    const { data: moduleData, error: moduleError } = await supabase
      .from('ai_generated_modules')
      .insert({
        title: parsedContent.title,
        description: parsedContent.description,
        content: JSON.stringify(parsedContent.content),
        subject_id,
        target_user_id: user_id,
        difficulty_level: parsedContent.difficulty || difficulty || 'intermediate',
        estimated_duration: parsedContent.estimatedTime || 30,
        learning_objectives: parsedContent.prerequisites || [],
        exercises: parsedContent.content?.exercises || [],
        prerequisites: parsedContent.prerequisites || [],
        generation_prompt: prompt,
        ai_model_used: 'gpt-4.1-2025-04-14',
        user_analytics_snapshot: context || {}
      })
      .select()
      .single();

    if (moduleError) {
      console.error('Error saving AI module:', moduleError);
      throw new Error('Failed to save generated module');
    }

    // Update request record
    await supabase
      .from('content_generation_requests')
      .update({
        generation_status: 'completed',
        completed_at: new Date().toISOString(),
        processing_time_ms: processingTime,
        generated_module_id: moduleData.id
      })
      .eq('id', requestData.id);

    console.log('Successfully generated and saved AI module:', moduleData.id);

    return new Response(JSON.stringify({
      success: true,
      module: {
        id: moduleData.id,
        title: parsedContent.title,
        description: parsedContent.description,
        content: parsedContent.content,
        difficulty: parsedContent.difficulty,
        estimatedTime: parsedContent.estimatedTime,
        prerequisites: parsedContent.prerequisites,
        tags: parsedContent.tags || [],
        generated_at: moduleData.created_at
      },
      processing_time: processingTime
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-adaptive-content function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});