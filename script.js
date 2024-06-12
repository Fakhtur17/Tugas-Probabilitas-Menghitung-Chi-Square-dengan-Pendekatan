// Toggle class 'active' untuk navbar
const navbarNav = document.querySelector(".navbar-nav");

// Ketika hamburger menu diklik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

// Klik di luar sidebar untuk menghilangkan nav
const hamburger = document.querySelector("#hamburger-menu");
document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// Fungsi perhitungan Chi-Kuadrat
function hitungChiKuadrat() {
  var derajatKebebasan = parseInt(
    document.getElementById("derajatKebebasan").value
  );
  var nilaiX1 = parseFloat(document.getElementById("nilaiX1").value);
  var nilaiX2 = parseFloat(document.getElementById("nilaiX2").value);

  if (derajatKebebasan < 1) {
    alert("Derajat Kebebasan (ν) harus minimal 1.");
    return;
  }

  var svg = document.getElementById("grafikChiKuadrat");
  var svgNS = "http://www.w3.org/2000/svg";

  // Hapus konten sebelumnya
  while (svg.lastChild) {
    svg.removeChild(svg.lastChild);
  }

  // Gambar sumbu x
  var sumbuX = document.createElementNS(svgNS, "line");
  sumbuX.setAttribute("x1", "50");
  sumbuX.setAttribute("y1", "180");
  sumbuX.setAttribute("x2", "350");
  sumbuX.setAttribute("y2", "180");
  sumbuX.setAttribute("stroke", "#fff");
  sumbuX.setAttribute("stroke-width", "1");
  svg.appendChild(sumbuX);

  // Gambar sumbu y
  var sumbuY = document.createElementNS(svgNS, "line");
  sumbuY.setAttribute("x1", "50");
  sumbuY.setAttribute("y1", "20");
  sumbuY.setAttribute("x2", "50");
  sumbuY.setAttribute("y2", "180");
  sumbuY.setAttribute("stroke", "#fff");
  sumbuY.setAttribute("stroke-width", "1");
  svg.appendChild(sumbuY);

  // Gambar tanda garis dan label pada sumbu x
  for (var i = 0; i <= 10; i++) {
    var posisiX = 50 + i * 30;
    var garisTanda = document.createElementNS(svgNS, "line");
    garisTanda.setAttribute("x1", posisiX);
    garisTanda.setAttribute("y1", "180");
    garisTanda.setAttribute("x2", posisiX);
    garisTanda.setAttribute("y2", "185");
    garisTanda.setAttribute("stroke", "#fff");
    garisTanda.setAttribute("stroke-width", "1");
    svg.appendChild(garisTanda);

    var label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", posisiX);
    label.setAttribute("y", "195");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("fill", "#ffffff"); // Warna putih
    label.textContent = i.toFixed(1);
    svg.appendChild(label);
  }

  // Gambar tanda garis dan label pada sumbu y
  for (var i = 0; i <= 4; i++) {
    var posisiY = 180 - i * 40;
    var garisTanda = document.createElementNS(svgNS, "line");
    garisTanda.setAttribute("x1", "45");
    garisTanda.setAttribute("y1", posisiY);
    garisTanda.setAttribute("x2", "50");
    garisTanda.setAttribute("y2", posisiY);
    garisTanda.setAttribute("stroke", "#fff");
    garisTanda.setAttribute("stroke-width", "1");
    svg.appendChild(garisTanda);

    var label = document.createElementNS(svgNS, "text");
    label.setAttribute("x", "40");
    label.setAttribute("y", posisiY + 5);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("fill", "#ffffff"); // Warna putih
    label.textContent = (i * 0.05).toFixed(2);
    svg.appendChild(label);
  }

  function ChiKuadrat(x, k) {
    if (x < 0) return 0;
    var gamma = (n) => {
      if (n === 1) {
        return 1;
      } else {
        return (n - 1) * gamma(n - 1);
      }
    };
    return (
      (Math.pow(x, k / 2 - 1) * Math.exp(-x / 2)) /
      (Math.pow(2, k / 2) * gamma(k / 2))
    );
  }

  // Gambar kurva distribusi Chi-kuadrat
  var path = document.createElementNS(svgNS, "path");
  var d = "M";
  var areaD = "M";
  var areaMulai = false;
  for (var i = 0.1; i <= 10; i += 0.1) {
    var y = ChiKuadrat(i, derajatKebebasan);
    var x = 50 + i * 30;
    var newY = 180 - y * 800; // Faktor skala disesuaikan untuk cocok dengan rentang sumbu y baru
    d += x + "," + newY + " ";

    if (i >= nilaiX1 && i <= nilaiX2) {
      if (!areaMulai) {
        areaD += x + ",180 L" + x + "," + newY + " ";
        areaMulai = true;
      } else {
        areaD += x + "," + newY + " ";
      }
      if (i + 0.1 > nilaiX2) {
        areaD += x + ",180 Z";
      }
    }
  }
  path.setAttribute("d", d);
  path.setAttribute("stroke", "#ff0000"); // warna kurva putih
  path.setAttribute("fill", "none");
  svg.appendChild(path);

  if (areaMulai) {
    var areaPath = document.createElementNS(svgNS, "path");
    areaPath.setAttribute("d", areaD);
    areaPath.setAttribute("fill", "#00ff00"); // warna grafik biru muda
    svg.appendChild(areaPath);
  }

  // Hitung nilai p1 dan p2
  var p1 = ChiKuadrat(nilaiX1, derajatKebebasan);
  var p2 = ChiKuadrat(nilaiX2, derajatKebebasan);

  // Hitung s dan tampilkan
  var s = nilaiX1 + (nilaiX2 - nilaiX1) / 3;
  document.getElementById("nilaiS").textContent =
    "Jarak s antara X1=" +
    nilaiX1 +
    " dan X2=" +
    nilaiX2 +
    " adalah " +
    s.toFixed(4);

  // Hitung luas antara x1 dan x2 menggunakan aturan trapesium
  var luas = ((p1 + p2) * s) / 2;
  document.getElementById("luasTrapesium").textContent =
    "Luas antara X1=" +
    nilaiX1 +
    " dan X2=" +
    nilaiX2 +
    " adalah " +
    luas.toFixed(4);

  // Tampilkan nilai p1 dan p2
  document.getElementById("nilaiP").textContent =
    "Nilai pada X1 (p1)=" +
    p1.toFixed(4) +
    ", Nilai pada X2 (p2)=" +
    p2.toFixed(4);
}
