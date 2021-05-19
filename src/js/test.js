/* 
0) Добавьте возможность реагировать на клики по карте. При клике на карту - открывайте балун с формой для отзыва (DONE)
1) после заполнения формы и нажатия на кнопку "Добавить", балун с формой должен быть закрыт, а на карту добавлен плейсмарк по тем координатам, по которым был открыт балун; (DONE)
2) отзывы поблизости группируются в одну метку. У сгруппированных меток выводится их количество; (DONE)
3) при масштабировании карты, происходит группировка меток; (DONE)
4) после нажатия на плейсмарк, должа открываться форма для составления нового отзыва об этих кординатах; (DONE)
5) на форме должны присутствовать все ранее оставленные для этих кординат отзывы; --TODO
6) при перезагрузке страницы, все отзывы и плейсмарки должны быть восстановлены (в базовом варианте для этого можно использовать localStorage, но вы можете создать свой сервер на node.js); (DONE)

Задание с *
7) при нажатии на сгруппированный объект открывается карусель отзывов. При нажатии на адрес в карусели откроется окно с отзывами по данному адресу. --TODO
*/

function mapInit() {
  ymaps.ready(() => {
    //     create map
    let myMap = new ymaps.Map("map", {
      center: [55.751574, 37.573856],
      zoom: 13,
      controls: ["zoomControl"],
      behaviors: ["drag"],
    });

    // create cluster
    let clusterer = new ymaps.Clusterer({
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterOpenBalloonOnClick: true,
      clusterBalloonContentLayout: "cluster#balloonCarousel",
      clusterBalloonContentLayoutWidth: 200,
      clusterBalloonContentLayoutHeight: 330,
    });

    //      create localStorage
    let placemarksData;
    const cachePlacemarks = {};
    let storage = localStorage;
    if (!storage.placemarks) {
      placemarksData = {};
    } else {
      placemarksData = JSON.parse(storage.placemarks);
    }

    // html template
    const template = `<h2>Отзыв</h2> 
    <form id='form'>
    <p><input type='text' id='input__name' placeholder='Укажите ваше имя' name='name'></p> 
    <input type='text' id='input__place' placeholder = 'Укажите место' name='place'>
    <p><textarea id='input__review' placeholder ='Оставьте отзыв' name='review'></textarea></p> 
    <p><button type='button' id='btn'>Добавить</button></p>  
    </form>`;

    let gCoords;

    //  createPlacemark
    function createPlaceMark(coords, data) {
      const reviewsContent = data.reviews.reduce((str, { name, review }) => {
        str += `<p><b>${name}</b>: ${review}</p>`;
        return str;
      }, "");

      let placemark;
      // TODO: fix placemarkKey
      const placemarkKey = [data.place].join(";");
      console.log("placemarkKey", placemarkKey);
      if (cachePlacemarks[placemarkKey]) {
        placemark = cachePlacemarks[placemarkKey];
      } else {
        placemark = new ymaps.Placemark(coords, {
          balloonContentBody: template,
        });
        placemark.events.add("click", (e) => {
          gCoords = coords;
          showBalloon(gCoords);
        });

        clusterer.add(placemark);
        cachePlacemarks[placemarkKey] = placemark;
      }
      placemark.properties.set(
        "balloonContentHeader",
        `<p><p>${data.place}</p>${reviewsContent}`
      );

      return placemark;
    }

    //show all placemarks on the map
    function showPlaceMarks(placemarksData) {
      Object.values(placemarksData).forEach((places) => {
        Object.values(places).forEach((place) => {
          createPlaceMark(place.coords, place);
        });
      });
      myMap.geoObjects.add(clusterer);
    }

    //sava data to storage
    function saveToStorage(form, coords) {
      const place = form.elements.place.value;
      // TODO: fix coordsKey
      const coordsKey = place;
      placemarksData[coordsKey] = placemarksData[coordsKey] ?? {};
      placemarksData[coordsKey][place] = placemarksData[coordsKey][place] ?? {
        place,
        coords,
        reviews: [],
      };
      placemarksData[coordsKey][place].reviews.push({
        name: form.elements.name.value,
        review: form.elements.review.value,
      });

      storage.placemarks = JSON.stringify(placemarksData);
      return placemarksData[coordsKey][place];
    }

    //show placemarks on the map
    showPlaceMarks(placemarksData);

    //show balloon
    const showBalloon = function (coords) {
      myMap.balloon.open(coords, {
        contentBody: template,
      });
    };
    //map click listener
    myMap.events.add("click", (e) => {
      gCoords = e.get("coords");
      console.log("set cooords myMap", gCoords);
      showBalloon(gCoords);
    });
    // TODO: union clusterer.events.add + myMap.events.add
    clusterer.events.add("click", (e) => {
      gCoords = e.get("coords");
      console.log("set cooords clusterer", gCoords);
      showBalloon(gCoords);
    });
    //button click listenet
    document.addEventListener("click", (e) => {
      if (e.target.id === "btn") {
        const form = document.getElementById("form");
        e.preventDefault();
        console.log("set cooords", gCoords);
        const placemark = saveToStorage(form, gCoords);
        createPlaceMark(gCoords, placemark);

        myMap.balloon.close();
      }
    });
  });
}

export { mapInit };
