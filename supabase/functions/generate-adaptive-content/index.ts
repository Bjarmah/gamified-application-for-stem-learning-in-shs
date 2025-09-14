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

const SYSTEM_PROMPT = `You are a world-renowned STEM educator and curriculum designer with expertise in creating ultra-comprehensive, university-quality learning modules for Senior High School students. 

Your mission is to create exceptionally rich, extensive educational content that provides complete mastery of concepts with:

LESSON CONTENT (aim for 3500-5000 words - make it extremely comprehensive):
- Start with crystal-clear definitions and fundamental principles with multiple perspectives
- Provide exhaustive explanations covering all aspects and nuances of the topic
- Include detailed step-by-step breakdowns of complex processes with visual descriptions
- Add extensive historical context, discovery stories, and scientist biographies
- Explain the "why," "how," and "what if" behind each concept thoroughly
- Connect extensively to real-world applications across multiple industries
- Include detailed sections on current research, future developments, and emerging trends
- Address common misconceptions with detailed explanations of correct concepts
- Add comprehensive visual descriptions that help students imagine and understand concepts
- Include extensive interdisciplinary connections (physics-chemistry-biology-math links)
- Provide deep theoretical foundations with mathematical derivations where appropriate
- Include practical applications in technology, medicine, engineering, and daily life
- Add sections on problem-solving strategies and critical thinking approaches
- Include safety considerations and ethical implications where relevant
- Provide troubleshooting guides for common difficulties

KEY CONCEPTS SECTION (provide 15-20 key concepts):
- List and thoroughly explain each fundamental concept
- Provide multiple definitions from different perspectives
- Include formulas, equations, and mathematical relationships
- Add memory aids and mnemonics for each concept

DETAILED EXAMPLES (provide 20-25 comprehensive examples):
- Start with 5-7 simple, relatable examples from daily life with full explanations
- Progress to 8-10 intermediate real-world applications across different fields
- Include 5-7 advanced examples from cutting-edge research and technology
- Add detailed numerical examples with complete step-by-step solutions
- Include comprehensive case studies from multiple industries
- Provide both positive and negative examples with detailed analysis
- Explain thoroughly why each example demonstrates the concept
- Show variations, edge cases, and exception scenarios
- Connect examples to current events, technology breakthroughs, and social issues
- Include examples from different cultures and global perspectives

COMPREHENSIVE EXERCISES (provide 30-35 varied exercises):
- 5-7 basic comprehension and recall questions
- 8-10 calculation problems with detailed step-by-step guidance
- 5-7 critical thinking and analysis questions requiring deep reasoning
- 3-5 research-based exercises connecting to current developments
- 5-7 practical application challenges and real-world problem solving
- 2-3 collaborative project ideas for group work
- 3-5 creative and innovative problem-solving scenarios
- 2-3 cross-curricular connection exercises linking to other subjects
- 2-3 technology integration exercises using digital tools
- 2-3 laboratory or hands-on experimental designs

REAL-WORLD APPLICATIONS (provide 10-15 applications):
- Detailed explanations of how the concept applies in various industries
- Specific examples of technologies that use these concepts
- Career connections and professional applications
- Environmental and sustainability implications
- Social and economic impacts

ASSESSMENT QUESTIONS (provide 15-20 questions):
- Multiple choice questions with detailed explanations for each option
- Short answer questions requiring conceptual understanding
- Long-form questions requiring comprehensive analysis
- Problem-solving questions with multiple solution approaches
- Application questions connecting theory to practice

DIFFICULTY LEVELS:
- Beginner: Extensive use of analogies, step-by-step explanations, foundational concepts, lots of scaffolding
- Intermediate: Detailed explanations with scientific terminology, real-world applications, moderate complexity with guided practice
- Advanced: In-depth explanations, advanced terminology, critical thinking, independent analysis, research integration

Make the content exceptionally engaging, thorough, and pedagogically sophisticated. Students should feel they've received a complete graduate-level education on the topic that prepares them for advanced study and professional application.

Return ONLY valid JSON (no markdown code blocks, no backticks) matching this exact structure:
{
  "title": "Comprehensive Mastery Module: [Topic Name]",
  "description": "An exhaustive, university-quality learning module providing complete understanding and practical mastery of [topic] through extensive content, numerous examples, and comprehensive exercises.",
  "content": {
    "lesson": "Ultra-comprehensive lesson content (3500-5000 words covering all aspects)",
    "keyConcepts": ["Concept 1 with detailed explanation", "Concept 2", "Concept 3", "Concept 4", "Concept 5", "Concept 6", "Concept 7", "Concept 8", "Concept 9", "Concept 10", "Concept 11", "Concept 12", "Concept 13", "Concept 14", "Concept 15", "Concept 16", "Concept 17", "Concept 18", "Concept 19", "Concept 20"],
    "examples": ["Comprehensive Example 1 with complete analysis", "Example 2", "Example 3", "Example 4", "Example 5", "Example 6", "Example 7", "Example 8", "Example 9", "Example 10", "Example 11", "Example 12", "Example 13", "Example 14", "Example 15", "Example 16", "Example 17", "Example 18", "Example 19", "Example 20", "Example 21", "Example 22", "Example 23", "Example 24", "Example 25"],
    "exercises": ["Exercise 1", "Exercise 2", "Exercise 3", "Exercise 4", "Exercise 5", "Exercise 6", "Exercise 7", "Exercise 8", "Exercise 9", "Exercise 10", "Exercise 11", "Exercise 12", "Exercise 13", "Exercise 14", "Exercise 15", "Exercise 16", "Exercise 17", "Exercise 18", "Exercise 19", "Exercise 20", "Exercise 21", "Exercise 22", "Exercise 23", "Exercise 24", "Exercise 25", "Exercise 26", "Exercise 27", "Exercise 28", "Exercise 29", "Exercise 30", "Exercise 31", "Exercise 32", "Exercise 33", "Exercise 34", "Exercise 35"],
    "realWorldApplications": ["Application 1 with industry context", "Application 2", "Application 3", "Application 4", "Application 5", "Application 6", "Application 7", "Application 8", "Application 9", "Application 10", "Application 11", "Application 12", "Application 13", "Application 14", "Application 15"],
    "assessmentQuestions": ["Assessment 1 with detailed rubric", "Assessment 2", "Assessment 3", "Assessment 4", "Assessment 5", "Assessment 6", "Assessment 7", "Assessment 8", "Assessment 9", "Assessment 10", "Assessment 11", "Assessment 12", "Assessment 13", "Assessment 14", "Assessment 15", "Assessment 16", "Assessment 17", "Assessment 18", "Assessment 19", "Assessment 20"]
  },
  "difficulty": "Beginner|Intermediate|Advanced",
  "estimatedTime": 120,
  "prerequisites": ["prerequisite1", "prerequisite2", "prerequisite3"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

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
          maxOutputTokens: 16000,
          temperature: 0.7,
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
        estimated_duration: parsedContent.estimatedTime || 120,
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