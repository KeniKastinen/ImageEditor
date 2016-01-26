'use strict';

angular.module('imageEditorApp')
    .controller('MainCtrl', function ($scope) {


        $scope.setImageFile = function (element) {

            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.image.src = e.target.result;

            };
            reader.readAsDataURL(element.files[0]);
            $scope.image.onload = $scope.resetImage;

        };
        $scope.init = function () {
            $scope.brightness = 0;
            $scope.contrast = 1;
            $scope.strength = 1;
            $scope.color = {
                red: 0,
                green: 0,
                blue: 0
            }
            $scope.autocontrast = false;
            $scope.vignette = false;
            $scope.kaanto = false;
            $scope.canvas = angular.element('#myCanvas')[0];
            $scope.ctx = $scope.canvas.getContext('2d');
            $scope.image = new Image();

            $scope.vignImage = new Image();



        };

        $scope.init();

        $scope.resetImage = function () {
            $scope.canvas.width = $scope.image.width;
            $scope.canvas.height = $scope.image.height;

            $scope.ctx.drawImage($scope.image, 0, 0, $scope.canvas.width, $scope.canvas.height);

            $scope.imageData = $scope.ctx.getImageData(0, 0, $scope.image.width, $scope.image.height);
            $scope.pixels = $scope.imageData.data;
            $scope.numPixels = $scope.imageData.width * $scope.imageData.height;

            if ($scope.vignImage.src === '') {
                $scope.vignImage.onload = resetVign;
                $scope.vignImage.src = 'images/vignette.jpg';
            }

            console.log($scope.vignImage);
        };

        var resetVign = function () {
            var cn = document.createElement('canvas');

            cn.width = $scope.image.width;
            cn.height = $scope.image.height;

            var ctx = cn.getContext('2d');

            ctx.drawImage($scope.vignImage, 0, 0, $scope.vignImage.width, $scope.vignImage.height, 0, 0, cn.width, cn.height);


            $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
            $scope.ctx.putImageData(imageData, 0, 0);
        };



        $scope.applyFilters = function () {
            $scope.resetImage();

            changeBrightness();
            changeContrast();
            changeStrenght();

            if ($scope.vignette) {
                addVignette();
            }

            $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
            $scope.ctx.putImageData($scope.imageData, 0, 0);
        };


        var changeBrightness = function () {

            var brightnessValue = parseInt($scope.brightness);

            for (var i = 0; i < $scope.numPixels; i++) {
                $scope.pixels[i * 4] = $scope.pixels[i * 4] + brightnessValue; // Red
                $scope.pixels[i * 4 + 1] = $scope.pixels[i * 4 + 1] + brightnessValue; // Green
                $scope.pixels[i * 4 + 2] = $scope.pixels[i * 4 + 2] + brightnessValue; // Blue
            }

        };



        var changeContrast = function () {

            var contrastValue = parseFloat($scope.contrast);

            for (var i = 0; i < $scope.numPixels; i++) {
                $scope.pixels[i * 4] = ($scope.pixels[i * 4] - 128) * contrastValue + 128; // Red
                $scope.pixels[i * 4 + 1] = ($scope.pixels[i * 4 + 1] - 128) * contrastValue + 128; // Green
                $scope.pixels[i * 4 + 2] = ($scope.pixels[i * 4 + 2] - 128) * contrastValue + 128; // Blue
            };

        };

        var changeStrenght = function () {

            for (var i = 0; i < $scope.numPixels; i++) {
                $scope.pixels[i * 4] = $scope.pixels[i * 4] + ($scope.color.red * $scope.strength / 100); // Red
                $scope.pixels[i * 4 + 1] = $scope.pixels[i * 4 + 1] + ($scope.color.green * $scope.strength / 100); // Green
                $scope.pixels[i * 4 + 2] = $scope.pixels[i * 4 + 2] + ($scope.color.blue * $scope.strength / 100); // Blue
            }
        };




        var addVignette = function () {
            for (var i = 0; i < $scope.numPixels; i++) {
                $scope.pixels[i * 4] = $scope.pixels[i * 4] * $scope.vignPixels[i * 4] / 255; // Red
                $scope.pixels[i * 4 + 1] = $scope.pixels[i * 4 + 1] * $scope.vignPixels[i * 4 + 1] / 255; // Green
                $scope.pixels[i * 4 + 2] = $scope.pixels[i * 4 + 2] * $scope.vignPixels[i * 4 + 2] / 255; // Blue
            }
        };

        var resetVign = function () {
            var cn = document.createElement('canvas');

            cn.width = $scope.image.width;
            cn.height = $scope.image.height;

            var ctx = cn.getContext('2d');

            ctx.drawImage($scope.vignImage, 0, 0, $scope.vignImage.width, $scope.vignImage.height, 0, 0, cn.width, cn.height);


            $scope.vignData = ctx.getImageData(0, 0, cn.width, cn.height);
            $scope.vignPixels = $scope.vignData.data;
        };


        $scope.kaantoo = function () {
            //$scope.resetImage();
            var imageData = $scope.ctx.getImageData(0, 0, $scope.image.width, $scope.image.height);
            var pixels = imageData.data;
            var numPixels = imageData.width * imageData.height;

            for (var i = 0; i < numPixels; i++) {
                pixels[i * 4] = 255 - pixels[i * 4]; // Red
                pixels[i * 4 + 1] = 255 - pixels[i * 4 + 1]; // Green
                pixels[i * 4 + 2] = 255 - pixels[i * 4 + 2]; // Blue

            };

            $scope.ctx.clearRect(0, 0, $scope.canvas.width, $scope.canvas.height);
            $scope.ctx.putImageData(imageData, 0, 0);


        };
        $scope.saveImage = function () {
            var imgAsDataUrl = $scope.canvas.toDataURL('image/png');
            $scope.url = imgAsDataUrl;
        };
    })
    .config(function ($compileProvider) {

        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|coui|data):/);

    });