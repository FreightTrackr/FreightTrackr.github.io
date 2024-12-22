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
    const { limit } = getLimit();
    getJSON(apiUrlWithPage,tokenkey,"Bearer "+tokenvalue,(result) => responseFunction(result, limit));
}

function getLimit() {
    const urlParams = new URLSearchParams(window.location.search);
    const limit = urlParams.get('limit') || 10;
    return { limit };
}

function responseFunction(result, limit) {
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
        setupPagination("pagination", totalPelanggan, limit);
    } else {
        console.log(result.data.message);
    }
}