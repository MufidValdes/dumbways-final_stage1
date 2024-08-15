function hitungVoucher(voucher , uangBelanja, uangDiBayar){
   
    // Mengecek jika voucher yang digunakan adalah DumbWaysJos
    if (voucher === 'DumbWaysJos') { // === -> true
        if(uangBelanja >= 50000){ //jika syarat minimal 50000
            diskon = uangBelanja * 0.211; // Menghitung diskon 21,1% 
            if (diskon > 20000) {
                diskon = 20000; //diskon maksimal 20000
            }
        }
    }
    // Mengecek jika voucher yang digunakan adalah DumbWaysMantap
    if (voucher === 'DumbWaysMantap') {
        if(uangBelanja >= 80000){ //jika syarat minimal 80000
            diskon = uangBelanja *0,3; // Menghitung diskon 30% 
            if (diskon > 40000) { 
                diskon = 40000; //diskon maksimal 40000
            }
        }
    }
    // menghitung total yang harus dibayar
    totalBayar = uangBelanja - diskon
    // menghitung total kembalian
    let kembalian = uangDiBayar - totalBayar

    console.log('Uang yang harus dibayar: '+ totalBayar)
    console.log('Diskon :'+ diskon )
    console.log('Kembalian: '+ kembalian)
}

hitungVoucher('DumbWaysJos', 100000, 100000);