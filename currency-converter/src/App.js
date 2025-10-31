import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [amt, setAmt] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("THB");
  const [res, setRes] = useState(null);
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูลอัตราแลกเปลี่ยน
  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
        if (!res.ok) throw new Error("Failed to fetch exchange rates");
        const data = await res.json();
        setRates(data.rates);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchRates();
  }, [from]);

  // ฟังก์ชันแปลงค่าเงิน
  const convert = () => {
    if (!rates[to]) return;
    const result = (amt * rates[to]).toFixed(2);
    setRes(result);
  };

  // คำนวณอัตโนมัติเมื่อเปลี่ยนค่า
  useEffect(() => {
    if (Object.keys(rates).length > 0) {
      convert();
    }

  }, [amt, to, rates]);

  return (
    <div className="container">
      <h1>💱 Currency Converter</h1>

      {loading && <p>กำลังโหลดข้อมูลอัตราแลกเปลี่ยน...</p>}
      {error && <p className="error">❌ {error}</p>}

      {!loading && !error && (
        <>
          <div className="input-group">
            <input
              type="number"
              min="0"
              value={amt}
              onChange={(e) => setAmt(e.target.value)}
            />

            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              {Object.keys(rates).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <span>➡️</span>

            <select value={to} onChange={(e) => setTo(e.target.value)}>
              {Object.keys(rates).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {res && (
            <h2 className="result">
              {amt} {from} = {res} {to}
            </h2>
          )}
        </>
      )}

      <footer>ใส่จำนวนเงิน แล้วเลือกสกุลที่ต้องการแปลง ระบบจะคำนวณให้อัตโนมัติ</footer>
    </div>
  );
}

export default App;
