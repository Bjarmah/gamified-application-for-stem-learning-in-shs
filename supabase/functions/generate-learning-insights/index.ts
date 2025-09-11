import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, analysisType } = await req.json();
    
    if (!userId || !analysisType) {
      throw new Error('Missing required parameters: userId and analysisType');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let analyticsData;
    let prompt;

    switch (analysisType) {
      case 'learning_patterns':
        // Get learning patterns data
        const { data: patternsData } = await supabase.rpc('get_learning_time_patterns', { 
          target_user_id: userId 
        });
        
        prompt = `Analyze this student's learning patterns and provide personalized insights:
        
        Learning Time Patterns: ${JSON.stringify(patternsData)}
        
        Please provide:
        1. Peak learning times and optimal study schedule
        2. Learning consistency analysis
        3. Productivity patterns
        4. Personalized recommendations for study scheduling
        
        Format as JSON with keys: peakTimes, consistency, productivity, recommendations`;
        break;

      case 'predictive_performance':
        // Get comprehensive analytics data
        const { data: performanceData } = await supabase.rpc('get_user_analytics_data', { 
          target_user_id: userId 
        });
        
        prompt = `Analyze this student's performance data and predict future outcomes:
        
        Performance Data: ${JSON.stringify(performanceData)}
        
        Please provide:
        1. Performance trend analysis
        2. Risk assessment for upcoming challenges
        3. Predicted performance in different subjects
        4. Intervention recommendations
        
        Format as JSON with keys: trends, risks, predictions, interventions`;
        break;

      case 'knowledge_gaps':
        // Get knowledge gaps data
        const { data: gapsData } = await supabase.rpc('get_knowledge_gaps', { 
          target_user_id: userId 
        });
        
        prompt = `Analyze this student's knowledge gaps and provide targeted recommendations:
        
        Knowledge Gaps Data: ${JSON.stringify(gapsData)}
        
        Please provide:
        1. Critical knowledge gaps that need immediate attention
        2. Learning path recommendations
        3. Practice strategies for each gap
        4. Prerequisites that should be mastered first
        
        Format as JSON with keys: criticalGaps, learningPath, practiceStrategies, prerequisites`;
        break;

      case 'comprehensive_insights':
        // Get all analytics data
        const { data: allData } = await supabase.rpc('get_user_analytics_data', { 
          target_user_id: userId 
        });
        const { data: patternsAllData } = await supabase.rpc('get_learning_time_patterns', { 
          target_user_id: userId 
        });
        const { data: gapsAllData } = await supabase.rpc('get_knowledge_gaps', { 
          target_user_id: userId 
        });
        
        prompt = `Provide comprehensive learning analytics and personalized insights:
        
        Analytics Data: ${JSON.stringify(allData)}
        Learning Patterns: ${JSON.stringify(patternsAllData)}
        Knowledge Gaps: ${JSON.stringify(gapsAllData)}
        
        Please provide a comprehensive analysis including:
        1. Overall learning performance summary
        2. Strengths and areas for improvement
        3. Personalized study plan
        4. Goal recommendations
        5. Motivation and engagement strategies
        
        Format as JSON with keys: summary, strengths, improvements, studyPlan, goals, motivation`;
        break;

      default:
        throw new Error(`Unknown analysis type: ${analysisType}`);
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: `You are an advanced AI learning analytics expert with deep expertise in educational psychology, cognitive science, and personalized learning optimization.

Your mission: Analyze student learning data to provide actionable, evidence-based insights that dramatically improve learning outcomes.

ANALYSIS FRAMEWORK:
1. COGNITIVE LOAD THEORY: Assess how information processing aligns with working memory limits
2. SPACED REPETITION: Identify optimal review intervals based on forgetting curves
3. METACOGNITIVE STRATEGIES: Evaluate self-regulation and learning awareness
4. MULTIMODAL LEARNING: Recommend diverse learning approaches (visual, auditory, kinesthetic)
5. GROWTH MINDSET: Frame all feedback to promote resilience and continuous improvement

OUTPUT REQUIREMENTS:
- Provide specific, measurable, actionable recommendations
- Use positive, encouraging language that builds confidence
- Include time estimates and difficulty ratings
- Reference learning science principles where applicable
- Prioritize high-impact, low-effort interventions first
- Always respond with valid JSON format

Generate insights that are both scientifically grounded and practically implementable.` 
          },
          { role: 'user', content: prompt }
        ],
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const insights = data.choices[0].message.content;

    try {
      const parsedInsights = JSON.parse(insights);
      
      // Store insights in database for caching
      await supabase.from('learning_insights').upsert({
        user_id: userId,
        analysis_type: analysisType,
        insights: parsedInsights,
        generated_at: new Date().toISOString()
      });

      return new Response(JSON.stringify({
        success: true,
        insights: parsedInsights,
        analysisType
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to parse AI insights',
        rawResponse: insights
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in generate-learning-insights function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});