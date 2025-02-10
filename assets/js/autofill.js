export function AutofillForm() {
    const queryParams = GetQueryParams();
    
    for (const key in queryParams) {
        const input = document.querySelector(`[id="${key}"]`);
        if (input) {
            input.value = queryParams[key];
        }
    }

    if (queryParams.role) {
        const selectedRadio = document.querySelector(`input[name="role"][value="${queryParams.role}"]`);
        if (selectedRadio) {
            selectedRadio.checked = true;
        }
    }
}

function GetQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const queryParams = {};
    
    for (const [key, value] of params.entries()) {
        queryParams[key] = value;
    }
    return queryParams;
}