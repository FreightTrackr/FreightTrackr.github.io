export function AutofillForm() {
    const queryParams = GetQueryParams();
    
    for (const key in queryParams) {
        const input = document.querySelector(`[name="${key}"]`);
        if (input) {
            input.value = queryParams[key];
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