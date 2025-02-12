import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APILacak } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";
export default function GetLacak(){
    const tokenkey = "Authorization";
    let tokenvalue = getCookie(tokenkey);
    const urlParams = new URLSearchParams(window.location.search);
    const no_resi = urlParams.get('no_resi') || "";
    const apiUrlWithPage = `${APILacak}?no_resi=${no_resi}`;
    getJSON(apiUrlWithPage,tokenkey,"Bearer "+tokenvalue,responseFunction);
}

function responseFunction(result) {
    if (result.status == 200) {
        const lacak = result.data.data.lokasi;
        const tbody = document.getElementById('lacak');
        tbody.innerHTML = "";
        const row = document.createElement("tr");
        row.className = "text-gray-700 dark:text-gray-400";
        lacak.forEach(entry => {
            const row = document.createElement("tr");
            row.className = "text-gray-700 dark:text-gray-400";

            row.appendChild(createTableCell(entry.timestamp));
            row.appendChild(createTableCell(entry.status));
            row.appendChild(createTableCell(entry.catatan));

            tbody.appendChild(row);
        });
    } else {
        console.log(result.data.message);
    }
}

function createTableCell(text) {
    const cell = document.createElement("td");
    cell.className = "px-4 py-3 text-sm";
    cell.textContent = text || "-";
    return cell;
}