import { useState } from 'react';
import './App.css';
// import CustomFileBar from "../src/component/custom-filebar/CustomFilebar";
import OnboardingComponent from "./components/onboarding/OnboardingComponent"; // Import the new component
import SignUpPage from './page/sign-up/SignUpPage';

import { LogIn } from 'lucide-react';
import LoginPage from './page/log-in/LogInComponent';



function App() {
  const [count, setCount] = useState(0);
  const [isOnboarding, setIsOnboarding] = useState(true); // State to control whether to show onboarding


  // Custom window controls


  const handleGetStarted = () => {
    setIsOnboarding(false); // Hide onboarding when Get Started is clicked
  };

  return (
    <>
      {/* file bar starts here */}

      {/* file bar ends here */}

      {isOnboarding ? (
        <OnboardingComponent onGetStarted={handleGetStarted} />
      ) : (
        <LoginPage />
      )}
    </>
  );
}

export default App;