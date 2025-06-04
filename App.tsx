
import React, { useState, useEffect, useCallback } from 'react';
import { fetchRestaurantRecommendations } from './services/geminiService';
import { Restaurant } from './types';
import Header from './components/Header';
import RestaurantList from './components/RestaurantList';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorDisplay from './components/ErrorDisplay';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  const loadRecommendations = useCallback(async () => {
    if (typeof process.env.API_KEY === 'undefined' || process.env.API_KEY === "") {
        setApiKeyMissing(true);
        setError("API Key is missing. Please configure it in your environment variables.");
        setLoading(false);
        return;
    }
    setApiKeyMissing(false);
    setLoading(true);
    setError(null);
    try {
      const fetchedRecommendations = await fetchRestaurantRecommendations();
      setRecommendations(fetchedRecommendations);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to fetch recommendations: ${err.message}. Ensure your Gemini API key is valid and has permissions.`);
      } else {
        setError('An unknown error occurred while fetching recommendations.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadRecommendations]); // Correctly depends on loadRecommendations

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-100 to-red-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {apiKeyMissing && (
           <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <ErrorDisplay message={error || "API Key is missing."} onRetry={loadRecommendations} showRetry={false} />
           </div>
        )}
        {loading && !apiKeyMissing && <LoadingIndicator />}
        {!loading && error && !apiKeyMissing && (
          <ErrorDisplay message={error} onRetry={loadRecommendations} />
        )}
        {!loading && !error && !apiKeyMissing && recommendations.length === 0 && (
          <div className="text-center py-10">
            <p className="text-2xl text-stone-600">No recommendations available at the moment.</p>
            <p className="text-stone-500 mt-2">Try refreshing or check back later.</p>
          </div>
        )}
        {!loading && !error && !apiKeyMissing && recommendations.length > 0 && (
          <RestaurantList restaurants={recommendations} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
