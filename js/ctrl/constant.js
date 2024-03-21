
app.constant('url', {
    host: 'https://api.shipnhanh99.com/api/v1',
    imgdf: '/img/logo.svg',
    imgapi: 'https://api.shipnhanh99.com/api/v1/files/upload-link',
    imgClientID: 'Client-ID 1a59785c78e8a37',
    imgBearer: 'Bearer 9132858822507571b98f823d680fedbc397f7099',
});
app.factory('SwalService', function () {
    return {
      showSuccessAlert: function (message) {
        swal.fire({
            icon: 'success',
            showConfirmButton: false,
            title: message,
            timer: 1000
        });
      },
      showErrorAlert: function (message) {
        swal.fire({
            icon: 'error',
            showConfirmButton: false,
            title: message,
            timer: 2000
        });
      },
      showProcessing: function() {
        return Swal.fire({
            title: '<span class="loading-text">Đang xử lý...</span>',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false
        });
      },
      showConfirmation: function (message, callback) {
        Swal.fire({
          title: message,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#17a673',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Xác Nhận',
          cancelButtonText: 'Xem Lại'
        }).then(function (result) {
          if (result.isConfirmed) {
            callback(true);
          } else {
            callback(false);
          }
        });
       },
    };
});

app.directive('fileModel', ['$parse','url', function($parse,url) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;
        element.bind('change', function() {
          scope.$apply(function() {
            modelSetter(scope, element[0].files[0]);

            // Display selected image immediately
            if (scope.selectedFile) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    scope.$apply(function() {
                        scope.selectedImage = event.target.result;
                    });
                };
                reader.readAsDataURL(scope.selectedFile);
            } else {
                scope.selectedImage=url.imgdf
            }
          });
        });
      }
    };
  }])
  .factory('FileService', ['$http','url','$rootScope', function($http,url,$rootScope) {
    return {
      getapiimg: function(file){
        let urlgetapiimg = url.imgapi+`/`+file.name+`/?type=`+file.type;
        return $http.get(urlgetapiimg, {
            headers: {
                token: $rootScope.userLogin.accessToken
            },
        })
      },
      uploadImage: function(file) {
        this.getapiimg(file).then(function(params) {
          $http.put(params.data.upload,file,{
            headers:{
            'Content-Type': file.type
            }
          })
          data= params;
        });
        return this.getapiimg(file);
      }
    };
}]);
app.service('ValiDateService', function() {
    this.invalidCharacters = ['$'];

    this.validateNullText = function(inputString) {
        if(inputString == undefined || inputString.length == 0 || inputString.length > 250){
          return true;
        }
        return false;
    };
    this.validateLatitude = function(input) {
      if(input == undefined || input.length == 0 || input.length > 10){
        return true;
      }else{
        if(Number(input) < -90 ||Number(input) > 90){
          return true;
        }
        return false;
      }
    };
    this.validateLongitude = function(input) {
      if(input == undefined || input.length == 0 || input.length > 10){
        return true;
      }else{
        if(Number(input) < -180 ||Number(input) > 180){
          return true;
        }
        return false;
      }
    };
    this.validateNumberphone = function(input) {
      if(input == undefined|| input.length == 0 || input.length > 10){
        return true;
      }
      if(!isNaN(parseFloat(input)) && isFinite(input)){
        if(input.length < Number(9) || input.length > Number(10)){
          return true;
        }
        return false;
      }else{
        return true;
      }
    };
    this.validatePrice = function(input) {
      if(input == undefined|| input.length == Number(0)){
        return true;
      }
      if(!isNaN(parseFloat(input)) && isFinite(input)){
        if(input < Number(1000) || input > Number(1000000)){
          return true;
        }
        return false;
      }else{
        return true;
      }
    };
}); 

app.service('TimeConversionService', function() {
  this.convertToDateTime = function(timeStr) {
      var today = new Date(); // Ngày hôm nay
      if(timeStr){
        var timeParts = timeStr.split(':');
        var hours = parseInt(timeParts[0]);
        var minutes = parseInt(timeParts[1]);
        var seconds = parseInt(0);
        var milliseconds =  parseInt(0);
        today.setHours(hours);
        today.setMinutes(minutes);
        today.setSeconds(seconds);
        today.setMilliseconds(milliseconds);
      }else{
        today.setSeconds(parseInt(0));
        today.setMilliseconds(parseInt(0));
      }
      
      return today;
  };
  this.convertToDate = function(date) {

    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    return hours + ':' + minutes;
  };
});
app.controller('myAppController', function($window,$rootScope,$location, ValiDateService) {
  $rootScope.ValiDateService = ValiDateService;
  const userCheck=JSON.parse($window.localStorage.getItem("user"));
  if(userCheck==undefined){
    $location.path("/user")
  }else{
    $rootScope.userLogin=userCheck;
    console.log($rootScope.userLogin);
  }
  
});



