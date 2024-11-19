import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APITransaksi } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";
import { addRowToTable } from "../element.js";
import { setupPagination } from "../pagination.js"

export default function GetTransaksi(){
    const tokenkey = "Authorization";
    let tokenvalue = getCookie(tokenkey);
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 1;
    const apiUrlWithPage = `${APITransaksi}?page=${page}`;
    getJSON(apiUrlWithPage,tokenkey,"Bearer "+tokenvalue,responseFunction);
}

function responseFunction(result) {
    if (result.status == 200) {
        const transaksi = result.data.data;
        const totalTransaksi = result.data.data_count.total;
        
        transaksi.forEach(transaksi => {
            const rowData = [
                transaksi.no_resi,
                transaksi.layanan,
                transaksi.isi_kiriman,
                transaksi.nama_pengirim,
                transaksi.alamat_pengirim,
                transaksi.kode_pos_pengirim,
                transaksi.kota_asal,
                transaksi.nama_penerima,
                transaksi.alamat_penerima,
                transaksi.kode_pos_penerima,
                transaksi.kota_tujuan,
                transaksi.berat_kiriman,
                transaksi.volumetrik,
                transaksi.nilai_barang,
                transaksi.biaya_dasar,
                transaksi.biaya_pajak,
                transaksi.biaya_asuransi,
                transaksi.total_biaya,
                transaksi.tanggal_kirim,
                transaksi.tanggal_terima,
                transaksi.tanggal_tenggat,
                transaksi.status,
                transaksi.tipe_cod,
                transaksi.status_cod,
                transaksi.sla,
                transaksi.aktual_sla,
                transaksi.status_sla,
                transaksi.no_pend_kirim,
                transaksi.no_pend_terima,
                transaksi.kode_pelanggan,
                transaksi.created_by.username,
                transaksi.id_history
            ];
            addRowToTable("table-transaksi", "tr", "td", rowData);
        });
        setupPagination("pagination", totalTransaksi);
    } else {
        console.log(result.data.message);
    }
}