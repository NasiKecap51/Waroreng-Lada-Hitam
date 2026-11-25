/* auth.js - login "palsu" khusus frontend (pakai localStorage).
   Muat file ini di SEMUA halaman, sebelum script lain. */
(function () {
  var USERS_KEY = 'jk_users';
  var SESSION_KEY = 'jk_session';

  function read(key, def) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v == null ? def : v;
    } catch (e) { return def; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { }
  }

  // Daftar akun; otomatis diisi akun admin kalau masih kosong
  function users() {
    var u = read(USERS_KEY, null);
    if (!u || !u.length) {
      u = [{ username: 'admin', password: 'admin123', nama: 'ADMIN', email: 'admin@jelajahkita.example' }];
      write(USERS_KEY, u);
    }
    // Akun admin yang sudah tersimpan di browser dengan nama lama ikut diperbarui
    for (var i = 0; i < u.length; i++) {
      if (u[i].username === 'admin' && u[i].nama !== 'ADMIN') {
        u[i].nama = 'ADMIN';
        write(USERS_KEY, u);
      }
    }
    return u;
  }

  var Auth = {
    // Data profil selalu dibaca ulang dari daftar akun supaya nama/email terbaru yang tampil
    current: function () {
      var sesi = read(SESSION_KEY, null);
      if (!sesi) return null;
      var list = users();
      for (var i = 0; i < list.length; i++) {
        if (list[i].username === sesi.username) {
          return { username: list[i].username, nama: list[i].nama, email: list[i].email };
        }
      }
      return sesi;
    },

    login: function (username, password) {
      var uname = String(username).trim().toLowerCase();
      var list = users();
      for (var i = 0; i < list.length; i++) {
        if (list[i].username.toLowerCase() === uname && list[i].password === password) {
          var sesi = { username: list[i].username, nama: list[i].nama, email: list[i].email };
          write(SESSION_KEY, sesi);
          return sesi;
        }
      }
      return null;
    },

    register: function (data) {
      var list = users();
      var uname = String(data.username).trim().toLowerCase();
      for (var i = 0; i < list.length; i++) {
        if (list[i].username.toLowerCase() === uname) {
          return { ok: false, msg: 'Username sudah dipakai.' };
        }
      }
      list.push({
        username: String(data.username).trim(),
        password: data.password,
        nama: String(data.nama).trim(),
        email: String(data.email).trim()
      });
      write(USERS_KEY, list);
      return { ok: true };
    },

    logout: function () {
      try { localStorage.removeItem(SESSION_KEY); } catch (e) { }
    }
  };
  window.Auth = Auth;

  // ---- Gaya tombol profil (ditambah lewat JS supaya style.css tidak perlu diubah)
  var css = '' +
    '.profil{position:relative;display:inline-block}' +
    '.profil-tombol{cursor:pointer;font:inherit}' +
    '.profil-menu{display:none;position:absolute;right:0;top:calc(100% + 8px);min-width:200px;' +
    'background:#fff;color:#222;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.18);padding:8px;z-index:999;text-align:left}' +
    '.profil.buka .profil-menu{display:block}' +
    '.profil-info{padding:8px 10px;border-bottom:1px solid #eee;margin-bottom:6px;line-height:1.4}' +
    '.profil-info strong{display:block}' +
    '.profil-info span{font-size:.85em;color:#666;word-break:break-all}' +
    '.profil-menu a,.profil-menu button{display:block;width:100%;padding:8px 10px;border:0;background:none;' +
    'color:#222;text-align:left;font:inherit;border-radius:6px;cursor:pointer;text-decoration:none}' +
    '.profil-menu a:hover,.profil-menu button:hover{background:#f1f5f4}' +
    '@media(max-width:768px){.profil{display:block}.profil-menu{position:static;box-shadow:none;border:1px solid #eee;margin-top:6px}}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---- Ganti tombol Login di navbar jadi Profil kalau sudah login
  function renderNav() {
    var user = Auth.current();
    if (!user) return;
    var links = document.querySelectorAll('nav.menu a[href="login.html"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var box = document.createElement('div');
      box.className = 'profil';
      box.innerHTML =
        '<button type="button" class="btn btn-kecil profil-tombol" aria-haspopup="true">👤 ' + esc(user.nama.split(' ')[0]) + ' ▾</button>' +
        '<div class="profil-menu">' +
        '<div class="profil-info"><strong>' + esc(user.nama) + '</strong><span>@' + esc(user.username) + '<br>' + esc(user.email) + '</span></div>' +
        '<a href="booking.html">Booking Saya</a>' +
        '<button type="button" class="profil-keluar">Logout</button>' +
        '</div>';
      a.parentNode.replaceChild(box, a);

      box.querySelector('.profil-tombol').addEventListener('click', function (e) {
        e.stopPropagation();
        this.parentNode.classList.toggle('buka');
      });
      box.querySelector('.profil-keluar').addEventListener('click', function () {
        Auth.logout();
        location.href = 'index.html';
      });
    }
    document.addEventListener('click', function () {
      var p = document.querySelectorAll('.profil.buka');
      for (var j = 0; j < p.length; j++) p[j].classList.remove('buka');
    });
  }

  // ---- Halaman booking wajib login + isi otomatis nama & email
  function guardBooking() {
    if (!/booking\.html$/.test(location.pathname)) return;
    var user = Auth.current();
    if (!user) {
      location.replace('login.html#wajib-login');
      return;
    }
    var info = document.querySelector('.info-login');
    if (info) info.style.display = 'none';
    var nama = document.getElementById('nama');
    var email = document.getElementById('email');
    if (nama && !nama.value) nama.value = user.nama;
    if (email && !email.value) email.value = user.email;
  }

  // Cek login secepat mungkin supaya halaman booking tidak sempat "berkedip"
  if (/booking\.html$/.test(location.pathname) && !Auth.current()) {
    location.replace('login.html#wajib-login');
    return;
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderNav();
    guardBooking();
  });
})();