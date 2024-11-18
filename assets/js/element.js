export function addRowToTable(parentId, firstChildId, secondChildId, rowData) {
    const tableElement = document.getElementById(parentId);
    if (tableElement) {
        const row = document.createElement(firstChildId);

        rowData.forEach(data => {
            const cell = document.createElement(secondChildId);
            cell.textContent = data;
            row.appendChild(cell);
        });

        tableElement.appendChild(row);
    } else {
        console.log(`Element with ID '${parentId}' not found.`);
    }
}