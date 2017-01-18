function initMap() {

  // neighborhood that I am interested in
  var neighborhoodLatLng = { lat: 39.916345, lng: 116.397155 };

  // and 9 locations
  var locations = [
    {
      title: 'Forbidden City',
      pos: {lat: 39.916345, lng: 116.397155}
    },
    {
      title: 'National Museum of China',
      pos: {lat: 39.905124, lng: 116.400484}
    },
    {
      title: 'Zhongshan Park',
      pos: {lat: 39.911788, lng: 116.394813}
    },
    {
      title: 'Nanluoguxiang',
      pos: {lat: 39.937087, lng: 116.403148}
    },
    {
      title: 'ShiChaHai',
      pos: {lat: 39.933925, lng: 116.392386}
    },
    {
      title: 'Xidan JoyCity',
      pos: {lat: 39.910839, lng: 116.373093}
    },
    {
      title: 'Gongren Stadium',
      pos: {lat: 39.9291, lng: 116.44327}
    },
    {
      title: 'Ditan Park',
      pos: {lat: 39.952876, lng: 116.416069}
    },
    {
      title: 'Temple of Heaven',
      pos: {lat: 39.883738, lng: 116.412934}
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

    // show infowindow about some marker when user clicks on it
    self.showInfoWindow = function() {
      var imgSrc = 'http://maps.googleapis.com/maps/api/streetview?size=200x150&location='
                    + this.position.lat() + ',' + this.position.lng();
      var InfoWindowPos = this.position;
      var InfoWindowContent = '<IMG BORDER="0" ALIGN="Middle" SRC=' + imgSrc + '>';
      var singleInfoWindow = new google.maps.InfoWindow({
        position: InfoWindowPos,
        content: InfoWindowContent
      });
      singleInfoWindow.open(map, this);
    };

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

      singleMarker.addListener('click', self.showInfoWindow);

      var singleLocationItem = {
        title: ko.observable(singleLocation.title),
        itemClass: ko.observable('show-item')
      };
      self.locationItems.push(singleLocationItem);
    });

    // user's input filter location items on the list and markers on the map
    self.filterText = ko.observable('');

    self.filterMarker = function() {
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
