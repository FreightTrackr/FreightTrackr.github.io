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
    getJSON(apiUrlWithPage,tokenkey,"Bearer "+tokenvalue,responseFunction);
}

function responseFunction(result) {
    if (result.status == 200) {
        const users = result.data.data;
        const totalUsers = result.data.data_count.total;
        
        users.forEach(user => {
            const rowData = [
                user.username,
                user.nama,
                user.no_telp,
                user.email,
                user.role
            ];
            addRowToTable("table-users", "tr", "td", rowData);
        });
        setupPagination("pagination", totalUsers);
        generateChart(totalUsers);
    } else {
        console.log(result.data.message);
    }
}

function generateChart(users) {
    // Extract data for the chart
    const roleCounts = {users};

    const labels = Object.keys(roleCounts);
    const data = Object.values(roleCounts);

    // Create a canvas element for the chart
    const canvas = document.createElement('canvas');
    canvas.id = 'usersChart';
    document.getElementById('chart-container').appendChild(canvas);

    // Generate the chart
    const ctx = document.getElementById('usersChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar', // You can change this to 'line', 'pie', etc.
        data: {
            labels: labels,
            datasets: [{
                label: '# of Users by Role',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}