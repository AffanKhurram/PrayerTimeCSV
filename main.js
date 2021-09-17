'use strict';

async function fetchAsync (url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

function createArray (arr, options, start, end) {
    var csvArray = [['Subject', 'Start date', 'Start time']];

    for (var i = 0; i < arr.length; i++) {
        var day = arr[i];
        // Skip dates
        if (day.date.gregorian.year == start[0] && day.date.gregorian.month.number == parseInt(start[1]) && parseInt(day.date.gregorian.day) < parseInt(start[2])) {
            continue;
        }
        // stop
        if (day.date.gregorian.year == end[0] && day.date.gregorian.month.number == parseInt(end[1]) && parseInt(day.date.gregorian.day) == parseInt(end[2])) {
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
            break;
        }
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
    }

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

document.getElementById('location').addEventListener('click', async function(e) {
    navigator.geolocation.getCurrentPosition(success, err);
});

document.getElementById('submit').addEventListener('click', async function(e) {
    var form = document.getElementById('input');
    var start = form.start.value.split('-');
    var end = form.end.value.split('-');
    var s = parseInt(start[0] + start[1]);
    var e = parseInt(end[0] + end[1])
    var arr = [];

    while (s <= e) {
        var month = s%100;
        var year = Math.floor(s/100);
        var url = "https://api.aladhan.com/v1/calendarByAddress?address=" + form.address.value + "&method=2&month=" + month + "&year=" + year;
        s++;
        if (s % 100 > 12) {
            s -= 12;
            s += 100;
        }
        await fetchAsync(url)
            .then(function(data) {
                arr = arr.concat(data.data);
            })
            .catch(function(err) {
                console.log(err);
            });
    }
    
    var options = {
        fajr: document.getElementById("Fajr").checked,
        dhuhr: document.getElementById("Dhuhr").checked,
        asr: document.getElementById("Asr").checked,
        maghrib: document.getElementById("Maghrib").checked,
        isha: document.getElementById("Isha").checked
    }

    downloadFile(createArray(arr, options, start, end));
        
});

async function success (data) {
    var url = "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=" + data.coords.latitude + "&longitude=" + data.coords.longitude + "&localityLanguage=en";
    await fetchAsync(url)
        .then(function(pos) {
            document.getElementById("input").address.value = pos.city + "," + pos.principalSubdivision + ',' + pos.countryCode;
        })
        .catch(function(err) {
            console.log(err);
        });
}

function err (e) {
    console.log(e)
}

navigator.geolocation.getCurrentPosition(success, err);