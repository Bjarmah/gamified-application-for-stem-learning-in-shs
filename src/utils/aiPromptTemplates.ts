// AI Prompt Templates for consistent and effective AI interactions

export const AI_PROMPTS = {
  // Personalized Tutoring Prompts
  tutoring: {
    explain_concept: (concept: string, level: string = 'high school') => 
      `Explain the concept of ${concept} for a ${level} student. Use clear, simple language with relevant examples and analogies. Break down complex ideas into digestible parts.`,
    
    practice_problems: (topic: string, difficulty: string = 'medium') => 
      `Create 3 practice problems for ${topic} at ${difficulty} difficulty level. Include step-by-step solutions and explanations for each problem.`,
    
    concept_review: (topics: string[]) => 
      `Review and summarize the key concepts in: ${topics.join(', ')}. Highlight the relationships between these concepts and their practical applications.`,
  },

  // Learning Insights Prompts
  insights: {
    performance_analysis: (analytics: any) => 
      `Analyze this student's learning performance and provide insights:
      - Average Score: ${analytics?.averageScore || 'N/A'}%
      - Study Streak: ${analytics?.streak || 0} days
      - Progress Trend: ${analytics?.progressTrend || 'stable'}
      - Completed Modules: ${analytics?.quizzesCompleted || 0}
      
      Provide specific insights about their learning patterns, strengths, and areas for improvement.`,
    
    comprehensive_analysis: (analytics: any, focus?: string) => 
      `Generate a comprehensive learning analysis for this STEM student:
      
      Performance Data:
      - Average Score: ${analytics?.averageScore || 'N/A'}%
      - Current Streak: ${analytics?.streak || 0} days
      - Total XP: ${analytics?.totalXP || 0}
      - Progress Trend: ${analytics?.progressTrend || 'stable'}
      
      ${focus ? `Focus Area: ${focus}` : ''}
      
      Provide detailed analysis covering:
      1. Learning strengths and achievements
      2. Areas needing improvement
      3. Personalized study recommendations
      4. Predicted learning outcomes
      5. Specific action steps for success`,

    knowledge_gaps: (weakAreas: string[]) => 
      `Identify and analyze knowledge gaps in these areas: ${weakAreas.join(', ')}. 
      Provide specific recommendations for addressing each gap and suggest learning resources.`,
  },

  // Coaching and Motivation Prompts
  coaching: {
    motivation: (situation: string, analytics?: any) => 
      `I'm a STEM student facing this situation: ${situation}
      ${analytics ? `My current performance: ${analytics.averageScore || 'N/A'}% average, ${analytics.streak || 0} day streak` : ''}
      
      Please provide motivational support and practical advice to help me stay focused and achieve my learning goals.`,
    
    study_strategy: (challenges: string[], goals: string[]) => 
      `Help me develop effective study strategies for these challenges: ${challenges.join(', ')}
      My learning goals are: ${goals.join(', ')}
      
      Provide specific, actionable study techniques and time management strategies.`,
    
    session_coaching: (phase: string, timeSpent: number, subject: string) => 
      `I'm in the ${phase} phase of studying ${subject}. I've been studying for ${Math.floor(timeSpent / 60)} minutes.
      Provide specific coaching advice for this study session, including tips for maintaining focus and maximizing learning.`,
  },

  // Content Analysis Prompts
  analysis: {
    educational_content: (content: string, focus?: string) => 
      `Analyze this educational content and extract key learning points:
      
      Content: ${content}
      ${focus ? `Analysis Focus: ${focus}` : ''}
      
      Provide:
      1. Main concepts and key terms
      2. Relationships between ideas  
      3. Practical applications
      4. Potential difficulty areas
      5. Supplementary learning topics`,
    
    quiz_feedback: (questions: any[], userAnswers: any[], score: number) => 
      `Analyze this quiz performance and provide personalized feedback:
      
      Score: ${score}%
      Questions: ${questions.length}
      
      Provide detailed feedback on:
      1. Overall performance assessment
      2. Concepts that need review
      3. Study recommendations
      4. Confidence-building strategies`,
  },

  // Advanced AI Features
  adaptive: {
    difficulty_adjustment: (currentLevel: string, performance: number, topic: string) => 
      `The student is at ${currentLevel} level with ${performance}% performance in ${topic}.
      Recommend whether to increase, decrease, or maintain difficulty level, and suggest specific adjustments.`,
    
    learning_path: (currentProgress: any, goals: string[]) => 
      `Based on current progress: ${JSON.stringify(currentProgress, null, 2)}
      And learning goals: ${goals.join(', ')}
      
      Create a personalized learning path with specific milestones and recommended study sequence.`,
  }
};

// Utility functions for prompt generation
export const generateContextualPrompt = (
  basePrompt: string, 
  userContext: any, 
  additionalContext?: string
) => {
  let prompt = basePrompt;
  
  if (userContext?.analytics) {
    prompt += `\n\nStudent Context:
    - Performance Level: ${userContext.analytics.averageScore || 'N/A'}%
    - Learning Streak: ${userContext.analytics.streak || 0} days
    - Progress Trend: ${userContext.analytics.progressTrend || 'stable'}`;
  }
  
  if (userContext?.currentModule) {
    prompt += `\n- Current Module: ${userContext.currentModule}`;
  }
  
  if (userContext?.weakAreas?.length) {
    prompt += `\n- Areas for Improvement: ${userContext.weakAreas.join(', ')}`;
  }
  
  if (additionalContext) {
    prompt += `\n\nAdditional Context: ${additionalContext}`;
  }
  
  return prompt;
};

export const getSystemPromptForType = (type: string) => {
  const systemPrompts = {
    tutoring: `You are an expert STEM tutor for high school students. Your role is to:
    - Provide clear, engaging explanations adapted to the student's level
    - Use analogies and real-world examples
    - Encourage critical thinking through guided questions
    - Maintain an encouraging and supportive tone
    - Focus on building understanding, not just providing answers`,
    
    insights: `You are an AI learning analytics specialist. Your role is to:
    - Analyze learning data and identify patterns
    - Provide actionable insights and recommendations
    - Focus on specific areas for improvement
    - Recognize achievements and progress
    - Suggest concrete next steps for learning success`,
    
    coaching: `You are an AI study coach focused on motivation and learning strategies. Your role is to:
    - Provide motivational support and encouragement
    - Suggest effective study techniques and time management
    - Help with goal setting and progress tracking
    - Offer practical advice for overcoming challenges
    - Build confidence and resilience in learning`,
    
    analysis: `You are an educational content analyzer. Your role is to:
    - Extract key concepts and learning objectives
    - Identify relationships between ideas
    - Suggest practical applications and examples
    - Highlight potential learning challenges
    - Recommend supplementary learning resources`
  };
  
  return systemPrompts[type as keyof typeof systemPrompts] || systemPrompts.tutoring;
};