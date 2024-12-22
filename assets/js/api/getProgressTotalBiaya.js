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
    const { startDate, endDate } = getDateParams();
    getJSON(apiUrl,tokenkey,"Bearer "+tokenvalue,(result) => responseFunction(result, startDate, endDate));
}

function getDateParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const startDate = urlParams.get('start-date') || "";
    const endDate = urlParams.get('end-date') || "";
    return { startDate, endDate };
}

function constructApiUrl() {
    const { startDate, endDate } = getDateParams();
    if (!startDate || !endDate) {
        return `${APISemuaTransaksi}?start_date=${startDate}&end_date=${endDate}`;
    }

    const utcStartDate = new Date(startDate).toISOString();
    const utcEndDate = new Date(endDate).toISOString();
    return `${APISemuaTransaksi}?start_date=${utcStartDate}&end_date=${utcEndDate}`;
}


function responseFunction(result, startDate, endDate) {
    if (result.status == 200) {
        const processedData = processData(result.data.data);
        generateChart(processedData, startDate, endDate);
    } else {
        console.log(result.data.message);
    }
}

function processData(data) {
    const totalBiayaPerDay = data.reduce((acc, item) => {
        const date = item.tanggal_kirim.split('T')[0];
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += item.total_biaya;
        return acc;
    }, {});

    sortedDates = Object.keys(totalBiayaPerDay).sort((a, b) => new Date(a) - new Date(b));
    sortedTotalBiaya = sortedDates.map(date => totalBiayaPerDay[date]);
    return { sortedDates, sortedTotalBiaya };
}

function generateChart(data, startDate, endDate) {
    const canvas = document.createElement('canvas');
    canvas.id = 'statusChart';
    canvas.width = 900;
    canvas.height = 500;
    document.getElementById('chart-container2').appendChild(canvas);
    const ctx = canvas.getContext('2d');

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