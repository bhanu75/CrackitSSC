import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  User, 
  Sun, 
  Moon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight,
  Search,
  Play,
  Trophy,
  Target,
  Users,
  Star,
  Instagram,
  Mail,
  Phone
} from 'lucide-react';

// ===== DATA LAYER =====
// src/data/questions.js (externalized data)
const questionsDatabase = {
  reasoning: [
    {
      id: 1,
      question: "If CODING is written as DPEJOH, then how will FLOWER be written?",
      options: ["GMPXFS", "GKPVDS", "GMPWFS", "GKNVFS"],
      correctAnswer: 0,
      explanation: "Each letter is shifted by +1 position in the alphabet. F→G, L→M, O→P, W→X, E→F, R→S",
      difficulty: "medium",
      topic: "Coding-Decoding"
    },
    {
      id: 2,
      question: "What is the next number in the series: 2, 6, 12, 20, 30, ?",
      options: ["42", "40", "38", "44"],
      correctAnswer: 0,
      explanation: "The differences are 4, 6, 8, 10, so next difference is 12. 30 + 12 = 42",
      difficulty: "medium",
      topic: "Number Series"
    },
    {
      id: 3,
      question: "In a certain code, RAIN is written as 8794. How is GAIN written in that code?",
      options: ["1794", "6794", "5794", "3794"],
      correctAnswer: 2,
      explanation: "R=8, A=7, I=9, N=4. So G=5, A=7, I=9, N=4 → 5794",
      difficulty: "easy",
      topic: "Coding-Decoding"
    },
    {
      id: 4,
      question: "Which number will replace the question mark? 4, 9, 16, 25, ?",
      options: ["36", "49", "64", "81"],
      correctAnswer: 0,
      explanation: "Perfect squares: 2², 3², 4², 5², 6² = 36",
      difficulty: "easy",
      topic: "Number Series"
    },
    {
      id: 5,
      question: "If South-East becomes North, North-East becomes West, and so on, what does South become?",
      options: ["North-East", "East", "North-West", "West"],
      correctAnswer: 1,
      explanation: "Each direction rotates 45° clockwise. South becomes East.",
      difficulty: "hard",
      topic: "Direction Sense"
    }
  ],
  mathematics: [
    {
      id: 6,
      question: "Find the value of x: 3x + 15 = 48",
      options: ["11", "13", "15", "17"],
      correctAnswer: 0,
      explanation: "3x + 15 = 48 → 3x = 33 → x = 11",
      difficulty: "easy",
      topic: "Linear Equations"
    },
    {
      id: 7,
      question: "What is 15% of 200?",
      options: ["25", "30", "35", "40"],
      correctAnswer: 1,
      explanation: "15% of 200 = (15/100) × 200 = 30",
      difficulty: "easy",
      topic: "Percentage"
    },
    {
      id: 8,
      question: "The area of a circle with radius 7 cm is:",
      options: ["154 cm²", "147 cm²", "150 cm²", "160 cm²"],
      correctAnswer: 0,
      explanation: "Area = πr² = (22/7) × 7² = 154 cm²",
      difficulty: "medium",
      topic: "Geometry"
    },
    {
      id: 9,
      question: "If the ratio of two numbers is 3:4 and their sum is 35, find the smaller number.",
      options: ["15", "20", "12", "18"],
      correctAnswer: 0,
      explanation: "Let numbers be 3x and 4x. 3x + 4x = 35 → 7x = 35 → x = 5. Smaller = 3×5 = 15",
      difficulty: "medium",
      topic: "Ratio and Proportion"
    },
    {
      id: 10,
      question: "What is the compound interest on ₹1000 at 10% per annum for 2 years?",
      options: ["₹200", "₹210", "₹220", "₹230"],
      correctAnswer: 1,
      explanation: "CI = P(1+r/100)ⁿ - P = 1000(1.1)² - 1000 = 1210 - 1000 = ₹210",
      difficulty: "hard",
      topic: "Simple & Compound Interest"
    }
  ],
  generalKnowledge: [
    {
      id: 11,
      question: "Which of the following is the capital of Rajasthan?",
      options: ["Jodhpur", "Udaipur", "Jaipur", "Kota"],
      correctAnswer: 2,
      explanation: "Jaipur is the capital city of Rajasthan, also known as the Pink City.",
      difficulty: "easy",
      topic: "Indian Geography"
    },
    {
      id: 12,
      question: "Who is known as the 'Iron Man of India'?",
      options: ["Mahatma Gandhi", "Sardar Vallabhbhai Patel", "Jawaharlal Nehru", "Subhas Chandra Bose"],
      correctAnswer: 1,
      explanation: "Sardar Vallabhbhai Patel is known as the 'Iron Man of India' for his role in uniting the country.",
      difficulty: "easy",
      topic: "Indian History"
    },
    {
      id: 13,
      question: "The largest planet in our solar system is:",
      options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
      correctAnswer: 1,
      explanation: "Jupiter is the largest planet in our solar system.",
      difficulty: "easy",
      topic: "Science"
    },
    {
      id: 14,
      question: "Which Article of the Indian Constitution deals with the Right to Education?",
      options: ["Article 19", "Article 21A", "Article 25", "Article 32"],
      correctAnswer: 1,
      explanation: "Article 21A provides free and compulsory education to children aged 6-14 years.",
      difficulty: "medium",
      topic: "Indian Polity"
    },
    {
      id: 15,
      question: "The currency of Japan is:",
      options: ["Yuan", "Won", "Yen", "Ringgit"],
      correctAnswer: 2,
      explanation: "The Yen is the official currency of Japan.",
      difficulty: "easy",
      topic: "World Geography"
    }
  ]
};

