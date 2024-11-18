import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APIUsers } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";
import { addRowToTable } from "../element.js";

export default function GetUsers(){
    const tokenkey = "Authorization"
    let tokenvalue = getCookie(tokenkey)
    getJSON(APIUsers,tokenkey,"Bearer "+tokenvalue,responseFunction);
}

function responseFunction(result) {
    if (result && result.data) {
        result.data.data.forEach(user => {
            const rowData = [
                user.username,
                user.nama,
                user.no_telp,
                user.email,
                user.role
            ];
            addRowToTable("table-users", "tr", "td", rowData);
        });
    } else {
        console.log("No user data found.");
    }
}