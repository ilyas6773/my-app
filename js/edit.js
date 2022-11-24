import '../edit.css'
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import BingMaps from 'ol/source/BingMaps';



const id = Number(window.location.search.replace("?id=", ""));
let setError = document.getElementById('error');

function getDataFromTheServer() {
    if (id == 0) return; // TODO: Проверка на число

    fetch(`https://localhost:7265/api/Houses/GetById/${id}`)
        .then(response => response.json())
        .then(house => {
            console.log(house);
            document.getElementById('Price').value = house[0]['Price'];
            document.getElementById('Id').value = house[0]['Id'];
            document.getElementById('PublicationDate').value = Date(house['PublicationDate']);
            document.getElementById('latitude').value = house[0]['Geo_Lat'];
            document.getElementById('longitude').value = house[0]['Geo_Lon'];
            document.getElementById('Region').value = house[0]['Region'];
            document.getElementById('floor').value = house[0]['FloorNum'];
            document.getElementById('totalFloor').value = house[0]['TotalFloor'];
            document.getElementById('room').value = house[0]['Rooms'];
            document.getElementById('area').value = house[0]['Area'];
            document.getElementById('photo').value = house[0]['Photopath'];
            switch (house[0]['Building_Type']) {
                case 0:
                    document.getElementById('other').checked = true;
                    break;
                case 1:
                    document.getElementById('panel').checked = true;
                    break;
                case 2:
                    document.getElementById('monolithic').checked = true;
                    break;
                case 3:
                    document.getElementById('brick').checked = true;
                    break;
                case 4:
                    document.getElementById('blocky').checked = true;
                    break;
                case 5:
                    document.getElementById('wood').checked = true;
                    break;
            }

            switch (house[0]['Object_Type']) {
                case 1:
                    document.getElementById('other1').checked = true;
                    break;
                case 2:
                    document.getElementById('panel').checked = true;
                    break;
            }
        })
    //.catch(error => setError.innerHTML = '<p><font color="red">Отсутствует подключение к серверу.</font></p>');
}
getDataFromTheServer();


document.getElementById('editbtn').onclick = function () {
    let price = document.getElementById('Price').value;
    let id = document.getElementById('Id').value;
    //let date = document.getElementById('PublicationDate').value;
    let lat = document.getElementById('latitude').value;
    let lon = document.getElementById('longitude').value;
    let reg = document.getElementById('Region').value;
    let floor = document.getElementById('floor').value;
    let totalfloor = document.getElementById('totalFloor').value;
    let room = document.getElementById('room').value;
    let area = document.getElementById('area').value;
    let photo = document.getElementById('photo').value;

    let object;
    if (document.getElementById('other1').checked) {
        object = 1;
    } else { object = 2; }

    let buildType;
    if (document.getElementById('other').checked) {
        buildType = 0;
    } else if (document.getElementById('panel').checked) {
        buildType = 1;
    } else if (document.getElementById('monolithic').checked) {
        buildType = 2;
    } else if (document.getElementById('brick').checked) {
        buildType = 3;
    } else if (document.getElementById('blocky').checked) {
        buildType = 4;
    } else { buildType = 5; }

    editUser(price, id, lat, lon, reg, floor, totalfloor, room, area, photo, buildType, object);
}


async function editUser(price, id, lat, lon, reg, floor, totalfloor, room, area, photo, buildType, object) {

    let body = {
        Price: price,
        Geo_Lat: lat,
        Geo_Lon: lon,
        Region: reg,
        Building_Type: buildType,
        FloorNum: floor,
        TotalFloor: totalfloor,
        Rooms: room,
        Area: area,
        Object_Type: object,
        Id: id,
        status: 1,
        Photopath: photo,
    };

    let y = JSON.stringify(body);
    console.log(y);

    fetch(`https://localhost:7265/api/Houses/Put?x=${y}`, {
        method: 'PUT',
        body: y,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    window.location.replace("http://localhost:5173/index.html");
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