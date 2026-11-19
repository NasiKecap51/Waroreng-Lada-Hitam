var form = document.getElementById("formLogin");
var pesan = document.getElementById("pesan");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  var username = document.getElementById("username").value.trim();
  var password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    pesan.textContent = "Login berhasil! Mengalihkan ke halaman utama...";
    pesan.className = "pesan sukses tampil";
    setTimeout(function () {
      window.location.href = "index.html";
    }, 1000);
  } else {
    pesan.textContent = "Login gagal! Username atau password salah.";
    pesan.className = "pesan gagal tampil";
  }
});