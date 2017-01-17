function initMap() {

  // neighborhood that I am interested in
  var neighborhoodLatLng = { lat: 49.130593, lng: 9.209632 };

  // and 9 locations
  var locations = [
    {
      title: 'Heilbronn University',
      pos: {lat: 49.12259, lng: 9.210835}
    },
    {
      title: 'OBI Markt Heilbronn-Schwabenhof',
      pos: {lat: 49.122947, lng: 9.2206}
    },
    {
      title: 'China Restaurant Hongkong',
      pos: {lat: 49.13782, lng: 9.20914}
    },
    {
      title: 'Wertwiesenpark',
      pos: {lat: 49.130264, lng: 9.202187}
    },
    {
      title: 'ASV Biergarten am Park',
      pos: {lat: 49.12709, lng: 9.199}
    },
    {
      title: 'Heilbronn Hauptbahnhof',
      pos: {lat: 49.142613, lng: 9.208512}
    },
    {
      title: 'Media Markt Heilbronn',
      pos: {lat: 49.148903, lng: 9.212966}
    },
    {
      title: 'Rathaus mit astronom. Uhr',
      pos: {lat: 49.142506, lng: 9.2184}
    },
    {
      title: 'Oralchirurgie Dr. Troßbach',
      pos: {lat: 49.14112, lng: 9.22468}
    }
  ];

  // new map
  var map = new google.maps.Map(document.getElementById('map'), {
    center: neighborhoodLatLng,
    zoom: 18
  });

  // new bounds for markers
  var bounds = new google.maps.LatLngBounds;

  // viewModel: contains markers
  var viewModel = function() {
    var self = this;

    // create markers in ViewModel
    self.markers = ko.observableArray([]);
    // and location items on the list to show
    self.locationItems = ko.observableArray([]);

    locations.forEach(function(singleLocation) {
      var singleMarker = new google.maps.Marker({
        map: map,
        title: singleLocation.title,
        position: singleLocation.pos
      });
      self.markers.push(singleMarker);

      bounds.extend(singleMarker.position);
      map.fitBounds(bounds);

      var singleLocationItem = {
        title: ko.observable(singleLocation.title),
        itemClass: ko.observable('show-item')
      };
      self.locationItems.push(singleLocationItem);
    });

    // user's input filter location items on the list and markers on the map
    self.filterText = ko.observable('');

    self.filterMarker = function() {
      console.log('ok');
      for (var i = 0; i < self.markers().length; i++) {
        var singleMarker = self.markers()[i];
        if (singleMarker.title.indexOf(self.filterText()) === -1) {
          singleMarker.setMap(null);
          self.locationItems()[i].itemClass('hide-item');
        } else {
          if (singleMarker.map !== map) {
            singleMarker.setMap(map);
          }
          self.locationItems()[i].itemClass('show-item');
        };
      };
    };

    // user clicks on location item to focus on a marker
    self.focusMarker = function() {
      for (var i = 0; i < self.markers().length; i++) {
        var singleMarker = self.markers()[i];
        if (singleMarker.title === this.title()) {
          singleMarker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout((function(marker) {
            return function() {
              marker.setAnimation(null);
            }
          })(singleMarker), 2100);
        };
      };
    };
  };

  ko.applyBindings(new viewModel());
};
