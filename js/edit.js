import '../edit.css'
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import moment from 'moment';


const id = Number(window.location.search.replace("?id=", ""));
let setError = document.getElementById('error');

function getDataFromTheServer() {
    if (id == 0) return; // TODO: Проверка на число

    fetch(`http://localhost:5195/api/House/GetById?id=${id}`)
        .then(response => response.json())
        .then(house => {
            console.log(house);
            document.getElementById('Id').value = house['id'];
            document.getElementById('Title').value = house['title'];
            document.getElementById('Price').value = house['price'];

            const date = new Date(house['publicationDate']);
            var date1 = moment(date).format('yyy-MM-DD');

            document.getElementById('PublicationDate').value = date1;
            document.getElementById('latitude').value = house['geo_Lat'];
            document.getElementById('longitude').value = house['geo_Lon'];
            //document.getElementById('file').value = house['file'];

            console.log(document.getElementById('PublicationDate').value)

        })
    //.catch(error => setError.innerHTML = '<p><font color="red">Отсутствует подключение к серверу.</font></p>');
}
getDataFromTheServer();


document.getElementById('editbtn').onclick = function () {
    let id = document.getElementById('Id').value;
    let title = document.getElementById('Title').value;
    let price = document.getElementById('Price').value;
    let date = document.getElementById('PublicationDate').value;
    let lat = document.getElementById('latitude').value;
    let lon = document.getElementById('longitude').value;
    let file = document.getElementById('file').files[0];
    
    editUser(id, title, price, date, lat, lon, file);
}


async function editUser(id, title, price, date, lat, lon, file) {

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        let body = {
            id: id,
            title: title,
            price: price,
            publicationDate : date,
            geo_Lat: lat,
            geo_Lon: lon,
            status: 1,
            file: reader.result.replace("data:application/json;base64,", '')
        };

        console.log(JSON.stringify(body));


        fetch('http://localhost:5195/api/House/Edit', {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        setTimeout(() => {  location.replace("http://localhost:5173/index.html"); }, 1000);
    }
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