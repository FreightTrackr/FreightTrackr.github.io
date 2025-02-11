import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APITransaksi } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";
import { addRowToTable } from "../element.js";
import { setupPagination } from "../pagination.js"

export default function GetTransaksi(){
    const tokenkey = "Authorization";
    let tokenvalue = getCookie(tokenkey);
    const apiUrl = constructApiUrl();
    if (!apiUrl) {
        console.error("Invalid URL parameters. Please provide start-date and end-date.");
        return;
    }
    const { limit } = getLimit();
    getJSON(apiUrl,tokenkey,"Bearer "+tokenvalue,(result) => responseFunction(result, limit));
}

function getLimit() {
    const urlParams = new URLSearchParams(window.location.search);
    const limit = urlParams.get('limit') || 10;
    return { limit };
}

function constructApiUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page') || 1;
    const limit = urlParams.get('limit') || 10;
    const startDate = urlParams.get('start-date') || "";
    const endDate = urlParams.get('end-date') || "";
    const noPend = urlParams.get('no-pend') || "";
    const kodePelanggan = urlParams.get('kode-pelanggan') || "";

    if (!startDate || !endDate) {
        return `${APITransaksi}?page=${page}&limit=${limit}&start_date=${startDate}&end_date=${endDate}&no_pend=${noPend}&kode_pelanggan=${kodePelanggan}`;
    }

    const utcStartDate = new Date(startDate).toISOString();
    const utcEndDate = new Date(endDate).toISOString();
    return `${APITransaksi}?page=${page}&limit=${limit}&start_date=${utcStartDate}&end_date=${utcEndDate}&no_pend=${noPend}&kode_pelanggan=${kodePelanggan}`;
}

function responseFunction(result, limit) {
    if (result.status == 200) {
        const transaksi = result.data.data;
        const totalTransaksi = result.data.data_count.total;

        const currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
        const start = (currentPage - 1) * limit + 1;
        const end = Math.min(currentPage * limit, totalTransaksi);
        document.getElementById('showing-text').innerText = `Showing ${start}-${end} of ${totalTransaksi}`;
        
        transaksi.forEach(transaksi => {
            const rowData = [
                transaksi.no_resi,
                transaksi.layanan,
                transaksi.kota_asal,
                transaksi.kota_tujuan,
                transaksi.tanggal_kirim,
                transaksi.tanggal_antaran_pertama,
                transaksi.tanggal_terima,
                transaksi.status,
                transaksi.tipe_cod,
                transaksi.status_cod,
                transaksi.status_sla,
                transaksi.no_pend_kirim,
                transaksi.no_pend_terima,
                transaksi.kode_pelanggan,
            ];
            const row = addRowToTable("table-transaksi", rowData);
            const params = new URLSearchParams();
            if (transaksi.no_resi) params.append("no_resi", transaksi.no_resi);
            const detailUrl = `/transaksi-detail/?${params.toString()}`;
            
            const actionHTML = `
                <td class="px-4 py-3">
                    <div class="flex items-center space-x-4 text-sm">
                        <button
                            class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                            aria-label="Edit"
                            onclick="window.location.href='${detailUrl}'"
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
                    </div>
                </td>
            `;
            row.insertAdjacentHTML('beforeend', actionHTML);
        });
        setupPagination("pagination", totalTransaksi, limit);
        generateCard(result.data.data_count);
    } else {
        console.log(result.data.message);
    }
}

function generateCard(data_count) {
    const delivereCount = document.getElementById('delivered');
    delivereCount.textContent = data_count.delivered;
    const canceledCount = document.getElementById('canceled');
    canceledCount.textContent = data_count.canceled;
    const returnedCount = document.getElementById('returned');
    returnedCount.textContent = data_count.returned;
    const inWarehouseCount = document.getElementById('in-warehouse');
    inWarehouseCount.textContent = data_count.inWarehouse;
    const inVehicleCount = document.getElementById('in-vehicle');
    inVehicleCount.textContent = data_count.inVehicle;
    const failedCount = document.getElementById('failed');
    failedCount.textContent = data_count.failed;
    const paidCount = document.getElementById('paid');
    paidCount.textContent = data_count.paid;
}