// ==========================================
// 1. LOGIN & DASHBOARD LOGIC
// ==========================================
const loginForm = document.getElementById('loginForm');
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const counselor = document.getElementById('inputCounselor').value;
  const name = document.getElementById('inputName').value;
  const cls = document.getElementById('inputClass').value;
  const id = document.getElementById('inputID').value;

  if(name && cls && id && counselor) {
    loginPage.classList.add('hidden');
    dashboardPage.classList.remove('hidden');
    dashboardPage.classList.add('animate-fade-in');
    dashboardPage.style.display = 'grid';
    
    document.getElementById('displayName').innerText = `${name} (${cls} - ${id})`;
    document.getElementById('displayCounselor').innerText = counselor;
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString('th-TH', { year:'numeric', month:'long', day:'numeric'});
  }
});

// ==========================================
// 2. MIC, FILE UPLOAD & RECOGNITION
// ==========================================
const micBtn = document.getElementById('micBtn');
const pulseRing = document.getElementById('pulseRing');
const micLabel = document.getElementById('micLabel');
const resultArea = document.getElementById('result');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const audioUpload = document.getElementById('audioUpload');
  
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'th-TH';
recognition.continuous = true;
recognition.interimResults = true;
let isRecording = false;

// จัดการปุ่ม Mic
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
  checkTextToEnableButton();
};

recognition.onresult = (e) => {
  let t = ''; 
  for (let i = e.resultIndex; i < e.results.length; i++) {
    t += e.results[i][0].transcript;
  }
  resultArea.value = t;
};

// จัดการ Upload ไฟล์เสียง (Mockup STT Process)
if (audioUpload) {
    audioUpload.addEventListener('change', (e) => {
        if(e.target.files.length > 0) {
            const file = e.target.files[0];
            micLabel.innerText = "กำลังถอดเสียงจากไฟล์...";
            
            // จำลองเวลาในการใช้ AI STT ถอดเสียง 1.5 วินาที
            setTimeout(() => {
                resultArea.value += `[ถอดเสียงจากไฟล์ ${file.name}] ...นักเรียนรู้สึกเครียดและกังวลเกี่ยวกับการสอบเข้ามหาวิทยาลัย พ่อแม่อยากให้เรียนหมอแต่ตัวเองอยากเรียนนิเทศศาสตร์ พยายามคุยแล้วแต่พ่อแม่ไม่ฟังจนรู้สึกไม่อยากกลับบ้าน...`;
                micLabel.innerText = "แตะเพื่อเริ่มพูด";
                checkTextToEnableButton();
            }, 1500);
        }
    });
}

function checkTextToEnableButton() {
    if(resultArea.value.trim().length > 0) {
        analyzeBtn.disabled = false;
        analyzeBtn.classList.remove('bg-slate-700', 'text-slate-400');
        analyzeBtn.classList.add('bg-emerald-500', 'text-white');
    }
}

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
// 3. ANALYZE ACTION (เชื่อมต่อ Make.com Webhook)
// ==========================================
analyzeBtn.onclick = async () => {
  const text = resultArea.value;
  if(!text) return;

  document.getElementById('emptyState').classList.add('hidden');
  document.getElementById('loadingState').classList.remove('hidden');
  document.getElementById('reportContent').classList.add('hidden');

  // ⚠️ ตรวจสอบ URL ตรงนี้ให้ดี ต้องขึ้นต้นด้วย https:// และไม่มีตัวอักษรอื่นปนอยู่ด้านหน้า
  const webhookUrl = 'https://hook.us2.make.com/756y9kdvd15rm8y8hyr5xcs191lxjo8n' 

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        counselor: document.getElementById('displayCounselor').innerText,
        student: document.getElementById('displayName').innerText,
        text: text 
      })
    });

    if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);

    // รับและทำความสะอาดข้อมูล JSON จาก Make.com
    const rawText = await response.text(); 
    const cleanText = rawText.replace(/```json/ig, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanText); 

    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('reportContent').classList.remove('hidden');
    
    // --- อัปเดต UI ให้ตรงกับ SOAP Form ---
    
    // Emotion & Sentiment
    document.getElementById('badgeSentiment').innerText = data.sentiment || "ไม่ระบุ";
    document.getElementById('badgeSentiment').className = `px-2 py-1 rounded text-xs font-bold ${data.sentiment === 'เชิงบวก' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`;
    
    document.getElementById('badgeEmotion').innerText = data.emotion || "-";

    // SOAP Elements
    document.getElementById('textS').innerText = data.subjective || text;
    document.getElementById('textO').innerText = data.objective || "-";
    document.getElementById('textA').innerText = data.assessment || "-";
    
    const risk = data.riskLevel || "ปานกลาง";
    document.getElementById('riskLevel').innerText = risk;
    
    // ปรับสีป้ายแจ้งเตือนความเสี่ยง
    if(risk === 'สูง') {
        document.getElementById('riskLevel').className = "text-xs font-bold px-2 py-1 rounded bg-red-500 text-white";
    } else if (risk === 'ปานกลาง') {
        document.getElementById('riskLevel').className = "text-xs font-bold px-2 py-1 rounded bg-amber-500 text-white";
    } else {
        document.getElementById('riskLevel').className = "text-xs font-bold px-2 py-1 rounded bg-emerald-500 text-white";
    }

    const planData = data.plan || [];
    if (Array.isArray(planData) && planData.length > 0) {
      document.getElementById('textP').innerHTML = planData.map(s => 
        `<div class="flex items-start gap-2"><span class="text-emerald-400 mt-1">•</span><span>${s}</span></div>`
      ).join('');
    } else {
      document.getElementById('textP').innerHTML = "-";
    }

  } catch (error) {
    console.error('Error:', error);
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับ Make.com: ' + error.message);
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('emptyState').classList.remove('hidden');
  }
};


