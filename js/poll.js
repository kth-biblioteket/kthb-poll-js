var getTotal = function (myChart) {
    var sum = myChart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);
    return sum;
}

const ctx = document.getElementById('myChart');
Chart.register(ChartDataLabels);
Chart.register(DoughnutLabel);
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        //labels: ['Clothing', 'Food', 'Education', 'Things', 'Plants'],
        datasets: [{
            label: '# of Votes',
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            hoverBackgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ]
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            animateScale: true,
            animateRotate: true
        },
        borderWidth: 0,
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                labels: {
                    name: {
                        // center, end, start, top*
                        align: 'end',
                        anchor: 'end',
                        color: '#ffffff' //function (ctx) {return ctx.dataset.backgroundColor;}
                        ,
                        font: function (context) {
                            var avgSize = Math.round((context.chart.height + context.chart.width) / 2);
                            var size = Math.round(avgSize / 32);
                            return {
                                size: size + 3,
                                weight: 'bold'
                            };
                        },
                        formatter: function (value, ctx) {
                            return ctx.active
                                ? ctx.dataset.data[ctx.dataIndex] + ''
                                : ctx.chart.data.labels[ctx.dataIndex];
                        },
                        offset: 8,
                        opacity: function (ctx) {
                            return ctx.active ? 1 : 1;
                        }
                    }
                }
            },
            doughnutlabel: {
                paddingPercentage: 5,
                labels: [
                    {
                        text: getTotal,
                        font: {
                            size: 96,
                            family: 'Arial, Helvetica, sans-serif',
                            style: 'italic',
                            weight: 'bold',
                        },
                        color: 'rgba(255, 255, 255, 1)',
                    },
                    {
                        text: `Promises`,
                        font: {
                            size: 48,
                            family: 'Arial, Helvetica, sans-serif',
                            style: 'italic',
                            weight: 'bold',
                        },
                        color: 'rgba(255, 255, 255, 1)',
                    },
                ],
            }
        },
        cutout: "65%",
        radius: "60%"
    }
});

var api_url = "https://ref.lib.kth.se"
var eventid = 2;
var data = [{
    name: 'Clothing',
    value: 0,
    color: '#cedb29'
}, {
    name: 'Food',
    value: 0,
    color: '#5cb7b3'
}, {
    name: 'Education',
    value: 0,
    color: '#146170'
}, {
    name: 'Things',
    value: 0,
    color: '#a65a95'
}, {
    name: 'Plants',
    value: 0,
    color: '#cb7d31'
}];

var socket = io.connect('https://ref.lib.kth.se');

socket.on("FromAPI", function (data) {
    document.getElementById("globe").classList.toggle('animated')
    GETInitialVotes(false);
});

socket.on("connect", () => {
});

socket.on("disconnect", () => {
});

socket.on('error', console.error.bind(console));

function GETInitialVotes(first) {
     return fetch(api_url + '/vote/api/v1/vote/' + eventid, {
        method: 'GET',
        headers: new Headers({
            'X-Api-Key': 'kg897n987n98n)!dskjlksjfd?435mnckjsbsekef-_klknbhjhsef'
        }),
        mode: 'cors'
    }).then(function (res) {
        if (res.ok) {
            return res.json();
        } else {
            throw new TypeError('GETVotes error');
        }
    }).then(function (resJSON) {
        var total = 0;
        var currentVotes = resJSON.currentVotes
        var chartdataarray = [];
        var chartlabelarray = [];
        data.map(function (category, i) {
            var key = category.name;
            var votes = currentVotes[key];
            chartlabelarray.push(key)
            chartdataarray.push(votes)
        });
        myChart.data.datasets[0].data = chartdataarray;
        myChart.data.labels = chartlabelarray;
        if (first === true) {
        }
        myChart.update();
    }).catch(function (err) {
        console.log(err);
    });
}


GETInitialVotes(true)

move.onclick = () => {
    document.getElementById("globe").classList.toggle('animated')
    GETInitialVotes(false);
}
const animated = document.getElementById('globe');
    animated.addEventListener('animationend', () => {
        document.getElementById("globe").classList.toggle('animated')
    });

