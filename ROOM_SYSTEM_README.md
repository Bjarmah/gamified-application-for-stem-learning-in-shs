# Room-Based Quiz System

This document explains the implementation of the room-based quiz system that allows students to create study rooms, join them using codes, and take quizzes within those rooms.

## 🏗️ System Architecture

### Database Tables

1. **`rooms`** - Main room information
   - `id`, `name`, `description`, `subject_id`
   - `room_code` - Unique 8-character code for joining
   - `max_members` - Maximum number of room members
   - `is_public` - Whether room is discoverable
   - `created_by` - User ID of room creator

2. **`room_members`** - Room membership and roles
   - `room_id`, `user_id`, `role` (owner/member)
   - `joined_at`, `is_online`, `last_seen`

3. **`room_quizzes`** - Quizzes created within rooms
   - `room_id`, `title`, `description`
   - `questions` - JSON array of quiz questions
   - `time_limit`, `passing_score`
   - `created_by`, `is_active`

4. **`room_quiz_attempts`** - Quiz results and scores
   - `quiz_id`, `user_id`, `score`
   - `percentage`, `answers` (JSON array)
   - `completed_at`

5. **`room_messages`** - Chat messages within rooms
   - `room_id`, `user_id`, `content`
   - `message_type` (message/system)
   - `created_at`

### Key Features

✅ **Room Creation** - Users can create study rooms with unique codes  
✅ **Room Joining** - Users can join rooms using 8-character codes  
✅ **Quiz Creation** - Room owners can create multiple-choice quizzes  
✅ **Quiz Taking** - Room members can take quizzes and see results  
✅ **Real-time Chat** - Members can chat within rooms  
✅ **Role Management** - Room owners have special privileges  
✅ **Persistent Storage** - All data is stored in Supabase database  

## 🚀 Setup Instructions

### 1. Database Setup

The room system database tables are already set up and ready to use. The following tables exist:
- `rooms` - Room information and settings
- `room_members` - Room membership and roles
- `room_quizzes` - Quizzes associated with rooms
- `room_quiz_attempts` - User attempts on room quizzes
- `room_messages` - Room chat messages

### 2. Environment Variables

Ensure your `.env` file contains:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Server

```bash
npm run dev
```

## 📱 How to Use

### Creating a Room

1. Navigate to `/rooms`
2. Click "Create Room"
3. Fill in:
   - Room name
   - Subject
   - Description
   - Maximum members
   - Public/private setting
4. Click "Create Room"
5. Share the generated room code with others

### Joining a Room

1. Go to `/rooms`
2. Enter the room code in "Join Room by Code"
3. Click "Join Room"
4. Or discover public rooms in the "Discover Rooms" tab

### Creating Quizzes (Room Owners Only)

1. Enter a room you own
2. In the Quick Actions sidebar, click "Create Quiz"
3. Fill in:
   - Quiz title and description
   - Time limit and passing score
   - Add questions with 4 options each
   - Mark the correct answer for each question
4. Click "Create Quiz"

### Taking Quizzes

1. In any room, go to the "Quizzes" tab
2. Click "Take Quiz" on any available quiz
3. Answer questions one by one
4. Navigate between questions using Previous/Next
5. Finish quiz to see your score and percentage

## 🔧 Technical Implementation

### Service Layer

The `RoomService` class handles all database operations:

```typescript
// Create a room
const result = await RoomService.createRoom(roomData, userId);

// Join a room by code
const success = await RoomService.joinRoomByCode(roomCode, userId);

// Create a quiz
const quizId = await RoomService.createQuiz(roomId, quizData, userId);

// Submit quiz attempt
const attemptId = await RoomService.submitQuizAttempt(quizId, userId, score, totalQuestions, percentage, answers);
```

### Security Features

- **Row Level Security (RLS)** - Users can only access rooms they're members of
- **Role-based Access** - Only room owners can create/edit quizzes and manage members
- **Input Validation** - All user inputs are validated before database operations

### Real-time Features

- **Live Chat** - Messages are stored in database and displayed in real-time
- **Online Status** - Track member online/offline status
- **Quiz Progress** - Real-time quiz taking with progress tracking

## 🎯 Quiz System Details

### Question Structure

Each quiz question contains:
```typescript
interface QuizQuestion {
  question: string;        // The question text
  options: string[];       // Array of 4 answer options
  correctAnswer: number;   // Index of correct option (0-3)
}
```

### Quiz Results

Quiz attempts store:
- User's score and percentage
- Total questions answered
- Array of user's answers
- Completion timestamp

### Time Limits

- Quizzes can have optional time limits (in minutes)
- Timer counts down during quiz taking
- Quiz automatically ends when time expires

## 🔄 Data Flow

1. **Room Creation** → Database → Room code generated
2. **Room Joining** → Code validation → Member added
3. **Quiz Creation** → Questions stored → Quiz available
4. **Quiz Taking** → Answers collected → Score calculated
5. **Results Storage** → Attempt saved → Progress tracked

## 🚨 Troubleshooting

### Common Issues

1. **"Room not found"** - Check if room code is correct
2. **"Permission denied"** - Ensure user is room member
3. **"Quiz creation failed"** - Verify user is room owner
4. **"Database connection error"** - Check Supabase credentials

### Debug Steps

1. Check browser console for errors
2. Verify database tables exist
3. Check RLS policies are active
4. Ensure user authentication is working

## 🔮 Future Enhancements

- **Real-time Notifications** - Push notifications for new messages/quizzes
- **File Sharing** - Upload study materials to rooms
- **Video Chat** - Integrate video conferencing
- **Quiz Analytics** - Detailed performance insights
- **Room Templates** - Pre-configured room setups
- **Mobile App** - Native mobile experience

## 📚 API Reference

### Room Endpoints

- `POST /api/rooms` - Create room
- `GET /api/rooms` - Get user's rooms
- `POST /api/rooms/join` - Join room by code
- `DELETE /api/rooms/:id` - Delete room (owner only)

### Quiz Endpoints

- `POST /api/rooms/:id/quizzes` - Create quiz
- `GET /api/rooms/:id/quizzes` - Get room quizzes
- `POST /api/quizzes/:id/attempts` - Submit quiz attempt
- `GET /api/quizzes/:id/attempts` - Get quiz results

### Message Endpoints

- `POST /api/rooms/:id/messages` - Send message
- `GET /api/rooms/:id/messages` - Get room messages

## 🤝 Contributing

To contribute to the room system:

1. Follow the existing code structure
2. Add proper error handling
3. Include TypeScript types
4. Update this documentation
5. Test thoroughly before submitting

## 📄 License

This room system is part of the gamified STEM learning application and follows the same license terms.

