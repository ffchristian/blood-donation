'use strict';
const angular = require('angular');
const ngRoute = require('angular-route');


import routes from './update-information.routes';

export class UpdateInformationComponent {
  user = null;
  /*@ngInject*/
  constructor($http, $routeParams, $location, SweetAlert) {
    this.title = 'update';
    this.$http = $http;
    this.$routeParams = $routeParams;
    this.SweetAlert = SweetAlert;
    this.$location = $location;
    this.form = {};
    this.user = {};

  }
  $onInit() {
    this.$http.get('/api/things/'+this.$routeParams.id)
      .then(response => {
        this.user = response.data.data;
      })
      .catch(err =>{
        this.$location.path('/')
      });
  }

  update(){
    this.SweetAlert.swal({
        title: "Are you sure?",
        text: "This Record is gonna be update",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
      },
      (action)=>{
        if(action){
          this.$http.put('/api/things/'+this.$routeParams.id, this.user)
            .then(response => {
              console.log(response);
              this.SweetAlert.swal("Great!");
            })
            .catch(err =>{
              this.SweetAlert.swal("Something went wrong!");
            });
        }
      });

  }

  delete(){
    this.SweetAlert.swal({
        title: "Are you sure?",
        text: "This Record is gonna be delete",
        type: "info",
        showCancelButton: true,
        closeOnConfirm: false,
        showLoaderOnConfirm: true
      },
      (action)=>{
        if(action){
          this.$http.delete('/api/things/'+this.$routeParams.id, this.user)
            .then(response => {
              console.log(response);
              this.SweetAlert.swal("Great!");
            })
            .catch(err =>{
              this.SweetAlert.swal("Something went wrong!");
            });
        }
      });

  }
}
UpdateInformationComponent.$inject = ['$http', '$routeParams', '$location', 'SweetAlert'];

export default angular.module('bloodDonationApp.update-information', [ngRoute])
  .config(routes)
  .component('updateInformation', {
    template: require('./update-information.html'),
    controller: UpdateInformationComponent,
    controllerAs: 'vm'
  })
  .name;