// Test configurations with dynamic timing
const testConfigurations = [
  {
    id: 1,
    title: "SSC CGL Tier 1 - General Intelligence & Reasoning",
    description: "Practice comprehensive reasoning questions with detailed explanations",
    category: "Reasoning",
    difficulty: "Medium",
    questionsSource: "reasoning",
    timePerQuestion: 90, // seconds per question
    totalQuestions: 5, // For demo - in production would be 25-100
    subjects: ["Coding-Decoding", "Number Series", "Direction Sense", "Logical Reasoning"]
  },
  {
    id: 2,
    title: "SSC CGL Tier 1 - Quantitative Aptitude",
    description: "Master mathematical concepts and problem-solving techniques",
    category: "Mathematics",
    difficulty: "Hard",
    questionsSource: "mathematics",
    timePerQuestion: 120, // More time for math problems
    totalQuestions: 5,
    subjects: ["Algebra", "Geometry", "Arithmetic", "Trigonometry"]
  },
  {
    id: 3,
    title: "SSC CGL Tier 1 - General Awareness",
    description: "Current affairs, history, geography, and general knowledge",
    category: "General Knowledge",
    difficulty: "Easy",
    questionsSource: "generalKnowledge",
    timePerQuestion: 60, // Less time for GK
    totalQuestions: 5,
    subjects: ["History", "Geography", "Science", "Current Affairs"]
  }
];

// ===== COMPONENT LAYER =====

