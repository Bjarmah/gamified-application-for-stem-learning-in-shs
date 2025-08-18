# AI Chatbot Integration

## Overview
This system integrates the Elfsight AI Chatbot into key learning pages to provide AI-powered assistance to students. The chatbot is contextually aware and provides subject-specific help during learning activities.

## Components

### 1. **AIChatbot** (`src/components/ai-chatbot/AIChatbot.tsx`)
- **Full-featured chatbot** with minimize/maximize functionality
- **Fixed positioning** on learning pages
- **Responsive design** with proper loading states
- **Custom header** with STEM branding

### 2. **FloatingAIChatbot** (`src/components/ai-chatbot/FloatingAIChatbot.tsx`)
- **Floating action button** that expands into full chatbot
- **Compact design** for mobile and space-constrained layouts
- **Smooth animations** and hover effects
- **Position customization** (bottom-right, bottom-left, top-right, top-left)

### 3. **ContextualAIChatbot** (`src/components/ai-chatbot/ContextualAIChatbot.tsx`)
- **Subject-aware chatbot** with contextual information
- **Dynamic icons** based on subject (Math, Physics, Chemistry, Biology, ICT)
- **Module-specific titles** for better context
- **Specialized assistance** for specific learning areas

## Integration Points

### **Subjects Page** (`src/pages/Subjects.tsx`)
- **Component**: `FloatingAIChatbot`
- **Position**: Bottom-right (mobile only)
- **Purpose**: General learning assistance and subject selection help
- **Visibility**: Hidden on desktop to avoid cluttering

```tsx
import { FloatingAIChatbot } from "@/components/ai-chatbot";

// AI Learning Assistant
<FloatingAIChatbot 
  position="bottom-right"
  className="md:hidden" // Only show on mobile
/>
```

### **Module Detail Page** (`src/pages/ModuleDetail.tsx`)
- **Component**: `ContextualAIChatbot`
- **Position**: Bottom-right
- **Purpose**: Subject and module-specific learning assistance
- **Context**: Subject name and module title
- **Visibility**: Large screens only for optimal learning experience

```tsx
import { ContextualAIChatbot } from "@/components/ai-chatbot";

// AI Learning Assistant - Contextual to the module
<ContextualAIChatbot 
  position="bottom-right"
  className="hidden lg:block"
  subject={module?.subject}
  moduleTitle={module?.title}
/>
```

### **Rooms Page** (`src/pages/Rooms.tsx`)
- **Component**: `FloatingAIChatbot`
- **Position**: Bottom-right
- **Purpose**: Collaboration and room management assistance
- **Visibility**: Small screens and up for room assistance

```tsx
import { FloatingAIChatbot } from '@/components/ai-chatbot';

// AI Collaboration Assistant
<FloatingAIChatbot 
  position="bottom-right"
  className="hidden sm:block"
/>
```

### **Quiz Page** (`src/pages/Quiz.tsx`)
- **Component**: `FloatingAIChatbot`
- **Position**: Bottom-left
- **Purpose**: Learning assistance before quiz starts
- **Visibility**: Hidden during quiz, available on medium screens and up

```tsx
import { FloatingAIChatbot } from "@/components/ai-chatbot";

// AI Learning Assistant - Available during quiz for help
{!quizStarted && (
  <FloatingAIChatbot 
    position="bottom-left"
    className="hidden md:block"
  />
)}
```

## Features

### **Responsive Design**
- **Mobile-first approach** with appropriate breakpoints
- **Conditional rendering** based on screen size
- **Touch-friendly** floating action buttons
- **Adaptive positioning** for different layouts

### **Contextual Awareness**
- **Subject-specific icons** (Calculator for Math, Atom for Physics, etc.)
- **Dynamic titles** based on current learning context
- **Module information** for targeted assistance
- **Learning stage awareness** (pre-quiz, during module, etc.)

### **User Experience**
- **Minimize/maximize** functionality
- **Smooth animations** and transitions
- **Loading states** with spinners
- **Error handling** for script loading
- **Accessibility** considerations

### **Performance Optimization**
- **Lazy loading** of Elfsight platform script
- **Conditional rendering** to avoid unnecessary loads
- **Script cleanup** on component unmount
- **Efficient positioning** calculations

## Configuration

### **Position Options**
```tsx
position="bottom-right"    // Default: Bottom right corner
position="bottom-left"     // Bottom left corner
position="top-right"       // Top right corner
position="top-left"        // Top left corner
```

### **Visibility Classes**
```tsx
className="hidden lg:block"     // Hidden on small/medium, visible on large
className="md:hidden"           // Hidden on medium and up, visible on small
className="hidden sm:block"     // Hidden on small, visible on medium and up
```

### **Customization Props**
```tsx
interface AIChatbotProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  showMinimizeButton?: boolean;
  initialMinimized?: boolean;
}

interface ContextualAIChatbotProps extends AIChatbotProps {
  subject?: string;
  moduleTitle?: string;
}
```

