import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APIKantor } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";
import { addRowToTable } from "../element.js";
import { setupPagination } from "../pagination.js"

export default function GetKantor(){
    const tokenkey = "Authorization";
    let tokenvalue = getCookie(tokenkey);
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 1;
    const apiUrlWithPage = `${APIKantor}?page=${page}`;
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
        const kantor = result.data.data;
        const totalKantor = result.data.data_count.total;
        
        kantor.forEach(kantor => {
            const rowData = [
                kantor.no_pend,
                kantor.no_pend_kcu,
                kantor.no_pend_kc,
                kantor.tipe_kantor,
                kantor.nama_kantor,
                kantor.region_kantor,
                kantor.kota_kantor,
                kantor.kode_pos_kantor,
                kantor.alamat_kantor
            ];
            addRowToTable("table-kantor", "tr", "td", rowData);
        });
        setupPagination("pagination", totalKantor, limit);
    } else {
        console.log(result.data.message);
    }
}