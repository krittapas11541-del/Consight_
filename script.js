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
// 3. KNOWLEDGE BASE & SCENARIOS
// ==========================================
// (ส่วนนี้เก็บไว้เผื่อใช้เป็น Fallback ได้ในอนาคต หากไม่ได้ใช้แล้วสามารถลบออกได้ครับ)
const scenarios = [
  {
    id: 'academic',
    keywords: ['สอบ', 'เกรด', 'เรียน', 'การบ้าน', 'อ่านหนังสือ', 'มหาวิทยาลัย', 'สอบตก', 'คะแนน'],
    core: 'ความวิตกกังวลด้านผลการเรียนและการศึกษาต่อ (Academic Stress)',
    cause: 'แรงกดดันจากความคาดหวังของตนเองหรือครอบครัว และความไม่มั่นใจในการเตรียมตัวสอบ',
    solutions: [
      'จัดตารางเวลาอ่านหนังสือให้ชัดเจน (Time Boxing)',
      'ปรึกษาครูประจำวิชาเพื่อขอคำแนะนำในจุดที่อ่อน',
      'โฟกัสที่ความก้าวหน้าเล็กๆ น้อยๆ แทนความสมบูรณ์แบบ',
      'นัดคุยกับครูแนะแนวเรื่องการวางแผนศึกษาต่อ'
    ]
  },
  {
    id: 'family',
    keywords: ['พ่อ', 'แม่', 'ที่บ้าน', 'ครอบครัว', 'โดนด่า', 'ทะเลาะ', 'ไล่ออก', 'ไม่เข้าใจ', 'บังคับ'],
    core: 'ความขัดแย้งภายในครอบครัว (Family Conflict)',
    cause: 'ช่องว่างระหว่างวัย (Generation Gap) และรูปแบบการสื่อสารที่ไม่ตรงกัน หรือความคาดหวังที่สูงเกินไปของผู้ปกครอง',
    solutions: [
      'หาจังหวะเวลาที่อารมณ์เย็นลงทั้งสองฝ่ายเพื่อเปิดใจคุย',
      'ใช้ "I Message" ในการสื่อสาร (เช่น "หนูรู้สึก..." แทน "แม่ทำไม...")',
      'ปรึกษาครูที่ปรึกษาเพื่อช่วยเป็นคนกลางในการเจรจา',
      'หากิจกรรมทำร่วมกันเพื่อกระชับความสัมพันธ์'
    ]
  },
  {
    id: 'social',
    keywords: ['เพื่อน', 'แฟน', 'เหงา', 'เข้ากับคนอื่นไม่ได้', 'โดนแกล้ง', 'นินทา', 'กลุ่ม', 'เลิก', 'อกหัก'],
    core: 'ปัญหาความสัมพันธ์และการปรับตัวทางสังคม (Social & Relationship Issues)',
    cause: 'ความเข้าใจผิด การสื่อสารที่คลาดเคลื่อน หรือการถูกกีดกันออกจากกลุ่มสังคม (Social Exclusion)',
    solutions: [
      'ถอยออกมามองปัญหาอย่างเป็นกลาง ไม่โทษตัวเองฝ่ายเดียว',
      'ปรึกษาเพื่อนสนิทที่ไว้ใจได้หรือครูแนะแนว',
      'เข้าร่วมชมรมหรือกิจกรรมที่ตนเองสนใจเพื่อเจอเพื่อนกลุ่มใหม่',
      'ฝึกทักษะการปฏิเสธ (Assertiveness) เมื่อไม่สบายใจ'
    ]
  },
  {
    id: 'financial',
    keywords: ['เงิน', 'ค่าเทอม', 'ไม่มีตัง', 'จน', 'รายจ่าย', 'หนี้', 'ยืม'],
    core: 'ความเครียดด้านเศรษฐานะ (Financial Stress)',
    cause: 'สภาพคล่องทางการเงินในครอบครัวไม่เพียงพอ หรือภาระค่าใช้จ่ายที่สูงขึ้นฉับพลัน',
    solutions: [
      'ติดต่อฝ่ายกิจการนักเรียนเพื่อขอข้อมูลทุนการศึกษา',
      'วางแผนการใช้จ่ายรายวัน (ทำบัญชีรายรับ-รายจ่าย)',
      'ปรึกษาครูที่ปรึกษาเพื่อหาแนวทางช่วยเหลือฉุกเฉิน',
      'หารายได้เสริมที่เหมาะสมและไม่กระทบการเรียน'
    ]
  },
  {
    id: 'addiction',
    keywords: ['เกม', 'นอนดึก', 'ไม่ตื่น', 'ติดโทรศัพท์', 'ขี้เกียจ', 'เบื่อ'],
    core: 'ปัญหาพฤติกรรมและการจัดระเบียบวินัย (Behavioral Issues)',
    cause: 'ขาดแรงจูงใจในการเรียน (Lack of Motivation) หรือการเสพติดสิ่งเร้าเพื่อหลีกหนีปัญหา',
    solutions: [
      'ตั้งเป้าหมายเล็กๆ ที่ทำสำเร็จได้ง่ายในแต่ละวัน',
      'จำกัดเวลาหน้าจอ (Screen Time) อย่างเป็นขั้นตอน',
      'หาแรงบันดาลใจใหม่ๆ นอกห้องเรียน',
      'ปรับเวลานอนให้เร็วขึ้นทีละ 15 นาที'
    ]
  },
  {
    id: 'depression', 
    keywords: ['ตาย', 'ฆ่าตัวตาย', 'ไม่อยากอยู่', 'หายไป', 'ไร้ค่า', 'เจ็บ', 'กรีด', 'เศร้า'],
    core: 'ภาวะความเสี่ยงด้านสุขภาพจิต (Mental Health Risk) - **ต้องการการดูแลด่วน**',
    cause: 'ภาวะซึมเศร้าสะสม ความรู้สึกโดดเดี่ยว หรือสารเคมีในสมองไม่สมดุล',
    solutions: [
      '**แจ้งครูพยาบาลหรือนักจิตวิทยาโรงเรียนทันที**',
      'ติดต่อสายด่วนสุขภาพจิต 1323',
      'อย่าปล่อยให้นักเรียนอยู่คนเดียว',
      'รับฟังด้วยความเข้าใจโดยไม่ตัดสิน (Active Listening)'
    ]
  }
];

