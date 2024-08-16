function drawSikuSiku(n) { //n = panjang
    let angka = 2; // Mulai dengan angka 2
    let baris = ''; // Variabel untuk menyimpan baris saat ini
    // Loop untuk setiap baris dari segitiga
    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
            baris += angka + ' '; // Menambahkan angka ke baris
            angka= nextPrime(angka + 1); // Bergerak ke angka berikutnya
        }
        baris += '\n';
    }
    return baris;
}
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

function nextPrime(start) {
    let num = start;
    while (!isPrime(num)) {
        num++;
    }
    return num;
}
console.log(drawSikuSiku(7));