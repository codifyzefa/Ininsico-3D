import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home/Home';
 import Contacter from './Home/contact';
import LoginPage from './pages/loginpage';
import TermsPage from './Home/terms';
import PrivacyPolicy from './Home/privacy';
import SecurityPage from './Home/security';
import ModelEditor from './ModelEditor';
import SignupPage from './pages/Siguppage';
import MainApp from './instasisco/MainApp';
import explore from './instasisco/explore';
import activity from './instasisco/activity';
import messages from './instasisco/messages';
import quicks from './instasisco/quiks';
import search from './instasisco/search';
import username from './instasisco/username';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contacter />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='security' element={<SecurityPage />} />
        <Route path="/editor" element={<ModelEditor />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<MainApp />} />
        
        <Route path="/dashboard" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;
