import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APIUsers } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";
import { addRowToTable } from "../element.js";
import { setupPagination } from "../pagination.js"

export default function GetUsers(){
    const tokenkey = "Authorization";
    let tokenvalue = getCookie(tokenkey);
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 1;
    const apiUrlWithPage = `${APIUsers}?page=${page}`;
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
        const users = result.data.data;
        const totalUsers = result.data.data_count.total;
        
        users.forEach(user => {
            const rowData = [
                user.username,
                user.nama,
                user.no_telp,
                user.email,
                user.role
            ];
            addRowToTable("table-users", "tr", "td", rowData);
        });
        setupPagination("pagination", totalUsers, limit);
    } else {
        console.log(result.data.message);
    }
}