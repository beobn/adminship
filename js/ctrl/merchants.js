app.controller("merchantsController", function ($rootScope,$scope, $http,url,FileService,TimeConversionService,SwalService) {
    const urlAPI=url.host+"/shops";
    $scope.selectedImage=url.imgdf;
    $scope.indexPage = 0;
    $scope.searchName='';
    $scope.totalPages= 0 ;
    $scope.merchant={};
    $scope.showDataTable = function (index) {
        $scope.merchant.timeopen= TimeConversionService.convertToDateTime();
        $scope.merchant.timeclose= TimeConversionService.convertToDateTime();
        $scope.dataTable = [];
        $scope.indexPage=index;
        if(index>$scope.totalPages-1){
            $scope.indexPage=0;
        }
        if(index<0){
            $scope.indexPage=$scope.totalPages-1;
        }
        var urlGetDataTable = urlAPI+`/?page=`+ $scope.indexPage+`&size=10&query&sort`;
        console.log(urlGetDataTable);
        $http.get(urlGetDataTable,$rootScope.userLogin.accessToken).then(function (response) {
            $scope.dataTable = response.data.data;
            $scope.totalPages = response.data.total_page;
        }).catch(error => {
            console.log(error);
        });
    }
    $scope.showDataTable(0);

    $scope.clickTable=function (index){
        var urlDataTableclick= urlAPI+`/`+index;
        $http.get(urlDataTableclick,$rootScope.userLogin.accessToken).then(function (response) {
            $scope.merchant = response.data;
            console.log(response.data);
            if(response.data.images != null){
                $scope.selectedImage=response.data.images.link
            }else{
                $scope.selectedImage=url.imgdf;
            }
            $scope.merchant.timeopen= TimeConversionService.convertToDateTime(response.data.time_open);
            $scope.merchant.timeclose= TimeConversionService.convertToDateTime(response.data.time_close);
            window.scrollTo(0, 0);
        }).catch(error => {
            console.log(error);
        });
    }


    $scope.validate=function(data){
        if($rootScope.ValiDateService.validateNullText(data.name)){
            SwalService.showErrorAlert("Tên cửa hàng sai định dạng");
            return false;
        }
        if($rootScope.ValiDateService.validateNullText(data.address)){
            SwalService.showErrorAlert("Địa chỉ cửa hàng sai định dạng");
            return false;
        }
        if($rootScope.ValiDateService.validateLatitude(data.latitude)){
            SwalService.showErrorAlert("Vĩ độ cửa hàng sai định dạng");
            return false;
        }
        if($rootScope.ValiDateService.validateLongitude(data.longitude)){
            SwalService.showErrorAlert("Kinh độ cửa hàng sai định dạng");
            return false;
        }
        if($rootScope.ValiDateService.validateNumberphone(data.phone)){
            SwalService.showErrorAlert("Số điện thoại cửa hàng sai định dạng");
            return false;
        }
        return true;
    }

    $scope.add=function () {
        SwalService.showConfirmation('Xác nhận thêm mới', function (confirmed) {
            if (confirmed) {
                let data = angular.copy($scope.merchant);
                if($scope.validate(data)){
                    SwalService.showProcessing();
                    data.id=null;
                    data.timeclose=TimeConversionService.convertToDate(new Date($scope.merchant.timeclose));
                    data.timeopen=TimeConversionService.convertToDate(new Date($scope.merchant.timeopen));
                    var urlsave = urlAPI+`/save`;
                    $http.post(urlsave, data).then(resp => {
                        setTimeout(() => {
                            SwalService.showSuccessAlert('Thêm Mới Thành Công');
                            $scope.clear();
                        }, 10);
                    })
                    .catch(error => {
                        console.log(error)
                        SwalService.showErrorAlert(error.data.message);
                    })

                }
            }
        });
        

        
    }

    $scope.update=function(){
        SwalService.showConfirmation('Xác nhận cập nhật', function (confirmed) {
        if (confirmed) {
            let data= angular.copy( $scope.merchant);
            data.time_close=TimeConversionService.convertToDate(new Date($scope.merchant.time_close));
            data.time_open=TimeConversionService.convertToDate(new Date($scope.merchant.time_open));
            // if($scope.validate(data)){
                //upload ảnh
                SwalService.showProcessing();
                FileService.uploadImage($scope.selectedFile)
                    .then(function(response) {
                        console.log(response);
                        
                        data.images=response.data.data.id;
                        console.log(data.images);
                        // var urlsave = urlAPI+`/save`;
                        // $http.post(urlsave, data).then(resp => {
                        //     setTimeout(() => {
                        //         SwalService.showSuccessAlert('Cập Nhật Thành Công');
                        //         $scope.clear();
                        //     }, 10);
                        // })
                        // .catch(error => {
                        //     console.log(error);
                        //     SwalService.showErrorAlert(error.data.message);
                        // })
                    })
                    .catch(function(error) {
                        // if($scope.selectedImage==url.imgdf){
                        //     data.image=null;
                        // }else{
                        //     data.image=$scope.selectedImage;
                        // }
                        // var urlsave = urlAPI+`/save`;
                        // $http.post(urlsave, data).then(resp => {
                        //     setTimeout(() => {
                        //         SwalService.showSuccessAlert('Cập Nhật Thành Công');
                        //         $scope.clear();
                        //     }, 10);
                        // })
                        // .catch(error => {
                        //     console.log(error);
                        //     SwalService.showErrorAlert(error.data.message);
                        // })
                        console.log(error);
                    });
                    //upload ảnh end
                // }
            }
        });
    };

    $scope.linkMaps=function (latitude,longitude) {
        return "https://www.google.com/maps/place/"+latitude+","+longitude;
    }

    $scope.clear=function(){
        $scope.merchant={};
        $scope.showDataTable(0);
        $scope.selectedImage=url.imgdf;
        $scope.selectedFile=undefined;
        $scope.indexPage = 0;
    }
    



})