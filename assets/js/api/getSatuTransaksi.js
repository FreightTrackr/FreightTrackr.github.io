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
    const tableContainer = document.getElementById('transaksi-detail');
    tableContainer.innerHTML = ""; // Clear previous content

    if (!transaction) {
        tableContainer.innerHTML = "<p>No transaction data available.</p>";
        return;
    }

    // Create the table element
    const table = document.createElement('table');
    table.className = "table table-striped";

    // Create the table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Field</th>
            <th>Value</th>
        </tr>
    `;
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');
    
    // Map of keys to display-friendly labels
    const transactionData = {
        "ID": transaction.id || "-",
        "No Resi": transaction.no_resi || "-",
        "Layanan": transaction.layanan || "-",
        "Isi Kiriman": transaction.isi_kiriman || "-",
        "Nama Pengirim": transaction.nama_pengirim || "-",
        "Alamat Pengirim": transaction.alamat_pengirim || "-",
        "Kode Pos Pengirim": transaction.kode_pos_pengirim || "-",
        "Kota Asal": transaction.kota_asal || "-",
        "Nama Penerima": transaction.nama_penerima || "-",
        "Alamat Penerima": transaction.alamat_penerima || "-",
        "Kode Pos Penerima": transaction.kode_pos_penerima || "-",
        "Kota Tujuan": transaction.kota_tujuan || "-",
        "Berat Kiriman": transaction.berat_kiriman !== undefined ? `${transaction.berat_kiriman} kg` : "-",
        "Volumetrik": transaction.volumetrik !== undefined ? `${transaction.volumetrik} cm³` : "-",
        "Nilai Barang": transaction.nilai_barang !== undefined ? `Rp ${transaction.nilai_barang}` : "-",
        "Biaya Dasar": transaction.biaya_dasar !== undefined ? `Rp ${transaction.biaya_dasar}` : "-",
        "Biaya Pajak": transaction.biaya_pajak !== undefined ? `Rp ${transaction.biaya_pajak}` : "-",
        "Biaya Asuransi": transaction.biaya_asuransi !== undefined ? `Rp ${transaction.biaya_asuransi}` : "-",
        "Total Biaya": transaction.total_biaya !== undefined ? `Rp ${transaction.total_biaya}` : "-",
        "Tanggal Kirim": transaction.tanggal_kirim ? new Date(transaction.tanggal_kirim).toLocaleString() : "-",
        "Tanggal Antaran Pertama": transaction.tanggal_antaran_pertama ? new Date(transaction.tanggal_antaran_pertama).toLocaleString() : "-",
        "Tanggal Terima": transaction.tanggal_terima ? new Date(transaction.tanggal_terima).toLocaleString() : "-",
        "Status": transaction.status || "-",
        "Tipe COD": transaction.tipe_cod || "-",
        "Status COD": transaction.status_cod || "-",
        "SLA": transaction.sla !== undefined ? `${transaction.sla} days` : "-",
        "Aktual SLA": transaction.aktual_sla !== undefined ? `${transaction.aktual_sla} days` : "-",
        "Status SLA": transaction.status_sla !== undefined ? (transaction.status_sla ? "Met" : "Not Met") : "-",
        "No Pend Kirim": transaction.no_pend_kirim || "-",
        "No Pend Terima": transaction.no_pend_terima || "-",
        "Kode Pelanggan": transaction.kode_pelanggan || "-",
        "Created By": transaction.created_by?.username || "-",
        "ID History": transaction.id_history || "-"
    };

    // Populate table rows
    for (const [key, value] of Object.entries(transactionData)) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${key}</td><td>${value}</td>`;
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}
