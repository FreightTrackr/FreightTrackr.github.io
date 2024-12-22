import { getCookie } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/cookie.js";
import { APITransaksiDelivered } from "../endpoint.js"
import { getJSON } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.1.6/api.js";

export default function GetVisualSLAAge(){
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
        console.log(result.data.message);
    } else {
        console.log(result.data.message);
    }
}

function processData(data) {
    data.sort((a, b) => new Date(a.tanggal_kirim) - new Date(b.tanggal_kirim));
    const labels = data.map(item => `${item.no_resi} - ${new Date(item.tanggal_kirim).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}`);
    const slaPromises = data.map(item => item.sla);
    const slaActuals = data.map(item => item.aktual_sla);
    return { labels, slaPromises, slaActuals };
}

function generateChart(data, startDate, endDate) {
    const canvas = document.createElement('canvas');
    canvas.id = 'statusChart';
    canvas.width = 900;
    canvas.height = 500;
    document.getElementById('chart-container5').appendChild(canvas);
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'SLA Dijanjikan',
                    data: data.slaPromises,
                    borderColor: 'blue',
                    fill: false
                },
                {
                    label: 'SLA Aktual',
                    data: data.slaActuals,
                    borderColor: 'red',
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'No Resi - Tanggal Kirim'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'SLA (Hari)'
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
                        label: function (context) {
                            const index = context.dataIndex;
                            const label = context.label;
                            const slaPromise = context.dataset.label === 'SLA Dijanjikan' ? data.slaPromises[index] : null;
                            const slaActual = context.dataset.label === 'SLA Aktual' ? data.slaActuals[index] : null;
                            let tooltipLabel = context.dataset.label + ': ' + context.raw;
                            if (slaPromise !== null && slaActual !== null) {
                                const difference = slaActual - slaPromise;
                                tooltipLabel += `\n${label}\nSelisih SLA: ${difference} hari`;
                            }
                            return tooltipLabel;
                        }
                    }
                }
            }
        }
    });
}