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
        console.log(result.data.message);
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