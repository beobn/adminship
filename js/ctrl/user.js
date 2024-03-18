app.controller("userController", function ($location,$rootScope,$scope,$window, $http,url,SwalService) {

    $scope.login=function() {
        const urlLogin=url.host+'/auth/login'
        const data = angular.copy($scope.user);
        if($rootScope.ValiDateService.validateNullText(data.phone)){
            SwalService.showErrorAlert("Phone không được bỏ trống!");
            return false;
        }
        if($rootScope.ValiDateService.validateNullText(data.password)){
            SwalService.showErrorAlert("Pass không được bỏ trống!");
            return false;
        }
        $http.post(urlLogin, data).then(resp => {
            setTimeout(() => {
                SwalService.showSuccessAlert('Đăng Nhập Thành Công');
                $window.localStorage.setItem('user',JSON.stringify(resp.data));
            }, 10);
            $location.path("/");
        })
        .catch(error => {
            console.log(error);
            SwalService.showErrorAlert(error.data.description);
        })
    }

})