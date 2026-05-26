import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import Layout from './components/Layout';
import About from './pages/About';
import JoinUs from './pages/JoinUs';
import Admin from './pages/Admin';
import Community from './pages/Community';
import Assignments from './pages/Assignments';
import Impact from './pages/Impact';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/"           element={<About />} />
              <Route path="/community"  element={<Community />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/impact"     element={<Impact />} />
              <Route path="/join"       element={<JoinUs />} />
              <Route path="/admin"      element={<Admin />} />
              <Route path="*"           element={<PageNotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
