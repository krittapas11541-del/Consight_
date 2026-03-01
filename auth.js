// auth.js
export function setupAuth() {
  // เปลี่ยนเป้าหมายมาจับที่ ID ของปุ่มแทน
  const loginBtn = document.getElementById('loginBtn');
  const loginPage = document.getElementById('loginPage');
  const dashboardPage = document.getElementById('dashboardPage');

  // ดักไว้ก่อน เผื่อหาปุ่มไม่เจอจะได้รู้
  if (!loginBtn) {
      console.log("⚠️ หาปุ่มไม่เจอ: อย่าลืมใส่ id='loginBtn' ที่ปุ่มเข้าสู่ระบบใน HTML นะครับ");
      return;
  }

  // เมื่อมีการคลิกปุ่ม
  loginBtn.addEventListener('click', (e) => {
    e.preventDefault(); // คำสั่งศักดิ์สิทธิ์ บังคับหยุดการรีเฟรชหน้าเว็บ!

    // ดึงค่าจากช่องกรอกข้อมูล
    const name = document.getElementById('inputName').value;
    const cls = document.getElementById('inputClass').value;
    const id = document.getElementById('inputID').value;
    const consent = document.getElementById('consentCheck').checked;

    // เช็คว่ากรอกครบไหม
    if (name && cls && id && consent) {
      // ข้อมูลครบ -> เปลี่ยนไปหน้า Dashboard
      loginPage.classList.add('hidden');
      dashboardPage.classList.remove('hidden');
      dashboardPage.classList.add('animate-fade-in');
      dashboardPage.style.display = 'grid';

      // เอาชื่อไปโชว์
      document.getElementById('displayName').innerText = name;
      document.getElementById('displayClass').innerText = "ชั้น: " + cls;
      document.getElementById('displayID').innerText = "รหัส: " + id;
      
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      document.getElementById('currentDate').innerText = new Date().toLocaleDateString('th-TH', options);
    } else {
      // ข้อมูลไม่ครบ -> เด้งแจ้งเตือน
      alert("กรุณากรอกข้อมูลให้ครบถ้วน และติ๊กยอมรับนโยบายก่อนเข้าใช้งานครับ");
    }
  });
}