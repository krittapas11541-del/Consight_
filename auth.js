// auth.js
export function setupAuth() {
  const loginForm = document.getElementById('loginForm');
  const loginPage = document.getElementById('loginPage');
  const dashboardPage = document.getElementById('dashboardPage');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('inputName').value;
    const cls = document.getElementById('inputClass').value;
    const id = document.getElementById('inputID').value;
    const consent = document.getElementById('consentCheck').checked;

    // ถ้าข้อมูลครบ ให้เปลี่ยนหน้า
    if (name && cls && id && consent) {
      loginPage.classList.add('hidden');
      dashboardPage.classList.remove('hidden');
      dashboardPage.classList.add('animate-fade-in');
      dashboardPage.style.display = 'grid';

      document.getElementById('displayName').innerText = name;
      document.getElementById('displayClass').innerText = "ชั้น: " + cls;
      document.getElementById('displayID').innerText = "รหัส: " + id;
      
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      document.getElementById('currentDate').innerText = new Date().toLocaleDateString('th-TH', options);
    } 
    // เติมส่วนนี้เข้าไป! ถ้าข้อมูลไม่ครบให้เด้งแจ้งเตือน
    else {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน และติ๊กยอมรับนโยบายก่อนเข้าใช้งานครับ");
      console.log("ข้อมูลที่รับมา:", { name, cls, id, consent }); // แอบดูค่าใน Console ว่าอันไหนหายไป
    }
  });
}