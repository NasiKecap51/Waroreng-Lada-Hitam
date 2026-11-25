/* login.js - proses form login (butuh auth.js dimuat lebih dulu) */
(function () {
  var form = document.getElementById('formLogin');
  var pesan = document.getElementById('pesan');
  var notif = document.getElementById('wajib-login');
  var dariBooking = location.hash === '#wajib-login';

  // Kotak "silakan login dulu" hanya tampil kalau dilempar dari halaman booking
  if (notif && !dariBooking) notif.style.display = 'none';

  // Sudah login? Tidak perlu lihat halaman login lagi
  if (Auth.current()) {
    location.replace(dariBooking ? 'booking.html' : 'index.html');
    return;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var u = document.getElementById('username').value;
    var p = document.getElementById('password').value;
    var sesi = Auth.login(u, p);
    if (sesi) {
      pesan.style.color = 'green';
      pesan.textContent = 'Login berhasil. Mengalihkan...';
      setTimeout(function () {
        location.href = dariBooking ? 'booking.html' : 'index.html';
      }, 600);
    } else {
      pesan.style.color = 'crimson';
      pesan.textContent = 'Username atau password salah.';
    }
  });
})();
