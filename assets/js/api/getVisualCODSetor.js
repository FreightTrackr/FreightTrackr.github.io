import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APITransaksiCOD } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";

export default function GetVisualCODSetor(){
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
        return `${APITransaksiCOD}?start_date=${startDate}&end_date=${endDate}`;
    }

    const utcStartDate = new Date(startDate).toISOString();
    const utcEndDate = new Date(endDate).toISOString();
    return `${APITransaksiCOD}?start_date=${utcStartDate}&end_date=${utcEndDate}`;
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
    const customerData = {};

    data.forEach(item => {
        const { kode_pelanggan, status_cod } = item;

        if (!customerData[kode_pelanggan]) {
            customerData[kode_pelanggan] = { sudahSetorCount: 0, belumSetorCount: 0 };
        }

        if (status_cod === "sudah_setor") {
            customerData[kode_pelanggan].sudahSetorCount++;
        } else if (status_cod === "belum_setor") {
            customerData[kode_pelanggan].belumSetorCount++;
        }
    });

    const labels = [];
    const sudahSetorPercentages = [];
    const belumSetorPercentages = [];
    const rawData = [];

    for (const customer in customerData) {
        const total = customerData[customer].sudahSetorCount + customerData[customer].belumSetorCount;
        labels.push(customer);
        sudahSetorPercentages.push((customerData[customer].sudahSetorCount / total) * 100);
        belumSetorPercentages.push((customerData[customer].belumSetorCount / total) * 100);
        rawData.push(customerData[customer]);
    }

    return { labels, sudahSetorPercentages, belumSetorPercentages, rawData };
}

function generateChart(data, startDate, endDate) {
    const chartContainer = document.createElement("div");
    chartContainer.className = "min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800";
    document.getElementById("chartjs").appendChild(chartContainer);

    const canvas = document.createElement('canvas');
    canvas.id = 'statusChart';
    canvas.width = 572;
    canvas.height = 286;
    chartContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'COD Settled (%)',
                    data: data.sudahSetorPercentages,
                    backgroundColor: '#4CAF50',
                },
                {
                    label: 'COD Not Settled (%)',
                    data: data.belumSetorPercentages,
                    backgroundColor: '#F87171',
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percentage'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Customer Code'
                    }
                }
            },
            responsive: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `COD Settlement Status by Customer Code (${startDate} - ${endDate})`
                },
                tooltip: {
                    callbacks: {
                        afterBody: function (tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            const raw = data.rawData[index];
                            const totalTransactions = raw.sudahSetorCount + raw.belumSetorCount;
                            return `Sudah Setor: ${raw.sudahSetorCount}\nBelum Setor: ${raw.belumSetorCount}\nTotal Transaksi: ${totalTransactions}`;
                        }
                    }
                }
            }
        }
    });
}
