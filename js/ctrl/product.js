
app.controller("productController", function ($rootScope,$scope, $http,url,SwalService,FileService) {

    const urlAPI=url.host+"/types";
    $scope.selectedImage=url.imgdf;
    $scope.searchName='';
    $scope.indexPage = 0;
    $scope.totalPages= 0 ;
    $scope.product={};

    
    $scope.showDataTable = function (index) {
        $scope.dataTable = [];
        $scope.indexPage=index;
        if(index>$scope.totalPages-1){
            $scope.indexPage=0;
        }
        if(index<0){
            $scope.indexPage=$scope.totalPages-1;
        }
        var urlGetDataTable = urlAPI+`/?page=` + $scope.indexPage+`&size=10&query=like(name,'`+$scope.searchName+`')`;
        $http.get(urlGetDataTable,$rootScope.userLogin.accessToken).then(function (response) {
            $scope.dataTable = response.data.data;
            $scope.totalPages = response.data.total_page;
        }).catch(error => {
            console.log(error);
        });
    }
    $scope.showDataTable(0);


    $scope.clickTable=function (index){
        var urlDataTableclick= urlAPI+`/find_id?id=`+index;
        $http.get(urlDataTableclick).then(function (response) {
            $scope.product = response.data;
            if(response.data.image != null){
                $scope.selectedImage=response.data.image
            }else{
                $scope.selectedImage=url.imgdf;
            }
            window.scrollTo(0, 0);
        }).catch(error => {
            console.log(error);
        });
    }

    $scope.validate=function(data){
        if($rootScope.ValiDateService.validateNullText(data.name)){
            SwalService.showErrorAlert("Tên sản phẩm không được bỏ trống!");
            return false;
        }
        return true;
    }

    $scope.add=function (){
        SwalService.showConfirmation('Xác nhận thêm mới', function (confirmed) {
            if (confirmed) {
                // Thực hiện hành động khi người dùng chọn "Xác Nhận"
                let data = angular.copy($scope.product);
                if($scope.validate(data)){
                    delete data.id;
                    //upload ảnh
                    SwalService.showProcessing();
                    FileService.uploadImage($scope.selectedFile)
                        .then(function(response) {
                            data.images=response.data.object;
                            var urlsave = urlAPI+`/`;
                            $http.post(urlsave, data,{
                                headers: {
                                    token: $rootScope.userLogin.accessToken
                                }
                            }).then(resp => {
                                setTimeout(() => {
                                    SwalService.showSuccessAlert('Thêm Mới Thành Công');
                                    // $scope.clear();
                                }, 10);
                            })
                            .catch(error => {
                                console.log(error);
                                SwalService.showErrorAlert(error.data.description);
                            })
                        })
                        .catch(function(error) {
                            SwalService.showErrorAlert('Lỗi ảnh');
                            console.log(error);
                        });
                    //end upload ảnh
                }
            }
        });
    }

    $scope.update=function (){
        SwalService.showConfirmation('Xác nhận cập nhật', function (confirmed) {
            if (confirmed) {
                let data= angular.copy( $scope.product);
                if($scope.validate(data)){
                    //upload ảnh
                    SwalService.showProcessing();
                    if(data.image!=url.imgdf){
                        const url = data.image;
                        if(url!=null){
                            FileService.deleteImage(url);
                        }
                    }
                    FileService.uploadImage($scope.selectedFile)
                        .then(function(response) {
                            data.image=response.data.data.link;
                            var urlsave = urlAPI+`/save`;
                            $http.post(urlsave, data).then(resp => {
                                setTimeout(() => {
                                    SwalService.showSuccessAlert('Cập Nhật Thành Công');
                                    $scope.clear();
                                }, 10);
                            })
                            .catch(error => {
                                console.log(error);
                                SwalService.showErrorAlert(error.data.message);
                            })
                        })
                        .catch(function(error) {
                            if($scope.selectedImage==url.imgdf){
                                data.image=null;
                            }else{
                                data.image=$scope.selectedImage;
                            }
                            var urlsave = urlAPI+`/save`;
                            $http.post(urlsave, data).then(resp => {
                                setTimeout(() => {
                                    SwalService.showSuccessAlert('Cập Nhật Thành Công');
                                    $scope.clear();
                                }, 10);
                            })
                            .catch(error => {
                                console.log(error);
                                SwalService.showErrorAlert(error.data.message);
                            })
                        });
                    //upload ảnh end
                }
            }
        });
    }
    $scope.clear=function(){
        $scope.product={};
        $scope.showDataTable(0);
        $scope.selectedImage=url.imgdf;
        $scope.inputValue="";
        $scope.selectedFile=undefined;
        $scope.indexPage = 0;
    }

})