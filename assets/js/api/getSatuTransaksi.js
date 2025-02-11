import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APISatuTransaksi } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";
export default function GetTransaksiDetail(){
    const tokenkey = "Authorization";
    let tokenvalue = getCookie(tokenkey);
    const urlParams = new URLSearchParams(window.location.search);
    const no_resi = urlParams.get('no_resi') || "";
    const apiUrlWithPage = `${APISatuTransaksi}?no_resi=${no_resi}`;
    getJSON(apiUrlWithPage,tokenkey,"Bearer "+tokenvalue,responseFunction);
}

function responseFunction(result, limit) {
    if (result.status == 200) {
        const transaksi = result.data.data;
        generateTransactionTable(transaksi);
    } else {
        console.log(result.data.message);
    }
}

function generateTransactionTable(transaction) {
    const tbody = document.getElementById('transaksi-detail');

    const keyMapping = {
        id: "ID",
        no_resi: "No Resi",
        layanan: "Layanan",
        isi_kiriman: "Isi Kiriman",
        nama_pengirim: "Nama Pengirim",
        alamat_pengirim: "Alamat Pengirim",
        kode_pos_pengirim: "Kode Pos Pengirim",
        kota_asal: "Kota Asal",
        nama_penerima: "Nama Penerima",
        alamat_penerima: "Alamat Penerima",
        kode_pos_penerima: "Kode Pos Penerima",
        kota_tujuan: "Kota Tujuan",
        berat_kiriman: "Berat Kiriman",
        volumetrik: "Volumetrik",
        nilai_barang: "Nilai Barang",
        biaya_dasar: "Biaya Dasar",
        biaya_pajak: "Biaya Pajak",
        biaya_asuransi: "Biaya Asuransi",
        total_biaya: "Total Biaya",
        tanggal_kirim: "Tanggal Kirim",
        tanggal_antaran_pertama: "Tanggal Antaran Pertama",
        tanggal_terima: "Tanggal Terima",
        status: "Status",
        tipe_cod: "Tipe COD",
        status_cod: "Status COD",
        sla: "SLA",
        aktual_sla: "Aktual SLA",
        status_sla: "Status SLA",
        no_pend_kirim: "No Pend Kirim",
        no_pend_terima: "No Pend Terima",
        kode_pelanggan: "Kode Pelanggan",
        created_by: "Created By",
        id_history: "ID History"
    };

    Object.entries(keyMapping).forEach(([key, label]) => {
        const row = document.createElement("tr");
        row.className = "text-gray-700 dark:text-gray-400";

        const labelCell = document.createElement("td");
        labelCell.className = "px-4 py-3 text-sm";
        labelCell.textContent = label;
        row.appendChild(labelCell);

        const valueCell = document.createElement("td");
        valueCell.className = "px-4 py-3 text-sm";

        if (key === "created_by") {
            valueCell.textContent = transaction.created_by?.username ?? "-";
        } else {
            valueCell.textContent = transaction[key] ?? "-";
        }

        row.appendChild(valueCell);
        tbody.appendChild(row);
    });
}

