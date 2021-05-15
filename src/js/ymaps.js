function mapInit() {
  ymaps.ready(() => {
    let moscow = new ymaps.Map("map", {
      center: [55.76, 37.6],
      zoom: 10,
      controls: ["zoomControl"],
      behaviors: ["drag"],
    });
    let placemark = new ymaps.Placemark([55.76, 37.6], {
      hintContent: "this is hint",
      balloonContent: "this is baloon",
    });

    moscow.geoObjects.add(placemark);

    moscow.events.add("click", function (e) {
      if (!moscow.balloon.isOpen()) {
        var coords = e.get("coords");
        moscow.balloon.open(coords, {
          contentHeader: "Отзыв",
          contentBody:
            "<p><input type='text' placeholder='Укажите ваше имя'></p>" +
            "<input type='text' placeholder = 'Укажите место'>" +
            "<p><textarea placeholder ='Оставьте отзыв'></textarea></p> " +
            "<p><button>Добавить</button></p> " +
            [coords[0].toPrecision(6), coords[1].toPrecision(6)].join(", "),
          contentFooter: "<sup>Щелкните еще раз</sup>",
        });
      } else {
        moscow.balloon.close();
      }
    });
    moscow.events.add("click", (e) => {
      console.log(e.get("coords"));
    });
  });
}

export { mapInit };
