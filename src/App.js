import React, { useState, useEffect } from "react"
import quizData from "./Data"
import "./App.css"

function Game() {
  const [step, setStep] = useState("start")
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState("")
  const [msg, setMsg] = useState("")
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(15)

  useEffect(() => {
    if (step !== "play") return
    if (time === 0) {
      next(false)
      return
    }
    const t = setInterval(() => setTime(t => t - 1), 1000)
    return () => clearInterval(t)
  }, [time, step])
  // เวลาในการตอบคำถาม
  const start = () => {
    setStep("play")
    setIndex(0)
    setScore(0)
    setTime(50) 
    setInput("")
    setMsg("")
  }

  const check = () => {
    const ans = (q?.answer || "").trim().toLowerCase()
    const ok = ans === input.trim().toLowerCase()
    next(ok)
  }

  const next = (ok) => {
    if (ok) setScore(s => s + 1)
    setMsg(ok ? "✅ ถูกต้อง!" : "❌ ผิดหรือหมดเวลา!")

    setTimeout(() => {
      if (index + 1 < quizData.length) {
        setIndex(i => i + 1)
        setTime(50)
        setInput("")
        setMsg("")
      } else {
        setStep("end")
      }
    }, 900)
  }

  const q = quizData[index] || {}
  const syll = q.syllables ?? "?"

  if (step === "start") {
    return (
      <div className="wrap">
        <h1 className="title">🧩 Decode the Pictures</h1>

        <div className="start-image-container">
          <img src="/images/พื้นหลังเกม.jpg" alt="start" className="start-image" />
          <p className="start-desc">
            เกมทายคำจากภาพ <br />
            ดูภาพดี ๆ แล้วพิมพ์คำตอบให้ถูก!
          </p>
        </div>

        <button className="start-btn" onClick={start}>เริ่มเล่น</button>
      </div>
    )
  }

  if (step === "end") {
    return (
      <div className="wrap">
        <h1 className="title">🏁 จบเกม!</h1>
        <p className="score">ได้คะแนน {score} / {quizData.length}</p>
        <button className="start-btn" onClick={start}>เล่นใหม่</button>
      </div>
    )
  }

  return (
    <div className="wrap">
      <h2 className="title">
        ข้อ {index + 1} / {quizData.length}
      </h2>

      <div className="img-grid">
        {q.images?.map((img, i) => (
          <img key={i} src={img} alt={`quiz-${i}`} className="img-multi" />
        ))}
      </div>

      <p className="question-text">{q.question}</p>
      <div className="hint-box">💡 พยางค์ : {syll}</div>

      <input
        className="input"
        placeholder="พิมพ์คำตอบที่นี่..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div className="btns">
        <button onClick={check}>ตรวจคำตอบ</button>
      </div>

      <p className="msg">{msg}</p>

      <div className="info">
        <span>⏱ {time}s</span>
        <span>⭐ {score}</span>
      </div>
    </div>
  )
}

export default Game