const defaultScenario = {
  core: 'ความเครียดทั่วไปในวัยเรียน (General Stress)',
  cause: 'ภาระงานที่สะสมหรือการพักผ่อนไม่เพียงพอ',
  solutions: [
    'จัดลำดับความสำคัญของงาน (Priority Setting)',
    'หาเวลาพักผ่อนเพื่อผ่อนคลายสมอง (Refresh)',
    'พูดคุยระบายความรู้สึกกับคนที่ไว้ใจ'
  ]
};

function getScenario(text) {
  for (let s of scenarios) {
    if (s.keywords.some(k => text.includes(k))) {
      return s;
    }
  }
  return defaultScenario;
}

// ==========================================
// 4. ANALYZE ACTION (เชื่อมต่อกับ Make.com)
// ==========================================
analyzeBtn.onclick = async () => {
  const text = resultArea.value;
  if(!text) return;

  // แสดงหน้าโหลด
  document.getElementById('emptyState').classList.add('hidden');
  document.getElementById('loadingState').classList.remove('hidden');
  document.getElementById('reportContent').classList.add('hidden');

  // URL ของ Make.com Webhook ของคุณ
  const webhookUrl = 'https://hook.us2.make.com/i96gm5v124bo8kwxamxwdemjdek32rvx';

  try {
    // ส่งข้อมูลไปที่ Make.com (ลบส่วน API Key ที่ทำให้ Error ออกแล้ว)
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // ข้อมูลที่ต้องการส่งไปให้ Make วิเคราะห์
        studentName: document.getElementById('displayName').innerText,
        studentId: document.getElementById('inputID').value,
        message: text 
      })
    });

    if (!response.ok) throw new Error('Network response was not ok');

    // รับผลลัพธ์ที่ Make.com ส่งกลับมา (Make ต้องมีโมดูล Webhook Response)
    const data = await response.json(); 

    // ซ่อนหน้าโหลด และแสดงผลลัพธ์
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('reportContent').classList.remove('hidden');

    // --- นำข้อมูลที่ Make ตอบกลับมา แสดงบนหน้าเว็บ ---
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
    }

  } catch (error) {
    console.error('Error fetching data from Make.com:', error);
    alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับ AI กรุณาลองใหม่อีกครั้ง');
    
    document.getElementById('loadingState').classList.add('hidden');
    document.getElementById('emptyState').classList.remove('hidden');
  }
};
