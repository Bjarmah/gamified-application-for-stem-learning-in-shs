-- Create learning_insights table to store AI-generated insights
CREATE TABLE learning_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  analysis_type TEXT NOT NULL,
  insights JSONB NOT NULL DEFAULT '{}',
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE learning_insights ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own insights" 
ON learning_insights 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert insights" 
ON learning_insights 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own insights" 
ON learning_insights 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_learning_insights_updated_at
BEFORE UPDATE ON learning_insights
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX idx_learning_insights_user_type ON learning_insights(user_id, analysis_type);
CREATE INDEX idx_learning_insights_generated_at ON learning_insights(generated_at DESC);