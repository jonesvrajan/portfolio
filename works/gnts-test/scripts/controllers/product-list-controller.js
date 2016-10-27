'use strict';

/**
 * @ngdoc function
 * @name productTableApp.controller:productListController
 * @description
 * # productListController
 * Controller of the productTableApp
 */
angular.module('productTableApp')
  .controller('productListController', ['$http', function($http) {
  	var self = this;
  	self.productlist = [];
  	self.quantity = 1;
	$http.get('scripts/products.json').then(function(response) {
		self.productlist = response.data.allProducts;
		}, function(errResponse) {
		console.error('Error while fetching products');
	});

	self.saveSettings = function() {
		alert('Test');
	}
  }]);
