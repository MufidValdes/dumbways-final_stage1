function drawSikuSiku(n) { //n = panjang
    let angka = 1; // Mulai dengan angka 1
    let baris = ''; // Variabel untuk menyimpan baris saat ini
    // Loop untuk setiap baris dari segitiga
    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
            baris += angka + ' '; // Menambahkan angka ke baris
            angka++; // Bergerak ke angka berikutnya
        }
        baris += '\n';
    }
    return baris;
}
console.log(drawSikuSiku(7));