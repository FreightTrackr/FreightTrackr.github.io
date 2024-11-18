import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APIKantor } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";
import { addRowToTable } from "../element.js";

export default function GetKantor(){
    const tokenkey = "Authorization"
    let tokenvalue = getCookie(tokenkey)
    getJSON(APIKantor,tokenkey,"Bearer "+tokenvalue,responseFunction);
}

function responseFunction(result) {
    if (result && result.data) {
        result.data.data.forEach(kantor => {
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
    } else {
        console.log("No transaksi data found.");
    }
}