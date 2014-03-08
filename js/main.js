var app = angular.module("myApp", ['ngRoute']);
app.config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: "templates/home.html",
    controller: "HomeController"
  })
  .when('/settings', {
    templateUrl: 'templates/settings.html',
    controller: 'SettingsController'
  })
  .otherwise({ redirectTo: '/' });
});

//services must return objects
app.service('mailService', ['$http', '$q', function($http, $q) {
  var getMail = function() {
    return $http({
            method: 'GET',
            url: '/api/mail'
          });
  };

  var sendEmail = function(mail) {
    var d = $q.defer();
    $http({
      method: 'POST',
      data: 'mail',
      url: '/api/send'
    }).success(function(data, status, headers) {
      d.resolve(data);
    }).error(function(data, status, headers) {
      d.reject(data);
    });
    return d.promise;
  };

  return {
    getMail: getMail,
    sendEmail: sendEmail
  };
}]);

app.controller('HomeController', function($scope) {
  $scope.selectedMail;

  $scope.setSelectedMail = function(mail) {
    $scope.selectedMail = mail;
  };

  $scope.isSelected = function(mail) {
    if($scope.selectedMail) {
      return $scope.selectedMail === mail;
    }
  };
});

// directive that builds the email listing
app.directive('emailListing', function() {
  var url = "http://www.gravatar.com/avatar/";
  return {
    restrict: 'EA', // E- element A- attribute C- class M- comment
    replace: false, // whether angular should replace the element or append
    scope: { // may be true/false or hash. if a hash we create an 'isolate' scope
      email: '=', // accept an object as parameter
      action: '&', // accept a function as a parameter
      isSelected: '&',
      shouldUseGravatar: '@', // accept a string as a parameter
      gravatarSize: '@'
    },
    transclude: false,
    templateUrl: '/templates/emailListing.html',
    controller: ['$scope', '$element', '$attrs', '$transclude',
      function($scope, $element, $attrs, $transclude) {
        $scope.handleClick = function() {
          $scope.action({selectedMail: $scope.email});
        };
      }
    ],
    // if you had a compile section here, link: wont run
    link: function(scope, iElement, iAttrs, controller) {
      var size = iAttrs.gravatarSize || 80;

      scope.$watch('gravatarImage', function() {
        var hash = md5(scope.email.from[0]);
        scope.gravatarImage = url + hash + '?s=' + size;
      });

      iElement.bind('click', function() {
        iElement.parent().children().removeClass('selected');
        iElement.addClass('selected');
      });
    }
  };
});

app.controller('MailListingController', ['$scope', 'mailService', function($scope, mailService) {
  $scope.email = [];
  $scope.nYearsAgo = 10;

  mailService.getMail()
  .success(function(data, status, headers) {
    $scope.email = data.all;
  })
  .error(function(data, status, headers) {
  });

  $scope.searchPastNYears = function(email) {
    var emailSentAtDate = new Date(email.sent_at),
        nYearsAgoDate = new Date();

    nYearsAgoDate.setFullYear(nYearsAgoDate.getFullYear() - $scope.nYearsAgo);
    return emailSentAtDate > nYearsAgoDate;
  };
}]);

app.controller('ContentController', ['$scope', 'mailService', '$rootScope', function($scope, mailService, $rootScope) {
  $scope.showingReply = false;
  $scope.reply = {};

  $scope.toggleReplyForm = function() {
    $scope.reply = {}; //reset variable
    $scope.showingReply = !$scope.showingReply;
    console.log($scope.selectedMail.from);
    $scope.reply.to = $scope.selectedMail.from.join(", ");
    $scope.reply.body = "\n\n -----------------\n\n" + $scope.selectedMail.body;
  };

  $scope.sendReply = function() {
    $scope.showingReply = false;
    $rootScope.loading = true;
    mailService.sendEmail($scope.reply)
    .then(function(status) {
      $rootScope.loading = false;
    }, function(err) {
      $rootScope.loading = false;
    });
  }

  $scope.$watch('selectedMail', function(evt) {
    $scope.showingReply = false;
    $scope.reply = {};
  });
}]);

app.controller('SettingsController', function($scope) {
  $scope.settings = {
    name: 'harry',
    email: "me@me.com"
  };

  $scope.updateSettings = function() {
    console.log("updateSettings clicked")
  };
});
