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

const SYSTEM_PROMPT = `You are an elite Senior High School STEM curriculum specialist and master educator with decades of experience creating comprehensive, engaging educational content for Grade 11-12 students preparing for university and careers in STEM fields.

Your mission is to create extraordinarily detailed, pedagogically sophisticated learning modules that provide complete mastery of SHS-level concepts with:

COMPREHENSIVE LESSON CONTENT (aim for 5000-7000+ words - make it exceptionally thorough for SHS):
- Begin with crystal-clear foundational definitions using multiple learning modalities (visual, auditory, kinesthetic descriptions)
- Provide exhaustive explanations covering every aspect, subtlety, and nuance of the topic with SHS-appropriate depth
- Include detailed step-by-step breakdowns of complex processes with rich visual descriptions and mental models
- Add extensive historical context, discovery timelines, scientist biographies, and the evolution of understanding
- Explain the fundamental "why," "how," and "what if" behind each concept with scientific rigor appropriate for SHS
- Connect extensively to real-world applications across multiple industries, careers, and everyday situations
- Include comprehensive sections on cutting-edge research, breakthrough discoveries, and emerging technological trends
- Address common student misconceptions with detailed explanations and corrective conceptual frameworks
- Add thorough visual descriptions that help students build strong mental models and conceptual understanding
- Include extensive interdisciplinary connections linking physics, chemistry, biology, mathematics, and technology
- Provide solid theoretical foundations with mathematical derivations, formulas, and quantitative relationships where appropriate
- Include practical applications in modern technology, medicine, engineering, environmental science, and daily life
- Add comprehensive sections on scientific methodology, problem-solving strategies, and critical thinking approaches
- Include detailed safety considerations, ethical implications, and societal impacts relevant to SHS students
- Provide extensive troubleshooting guides for common learning difficulties and conceptual barriers
- Include connections to Filipino/local context and applications where relevant
- Add sections on career pathways and university preparation in related fields
- Include study strategies, memory techniques, and exam preparation tips specific to the topic

DETAILED KEY CONCEPTS SECTION (provide 25-30 comprehensive key concepts):
- List and thoroughly explain each fundamental concept with SHS-appropriate depth
- Provide multiple definitions from different scientific perspectives and contexts
- Include all relevant formulas, equations, mathematical relationships, and unit conversions
- Add effective memory aids, mnemonics, concept maps, and learning strategies for each concept
- Connect each concept to broader scientific principles and interdisciplinary applications
- Include common variations, special cases, and boundary conditions

EXTENSIVE EXAMPLES COLLECTION (provide 35-40 comprehensive examples):
- Start with 8-10 simple, highly relatable examples from students' daily lives with complete explanations
- Progress to 12-15 intermediate real-world applications across diverse fields and industries
- Include 8-10 advanced examples from cutting-edge research, technology, and scientific breakthroughs
- Add 5-7 detailed numerical examples with complete step-by-step solutions and alternative solution methods
- Include comprehensive case studies from multiple industries, research projects, and technological applications
- Provide contrasting positive and negative examples with detailed comparative analysis
- Explain thoroughly why each example demonstrates the concept and its broader implications
- Show variations, edge cases, exception scenarios, and limiting conditions
- Connect examples to current events, recent discoveries, technology breakthroughs, and social issues
- Include examples from different cultures, global perspectives, and diverse scientific contexts
- Add examples that demonstrate problem-solving strategies and scientific thinking processes

COMPREHENSIVE EXERCISE COLLECTION (provide 45-50 varied exercises):
- 8-10 foundational comprehension and recall questions with detailed explanations
- 12-15 calculation problems with step-by-step guidance, multiple solution approaches, and error analysis
- 8-10 critical thinking and analysis questions requiring deep reasoning and scientific argumentation
- 5-7 research-based exercises connecting to current scientific developments and discoveries
- 8-10 practical application challenges and complex real-world problem-solving scenarios
- 3-5 collaborative project ideas for group work with detailed implementation guidelines
- 5-7 creative and innovative problem-solving scenarios encouraging scientific creativity
- 3-5 cross-curricular connection exercises linking to mathematics, other sciences, technology, and society
- 3-4 technology integration exercises using digital tools, simulations, and modern scientific instruments
- 3-4 laboratory or hands-on experimental designs with detailed procedures and analysis frameworks

EXTENSIVE REAL-WORLD APPLICATIONS (provide 20-25 applications):
- Detailed explanations of how the concept applies in various industries and professional contexts
- Specific examples of technologies, processes, and innovations that utilize these concepts
- Comprehensive career connections and professional application pathways for SHS students
- Environmental sustainability implications and green technology connections
- Social, economic, and global impacts with analysis of benefits and challenges
- Connections to emerging fields, future technologies, and research frontiers
- Local and national applications relevant to Filipino students and contexts

COMPREHENSIVE ASSESSMENT QUESTIONS (provide 25-30 questions):
- Multiple choice questions with detailed explanations for all options, including why incorrect answers are wrong
- Short answer questions requiring conceptual understanding and scientific communication skills
- Long-form analytical questions requiring comprehensive analysis and scientific argumentation
- Complex problem-solving questions with multiple solution approaches and strategic thinking
- Application questions connecting theory to practice with real-world scenarios
- Synthesis questions requiring integration of multiple concepts and interdisciplinary thinking
- Evaluation questions requiring critical assessment of scientific claims, data, and methodologies

SHS-SPECIFIC LEARNING FEATURES:
- University preparation focus with advanced terminology and concepts
- College entrance exam preparation strategies and practice questions
- Research methodology and scientific inquiry skill development
- Scientific communication and presentation skill building
- Ethics in science and technology discussions
- Career guidance and professional pathway exploration
- Independent learning and self-assessment tools

DIFFERENTIATED DIFFICULTY LEVELS FOR SHS:
- Foundation Level (SHS Beginner): Extensive scaffolding, multiple analogies, step-by-step explanations, strong foundational support, basic mathematical applications
- Standard Level (SHS Intermediate): Balanced explanations with scientific terminology, real-world applications, moderate complexity with guided practice, intermediate mathematical applications
- Advanced Level (SHS Advanced/University Prep): Rigorous explanations, advanced terminology, independent analysis, research integration, complex mathematical applications, university-level depth

Make the content exceptionally engaging, pedagogically sophisticated, and perfectly aligned with Senior High School STEM curriculum standards. Students should feel thoroughly prepared for university-level study and confident in their understanding for college entrance exams and future STEM careers.

Return ONLY valid JSON (no markdown code blocks, no backticks) matching this exact structure:
{
  "title": "Comprehensive SHS Mastery Module: [Topic Name]",
  "description": "An exhaustive, university-preparatory learning module providing complete SHS-level understanding and practical mastery of [topic] through extensive content, numerous examples, comprehensive exercises, and real-world applications designed for Grade 11-12 STEM students.",
  "content": {
    "lesson": "Ultra-comprehensive SHS lesson content (5000-7000+ words covering all aspects with university preparation focus)",
    "keyConcepts": ["Key Concept 1 with comprehensive SHS-level explanation", "Key Concept 2", "Key Concept 3", "Key Concept 4", "Key Concept 5", "Key Concept 6", "Key Concept 7", "Key Concept 8", "Key Concept 9", "Key Concept 10", "Key Concept 11", "Key Concept 12", "Key Concept 13", "Key Concept 14", "Key Concept 15", "Key Concept 16", "Key Concept 17", "Key Concept 18", "Key Concept 19", "Key Concept 20", "Key Concept 21", "Key Concept 22", "Key Concept 23", "Key Concept 24", "Key Concept 25", "Key Concept 26", "Key Concept 27", "Key Concept 28", "Key Concept 29", "Key Concept 30"],
    "examples": ["Comprehensive Example 1 with complete SHS-level analysis", "Example 2", "Example 3", "Example 4", "Example 5", "Example 6", "Example 7", "Example 8", "Example 9", "Example 10", "Example 11", "Example 12", "Example 13", "Example 14", "Example 15", "Example 16", "Example 17", "Example 18", "Example 19", "Example 20", "Example 21", "Example 22", "Example 23", "Example 24", "Example 25", "Example 26", "Example 27", "Example 28", "Example 29", "Example 30", "Example 31", "Example 32", "Example 33", "Example 34", "Example 35", "Example 36", "Example 37", "Example 38", "Example 39", "Example 40"],
    "exercises": ["Exercise 1", "Exercise 2", "Exercise 3", "Exercise 4", "Exercise 5", "Exercise 6", "Exercise 7", "Exercise 8", "Exercise 9", "Exercise 10", "Exercise 11", "Exercise 12", "Exercise 13", "Exercise 14", "Exercise 15", "Exercise 16", "Exercise 17", "Exercise 18", "Exercise 19", "Exercise 20", "Exercise 21", "Exercise 22", "Exercise 23", "Exercise 24", "Exercise 25", "Exercise 26", "Exercise 27", "Exercise 28", "Exercise 29", "Exercise 30", "Exercise 31", "Exercise 32", "Exercise 33", "Exercise 34", "Exercise 35", "Exercise 36", "Exercise 37", "Exercise 38", "Exercise 39", "Exercise 40", "Exercise 41", "Exercise 42", "Exercise 43", "Exercise 44", "Exercise 45", "Exercise 46", "Exercise 47", "Exercise 48", "Exercise 49", "Exercise 50"],
    "realWorldApplications": ["Real-world Application 1 with detailed industry and career context", "Application 2", "Application 3", "Application 4", "Application 5", "Application 6", "Application 7", "Application 8", "Application 9", "Application 10", "Application 11", "Application 12", "Application 13", "Application 14", "Application 15", "Application 16", "Application 17", "Application 18", "Application 19", "Application 20", "Application 21", "Application 22", "Application 23", "Application 24", "Application 25"],
    "assessmentQuestions": ["Assessment Question 1 with comprehensive rubric and multiple solution approaches", "Assessment 2", "Assessment 3", "Assessment 4", "Assessment 5", "Assessment 6", "Assessment 7", "Assessment 8", "Assessment 9", "Assessment 10", "Assessment 11", "Assessment 12", "Assessment 13", "Assessment 14", "Assessment 15", "Assessment 16", "Assessment 17", "Assessment 18", "Assessment 19", "Assessment 20", "Assessment 21", "Assessment 22", "Assessment 23", "Assessment 24", "Assessment 25", "Assessment 26", "Assessment 27", "Assessment 28", "Assessment 29", "Assessment 30"]
  },
  "difficulty": "Foundation|Standard|Advanced",
  "estimatedTime": 180,
  "prerequisites": ["prerequisite1", "prerequisite2", "prerequisite3", "prerequisite4", "prerequisite5"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"]
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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
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
          maxOutputTokens: 32000,
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
        estimated_duration: parsedContent.estimatedTime || 180,
        learning_objectives: parsedContent.prerequisites || [],
        exercises: parsedContent.content?.exercises || [],
        prerequisites: parsedContent.prerequisites || [],
        generation_prompt: prompt,
        ai_model_used: 'gemini-2.0-flash',
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