// Timer Component
const Timer = ({ timeLeft, isActive, onTimeUp, className = "" }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft < 300) return 'text-red-500'; // Last 5 minutes
    if (timeLeft < 600) return 'text-yellow-500'; // Last 10 minutes
    return 'text-green-500';
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Clock className={`h-5 w-5 mr-2 ${getTimerColor()}`} />
      <span className={`text-lg font-semibold ${getTimerColor()}`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

// Question Card Component
const QuestionCard = ({ 
  question, 
  questionNumber, 
  selectedAnswer, 
  onAnswerSelect,
  showExplanation = false,
  darkMode 
}) => {
  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
      <div className="flex justify-between items-center mb-6">
        <span className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Question {questionNumber}
        </span>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {question.difficulty}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
            {question.topic}
          </span>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {question.question}
        </h3>
        
        <div className="space-y-3">
          {question.options.map((option, optionIndex) => (
            <button
              key={optionIndex}
              onClick={() => onAnswerSelect(optionIndex)}
              disabled={showExplanation}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === optionIndex
                  ? showExplanation
                    ? optionIndex === question.correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-900'
                      : 'border-red-500 bg-red-50 text-red-900'
                    : 'border-blue-500 bg-blue-50 text-blue-900'
                  : showExplanation && optionIndex === question.correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-900'
                  : darkMode
                  ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500'
                  : 'border-gray-200 bg-gray-50 text-gray-900 hover:border-gray-300'
              }`}
            >
              <span className={`inline-block w-8 h-8 rounded-full mr-3 text-center leading-8 font-semibold ${
                selectedAnswer === optionIndex
                  ? showExplanation
                    ? optionIndex === question.correctAnswer
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-blue-500 text-white'
                  : showExplanation && optionIndex === question.correctAnswer
                  ? 'bg-green-500 text-white'
                  : darkMode
                  ? 'bg-gray-600 text-gray-300'
                  : 'bg-gray-300 text-gray-700'
              }`}>
                {String.fromCharCode(65 + optionIndex)}
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Explanation:
          </h4>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

// Question Navigator Component
const QuestionNavigator = ({ 
  questions, 
  currentQuestion, 
  userAnswers, 
  onQuestionSelect, 
  darkMode 
}) => {
  const getQuestionStatus = (index) => {
    if (userAnswers[index] !== undefined) return 'attempted';
    return 'unattempted';
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 sticky top-24`}>
      <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Question Navigator
      </h4>
      
      <div className="grid grid-cols-5 gap-2 mb-6">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => onQuestionSelect(index)}
            className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${
              currentQuestion === index
                ? 'bg-blue-600 text-white'
                : getQuestionStatus(index) === 'attempted'
                ? 'bg-green-500 text-white'
                : darkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-green-500 mr-3"></div>
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Attempted
          </span>
        </div>
        <div className="flex items-center">
          <div className={`w-4 h-4 rounded mr-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Unattempted
          </span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-blue-600 mr-3"></div>
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Current
          </span>
        </div>
      </div>

      {/* Progress Summary */}
      <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {Object.keys(userAnswers).length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
            Attempted
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(userAnswers).length / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Quiz Page Component
const QuizPage = ({ 
  test, 
  questions, 
  currentQuestion, 
  setCurrentQuestion,
  userAnswers,
  setUserAnswers,
  timeLeft,
  onSubmit,
  darkMode 
}) => {
  const handleAnswerSelect = (answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Test Header */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 mb-6`}>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h2 className={`text-2xl font-bold mb-4 md:mb-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {test.title}
          </h2>
          <div className="flex items-center space-x-6">
            <Timer timeLeft={timeLeft} isActive={true} />
            <button
              onClick={onSubmit}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-3">
          <QuestionCard
            question={questions[currentQuestion]}
            questionNumber={currentQuestion + 1}
            selectedAnswer={userAnswers[currentQuestion]}
            onAnswerSelect={handleAnswerSelect}
            darkMode={darkMode}
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentQuestion === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentQuestion === questions.length - 1
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Next
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Question Navigation Panel */}
        <div className="lg:col-span-1">
          <QuestionNavigator
            questions={questions}
            currentQuestion={currentQuestion}
            userAnswers={userAnswers}
            onQuestionSelect={setCurrentQuestion}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
};

// Results Component
const ResultsPage = ({ test, questions, userAnswers, onRetakeTest, onBackToTests, darkMode }) => {
  const calculateDetailedScore = () => {
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;
    const topicWiseScore = {};

    questions.forEach((question, index) => {
      const topic = question.topic;
      if (!topicWiseScore[topic]) {
        topicWiseScore[topic] = { correct: 0, total: 0 };
      }
      topicWiseScore[topic].total++;

      if (userAnswers[index] !== undefined) {
        if (userAnswers[index] === question.correctAnswer) {
          correct++;
          topicWiseScore[topic].correct++;
        } else {
          incorrect++;
        }
      } else {
        unattempted++;
      }
    });

    return {
      correct,
      incorrect,
      unattempted,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
      topicWiseScore
    };
  };

  const score = calculateDetailedScore();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
        <div className="text-center mb-8">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Test Completed!
          </h2>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {test.title}
          </p>
        </div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <div className="text-3xl font-bold text-green-600 mb-2">{score.correct}</div>
            <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Correct</div>
          </div>
          <div className={`p-6 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-red-50'}`}>
            <div className="text-3xl font-bold text-red-600 mb-2">{score.incorrect}</div>
            <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Incorrect</div>
          </div>
          <div className={`p-6 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
            <div className="text-3xl font-bold text-yellow-600 mb-2">{score.unattempted}</div>
            <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Unattempted</div>
          </div>
          <div className={`p-6 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <div className="text-3xl font-bold text-blue-600 mb-2">{score.percentage}%</div>
            <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Score</div>
          </div>
        </div>

        {/* Topic-wise Performance */}
        <div className="mb-8">
          <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Topic-wise Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(score.topicWiseScore).map(([topic, topicScore]) => (
              <div key={topic} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {topic}
                  </span>
                  <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {topicScore.correct}/{topicScore.total}
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(topicScore.correct / topicScore.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRetakeTest}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Retake Test
          </button>
          <button
            onClick={onBackToTests}
            className={`border-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} px-8 py-3 rounded-lg font-semibold transition-colors`}
          >
            Back to Tests
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN APP COMPONENT =====
const CrackitSSC = () => {
  // Core state
  const [currentPage, setCurrentPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Test state
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic timer calculation based on test configuration
  const calculateTotalTime = (test) => {
    return test.timePerQuestion * test.totalQuestions;
  };

  // Load questions for a specific test
  const loadQuestionsForTest = (test) => {
    const sourceQuestions = questionsDatabase[test.questionsSource] || [];
    // In production, this would be an API call
    // For now, we'll take the first N questions
    return sourceQuestions.slice(0, test.totalQuestions);
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (testStarted && timeLeft > 0 && !testCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTestSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, timeLeft, testCompleted]);

  // Test management functions
  const startTest = (test) => {
    const questions = loadQuestionsForTest(test);
    const totalTime = calculateTotalTime(test);
    
    setSelectedTest(test);
    setCurrentQuestions(questions);
    setCurrentQuestion(0);
    setUserAnswers({});
    setTimeLeft(totalTime);
    setTestStarted(true);
    setTestCompleted(false);
    setCurrentPage('test');
  };

  const handleTestSubmit = () => {
    setTestCompleted(true);
    setTestStarted(false);
    setCurrentPage('results');
  };

  const retakeTest = () => {
    if (selectedTest) {
      startTest(selectedTest);
    }
  };

  // Filtered tests for search
  const filteredTests = useMemo(() => {
    if (!searchQuery) return testConfigurations;
    return testConfigurations.filter(test =>
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  // Navigation components
  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } ${darkMode ? 'bg-gray-900' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          CrackitSSC
        </h2>
        <button onClick={() => setSidebarOpen(false)} className="p-2">
          <X className={`h-6 w-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
      </div>
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          <button
            onClick={() => {setCurrentPage('home'); setSidebarOpen(false);}}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              currentPage === 'home' 
                ? 'bg-blue-600 text-white' 
                : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <Home className="h-5 w-5 mr-3" />
            Home
          </button>
          <button
            onClick={() => {setCurrentPage('tests'); setSidebarOpen(false);}}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              currentPage === 'tests' 
                ? 'bg-blue-600 text-white' 
                : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100'}`
            }`}
          >
            <BookOpen className="h-5 w-5 mr-3" />
            Practice Tests
          </button>
        </div>
      </nav>
    </div>
  );

  // Header component
  const Header = () => (
    <header className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-40`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`p-2 rounded-md ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className={`ml-4 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              CrackitSSC
            </h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-md ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </header>
  );

  // Home page component
  const HomePage = () => (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`${darkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'} py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Crack SSC CGL
              <span className="text-blue-600"> with Confidence</span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Master your SSC CGL preparation with our comprehensive practice tests, detailed explanations, and performance analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('tests')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center"
              >
                <Play className="h-6 w-6 mr-2" />
                Start Practice Test
              </button>
              <button
                onClick={() => setCurrentPage('tests')}
                className={`border-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} px-8 py-4 rounded-lg text-lg font-semibold transition-colors`}
              >
                View All Tests
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Why Choose CrackitSSC?
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Everything you need to excel in SSC CGL examinations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Comprehensive Tests
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Practice with real exam patterns and difficulty levels to boost your confidence
              </p>
            </div>
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
              <Target className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Detailed Analytics
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Track your progress with comprehensive performance analytics and insights
              </p>
            </div>
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
              <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Expert Solutions
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Learn from detailed explanations and step-by-step solutions for every question
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-blue-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Practice Questions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-600 mb-2">50K+</div>
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-600 mb-2">24/7</div>
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                CrackitSSC
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your ultimate destination for SSC CGL exam preparation with comprehensive practice tests and expert guidance.
              </p>
            </div>
            <div>
              <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Quick Links
              </h4>
              <div className="space-y-2">
                <button 
                  onClick={() => setCurrentPage('tests')}
                  className={`block ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Practice Tests
                </button>
                <button className={`block ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Study Material
                </button>
                <button className={`block ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                  Previous Papers
                </button>
              </div>
            </div>
            <div>
              <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Connect With Us
              </h4>
              <div className="flex space-x-4">
                <a href="#" className="p-2 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} transition-colors`}>
                  <Mail className="h-5 w-5" />
                </a>
                <a href="#" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} transition-colors`}>
                  <Phone className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              © 2025 CrackitSSC. All rights reserved. Built for SSC CGL aspirants.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );

  // Tests page component
  const TestsPage = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Practice Tests
        </h2>
        <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Choose from our comprehensive collection of SSC CGL practice tests
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className={`absolute left-3 top-3 h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search tests by name, category, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
              darkMode 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>
      </div>

      {/* Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div key={test.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6`}>
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                test.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {test.difficulty}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                {test.category}
              </span>
            </div>
            <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {test.title}
            </h3>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {test.description}
            </p>
            
            {/* Test Details */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {Math.floor(calculateTotalTime(test) / 60)} mins total
                  </span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-green-600 mr-2" />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {test.totalQuestions} questions
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <Target className="h-4 w-4 text-purple-600 mr-2" />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {test.timePerQuestion}s per question
                </span>
              </div>
            </div>

            {/* Subjects covered */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {test.subjects.slice(0, 3).map((subject, index) => (
                  <span 
                    key={index}
                    className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {subject}
                  </span>
                ))}
                {test.subjects.length > 3 && (
                  <span className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    +{test.subjects.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => startTest(test)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Test
            </button>
          </div>
        ))}
      </div>

      {filteredTests.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No tests found matching "{searchQuery}"
          </p>
          <button 
            onClick={() => setSearchQuery('')}
            className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );

  // Main render logic
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Sidebar />
      <Header />
      
      {/* Overlay for sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="transition-all duration-300">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'tests' && <TestsPage />}
        {currentPage === 'test' && (
          <QuizPage
            test={selectedTest}
            questions={currentQuestions}
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            timeLeft={timeLeft}
            onSubmit={handleTestSubmit}
            darkMode={darkMode}
          />
        )}
        {currentPage === 'results' && (
          <ResultsPage
            test={selectedTest}
            questions={currentQuestions}
            userAnswers={userAnswers}
            onRetakeTest={retakeTest}
            onBackToTests={() => setCurrentPage('tests')}
            darkMode={darkMode}
          />
        )}
      </main>
    </div>
  );
};

export default CrackitSSC;