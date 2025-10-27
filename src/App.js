import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [form, setForm] = useState({ gmat: "", gpa: "", exp: "", goal: "Tech", budget: 50000 });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await axios.post("https://collegecompass-backend.onrender.com/api/match", form);
    setResults(res.data);
    setLoading(false);
    setComparison([]);
  };

  const toggleCompare = (college) => {
    const alreadySelected = comparison.find(c => c.name === college.name);
    if (alreadySelected) {
      setComparison(comparison.filter(c => c.name !== college.name));
    } else if (comparison.length < 2) {
      setComparison([...comparison, college]);
    }
  };

  return (
    <div className="container">
      <h2>🎯 CollegeCompass AI</h2>
      <form onSubmit={handleSubmit}>
        <input type="number" placeholder="GMAT" onChange={e => setForm({...form, gmat: +e.target.value})}/>
        <input type="number" step="0.1" placeholder="GPA" onChange={e => setForm({...form, gpa: +e.target.value})}/>
        <input type="number" placeholder="Work Exp (years)" onChange={e => setForm({...form, exp: +e.target.value})}/>
        <select onChange={e => setForm({...form, goal: e.target.value})}>
          <option>Tech</option><option>Finance</option><option>Consulting</option>
        </select>
        <input type="number" placeholder="Budget (USD)" onChange={e => setForm({...form, budget: +e.target.value})}/>
        <button type="submit">Find My Fit</button>
      </form>

      {loading ? <p>Finding matches...</p> :
        <>
          {results.map((r, i) => (
            <div key={i} className="card">
              <input
                type="checkbox"
                checked={comparison.some(c => c.name === r.name)}
                onChange={() => toggleCompare(r)}
                disabled={!comparison.some(c => c.name === r.name) && comparison.length >= 2}
                style={{marginRight: '8px'}}
              />
              <strong>{r.name}</strong>
              <p>Region: {r.region}</p>
              <p>Fit Score: {r.fit_score}%</p>
              <p>ROI: {r.roi}x</p>
              <small>{r.reason}</small>
              <div style={{
                background: `linear-gradient(to right, #4caf50 ${r.fit_score}%, #eee 0%)`,
                height: '8px',
                margin: '6px 0'
              }}></div>
            </div>
          ))}

          {comparison.length === 2 && (
            <div className="comparison-modal">
              <h2>College Comparison</h2>
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>{comparison[0].name}</th>
                    <th>{comparison[1].name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Region</td>
                    <td>{comparison[0].region}</td>
                    <td>{comparison[1].region}</td>
                  </tr>
                  <tr>
                    <td>Fit Score</td>
                    <td>{comparison[0].fit_score}%</td>
                    <td>{comparison[1].fit_score}%</td>
                  </tr>
                  <tr>
                    <td>ROI</td>
                    <td>{comparison[0].roi}x</td>
                    <td>{comparison[1].roi}x</td>
                  </tr>
                  <tr>
                    <td>Reasoning</td>
                    <td>{comparison[0].reason}</td>
                    <td>{comparison[1].reason}</td>
                  </tr>
                </tbody>
              </table>
              <button onClick={() => setComparison([])}>Close Comparison</button>
            </div>
          )}
        </>
      }
    </div>
  );
}
export default App;
