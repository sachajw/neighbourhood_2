var locationsObj = function(data) {

    var self = this;
    self.address = ko.observable('');
    self.contentString = ko.observable('');
    self.lat = ko.observable(data.lat);
    self.lng = ko.observable(data.lng);
    self.marker = ko.observable();
    self.title = ko.observable(data.title);
    self.content = ko.observable(data.content);
    self.url = ko.observable('');
    self.id = ko.observable('');
};

var markers = [{
        lat: -34.0972041,
        lng: 18.377911700000027,
        iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        content: '<h2>The Village Roast</h2><br><h4>Noordhoek Farm Village, Main Road<br>Daily 06:30-14:30 <br><br> Great coffee!</h4>',
        title: 'The Village Roast'
    },
    {
        lat: -34.099052214344724,
        lng: 18.38208496570587,
        iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        content: '<h2>Cape Point Vineyards</h2><br><h4>Silvermine Road<br>Wine Tasting: Daily 11:00-18:00<br>Market: Thursday 16:30-20:30<br><br>Majestic view!</h4>',
        title: 'Cape Point Vineyards'
    },
    {
        lat: -34.09687110947399,
        lng: 18.372305631637573,
        iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        content: '<h2>Jakes on the Common</h2><br><h4>Chapmans Peak Drive<br>Monday to Saturday 08:30-22:00<br>Sunday 08:30-17:00<br><br>Fat juicy steaks!</h4>',
        title: 'Jakes on the Common'
    },
    {
        lat: -34.09827928340744,
        lng: 18.363819122314453,
        iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        content: '<h2>Aegir Project</h2><br><h4>Beach Road<br>Friday 16:00-19:00<br>Saturday 12:00-18:00<br>Sunday 12:00-15:00<br><br> Independent Craft Brewery!</h4>',
        title: 'Aegir Project'
    },
    {
        lat: -34.098230419720146,
        lng: 18.35763931274414,
        iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        content: '<h2>Noordhoek Beach</h2><br><h4>Parking in Beach Road<br><br> Family fun in the sun!</h4>',
        title: 'Noordhoek Beach'
    },
    {
        lat: -34.096759,
        lng: 18.352614,
        iconImage: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
        content: '<h2>The Hoek Surf Break</h2><br><h4>Parking in Beach Road<br><br>Big barreling stoke!</h4>',
        title: 'The Hoek Surf Break'
    },
];


function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: -34.0972041, lng: 18.377911700000027 }
    });

    ko.applyBindings(new ViewModel());

}


var ViewModel = function() {

    var self = this;
    var infowindow = new google.maps.InfoWindow({
        maxWidth: 250
    });
    var bounds = new google.maps.LatLngBounds();
    var venue;
    var location;
    var marker;
    var UserInput;
    var url;
    var id;

    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'

    // an observable array that stores converted data from the model
    self.hangouts = ko.observableArray([]);

    // loop over the model data and convert each item to an object of ko.observables. store the objects in the observable array
    markers.forEach(function(hangoutData) {
        self.hangouts.push(new locationsObj(hangoutData));
    });



    // set up the map's interactivity
    self.hangouts().forEach(function(hangoutData) {

        // create markers
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(hangoutData.lat(), hangoutData.lng()),
            map: map,
            icon: image,
            animation: google.maps.Animation.DROP
        });
        bounds.extend(marker.position);
        hangoutData.marker = marker;

        // make some infoWindows!
        google.maps.event.addListener(hangoutData.marker, 'click', function() {
            infowindow.open(map, this);
            hangoutData.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                hangoutData.marker.setAnimation(null);
            }, 1200);
            infowindow.setContent(hangoutData.content());
        });
    });

    map.fitBounds(bounds);

    // connect the list items to the correct marker on click
    self.popInfoWindow = function(hangoutData) {
        google.maps.event.trigger(hangoutData.marker, 'click');
        $(".menu").slideToggle("slow", function() {
            $(".close").hide();
            $(".hamburger").show();
        });
    };

    // empty observable array to contain search results
    self.visible = ko.observableArray();

    // initially, all markers are visible
    self.hangouts().forEach(function(place) {
        self.visible.push(place);
    });

    // make the input from the search box available as a ko.observable
    self.userInput = ko.observable('');

    // show markers for locations in search results
    self.filterMarkers = function() {
        // when a search is initiated, reset the map to blank
        // use .toLowerCase() so that user input will be matched whether they capitalize or not!
        UserInput = self.userInput().toLowerCase();
        infowindow.close();
        self.visible.removeAll();

        self.hangouts().forEach(function(place) {
            place.marker.setVisible(false);
            // for items not in an array, indexOf returns a value of -1. Zero or greater indicates that the value is present in the array
            if (place.title().toLowerCase().indexOf(UserInput) !== -1) {
                // if the input is present, the place will be added to the visible array
                self.visible.push(place);
            }
        });
        // loop over items in the visible array and set their visibility to true in the view
        self.visible().forEach(function(place) {
            place.marker.setVisible(true);
        });
    };

};
$(".close").hide();
$(".menu").hide();
$(".hamburger").click(function() {
    $(".menu").slideToggle("slow", function() {
        $(".hamburger").hide();
        $(".close").show();
    });
});

$(".close").click(function() {
    $(".menu").slideToggle("slow", function() {
        $(".close").hide();
        $(".hamburger").show();
    });
});