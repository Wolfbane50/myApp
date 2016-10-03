class ToastController {
  //end-non-standard


  //start-non-standard
  constructor() {
    this.toastMsg = "Initial Message";
    this.makeToast = function(message) {
      // Set a timer to make the toast go back down
console.log("Toast set to: " + message);
      this.toastMsg = message;
    }
  }

}

angular.module('myappApp')
  .controller('ToastController', ToastController);
