angular.module('AuthApp', ['uiGmapgoogle-maps'])
    .config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });
    })
    .controller('mainCtrl', function ($scope, $log, $interval,uiGmapGoogleMapApi,$http) {
        $scope.scenario = 'Log in';
        console.log($scope.currentUser);
        var stoptime;
        $scope.clicked=false;
        $scope.intervalfunction = function(){
            $scope.interval =  $interval(function(){
                $scope.fetchmarkers();
             },15000)};

      /*  $http.defaults.headers.put = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
        };
        $http.defaults.useXDomain = true;

*/



        $scope.fetchmarkers = function(){
            var data = {"getLastIncidents":"AxCdreRt33s9dfVh2S"}
            $http.post("http://52.59.246.211/timeline/submit.php", data).success(function(data, status) {
                console.log(data)
                $scope.places = data.Incidents;
                var i =0;
                $scope.markers=[];
                angular.forEach($scope.places, function(place){
                    var long = place.longitude
                    var lat = place.latitude
                    console.log(lat + "  "+ long);
                    $scope.markers.push(createMarker(i,lat,long,place.fullAddress,place.timeOfIncident,place.reportedBy))
                    i++;
                    $scope.$apply();
                });
            }).error(function(data,status){console.log('failed')})
   /* query.find({
        success: function(placesObjects) {
            $scope.places = placesObjects;
            var i =0;
            $scope.markers=[];
            angular.forEach($scope.places, function(place){
                var location = place.get("location");
                console.log(location.latitude + "  "+ location.longitude);
                $scope.markers.push(createMarker(i,location.latitude,location.longitude))
                i++;
                $scope.$apply();
            });

        }
    });*/


}


        $scope.markers=[];
        var createMarker = function(i, latitude,longitude,address,time,reporter) {


            
                idKey = "id";
            


            var ret = {
                latitude: latitude,
                longitude: longitude,
                title: address,
                time: time,
                reporter: reporter
            };
            ret[idKey] = i;
            return ret;
        };
        $scope.coordsUpdates = 0;
        $scope.dynamicMoveCtr = 0;
        $scope.options = {scrollwheel: true};


        $scope.map = {center: {latitude: 31.928508, longitude: 34.798336 }, zoom: 10 };
        console.log($scope.marker);


        $scope.showmarker = function (marker1,eventname,exactmodel) {
           // alert("baby at "+ exactmodel.latitude+ "  "+ exactmodel.longitude);
            $scope.clicked=true;
            $scope.currentmodel=exactmodel;
            $scope.map = { center: { latitude: exactmodel.latitude, longitude: exactmodel.longitude }, zoom: 15 };
           // console.log(exactmodel);
        };

        $scope.deletemarker= function(markertodelete){

            var query = new Parse.Query("PlaceObject");
            query.find({
                success: function(placesObjects) {

                    angular.forEach(placesObjects, function(place){
                        var location = place.get("location");
                        if((markertodelete.latitude==location.latitude)&&(markertodelete.longitude==location.longitude))
                        {
                            place.destroy({});
                            $scope.clicked = false;
                            $scope.fetchmarkers();
                        }

                    });

                }
            });

        };
        $scope.circles = [
            {
                id: 1,
                center: {
                    latitude: 40.1451,
                    longitude: -99.6680
                },
                radius: 50,
                stroke: {
                    color: '#08B21F',
                    weight: 2,
                    opacity: 1
                },
                fill: {
                    color: '#08B21F',
                    opacity: 0.5
                },
                geodesic: true, // optional: defaults to false
                draggable: true, // optional: defaults to false
                clickable: true, // optional: defaults to true
                editable: true, // optional: defaults to false
                visible: true, // optional: defaults to true
                control: {}
            }
        ];
        $scope.intervalfunction();

    });
