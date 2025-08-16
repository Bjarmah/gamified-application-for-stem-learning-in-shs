-- Update Physics modules with comprehensive content structure

UPDATE modules SET 
content = '{
  "text": {
    "introduction": "Dynamics bridges the gap between describing motion (kinematics) and understanding its causes. Newton''s three laws of motion provide a framework for analyzing how forces affect the motion of objects, from falling mangoes to orbiting satellites.",
    "sections": [
      {
        "title": "Newton''s First Law (Law of Inertia)",
        "content": "An object at rest stays at rest, and an object in motion continues moving at constant velocity, unless acted upon by an unbalanced external force. This law defines inertia - the tendency of objects to maintain their state of motion. Mass is a measure of inertia; more massive objects are harder to accelerate or stop."
      },
      {
        "title": "Newton''s Second Law (F = ma)", 
        "content": "The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. This mathematical relationship F = ma allows us to predict motion when forces are known, or determine forces from observed motion. It applies to everything from molecular interactions to planetary dynamics."
      },
      {
        "title": "Newton''s Third Law (Action-Reaction)",
        "content": "For every action force, there is an equal and opposite reaction force. These force pairs act on different objects simultaneously. Walking, swimming, and rocket propulsion all depend on this principle. The forces are equal in magnitude but may produce different accelerations due to different masses."
      },
      {
        "title": "Applications and Problem Solving",
        "content": "Dynamic analysis involves identifying all forces acting on an object, drawing free-body diagrams, applying Newton''s laws, and solving the resulting equations. Common force types include gravitational, normal, friction, tension, and applied forces. Understanding equilibrium conditions helps analyze static situations."
      }
    ]
  },
  "questions": [
    {
      "type": "multiple-choice",
      "question": "A 2 kg object accelerates at 3 m/s². What is the net force acting on it?",
      "options": ["1.5 N", "6 N", "5 N", "0.67 N"],
      "correctAnswer": 1,
      "explanation": "Using F = ma, F = (2 kg)(3 m/s²) = 6 N. The net force is 6 N in the direction of acceleration."
    },
    {
      "type": "multiple-choice",
      "question": "When you walk forward, what force pushes you ahead?",
      "options": ["Force of your foot on ground", "Friction force from ground", "Air resistance", "Gravitational force"],
      "correctAnswer": 1,
      "explanation": "By Newton''s third law, when your foot pushes backward on the ground, the ground exerts an equal forward friction force on you."
    }
  ],
  "exercises": [
    {
      "type": "problem-solving",
      "title": "Force Analysis",
      "instructions": "A 5 kg box is pulled across a horizontal surface by a 30 N force at 37° above horizontal. If the coefficient of kinetic friction is 0.3, calculate the acceleration of the box.",
      "hint": "Resolve forces into components, find the normal force, calculate friction, then apply Newton''s second law."
    }
  ],
  "scenarioChallenges": [
    {
      "title": "Transportation in Ghana",
      "scenario": "Ghana''s transportation system includes tro-tros (shared taxis) that frequently start, stop, and turn. Understanding forces helps explain passenger experiences and vehicle design for safety and efficiency.",
      "tasks": [
        "Explain why passengers lurch forward when a tro-tro brakes suddenly",
        "Analyze the forces involved when a loaded truck climbs hills in the Eastern Region",
        "Discuss how understanding Newton''s laws can improve road safety measures"
      ],
      "learningObjectives": [
        "Apply Newton''s laws to real transportation scenarios",
        "Understand the relationship between forces, mass, and acceleration in vehicles",
        "Connect physics principles to everyday experiences and safety"
      ],
      "ghanaContext": "Ghana''s diverse terrain from coastal plains to mountainous regions provides varied contexts for studying force and motion."
    }
  ]
}',
estimated_duration = 55,
difficulty_level = 'intermediate'
WHERE id = 'cdf81f80-3144-4124-ba0c-bb478435991f';

