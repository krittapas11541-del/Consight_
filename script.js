// ==========================================
// 1. LOGIN & DASHBOARD LOGIC
// ==========================================
const loginForm = document.getElementById('loginForm');
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('inputName').value;
  const cls = document.getElementById('inputClass').value;
  const id = document.getElementById('inputID').value;
  const consent = document.getElementById('consentCheck').checked;

  if(name && cls && id && consent) {
    loginPage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
    dashboardPage.classList.add('animate-fade-in');
    
    dashboardPage.style.display = 'grid';
    
    document.getElementById('displayName').innerText = name;
    document.getElementById('displayClass').innerText = "ชั้น: " + cls;
    document.getElementById('displayID').innerText = "รหัส: " + id;
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric'});
  }
});

// ==========================================
// 2. MIC & SPEECH RECOGNITION SETUP
// ==========================================
const micBtn = document.getElementById('micBtn');
const pulseRing = document.getElementById('pulseRing');
const micLabel = document.getElementById('micLabel');
const resultArea = document.getElementById('result');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
  
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'th-TH';
recognition.continuous = true;
recognition.interimResults = true;
let isRecording = false;

micBtn.onclick = () => { 
  if(!isRecording) recognition.start(); 
  else recognition.stop(); 
};

recognition.onstart = () => {
  isRecording = true;
  micBtn.classList.add('recording');
  pulseRing.classList.remove('hidden');
  micLabel.innerText = "กำลังรับฟัง...";
  micLabel.classList.add('text-red-400');
};

recognition.onend = () => {
  isRecording = false;
  micBtn.classList.remove('recording');
  pulseRing.classList.add('hidden');
  micLabel.innerText = "แตะเพื่อเริ่มพูด";
  micLabel.classList.remove('text-red-400');
  
  if(resultArea.value.trim().length > 0) {
    analyzeBtn.disabled = false;
    analyzeBtn.classList.remove('bg-slate-700', 'text-slate-400');
    analyzeBtn.classList.add('bg-emerald-500', 'text-white');
  }
};

recognition.onresult = (e) => {
  let t = ''; 
  for (let i = e.resultIndex; i < e.results.length; i++) {
    t += e.results[i][0].transcript;
  }
  resultArea.value = t;
};

// เคลียร์ข้อความ
clearBtn.addEventListener('click', () => {
  resultArea.value = '';
  analyzeBtn.disabled = true;
  analyzeBtn.classList.add('bg-slate-700', 'text-slate-400');
  analyzeBtn.classList.remove('bg-emerald-500', 'text-white');
  document.getElementById('reportContent').classList.add('hidden');
  document.getElementById('emptyState').classList.remove('hidden');
});

// ==========================================
// 3. KNOWLEDGE BASE & SCENARIOS (ไม่ได้ใช้แล้ว แต่เก็บไว้เป็นข้อมูลอ้างอิง)
// ==========================================
// ... (คุณสามารถเก็บตัวแปร scenarios ไว้เหมือนเดิมได้เลยครับ) ...

// ==========================================
// 4. ANALYZE ACTION (เชื่อมต่อ Google Apps Script)
// ==========================================
analyzeBtn.onclick = async () => {
  const text = resultArea.value;
  if(!text) return;

  // 1. ซ่อนหน้าต่างอื่นๆ และแสดงหน้า Loading
  document.getElementById('emptyState').classList.add('hidden');
  document.getElementById('loadingState').classList.remove('hidden');
  document.getElementById('reportContent').classList.add('hidden');

  // 2. กำหนด URL ของ Google Apps Script
  // ⚠️ สำคัญ: นำ URL ที่ได้จากการ Deploy ของ GAS (ลงท้ายด้วย /exec) มาวางแทนที่ด้านล่างนี้
  const webhookUrl = 'https://script.google.com/macros/s/AKfycbytIhd6t6vIGwoorzA-a8JseMJl8c9hrR6jUtCpC-ZxsgxKGfJL3yoAK43zXTkG1uYMkg/exec'; 

  try {
    // 3. ยิง Request ไปที่ GAS
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        // ใช้ text/plain เพื่อกันไม่ให้เบราว์เซอร์บล็อกการเชื่อมต่อ (แก้ CORS Error 100%)
        'Content-Type': 'text/plain;charset=utf-8' 
      },
      body: JSON.stringify({
        studentName: document.getElementById('displayName').innerText,
        studentId: document.getElementById('inputID').value,
        message: text 
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }

    // 4. รับผลลัพธ์กลับมา (GAS จะส่งกลับมาเป็น JSON สำเร็จรูปพร้อมใช้)
    const data = await response.json(); 

    // ซ่อนหน้า Loading และแสดงหน้า Report
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('reportContent').classList.remove('hidden');
    
    // 5. นำข้อมูลจาก JSON มาแสดงผลบนหน้าจอ
    const risk = data.stressRisk || 0;
    document.getElementById('stressScore').innerText = risk + "%";
    document.getElementById('stabilityScore').innerText = (100 - risk) + "%";
    
    const stressEl = document.getElementById('stressScore');
    if(risk > 70) stressEl.className = "text-xl md:text-2xl font-bold text-red-500 mt-1";
    else if(risk > 40) stressEl.className = "text-xl md:text-2xl font-bold text-amber-400 mt-1";
    else stressEl.className = "text-xl md:text-2xl font-bold text-emerald-400 mt-1";

    document.getElementById('textCore').innerText = data.core || "-";
    document.getElementById('textCause').innerText = data.cause || "-";
    
    if (data.solutions && Array.isArray(data.solutions)) {
      document.getElementById('textSolution').innerHTML = data.solutions.map(s => 
        `<div class="flex items-start gap-2"><span class="text-emerald-400 mt-1">•</span><span>${s}</span></div>`
      ).join('');
    } else {
      document.getElementById('textSolution').innerHTML = "-";
    }

  } catch (error) {
    console.error('❌ Error Fetching to GAS:', error);
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ AI กรุณาลองใหม่อีกครั้ง');
    
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('emptyState').classList.remove('hidden');
  }
};



