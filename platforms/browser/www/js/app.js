var myApp = angular.module('myApp', ['ui.router','ngMaterial']);

// CONFIGURATION DES ROUTES

myApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/help'); //Page par défault
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html' //Page Login
        })
        .state('inscription', {
            url: '/inscription',
            templateUrl: 'views/inscription.html' //Page inscription
        })
        .state('core', {
            url: '/core',
            templateUrl: 'views/core.html' //Page principale si connecté
        })
        .state('accueil', {
            url: '/accueil',
            templateUrl: 'views/accueil.html' //Page d'acceuil
        })
        .state('help', {
            url: '/help',
            templateUrl: 'views/watsonConv.html',
            controller: 'controllerhelp' //Controller administré à la page watson Conversation
        });
});

// CONFIGURATION API WATSON

var apiUrl = "http://bersetfa.myhostpoint.ch/api.php"; //Adresse IP à changer selon réseau pour connection au fichier php

myApp.controller('controllerhelp', ['$scope', '$http', function ($scope, $http) {

    $scope.chatBotLoaded = false;
    $scope.chatMessage = '';
    $scope.context = "";
	$scope.location = [];

    // Initialisation cercle chargement pas encore actif
    $scope.chatLoading = false;

    $scope.messages = [];

    $scope.chatBot = function(message) {
        // Activation cercle chargement
        $scope.chatLoading = true;

        // Ajout message du client dans tableau message
        if ($scope.chatMessage != '') $scope.messages.push('Moi : '+$scope.chatMessage);
        $scope.chatMessage = '';

        $http.post(apiUrl, { message: message, context: $scope.context }, {headers:{'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}}).then(function (response) {
            alert(JSON.stringify(response));
            if(response.error){
                // Erreur si probleme de récupération du message
                $('#messages').append('<p>Erreur, nous n\'arrivons pas à récupérer le message</p>');
            }else{
                // Ajout du message de Watson dans le tableau Message
                $scope.messages.push('Watson : '+response.data.output.text[0]);
                $scope.context = response.data.context;

                for (var i = 1; i >= response.data.entities.lenght; i++) {
                	$scope.location.push(response.data.entities[i].value);
                }

                console.log($scope.location);


                // Fin du chargement donc disparition cercle chargement
                $scope.chatLoading = false;
            }

        }).catch(function (error) {
            // Erreur si problème de connection
            $('#messages').append('<p>Problème de communication avec le server</p>');
        });
    }

    $scope.loadChatbot = function(){

        // Création fonction pour initialiser fonction principale chatbot
        $scope.chatBotLoaded = true;
        // Activation fonction principale Chatbot
        $scope.chatBot("");

    }

    $scope.$on('startChatbot', function () {
        //Initialisation fonction loadChatbot
        $scope.loadChatbot();
    });

}]);

myApp.controller('mainController', ['$scope', '$rootScope', '$timeout', '$document', function ($scope, $rootScope, $timeout, $document) {

    //Le programme phonegap n'est pas prêt
    $scope.deviceReady = false;


    $document.on('deviceready', function() {
        $timeout(function() {
            StatusBar.hide(); //cacher bar en haut du téléphone

            // Programme phonegap ready
            $scope.deviceReady = true;
            $rootScope.$broadcast('startChatbot');
        });

    });
}]);

$(".button-collapse").sideNav();
