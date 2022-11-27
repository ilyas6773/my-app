import '../edit.css'
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';






document.getElementById('addBtn').onclick = function () {
    let title = document.getElementById('Title').value;
    let price = document.getElementById('Price').value;
    let date = document.getElementById('PublicationDate').value;
    let lat = document.getElementById('latitude').value;
    let lon = document.getElementById('longitude').value;
    let file = document.getElementById('file').files[0];

    console.log(date);
    addUser(title, price, date, lat, lon, file);
}


async function addUser(title, price, date, lat, lon, file) {

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        let body = {
            id: 0,
            title: title,
            price: price,
            publicationDate : date,
            geo_Lat: lat,
            geo_Lon: lon,
            status: 1,
            file: reader.result.replace("data:application/json;base64,", '')
        };

        console.log(JSON.stringify(body));


        fetch('http://localhost:5195/api/House/Add', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        setTimeout(() => {  location.replace("http://localhost:5173/index.html"); }, 1000);
        
    }

    // let y = JSON.stringify(body);
    // console.log(y);

    // fetch(`https://localhost:5195/api/House/Post?x=${y}`, {
    //     method: 'POST',
    //     body: y,
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });

    // window.location.replace("http://localhost:5173/index.html");
}

//////////////////////////////////////////MAP//////////////////////////////////////////


const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: [0, 0],
        zoom: 2
    })
});

var linkLayer;
var coord;
async function onClick(browserEvent) {
    if (linkLayer != null) return;

    var coordinate = browserEvent.coordinate;

    var forms = document.getElementById('latitude');
    forms.value = coordinate[0];
    forms = document.getElementById('longitude');
    forms.value = coordinate[1];

    console.log(coordinate);
}
map.on('click', onClick);