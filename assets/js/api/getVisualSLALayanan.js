import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APITransaksiDelivered } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";

export default function GetVisualSLALayanan(){
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
        const { layanan, status_sla } = item;
        if (!customerData[layanan]) {
            customerData[layanan] = { trueCount: 0, falseCount: 0 };
        }
        if (status_sla) {
            customerData[layanan].trueCount++;
        } else {
            customerData[layanan].falseCount++;
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
    const canvas = document.createElement('canvas');
    canvas.id = 'statusChart';
    canvas.width = 900;
    canvas.height = 500;
    document.getElementById('chart-container4').appendChild(canvas);
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'SLA Met (%)',
                    data: data.truePercentages,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'SLA Not Met (%)',
                    data: data.falsePercentages,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
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
                        text: 'Service'
                    }
                }
            },
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `SLA Status Percentage by Service (${startDate} - ${endDate})`
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