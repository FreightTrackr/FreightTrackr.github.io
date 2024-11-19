import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APIPelanggan } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";
import { addRowToTable } from "../element.js";
import { setupPagination } from "../pagination.js"

export default function GetPelanggan(){
    const tokenkey = "Authorization";
    let tokenvalue = getCookie(tokenkey);
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 1;
    const apiUrlWithPage = `${APIPelanggan}?page=${page}`;
    getJSON(apiUrlWithPage,tokenkey,"Bearer "+tokenvalue,responseFunction);
}

function responseFunction(result) {
    if (result.status == 200) {
        const pelanggan = result.data.data;
        const totalPelanggan = result.data.data_count.total;
        
        pelanggan.forEach(pelanggan => {
            const rowData = [
                pelanggan.kode_pelanggan,
                pelanggan.tipe_pelanggan,
                pelanggan.nama_pelanggan
            ];
            addRowToTable("table-pelanggan", "tr", "td", rowData);
        });
        setupPagination("pagination", totalPelanggan);
    } else {
        console.log(result.data.message);
    }
}