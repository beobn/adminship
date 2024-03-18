app.controller("productdetailController", function ($rootScope,$scope, $http,url,SwalService,FileService,TimeConversionService) {
    const urlAPI=url.host+"admin/rest/productdetail";
    const urlAPIMerchant=url.host+"admin/rest/merchant";
    const urlAPIProduct=url.host+"admin/rest/product";

    $scope.selectedImage=url.imgdf;
    $scope.searchName='';
    $scope.indexPage = 0;
    $scope.totalPages= 0;
    $scope.productdetail={};
    $scope.yesNoSize="1";

    // option
    $scope.merchant={};
    $scope.product = {};
    $scope.size = {};

    $scope.validate=function(){
        if($scope.merchant.id == undefined){
            SwalService.showErrorAlert("Bạn cần chọn cửa hàng");
            return false;
        }
        if($scope.product.id == undefined){
            SwalService.showErrorAlert("Bạn cần chọn sản phẩm");
            return false;
        }
        if($scope.yesNoSize=='1'){
            if($scope.price1 == undefined || $scope.price1.length == 0){
                SwalService.showErrorAlert("Bạn cần nhập giá tiền");
                return false;
            }
        }else{
            if($scope.price1 == undefined || $scope.price1.length == 0){
                SwalService.showErrorAlert("Bạn cần nhập giá tiền size vừa");
                return false;
            }
            if($scope.price1 == undefined || $scope.price1.length == 0){
                SwalService.showErrorAlert("Bạn cần nhập giá tiền size lớn");
                return false;
            }
            if($rootScope.ValiDateService.validatePrice($scope.price2)==true){
                SwalService.showErrorAlert("Bạn cần nhập tiền từ 1 nghìn đến 1 triệu");
                return false;
            }
        }
        if($rootScope.ValiDateService.validatePrice($scope.price1)==true){
            SwalService.showErrorAlert("Bạn cần nhập tiền từ 1 nghìn đến 1 triệu");
            return false;
        }
        
        return true;
    }

    $scope.showOption = function (index) {
        if(index==0){ // cửa hàng merchant
            $scope.listMerchants = [];
            if($scope.inputValueMerchanrt == undefined){
                $scope.inputValueMerchanrt ="";
            }
            var urlGetData = urlAPIMerchant+`/getall/0?seach=`+$scope.inputValueMerchanrt;
            $http.get(urlGetData).then(function (response) {
                $scope.listMerchants = response.data.content;
            }).catch(error => {
                console.log(error);
            });
        }
        if(index==1){ // sản phẩm product
            $scope.listProduct = [];
            if($scope.inputValueProduct == undefined){
                $scope.inputValueProduct ="";
            }
            var urlGetData = urlAPIProduct+`/getall/0?seach=`+$scope.inputValueProduct;
            $http.get(urlGetData).then(function (response) {
                $scope.listProduct = response.data.content;
            }).catch(error => {
                console.log(error);
            });
        }
    }
    $scope.showOption(0);
    $scope.showOption(1);

    $scope.showDataTable = function (index) {
        $scope.dataTable = [];
        $scope.indexPage=index;
        if(index>$scope.totalPages-1){
            $scope.indexPage=0;
        }
        if(index<0){
            $scope.indexPage=$scope.totalPages-1;
        }
        var urlGetData = urlAPI+`/getall/` + $scope.indexPage+`?seach=`+$scope.searchName;
        $http.get(urlGetData).then(function (response) {
            $scope.dataTable = response.data.content;
            $scope.totalPages = response.data.totalPages;
        }).catch(error => {
            console.log(error);
        });
    }
    $scope.showDataTable(0);


    $scope.clickTable=function (index){
        var urlDataTableclick= urlAPI+`/find_id?id=`+index;
        $http.get(urlDataTableclick).then(function (response) {
            $scope.productdetail = response.data;
            console.log(response.data);
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

    $scope.onInputChange = function(index) {
        if(index==0){ //cửa hàng merchant
            $scope.showOption(0);
            $scope.merchant={};
        }
        if(index==1){ //sản phẩm product
            $scope.showOption(1);
            $scope.product={};
        }
        
    };

    $scope.onOptionSelect = function(index,id) {
        if(index==0){ // cửa hàng merchant
            var urlFind = urlAPIMerchant+`/find_id?id=`+id;
            $http.get(urlFind).then(function (response) {
                $scope.inputValueMerchanrt = response.data.name;
                $scope.merchant=response.data;
                
            }).catch(error => {
                console.log(error);
            });
        }
        if(index==1){ //sản phẩm product
            var urlFind = urlAPIProduct+`/find_id?id=`+id;
            $http.get(urlFind).then(function (response) {
                $scope.inputValueProduct = response.data.name;
                $scope.product=response.data;
            }).catch(error => {
                console.log(error);
            });
        }
        if(index==2){ //size
            var urlFind = urlAPIProduct+`/find_id?id=`+id;
            $http.get(urlFind).then(function (response) {
                $scope.inputValueProduct = response.data.name;
                $scope.product=response.data;
            }).catch(error => {
                console.log(error);
            });
        }
    };

    $scope.add=function (){
        SwalService.showConfirmation('Xác nhận thêm mới', function (confirmed) {
            if (confirmed) {
                // Thực hiện hành động khi người dùng chọn "Xác Nhận"
                if($scope.validate()){
                    SwalService.showSuccessAlert('Thêm Mới Thành Công');
                    console.log($scope.price1);
                    
                    SwalService.showProcessing();
                        var data={};
                        // data.id=0;
                        data.merchants=$scope.merchant;
                        data.product=$scope.product;
                        data.size=$scope.yesNoSize;
                        data.price1=$scope.price1;
                        data.price2=$scope.price2;
                        data.status='0';  
                        var urlsave = urlAPI+`/save`;
                        $http.post(urlsave, data).then(resp => {
                            setTimeout(() => {
                                SwalService.showSuccessAlert('Thêm Mới Thành Công');
                                $scope.clear();
                            }, 10);
                        })
                        .catch(error => {
                            console.log(error);
                            SwalService.showErrorAlert(error.data.message);
                        })
                }
            }
        });
    }
    
    $scope.clear=function(){
        $scope.selectedImage=url.imgdf;
        $scope.searchName='';
        $scope.indexPage = 0;
        $scope.productdetail={};
        $scope.yesNoSize='false';
    }
})