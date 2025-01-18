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

        const currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
        const start = (currentPage - 1) * limit + 1;
        const end = Math.min(currentPage * limit, totalUsers);
        document.getElementById('showing-text').innerText = `Showing ${start}-${end} of ${totalUsers}`;
        
        users.forEach(user => {
            const rowData = [
                user.username,
                user.nama,
                user.no_telp,
                user.email,
                user.role,
                user.no_pend,
                user.kode_pelanggan,
            ];
            const row = addRowToTable("table-users", rowData);

            const params = new URLSearchParams();
            if (user.username) params.append("username", user.username);
            if (user.nama) params.append("nama", user.nama);
            if (user.no_telp) params.append("no_telp", user.no_telp);
            if (user.email) params.append("email", user.email);
            if (user.role) params.append("role", user.role);
            if (user.no_pend) params.append("no_pend", user.no_pend);
            if (user.kode_pelanggan) params.append("kode_pelanggan", user.kode_pelanggan);
            const editUrl = `/edit-user?${params.toString()}`;
            
            const actionHTML = `
                <td class="px-4 py-3">
                    <div class="flex items-center space-x-4 text-sm">
                        <button
                            class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                            aria-label="Edit"
                            onclick="window.location.href='${editUrl}'"
                        >
                            <svg
                                class="w-5 h-5"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                                ></path>
                            </svg>
                        </button>
                        <button
                            class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                            aria-label="Delete"
                            onclick="deleteUser('${user.username}')"
                        >
                            <svg
                                class="w-5 h-5"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clip-rule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </td>
            `;

            row.insertAdjacentHTML('beforeend', actionHTML);
        });
        setupPagination("pagination", totalUsers, limit);
    } else {
        console.log(result.data.message);
    }
}