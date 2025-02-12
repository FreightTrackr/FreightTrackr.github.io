export function addRowToTable(parentId, rowData) {
    const tableElement = document.getElementById(parentId);
    if (tableElement) {
        const tbodyElement = tableElement.querySelector('tbody');
        if (!tbodyElement) {
            console.error(`No <tbody> found inside the table with ID '${parentId}'.`);
            return null;
        }
        const row = document.createElement("tr");
        row.className = "text-gray-700 dark:text-gray-400";

        rowData.forEach(data => {
            const cell = document.createElement("td");
            cell.className = "px-4 py-3 text-sm";
            cell.textContent = data;
            row.appendChild(cell);
        });

        tbodyElement.appendChild(row);
        return row;
    } else {
        console.error(`Element with ID '${parentId}' not found.`);
        return null;
    }
}

export function onClickPreventDefault(id, actionFunctionName) {
    document.getElementById(id).onclick = function(event) {
        event.preventDefault();
        actionFunctionName();
    };
}

export function redirectForm() {
    document.getElementById('cari-transaksi').addEventListener('click', function(e) {
        e.preventDefault();  // Menghindari form submit default
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const noPend = document.getElementById('no-pend').value;
        const kodePelanggan = document.getElementById('kode-pelanggan').value;
        const limit = document.getElementById('limit').value;
    
        const url = `?start-date=${startDate}&end-date=${endDate}&no-pend=${noPend}&kode-pelanggan=${kodePelanggan}&limit=${limit}`;
        window.location.href = url;
    });
}

export function redirectFormLacak() {
    document.getElementById('lacak-button').addEventListener('click', function(e) {
        e.preventDefault();  // Menghindari form submit default
        const no_resi = document.getElementById('no_resi').value;
    
        const url = `?no_resi=${no_resi}`;
        window.location.href = url;
    });
}