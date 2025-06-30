import { useState } from 'react';

export default function PredictForm() {
  const [features, setFeatures] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      const response = await fetch('https://YOUR-BACKEND-URL.onrailway.app/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: JSON.parse(features) })
      });

      const data = await response.json();
      setPrediction(data.predicted_price);
    } catch (error) {
      console.error(error);
      setPrediction('Error making prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>House Price Prediction</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={5}
          cols={50}
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          placeholder='Enter feature array, e.g., [7, 1500, 2, 500, 2, 2, 3, 1, 1]'
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>
      {prediction && <h3>Predicted Price: {prediction}</h3>}
    </div>
  );
}
