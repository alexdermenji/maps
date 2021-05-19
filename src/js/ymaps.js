function mapInit() {
  ymaps.ready(() => {
    //     create map
    let myMap = new ymaps.Map("map", {
      center: [55.751574, 37.573856],
      zoom: 13,
      controls: ["zoomControl"],
      behaviors: ["drag"],
    });

    let clusterer = new ymaps.Clusterer({
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterOpenBalloonOnClick: true,
      clusterBalloonContentLayout: "cluster#balloonCarousel",
      clusterBalloonContentLayoutWidth: 200,
      clusterBalloonContentLayoutHeight: 330,
    });

    let coords;

    const template = `<h2>Отзыв</h2> 
    <form id='form'>
    <p><input type='text' id='input__name' placeholder='Укажите ваше имя' name='name'></p> 
    <input type='text' id='input__place' placeholder = 'Укажите место' name='place'>
    <p><textarea id='input__review' placeholder ='Оставьте отзыв' name='review'></textarea></p> 
    <p><button type='button' id='btn'>Добавить</button></p>  
    </form>`;

    //      create localStorage
    let placemarksData;
    let storage = localStorage;
    if (!storage.placemarks) {
      placemarksData = [];
    } else {
      placemarksData = JSON.parse(storage.placemarks);
    }

    //      createPlacemark

    function createPlaceMark(coords, data) {
      let reviewsContent = `<b>${data.name}</b> [${data.place}]<p>${data.reviews}</p>`;

      let placemark = new ymaps.Placemark(coords, {
        balloonContentHeader: reviewsContent,
        balloonContentBody: template,
      });

      myMap.geoObjects.add(placemark);

      // clusterer.add(placemark);
      // myMap.geoObjects.add(clusterer);

      placemark.events.add("click", (e) => {
        showBalloon(coords);
      });

      return placemark;
    }
    function showPlaceMarks(data) {
      for (let i = 0; i < data.length; i++) {
        createPlaceMark(data[i].coords, data[i]);
      }
    }
    function saveToStorage(data, form, coords) {
      data.push({
        //добавляем метку в localStorage
        id: data.length,
        name: form.elements.name.value,
        place: form.elements.place.value,
        reviews: [form.elements.review.value],
        coords: coords,
      });

      storage.placemarks = JSON.stringify(data);
    }

    showPlaceMarks(placemarksData);

    //show balloon
    const showBalloon = function (coords) {
      myMap.balloon.open(coords, {
        contentBody: template,
      });
    };

    myMap.events.add("click", (e) => {
      coords = e.get("coords");
      showBalloon(coords);
    });

    document.addEventListener("click", (e) => {
      if (e.target.id === "btn") {
        const form = document.getElementById("form");
        e.preventDefault();
        saveToStorage(placemarksData, form, coords);
        createPlaceMark(coords, placemarksData[placemarksData.length - 1]);

        myMap.balloon.close();
      }
    });
  });
}

export { mapInit };
