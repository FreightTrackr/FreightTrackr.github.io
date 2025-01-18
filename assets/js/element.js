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