import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APIPelanggan } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";
import { addRowToTable } from "../element.js";

export default function GetPelanggan(){
    const tokenkey = "Authorization"
    let tokenvalue = getCookie(tokenkey)
    getJSON(APIPelanggan,tokenkey,"Bearer "+tokenvalue,responseFunction);
}

function responseFunction(result) {
    if (result && result.data) {
        result.data.data.forEach(pelanggan => {
            const rowData = [
                pelanggan.kode_pelanggan,
                pelanggan.tipe_pelanggan,
                pelanggan.nama_pelanggan
            ];
            addRowToTable("table-pelanggan", "tr", "td", rowData);
        });
    } else {
        console.log("No transaksi data found.");
    }
}