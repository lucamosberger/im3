const apiUrl = "https://abgespacet.lucamosberger.ch/script/luca_api.php";

let chart = null;

getApiData(apiUrl);

function getApiData(url) {
fetch(apiUrl)
    .then((response) => response.json())
    .then((myData) => {
        console.log(myData);

        let latitude = myData.map((item) => item.latitude);
        let longitude = myData.map((item) => item.longitude);

        const ctx = document.getElementById('myChart');

        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Locations',
                    data: longitude.map((value, index) => {
                        return { x: longitude[index], y: latitude[index] };
                    }),
                    borderColor: '#ff6900',
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        display: true,
                        title: {
                            display: true,
                            text: 'Longitude'
                        },
                        labels: longitude.map((value, index) => longitude[index])
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Latitude'
                        }
                    }
                }
            }
        });
    })
}

function addData(chart, label, newdata) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(newdata);
    }
    )
}
