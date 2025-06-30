import { useEffect, useState } from 'react';

const LABELS_MAP = {
  "OverallQual": "Overall Material & Finish Quality (1-10)", //1
  "ExterQual": "Exterior Material Quality (1-5)", // 2
  "BsmtQual": "Basement Height (1-5)", //3
  "GrLivArea": "Above Grade Living Area (sq ft)", //4
  "KitchenQual": "Kitchen Quality (1-5)", //5
  "GarageType": "Garage Location Type", //9
  "GarageFinish": "Garage Interior Finish (1-3)", //8
  "GarageCars": "Garage Car Capacity", //6
  "GarageArea": "Garage Area (sq ft)", //7
};


export default function PredictForm() {
  const [columns, setColumns] = useState([]);
  const [inputs, setInputs] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // LOCAL FastAPI backend
  const API_URL = 'http://127.0.0.1:8000';

  // On mount: fetch expected columns from FastAPI
  useEffect(() => {
    fetch(`${API_URL}/expected-features`)
      .then(res => res.json())
      .then(data => {
        setColumns(data.columns);
        const initial = {};
        data.columns.forEach(col => initial[col] = '');
        setInputs(initial);
      })
      .catch(err => {
        console.error(err);
        setError('Error loading expected features from backend.');
      });
  }, []);

  // Handle form input change
  const handleChange = (e, col) => {
    setInputs({
      ...inputs,
      [col]: e.target.value
    });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);
    setLoading(true);

    // Validate inputs
    const values = [];
    for (const col of columns) {
      const val = parseFloat(inputs[col]);
      if (isNaN(val)) {
        setError(`Invalid input for ${col}. Please enter all values as numbers.`);
        setLoading(false);
        return;
      }
      values.push(val);
    }

    // Call backend /predict
    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: values })
      });
      const data = await response.json();

      if (data.predicted_price !== undefined) {
        setPrediction(data.predicted_price.toFixed(2));
      } else if (data.error) {
        setError(data.error);
      } else {
        setError('Unexpected error in prediction.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>House Price Prediction</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {columns.length === 0 ? (
        <p>Loading form fields from backend...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {columns.map((col, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <label>
                <strong>{LABELS_MAP[col] || col}</strong>
                <input
                  type="number"
                  step="any"
                  value={inputs[col]}
                  onChange={(e) => handleChange(e, col)}
                  style={{
                    marginLeft: '10px',
                    padding: '5px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </label>
            </div>
          ))}
          <button type="submit" disabled={loading}>
            {loading ? 'Predicting...' : 'Predict'}
          </button>
        </form>
      )}
      {prediction && (
        <h3 style={{ marginTop: '20px', color: 'green' }}>
          Predicted Price: ${prediction}
        </h3>
      )}
    </div>
  );
}
