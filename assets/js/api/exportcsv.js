import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APIExportCSV } from "../endpoint.js"
import { getCsv } from "../api.js";

export default function ExportCSV(){
    const tokenkey = "Authorization";
    let tokenvalue = getCookie(tokenkey);
    const apiUrl = constructApiUrl();
    if (!apiUrl) {
        console.error("Invalid URL parameters. Please provide start-date and end-date.");
        return;
    }
    getCsv(apiUrl,tokenkey,"Bearer "+tokenvalue,responseFunction);
}

function constructApiUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 1;
    const limit = urlParams.get('limit') || 10;
    const startDate = urlParams.get('start-date') || "";
    const endDate = urlParams.get('end-date') || "";
    const noPend = urlParams.get('no-pend') || "";
    const kodePelanggan = urlParams.get('kode-pelanggan') || "";

    if (!startDate || !endDate) {
        return `${APIExportCSV}?page=${page}&limit=${limit}&start_date=${startDate}&end_date=${endDate}&no_pend=${noPend}&kode_pelanggan=${kodePelanggan}`;
    }

    const utcStartDate = new Date(startDate).toISOString();
    const utcEndDate = new Date(endDate).toISOString();
    return `${APIExportCSV}?page=${page}&limit=${limit}&start_date=${utcStartDate}&end_date=${utcEndDate}&no_pend=${noPend}&kode_pelanggan=${kodePelanggan}`;
}

function responseFunction(result) {
    if (result.status === 200) {
        downloadCSV(result.data);
    } else {
        console.error("Failed to export data:", result.data);
    }
}

function downloadCSV(data, filename = 'transaksi.csv') {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}