export function postBiasa(target_url,datajson,responseFunction){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    var raw = JSON.stringify(datajson);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(target_url, requestOptions)
        .then(response => {
            const status = response.status;
            return response.text().then(result => {
                const parsedResult = JSON.parse(result);
                responseFunction({ status, data: parsedResult });
            });
        })
        .catch(error => console.log('error', error));
}

export function getBiasa(target_url,responseFunction){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    fetch(target_url, requestOptions)
        .then(response => {
            const status = response.status;
            return response.text().then(result => {
                const parsedResult = JSON.parse(result);
                responseFunction({ status, data: parsedResult });
            });
        })
        .catch(error => console.log('error', error));
}

export function putBiasa(target_url,datajson,responseFunction){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    var raw = JSON.stringify(datajson);

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(target_url, requestOptions)
        .then(response => {
            const status = response.status;
            return response.text().then(result => {
                const parsedResult = JSON.parse(result);
                responseFunction({ status, data: parsedResult });
            });
        })
        .catch(error => console.log('error', error));
}

export function deleteBiasa(target_url,datajson,responseFunction){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

    var raw = JSON.stringify(datajson);

    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(target_url, requestOptions)
        .then(response => {
            const status = response.status;
            return response.text().then(result => {
                const parsedResult = JSON.parse(result);
                responseFunction({ status, data: parsedResult });
            });
        })
        .catch(error => console.log('error', error));
}

export function getCsv(target_url, tokenkey, tokenvalue, responseFunction) {
    let myHeaders = new Headers();
    myHeaders.append(tokenkey, tokenvalue);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "text/csv");

    let requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    fetch(target_url, requestOptions)
        .then(response => {
            const status = response.status;
            return response.text().then(result => {
                if (response.ok) {
                    responseFunction({ status, data: result });
                } else {
                    try {
                        const parsedError = JSON.parse(result);
                        responseFunction({ status, data: parsedError.message });
                    } catch {
                        responseFunction({ status, data: result });
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}