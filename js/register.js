/* register.js - simpan akun baru ke localStorage (butuh auth.js dimuat lebih dulu) */
(function () {
  var form = document.getElementById('formRegister');
  var pesan = document.getElementById('pesanRegister');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var hasil = Auth.register({
      nama: document.getElementById('rn').value,
      email: document.getElementById('re').value,
      username: document.getElementById('ru').value,
      password: document.getElementById('rp').value
    });
    if (hasil.ok) {
      pesan.style.color = 'green';
      pesan.textContent = 'Akun berhasil dibuat. Mengalihkan ke login...';
      setTimeout(function () { location.href = 'login.html'; }, 900);
    } else {
      pesan.style.color = 'crimson';
      pesan.textContent = hasil.msg;
    }
  });
})();
