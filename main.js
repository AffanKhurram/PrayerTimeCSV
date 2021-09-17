'use strict';

async function fetchAsync (url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

function createArray (data, options) {
    var arr = data.data;
    var csvArray = [['Subject', 'Start date', 'Start time']];

    arr.forEach(function(day) {
        if (options.fajr)
            csvArray.push(['Fajr', day.date.gregorian.month.number + '/' + day.date.gregorian.day + '/' + day.date.gregorian.year, day.timings.Fajr.slice(0, -6)]);
        if (options.dhuhr)
            csvArray.push(['Dhuhr', day.date.gregorian.month.number + '/' + day.date.gregorian.day + '/' + day.date.gregorian.year, day.timings.Dhuhr.slice(0, -6)]);
        if (options.asr)
            csvArray.push(['Asr', day.date.gregorian.month.number + '/' + day.date.gregorian.day + '/' + day.date.gregorian.year, day.timings.Asr.slice(0, -6)]);
        if (options.maghrib)
            csvArray.push(['Maghrib', day.date.gregorian.month.number + '/' + day.date.gregorian.day + '/' + day.date.gregorian.year, day.timings.Maghrib.slice(0, -6)]);
        if (options.isha)
            csvArray.push(['Isha', day.date.gregorian.month.number + '/' + day.date.gregorian.day + '/' + day.date.gregorian.year, day.timings.Isha.slice(0, -6)]);
    });

    return csvArray;
}

function downloadFile (data) {
    let csvContent = "data:text/csv;charset=utf-8,";

    data.forEach(function(row) {
        let line = row.join(',');
        csvContent += line + '\r\n';
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "prayer_timings.csv");
    document.body.appendChild(link);
    link.click();
}

// document.getElementById("input").addEventListener("submit", function(e) {
//     console.log(document.getElementById('input')['address']);
// });

document.getElementById('submit').addEventListener('click', function(e) {
    var form = document.getElementById('input');
    var url = "http://api.aladhan.com/v1/calendarByAddress?address=" + form.address.value + "&method=2&year=" + form.year.value;
    var options = {
        fajr: document.getElementById("Fajr").checked,
        dhuhr: document.getElementById("Dhuhr").checked,
        asr: document.getElementById("Asr").checked,
        maghrib: document.getElementById("Maghrib").checked,
        isha: document.getElementById("Isha").checked
    }
        
    fetchAsync("https://api.aladhan.com/v1/calendarByAddress?address=Richardson,TX,USA&method=2&month=9&year=2021")
        .then(function(data) {
            var arr = createArray(data, options);
            // arr.forEach(function(row) {
            //     console.log(row);
            // });
            downloadFile(arr);
        })
        .catch(function(err) {
            console.log(err);
        })
});

// fetchAsync("http://api.aladhan.com/v1/calendarByAddress?address=Richardson,TX,USA&method=2&month=9&year=2021")
//     .then(function(data) {
//         var arr = createArray(data);
//         arr.forEach(function(row) {
//             console.log(row);
//         });
//         //downloadFile(arr);
//     })
//     .catch(function(err) {
//         console.log(err);
//     })

// var arr = [
//     ['subject', 'start date', 'start time'],
//     ['fajr', '9/1/2021', '13:39'],
//     ['dhuhr, 9/1/2021', '13:3']
// ];

// let csvContent = "data:text/csv;charset=utf-8,";

// arr.forEach(function(row) {
//     let line = row.join(',');
//     csvContent += line + '\r\n';
// });

// var encodedUri = encodeURI(csvContent);
// var link = document.createElement("a");
// link.setAttribute("href", encodedUri);
// link.setAttribute("download", "prayer_timings.csv");
// console.log(document.body);
// document.body.appendChild(link); // Required for FF

// link.click(); // This will download the data file named "my_data.csv".