-- Update Work, Energy, and Power module
UPDATE modules SET
content = '{
  "text": {
    "introduction": "Energy is the capacity to do work and exists in many forms - kinetic, potential, thermal, electrical, and more. The concepts of work, energy, and power are fundamental to understanding mechanical systems, from simple machines to complex engines.",
    "sections": [
      {
        "title": "Work and Energy",
        "content": "Work is done when a force causes displacement: W = F·d·cos(θ), where θ is the angle between force and displacement. Energy is the capacity to do work. Kinetic energy (KE = ½mv²) depends on motion, while potential energy depends on position. Gravitational potential energy is PE = mgh."
      },
      {
        "title": "Conservation of Energy",
        "content": "Energy cannot be created or destroyed, only transformed from one type to another. In mechanical systems, kinetic and potential energy interchange. Total mechanical energy remains constant in the absence of non-conservative forces like friction. This principle allows us to solve complex motion problems elegantly."
      },
      {
        "title": "Power",
        "content": "Power is the rate of doing work or transferring energy: P = W/t = F·v. It measures how quickly energy is used or converted. Understanding power is crucial for designing efficient machines and understanding energy consumption in various applications."
      },
      {
        "title": "Efficiency and Machines",
        "content": "Real machines are less than 100% efficient due to friction and other energy losses. Efficiency = (useful energy output)/(total energy input) × 100%. Simple machines like levers, pulleys, and inclined planes trade force for distance while conserving energy (ideally)."
      }
    ]
  },
  "questions": [
    {
      "type": "multiple-choice",
      "question": "A 10 kg object at rest falls 5 m. What is its kinetic energy just before impact? (g = 10 m/s²)",
      "options": ["50 J", "100 J", "500 J", "250 J"],
      "correctAnswer": 2,
      "explanation": "Using conservation of energy: PE = mgh = (10 kg)(10 m/s²)(5 m) = 500 J. This converts entirely to kinetic energy."
    },
    {
      "type": "multiple-choice", 
      "question": "If a machine has 80% efficiency and input power is 1000 W, the useful output power is:",
      "options": ["800 W", "1250 W", "200 W", "80 W"],
      "correctAnswer": 0,
      "explanation": "Efficiency = output/input × 100%, so output = efficiency × input = 0.8 × 1000 W = 800 W."
    }
  ],
  "exercises": [
    {
      "type": "calculation",
      "title": "Hydroelectric Power",
      "instructions": "Calculate the theoretical power output of a hydroelectric plant where 1000 m³/s of water falls through a height of 50 m. Assume 100% efficiency and water density of 1000 kg/m³.",
      "hint": "Find the mass flow rate first, then use P = mgh/t to find power output."
    }
  ],
  "scenarioChallenges": [
    {
      "title": "Bui Hydroelectric Dam",
      "scenario": "The Bui Dam on the Black Volta River generates electricity for Ghana. Understanding work, energy, and power principles explains how falling water is converted to electrical energy and the factors affecting power output.",
      "tasks": [
        "Calculate the power generated by water falling through the dam",
        "Explain why power output varies with water level and flow rate",
        "Analyze the energy transformations from gravitational PE to electrical energy"
      ],
      "learningObjectives": [
        "Apply energy concepts to renewable energy systems",
        "Understand the relationship between power, energy, and time",
        "Evaluate factors affecting hydroelectric efficiency"
      ],
      "ghanaContext": "The Bui Dam provides about 400 MW of power, contributing significantly to Ghana''s energy security and demonstrating practical applications of energy principles."
    }
  ]
}',
estimated_duration = 45,
difficulty_level = 'intermediate'
WHERE id = 'e2e2d547-083e-46b5-97ce-39fffa14be26';

-- Update Kinematics module
UPDATE modules SET
content = '{
  "text": {
    "introduction": "Kinematics describes motion without considering the forces that cause it. By studying position, velocity, and acceleration, we can predict where objects will be and how fast they''ll be moving at any given time.",
    "sections": [
      {
        "title": "Position, Distance, and Displacement",
        "content": "Position is location relative to a reference point. Distance is the total path length traveled (always positive), while displacement is the straight-line distance from start to finish (can be negative). Displacement is a vector quantity with both magnitude and direction."
      },
      {
        "title": "Velocity and Speed",
        "content": "Speed is distance per unit time (scalar), while velocity is displacement per unit time (vector). Average velocity = Δx/Δt, and instantaneous velocity is the limit as Δt approaches zero. Velocity graphs reveal acceleration patterns."
      },
      {
        "title": "Acceleration",
        "content": "Acceleration is the rate of change of velocity: a = Δv/Δt. Constant acceleration produces linear velocity-time graphs and parabolic position-time graphs. The kinematic equations describe motion with constant acceleration."
      },
      {
        "title": "Kinematic Equations",
        "content": "For constant acceleration: v = v₀ + at, x = x₀ + v₀t + ½at², v² = v₀² + 2a(x - x₀), and x = x₀ + ½(v₀ + v)t. These equations allow us to solve for any unknown variable when others are given."
      }
    ]
  },
  "questions": [
    {
      "type": "multiple-choice",
      "question": "A car accelerates from rest at 2 m/s² for 5 seconds. How far does it travel?",
      "options": ["10 m", "25 m", "50 m", "5 m"],
      "correctAnswer": 1,
      "explanation": "Using x = x₀ + v₀t + ½at² with x₀ = 0, v₀ = 0: x = ½(2)(5)² = 25 m."
    },
    {
      "type": "multiple-choice",
      "question": "Which quantity is a vector?",
      "options": ["Speed", "Distance", "Time", "Displacement"],
      "correctAnswer": 3,
      "explanation": "Displacement has both magnitude and direction, making it a vector quantity. Speed and distance are scalars."
    }
  ],
  "exercises": [
    {
      "type": "graphing",
      "title": "Motion Graphs",
      "instructions": "A ball is thrown upward with initial velocity 20 m/s. Draw position-time, velocity-time, and acceleration-time graphs for its motion until it returns to ground level. Use g = 10 m/s².",
      "hint": "Consider that acceleration due to gravity is constant at -10 m/s² throughout the motion."
    }
  ],
  "scenarioChallenges": [
    {
      "title": "Accra Traffic Analysis",
      "scenario": "Traffic congestion in Accra affects millions daily. Understanding kinematics helps analyze traffic flow, optimize traffic light timing, and improve transportation efficiency.",
      "tasks": [
        "Calculate the stopping distance for a car traveling at 60 km/h when brakes are applied",
        "Analyze how reaction time affects total stopping distance",
        "Determine optimal acceleration profiles for traffic lights to minimize fuel consumption"
      ],
      "learningObjectives": [
        "Apply kinematic equations to traffic safety scenarios",
        "Understand the relationship between speed, reaction time, and stopping distance",
        "Evaluate motion optimization in urban planning"
      ],
      "ghanaContext": "Accra''s rapid urbanization has created traffic challenges that can be addressed through scientific analysis of motion and planning."
    }
  ]
}',
estimated_duration = 50,
difficulty_level = 'beginner'
WHERE id = '725f62ae-d404-40ef-a8d6-e1a03fecad09';