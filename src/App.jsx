import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import Home from './pages/Home';
import RecipeOverview from './pages/RecipeOverview';
import LiveCooking from './pages/LiveCooking';
import SaveRecipe from './pages/SaveRecipe';
import MyRecipes from './pages/MyRecipes';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: "var(--page-bg)" }}>
        <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: "var(--green-100)", borderTopColor: "var(--green-500)" }}></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipe/:id" element={<RecipeOverview />} />
      <Route path="/cooking/:id" element={<LiveCooking />} />
      <Route path="/save-recipe/:id" element={<SaveRecipe />} />
      <Route path="/my-recipes" element={<MyRecipes />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router basename="/recipeApp/"r>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App