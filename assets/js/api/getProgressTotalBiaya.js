import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APISemuaTransaksi } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";

export default function GetProgressTotalBiaya(){
    const tokenkey = "Authorization";
    let tokenvalue = getCookie(tokenkey);
    const apiUrl = constructApiUrl();
    if (!apiUrl) {
        console.error("Invalid URL parameters. Please provide start-date and end-date.");
        return;
    }
    getJSON(apiUrl,tokenkey,"Bearer "+tokenvalue,responseFunction);
}

function constructApiUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const startDate = urlParams.get('start-date') || "";
    const endDate = urlParams.get('end-date') || "";
    const noPend = urlParams.get('no-pend') || "";
    const kodePelanggan = urlParams.get('kode-pelanggan') || "";

    if (!startDate || !endDate) {
        return `${APISemuaTransaksi}?start_date=${startDate}&end_date=${endDate}&no_pend=${noPend}&kode_pelanggan=${kodePelanggan}`;
    }

    const utcStartDate = new Date(startDate).toISOString();
    const utcEndDate = new Date(endDate).toISOString();
    return `${APISemuaTransaksi}?start_date=${utcStartDate}&end_date=${utcEndDate}&no_pend=${noPend}&kode_pelanggan=${kodePelanggan}`;
}

function responseFunction(result) {
    if (result.status == 200) {
        generateChart(result.data.data);
    } else {
        console.log(result.data.message);
    }
}

function generateChart(data) {
    const canvas = document.createElement('canvas');
    canvas.id = 'statusChart';
    canvas.width = 900;
    canvas.height = 500;
    document.getElementById('chart-container2').appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Transform data to accumulate total_biaya per day
    const totalBiayaPerDay = data.reduce((acc, item) => {
        const date = item.tanggal_kirim.split('T')[0];
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += item.total_biaya;
        return acc;
    }, {});

    // Sort dates to ensure the chart shows data in chronological order
    const sortedDates = Object.keys(totalBiayaPerDay).sort((a, b) => new Date(a) - new Date(b));
    const sortedTotalBiaya = sortedDates.map(date => totalBiayaPerDay[date]);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDates,
            datasets: [
                {
                    label: 'Total Biaya per Hari',
                    data: sortedTotalBiaya,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    },
                    title: {
                        display: true,
                        text: 'Tanggal Kirim'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Biaya (IDR)'
                    }
                }
            }
        }
    });
}