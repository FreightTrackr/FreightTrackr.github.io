import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APITransaksiDelivered } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";

export default function GetVisualSLAPelanggan(){
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
        return `${APITransaksiDelivered}?start_date=${startDate}&end_date=${endDate}`;
    }

    const utcStartDate = new Date(startDate).toISOString();
    const utcEndDate = new Date(endDate).toISOString();
    return `${APITransaksiDelivered}?start_date=${utcStartDate}&end_date=${utcEndDate}`;
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
        const { kode_pelanggan, status_sla } = item;
        if (!customerData[kode_pelanggan]) {
            customerData[kode_pelanggan] = { trueCount: 0, falseCount: 0 };
        }
        if (status_sla) {
            customerData[kode_pelanggan].trueCount++;
        } else {
            customerData[kode_pelanggan].falseCount++;
        }
    });

    const labels = [];
    const truePercentages = [];
    const falsePercentages = [];
    const rawData = [];

    for (const customer in customerData) {
        const total = customerData[customer].trueCount + customerData[customer].falseCount;
        labels.push(customer);
        truePercentages.push((customerData[customer].trueCount / total) * 100);
        falsePercentages.push((customerData[customer].falseCount / total) * 100);
        rawData.push(customerData[customer]);
    }

    return { labels, truePercentages, falsePercentages, rawData };
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
                    label: 'SLA Met (%)',
                    data: data.truePercentages,
                    backgroundColor: '#4CAF50',
                },
                {
                    label: 'SLA Not Met (%)',
                    data: data.falsePercentages,
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
                    text: `Final SWP Percentage by Customer Code (${startDate} - ${endDate})`
                },
                tooltip: {
                    callbacks: {
                        afterBody: function(tooltipItems) {
                            const index = tooltipItems[0].dataIndex;
                            const raw = data.rawData[index];
                            const totalTransactions = raw.trueCount + raw.falseCount;
                            return `Memenuhi SLA: ${raw.trueCount}\nTidak Memenuhi SLA: ${raw.falseCount}\nTotal Transaksi: ${totalTransactions}`;
                        }
                    }
                }
            }
        }
    });
}