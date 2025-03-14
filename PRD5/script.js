// Fetch data from an API and save it as a JSON file in the browser

function fetchDataAndSave(family) {
    const apiUrl = 'https://www.fruityvice.com/api/fruit/family/' + family;
    const proxyUrl = 'https://corsproxy.io/';

    fetch(proxyUrl + apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse JSON
        })
        .then(data => {
            // Convert data to a JSON string
            const jsonString = JSON.stringify(data, null, 2);

            // Create a Blob with the JSON data
            const blob = new Blob([jsonString], { type: 'application/json' });

            // Create a download link
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = family + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function showDataResult(family) {
    const apiUrl = 'https://www.fruityvice.com/api/fruit/family/' + family;
    const proxyUrl = 'https://corsproxy.io/';

    fetch(proxyUrl + apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse JSON and return it
    })
    .then(data => {
        document.getElementById('floatingTextarea').value = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('floatingTextarea').value = 'Failed to load data';
    });
}