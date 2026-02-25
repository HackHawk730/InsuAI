import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/InsureAi';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});


api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const signup = async (userData) => {
  try {
    const payload = {
      name: userData.name,
      email: userData.email,
      role: userData.role,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
    };
    if (userData.role === 'Agent') {
      if (userData.company != null) payload.company = userData.company;
      if (userData.specialization != null) payload.specialization = userData.specialization;
    }
    const response = await api.post('/singup', payload);


    const message = typeof response.data === 'string' ? response.data : response.data?.message || 'Registration Successful';


    const isSuccess = message.includes('Successful') || message.includes('successful');

    return {
      success: isSuccess,
      message: message
    };
  } catch (error) {
    let errorMessage = 'Signup failed. Please try again.';

    if (error.response) {

      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {

      errorMessage = 'Unable to connect to server. Please make sure the backend is running on port 9090.';
    } else {
      errorMessage = error.message || 'An unexpected error occurred';
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const signin = async (credentials) => {
  try {
    const response = await api.post('/singin', {
      email: credentials.email,
      password: credentials.password,
    });

    // Handle new JSON response format
    if (response.data && typeof response.data === 'object') {
      return {
        success: response.data.success,
        message: response.data.message,
        user: response.data.user
      };
    }

    // Fallback for legacy string response (if any)
    const message = typeof response.data === 'string' ? response.data : response.data?.message || 'Login Successful';
    const isSuccess = message.includes('Successful') || message.includes('successful');

    return {
      success: isSuccess,
      message: message
    };
  } catch (error) {
    let errorMessage = 'Signin failed. Please try again.';

    if (error.response) {
      // The backend now returns a JSON object on error too (400 Bad Request with LoginResponse body)
      if (error.response.data && typeof error.response.data === 'object' && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else {
        errorMessage = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {
      errorMessage = 'Unable to connect to server. Please make sure the backend is running on port 9090.';
    } else {
      errorMessage = error.message || 'An unexpected error occurred';
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const agentScheduling = async (scheduleData, email) => {
  try {
    const response = await api.post(`/agentSchedule?email=${email}`, scheduleData);
    return {
      success: true,
      message: typeof response.data === 'string' ? response.data : 'Successfully scheduled'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Scheduling failed'
    };
  }
};

//Fetch the AgentAvailability from DB

export const fetchAgentsWithAvailability = async () => {
  try {
    const response = await api.get('/agents/available');
    return {
      success: true,
      agents: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      agents: [],
      message: error.response?.data || error.message || 'Failed to fetch agents'
    };
  }
};

//Update the Db as per changes
export const bookSchedule = async ({
  agentEmail,
  scheduleId,
  userEmail,
  userNote,
  startTime,
  endTime,
  appointmentType,
}) => {
  try {
    const response = await api.post('/bookSchedule', {
      agentEmail,
      scheduleId,
      userEmail,
      userNote,
      startTime,
      endTime,
      appointmentType,
    });

    return {
      success: true,
      message: typeof response.data === 'string' ? response.data : 'Slot booked successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Failed to book slot'
    };
  }
};

export const updateScheduleStatus = async (email, scheduleId, status) => {
  try {
    const response = await api.post(`/updateScheduleStatus?email=${encodeURIComponent(email)}&scheduleId=${scheduleId}&status=${status}`);
    return {
      success: true,
      message: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Failed to update status'
    };
  }
};

export const fetchAgentRequests = async (email) => {
  try {
    const response = await api.get(`/agentRequests?email=${encodeURIComponent(email)}`);
    return {
      success: true,
      requests: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      requests: [],
      message: error.response?.data || error.message || 'Failed to fetch agent requests'
    };
  }
};

export const applyForPolicy = async (userEmail, agentEmail, typeId, policyTypeName, formData) => {
  try {
    const response = await api.post('/applyPolicy', {
      userEmail,
      agentEmail,
      typeId,
      policyTypeName,
      formData
    });
    return {
      success: true,
      policy: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Failed to apply for policy'
    };
  }
};

export const fetchMyPolicies = async (userEmail) => {
  try {
    const response = await api.get(`/myPolicies?email=${encodeURIComponent(userEmail)}`);
    return {
      success: true,
      policies: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      policies: [],
      message: error.response?.data || error.message || 'Failed to fetch policies'
    };
  }
};

export const fetchAllPolicies = async (email) => {
  try {
    const response = await api.get(`/allPolicies${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    return {
      success: true,
      policies: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      policies: [],
      message: error.response?.data || error.message || 'Failed to fetch policies'
    };
  }
};

export const updatePolicyStatus = async (policyId, status, comments) => {
  try {
    const response = await api.post('/updatePolicy', {
      policyId,
      status,
      comments
    });
    return {
      success: true,
      policy: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Failed to update policy'
    };
  }
};

export const fetchAllAgents = async () => {
  try {
    const response = await api.get('/allAgents');
    return {
      success: true,
      agents: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      agents: [],
      message: error.response?.data || error.message || 'Failed to fetch agents'
    };
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await api.get('/allUsers');
    return {
      success: true,
      users: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      users: [],
      message: error.response?.data || error.message || 'Failed to fetch users'
    };
  }
};

export const fetchSystemHealth = async () => {
  try {
    const response = await axios.get('http://localhost:9090/actuator/health');
    return {
      success: true,
      health: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch health'
    };
  }
};

export const fetchSystemMetrics = async (metricName) => {
  try {
    const url = `http://localhost:9090/actuator/metrics${metricName ? '/' + metricName : ''}`;
    const response = await axios.get(url);
    return {
      success: true,
      metrics: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to fetch metrics'
    };
  }
};
export const fetchAllAppointments = async () => {
  try {
    const response = await api.get('/allSchedules');
    return {
      success: true,
      appointments: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      appointments: [],
      message: error.response?.data || error.message || 'Failed to fetch appointments'
    };
  }
};

export const createPolicyOffering = async (offeringData, agentEmail) => {
  try {
    const response = await api.post(`/createPolicyOffering?agentEmail=${encodeURIComponent(agentEmail)}`, offeringData);
    return {
      success: true,
      message: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Failed to create policy offering'
    };
  }
};

export const getPolicyOfferings = async () => {
  try {
    const response = await api.get('/policyOfferings');
    return {
      success: true,
      offerings: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      offerings: [],
      message: error.response?.data || error.message || 'Failed to fetch policy offerings'
    };
  }
};

export const submitFeedback = async (feedbackData) => {
  try {
    const response = await api.post('/feedback/submit', feedbackData);
    return {
      success: true,
      feedback: response.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data || error.message || 'Failed to submit feedback'
    };
  }
};

export const fetchAgentFeedback = async (email) => {
  try {
    const response = await api.get(`/feedback/agent/${encodeURIComponent(email)}`);
    return {
      success: true,
      feedback: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      feedback: [],
      message: error.response?.data || error.message || 'Failed to fetch agent feedback'
    };
  }
};

export const fetchAllFeedback = async () => {
  try {
    const response = await api.get('/feedback/all');
    return {
      success: true,
      feedback: response.data || []
    };
  } catch (error) {
    return {
      success: false,
      feedback: [],
      message: error.response?.data || error.message || 'Failed to fetch all feedback'
    };
  }
};

export const generateAIChatResponse = async (userMessage) => {
  const lowText = userMessage.toLowerCase().trim();

  const qaData = {
    "hello": "Hello! I am your InsuAI Assistant. I can help you with policy inquiries, recommendations, and general insurance questions. How can I assist you today?",
    "hi": "Hi there! How can I help you with your insurance needs today?",
    "hey": "Hey! How can I assist you today?",

    "general policy inquiry": "We offer a wide range of insurance products including Health, Life, Auto, and Corporate plans. You can view all our active offerings in the 'Policy Offerings' section. Is there a specific type you're interested in?",

    "what insurance policies are available?": "Currently, we have Comprehensive Health Insurance, Term Life Protection, Premium Auto Insurance, and specialized Business Coverage available. Each plan is designed to provide maximum security for your specific needs.",

    "show me all health insurance plans": "Our health plans include: 1. Individual Star Health, 2. Family Floater Plus, and 3. Senior Citizen Care. These plans cover hospitalization, pre-existing diseases (after waiting period), and regular health check-ups.",

    "what is the best policy for senior citizens?": "For senior citizens, we highly recommend our 'Senior Citizen Care' policy. It features lower waiting periods for pre-existing diseases, cashless hospitalization across 5000+ hospitals, and dedicated support for elderly claims.",

    "do you offer corporate insurance plans?": "Yes, we offer Group Health and Liability insurance for corporations. Our plans include employee wellness programs and simplified claim processing for HR departments. Would you like to speak to a corporate specialist?",

    "what documents are required to apply for a policy?": "To apply, you typically need: 1. A valid Govt ID (Aadhar/Passport), 2. Address Proof, 3. Income Proof (for Life Insurance), and 4. Recent medical reports (if applicable for health plans over age 45).",

    "suggest a health insurance plan for a 35-year-old": "For a 35-year-old, the 'Individual Star Health' plan is ideal. It offers a high sum insured with low premiums, restoration benefits, and covers modern treatments. It's the perfect balance of cost and coverage.",

    "which policy is best for my family?": "The 'Family Floater Plus' is our top recommendation for families. It covers you, your spouse, and up to 3 children under a single sum insured, making it more cost-effective than individual policies.",

    "i want low premium and high coverage, what do you suggest?": "If you're looking for value, our 'Direct Benefit' plans offer competitive premiums by focusing on core coverages. You can also opt for a higher deductible to significantly lower your annual premium.",

    "recommend a policy for critical illness coverage": "Our 'Critical Illness Rider' can be added to any Health or Life policy. It provides a lump sum payment upon diagnosis of 30+ critical illnesses, including cancer and heart stroke, to help with treatment costs.",

    "what insurance plan is suitable for small businesses?": "The 'SME Protector' plan is designed specifically for small businesses. It covers fire, theft, and public liability, ensuring your business assets and reputation remain secure during unforeseen events."
  };

  // Simulate a small delay for a natural feel
  await new Promise(resolve => setTimeout(resolve, 800));

  // Find exact match or keyword match
  const match = Object.keys(qaData).find(key => lowText.includes(key));

  if (match) {
    return {
      success: true,
      text: qaData[match]
    };
  }

  // Fallback
  return {
    success: true,
    text: "That's a great question! While I don't have a specific answer for that in my current database, I can help you with policy inquiries, health plans, or document requirements. Would you like to see our available policies?"
  };
};

export default api;
