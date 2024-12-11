import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APITransaksiDelivered } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";

export default function GetVisualSLA(){
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

    for (const customer in customerData) {
        const total = customerData[customer].trueCount + customerData[customer].falseCount;
        labels.push(customer);
        truePercentages.push((customerData[customer].trueCount / total) * 100);
        falsePercentages.push((customerData[customer].falseCount / total) * 100);
    }

    return { labels, truePercentages, falsePercentages };
}

function generateChart(data, startDate, endDate) {
    const canvas = document.createElement('canvas');
    canvas.id = 'statusChart';
    canvas.width = 900;
    canvas.height = 500;
    document.getElementById('chart-container3').appendChild(canvas);
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
                        text: 'Customer Code'
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
                    text: `SLA Status Percentage by Customer Code (${startDate} - ${endDate})`
                }
            }
        }
    });
}