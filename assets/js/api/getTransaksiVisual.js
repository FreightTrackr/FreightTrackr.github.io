import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APITransaksiVisual } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";

export default function GetTransaksiVisual(){
    const tokenkey = "Authorization";
    let tokenvalue = getCookie(tokenkey);
    const apiUrl = constructApiUrl();

    if (!apiUrl) {
        console.error("Invalid URL parameters. Please provide start-date and end-date.");
        return;
    }

    getJSON(apiUrl,tokenkey,"Bearer "+tokenvalue,responseFunction);
}

function constructApiUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const startDate = urlParams.get('start-date') || "";
    const endDate = urlParams.get('end-date') || "";
    const noPend = urlParams.get('no-pend') || "";
    const kodePelanggan = urlParams.get('kode-pelanggan') || "";

    if (!startDate || !endDate) {
        return `${APITransaksiVisual}?start_date=${startDate}&end_date=${endDate}&no_pend=${noPend}&kode_pelanggan=${kodePelanggan}`;
    }

    const utcStartDate = new Date(startDate).toISOString();
    const utcEndDate = new Date(endDate).toISOString();
    return `${APITransaksiVisual}?start_date=${utcStartDate}&end_date=${utcEndDate}&no_pend=${noPend}&kode_pelanggan=${kodePelanggan}`;
}