## Technical Implementation

### **Script Loading**
```tsx
useEffect(() => {
  // Load Elfsight platform script
  const script = document.createElement('script');
  script.src = 'https://elfsightcdn.com/platform.js';
  script.async = true;
  script.onload = () => setIsLoaded(true);
  document.head.appendChild(script);

  return () => {
    // Cleanup script on unmount
    if (document.head.contains(script)) {
      document.head.removeChild(script);
    }
  };
}, []);
```

### **Dynamic Icons**
```tsx
const getSubjectIcon = () => {
  if (!subject) return <BookOpen className="h-5 w-5" />;
  
  switch (subject.toLowerCase()) {
    case 'mathematics':
      return <Calculator className="h-5 w-5" />;
    case 'physics':
      return <Atom className="h-5 w-5" />;
    case 'chemistry':
      return <FlaskConical className="h-5 w-5" />;
    case 'biology':
      return <Activity className="h-5 w-5" />;
    case 'ict':
      return <Monitor className="h-5 w-5" />;
    default:
      return <BookOpen className="h-5 w-5" />;
  }
};
```

### **Position Calculation**
```tsx
const getPositionClasses = () => {
  switch (position) {
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'top-right':
      return 'top-4 right-4';
    case 'top-left':
      return 'top-4 left-4';
    default:
      return 'bottom-4 right-4';
  }
};
```

## Usage Examples

### **Basic Integration**
```tsx
import { AIChatbot } from "@/components/ai-chatbot";

function LearningPage() {
  return (
    <div>
      {/* Your learning content */}
      
      {/* AI Assistant */}
      <AIChatbot position="bottom-right" />
    </div>
  );
}
```

### **Floating Button**
```tsx
import { FloatingAIChatbot } from "@/components/ai-chatbot";

function MobilePage() {
  return (
    <div>
      {/* Your content */}
      
      {/* Floating AI Assistant */}
      <FloatingAIChatbot 
        position="bottom-right"
        className="md:hidden"
      />
    </div>
  );
}
```

### **Contextual Assistance**
```tsx
import { ContextualAIChatbot } from "@/components/ai-chatbot";

function ModulePage({ subject, moduleTitle }) {
  return (
    <div>
      {/* Module content */}
      
      {/* Subject-specific AI Assistant */}
      <ContextualAIChatbot 
        position="bottom-right"
        subject={subject}
        moduleTitle={moduleTitle}
        className="hidden lg:block"
      />
    </div>
  );
}
```

## Best Practices

### **Positioning Strategy**
- **Bottom-right**: Default position for most learning contexts
- **Bottom-left**: Alternative when right side is occupied
- **Top positions**: Use sparingly to avoid blocking content
- **Mobile considerations**: Ensure touch targets are accessible

### **Visibility Management**
- **Large screens**: Full chatbot for comprehensive assistance
- **Medium screens**: Floating button to save space
- **Small screens**: Floating button with mobile-optimized positioning
- **Quiz contexts**: Hide during active assessment

### **Performance Considerations**
- **Lazy loading**: Only load when needed
- **Conditional rendering**: Avoid unnecessary component mounts
- **Script cleanup**: Proper cleanup to prevent memory leaks
- **Responsive breakpoints**: Use appropriate visibility classes

## Future Enhancements

### **Planned Features**
- **Learning path integration**: Context-aware suggestions
- **Progress tracking**: AI assistance based on user progress
- **Subject expertise**: Specialized knowledge for each subject
- **Multilingual support**: Language-specific assistance
- **Voice interaction**: Speech-to-text capabilities

### **Integration Opportunities**
- **Gamification system**: AI-powered hints and tips
- **Assessment feedback**: Post-quiz analysis and suggestions
- **Study planning**: AI-assisted study schedule creation
- **Peer learning**: AI-facilitated group study sessions
- **Content recommendations**: Personalized learning suggestions

## Troubleshooting

### **Common Issues**
1. **Chatbot not loading**
   - Check internet connection
   - Verify Elfsight platform script loading
   - Check browser console for errors

2. **Position conflicts**
   - Ensure z-index is appropriate
   - Check for overlapping elements
   - Verify positioning classes

3. **Mobile responsiveness**
   - Test on various screen sizes
   - Verify touch target accessibility
   - Check positioning on different devices

### **Debug Information**
- **Console logs**: Script loading status
- **Network tab**: Elfsight platform requests
- **Element inspection**: Positioning and styling
- **Responsive testing**: Different viewport sizes

## Conclusion

The AI Chatbot integration provides:
- **Immediate assistance** during learning activities
- **Contextual help** based on subject and module
- **Responsive design** for all device types
- **Seamless integration** with existing learning flow
- **Enhanced user experience** with AI-powered support

This system transforms the learning experience by providing intelligent, contextual assistance that adapts to the user's current learning context and device capabilities.
