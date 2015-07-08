var exampleModule = angular.module('ExampleApp', []);

exampleModule.controller('UserController', function($scope, $http){
	$scope.myMessage = function(){
		return "Hi prudvi, cool man!";
	};

	$scope.createUser = function(){
		var fName = $scope.fname;
		var lName = $scope.lname;
		var lName3 = $scope.lname3;
		var lName4 = $scope.lname4;
		var button1 = $scope.button1;

		console.log(fName);
		console.log(lName);
		console.log(lName3);
		console.log(lName4);
		console.log(button1);

		var rootUrl = "http://localhost:3000";

		var url = rootUrl + "/user?fname=" + fName + "&lname=" + lName + "&lname3=" + lName3 + "&lname4=" + lName4 + "&button1=" + button1 ;

		console.log(url);
		$http.get(url).success(function(data, status, headers, config){
			console.log(data); 
		})
	};
	
});
