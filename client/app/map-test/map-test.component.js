'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');

import routes from './map-test.routes';

export class MapTestComponent {
  /*@ngInject*/
  constructor(esriLoader, $scope, $http, $uibModal, $compile, socket) {
    this.esriLoader = esriLoader;
    this.$scope = $scope;
    this.$http = $http;
    this.$uibModal = $uibModal;
    this.$compile = $compile;
    this.socket = socket;
    this.points = [];
    this.animationsEnabled = true;

  }
  $onInit(){
    const vm = this;
    vm.esriLoader.require([
        "esri/Map",
        'esri/widgets/Search',
        "esri/widgets/Track",
        "esri/tasks/Locator",
        "esri/PopupTemplate",
        "esri/geometry/Point",
        "esri/views/MapView",
        "esri/views/SceneView",
        "esri/layers/Layer",
        "esri/Graphic",
        "esri/widgets/Expand",
        "esri/widgets/Home",
        "esri/geometry/Extent",
        "esri/Viewpoint",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/core/watchUtils",
        "dojo/on",
        "dojo/dom",
        "dojo/domReady!"
      ],
      (
        Map, Search, Track, Locator, PopupTemplate , Point, MapView, SceneView, Layer, Graphic, Expand,
        Home, Extent, Viewpoint, SimpleMarkerSymbol, watchUtils,
        on, dom
      ) =>{
        vm.Point = Point;
        vm.Graphic = Graphic;
        vm.SimpleMarkerSymbol = SimpleMarkerSymbol;

        let map = new Map({
          basemap: "streets"
        });

        // Set up a locator task using the world geocoding service
        vm.locatorTask = new Locator({
          url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
        });

        vm.view = new SceneView({
          container: "viewDiv",
          map: map,
        });

        let searchWidget = new Search({
          view: vm.view
        });

        // add the search widget to the top left corner of the view
        vm.view.ui.add(searchWidget, {
          position: 'top-left',
          index: 0
        });

        // destroy the search widget when angular scope is also being destroyed
       vm.$scope.$on('$destroy', () =>{
          searchWidget.destroy();
         //socket.unsyncUpdates('thing');
        });

        let track = new Track({
          view: vm.view
        });

        vm.view.ui.add(track, "top-left");

        // The sample will start tracking your location
        // once the view becomes ready
        vm.view.then(function(data) {
          track.start();

          vm.socket.syncUpdates('thing', vm.points, (event, item, array)=>{
            if(event === 'update' || event === 'deleted'){
              vm.points = array;
              vm.view.graphics.removeAll();
              vm.view.graphics.addMany(vm.points);
            }
            else if(event === 'created'){
              vm.addPoint(item)
            }
          });
        });

        // *****************************************************
        // listen to click event on the view
        // 1. select if there is an intersecting feature
        // *****************************************************
        watchUtils.whenTrue(vm.view, "stationary", function() {
          if(!vm.view.extent) return;
          const area = parseInt(vm.view.extent.xmax - vm.view.center.x)/1000;
          vm.$http({method: 'GET', url: '/api/things', params: {distance: area, lat: vm.view.center.latitude, lng: vm.view.center.longitude}})
            .then(response => {
              response.data.data.forEach( item =>{
                let oldItem = _.find( vm.points, {
                  _id: item._id
                });
                if(!oldItem){
                  vm.addPoint(item)
                }
              })
            });
        });

        vm.view.on("click", function(evt) {
          vm.view.hitTest(evt.screenPoint).then(function(response) {
            vm.show = false;
            if (response.results.length > 0 && response.results[0].graphic) {
              const feature = response.results[0].graphic;
              if(!feature.attributes.email){
                vm.open(evt.mapPoint);
              }
              else{
                vm.open(evt.mapPoint, feature.attributes);
              }
            }
            else{
              vm.open(evt.mapPoint);
            }
          });
        });

        function handleLayerLoadError(err) {
          console.log("Layer failed to load: ", err);
        }
      });
  }
  setShow(){
    this.show = true;
  }

  addPoint(information){
    const vm = this;
    let point = new vm.Point({
      longitude: information.coordinate.lng,
      latitude: information.coordinate.lat
    });

    // Create a symbol for drawing the point
    let markerSymbol = new vm.SimpleMarkerSymbol({
      color: [226, 119, 40],
      outline: { // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 2
      }
    });
    let lineAtt = {
      firstName: information.firstName,
      lastName: information.lastName,
      email: information.email,
      number: information.number,
      bloodGroup: information.bloodGroup,
      address: information.address
    };
    // Create a graphic and add the geometry and symbol to it
    let pointGraphic = new vm.Graphic({
      geometry: point,
      symbol: markerSymbol,
      //popupTemplate: template,
      attributes: lineAtt
    });

    // Add the graphics to the view's graphics layer
    //view.graphics.addMany([pointGraphic]);
    pointGraphic._id = information._id;
    vm.points.push(pointGraphic);
    vm.view.graphics.add(pointGraphic);
  }

  open(mapPoint, attributes){
    const vm = this;
    let modalInstance = vm.$uibModal.open({
      animation: vm.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: ModalController,
      controllerAs: 'vm',
      size: null,
      resolve: {
        mapPoint: function () {
          return mapPoint;
        },
        locatorTask: function () {
          return vm.locatorTask;
        },
        attributes: function () {
          return attributes;
        }
      }
    });

    modalInstance.result.then(function (information) {

    }, function () {
     console.log('Modal dismissed at: ' + new Date());
    });
  };
}

export class ModalController {

  /*@ngInject*/
  constructor($scope, $uibModalInstance, SweetAlert, $http, mapPoint, locatorTask, attributes) {
    this.title = 'Enter your data';
    this.$uibModalInstance = $uibModalInstance;
    this.SweetAlert = SweetAlert;
    this.$http = $http;
    this.submitted = false;
    this.loading = false;
    this.form = {};
    this.user = {};

    if(attributes){
      this.title = attributes.firstName+' '+attributes.lastName;
      this.watchMode = true;
      this.user = attributes;
    }

    this.ok = function () {

      this.submitted = true;

      if (this.form.$valid) {
        this.loading = true;
        locatorTask.locationToAddress(mapPoint).then((response) => {
          this.user.address = response.address.Match_addr;
          this.user.latitude = mapPoint.latitude;
          this.user.longitude = mapPoint.longitude;
          this.$http.post('/api/things', this.user)
            .then(response => {
              this.loading = false;
              this.submitted = false;
              const id = response.data.data.id;
              this.SweetAlert.swal({
                title: "<h3>Good job!</h3>",
                text: '<a href="update-information/'+id+'" target="_blank">update link</a>',
                html: true
              });
              $uibModalInstance.close(true);
            });

        })

      }

    };

  }
  setShow(){
    this.show = true;
  }
  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  };
  delete() {
    $uibModalInstance.dismiss('cancel');
  };
}

ModalController.$inject = ['$scope', '$uibModalInstance', 'SweetAlert', '$http', 'mapPoint', 'locatorTask', 'attributes'];
MapTestComponent.$inject = ['esriLoader', '$scope', '$http', '$uibModal', '$compile', 'socket'];

export default angular.module('bloodDonationApp.map-test', [ngRoute])
  .config(routes)
  .controller('ModalController', ModalController)
  .component('mapTest', {
    template: require('./map-test.html'),
    controller: MapTestComponent,
    controllerAs: 'vm'
  })
  .name;
