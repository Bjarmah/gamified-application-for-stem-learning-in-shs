import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a world-class STEM educator with PhD-level expertise creating comprehensive, detailed learning modules for Senior High School students. 

Your mission is to create rich, extensive educational content that thoroughly explains concepts with:

LESSON CONTENT (aim for 1500-2000 words):
- Start with clear definitions and fundamental principles
- Provide detailed explanations with multiple perspectives
- Include step-by-step breakdowns of complex processes
- Add historical context and discovery stories
- Explain the "why" behind each concept, not just the "what"
- Connect to real-world applications and current research
- Include common misconceptions and how to avoid them
- Add visual descriptions that help students imagine concepts
- Include interdisciplinary connections
- Provide deeper theoretical foundations

EXAMPLES (provide 8-12 detailed examples):
- Start with simple, relatable examples from daily life
- Progress to more complex, real-world applications
- Include numerical examples with step-by-step solutions
- Add case studies from different industries
- Include both positive and negative examples
- Explain why each example demonstrates the concept
- Show variations and edge cases
- Connect examples to current events or technology

EXERCISES (provide 12-15 varied exercises):
- Begin with basic comprehension questions
- Include calculation problems with clear steps
- Add critical thinking and analysis questions
- Include research-based exercises
- Add practical application challenges
- Include collaborative project ideas
- Mix different difficulty levels within the set
- Include both theoretical and hands-on activities
- Add creative problem-solving scenarios
- Include cross-curricular connections

DIFFICULTY LEVELS:
- Beginner: Simple language, analogies, step-by-step explanations, foundational concepts
- Intermediate: More detailed explanations, scientific terminology, real-world applications, moderate complexity
- Advanced: In-depth explanations, advanced terminology, critical thinking, higher-order analysis

Make the content engaging, thorough, and pedagogically sound. Students should feel they've received a complete university-level education on the topic.

Return ONLY valid JSON (no markdown code blocks, no backticks) matching this exact structure:
{
  "title": "Engaging Module Title",
  "description": "Comprehensive 2-3 sentence module summary",
  "content": {
    "lesson": "Extensive detailed lesson content (1500-2000 words)",
    "examples": ["Detailed Example 1 with full explanation", "Detailed Example 2", "Example 3", "Example 4", "Example 5", "Example 6", "Example 7", "Example 8", "Example 9", "Example 10", "Example 11", "Example 12"],
    "exercises": ["Exercise 1", "Exercise 2", "Exercise 3", "Exercise 4", "Exercise 5", "Exercise 6", "Exercise 7", "Exercise 8", "Exercise 9", "Exercise 10", "Exercise 11", "Exercise 12", "Exercise 13", "Exercise 14", "Exercise 15"]
  },
  "difficulty": "Beginner|Intermediate|Advanced",
  "estimatedTime": 45,
  "prerequisites": ["prerequisite1", "prerequisite2"],
  "tags": ["tag1", "tag2", "tag3"]
}

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

    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
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
    ${context?.currentPerformance ? 'Current performance: ' + context.currentPerformance : ''}
    ${context?.weakAreas ? 'Areas needing focus: ' + context.weakAreas.join(', ') : ''}
    
    Please provide detailed, curriculum-aligned content that matches the specified difficulty level.`;

    console.log('Calling Gemini with prompt:', prompt.substring(0, 200) + '...');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${SYSTEM_PROMPT}\n\n${prompt}`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 8000,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
    }

    const aiResponse = await response.json();
    const generatedContent = aiResponse.candidates[0].content.parts[0].text;

    console.log('Gemini response received, length:', generatedContent.length);

    // Parse JSON content with improved error handling
    let parsedContent;
    try {
      // Clean the generated content by removing markdown code blocks if present
      let cleanedContent = generatedContent.trim();
      
      // Remove markdown code blocks (```json and ```)
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      parsedContent = JSON.parse(cleanedContent);
      console.log('Successfully parsed AI response as JSON');
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.log('Raw content:', generatedContent.substring(0, 500));
      
      // Fallback: create structured content
      parsedContent = {
        title: `Comprehensive ${topic} Module`,
        description: `An extensive learning module covering ${topic} with detailed explanations, multiple examples, and varied exercises.`,
        content: {
          lesson: generatedContent,
          examples: [
            `Basic example demonstrating ${topic} fundamentals`,
            `Real-world application of ${topic}`,
            `Advanced case study in ${topic}`
          ],
          exercises: [
            `Define the key concepts in ${topic}`,
            `Solve a basic problem involving ${topic}`,
            `Analyze a real-world scenario using ${topic} principles`
          ]
        },
        difficulty: difficulty || 'intermediate',
        estimatedTime: 45,
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
        estimated_duration: parsedContent.estimatedTime || 45,
        learning_objectives: parsedContent.prerequisites || [],
        exercises: parsedContent.content?.exercises || [],
        prerequisites: parsedContent.prerequisites || [],
        generation_prompt: prompt,
        ai_model_used: 'gemini-1.5-flash',
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