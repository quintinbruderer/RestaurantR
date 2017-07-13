import React, {Component} from 'react';

export default class Facebook extends Component {
  constructor(props) {
    super(props);

    // post login behavior should be defined at a higher level
    this.onSuccess = (response) => {
      console.log(response.authResponse.userID)
      window.FB.api("/" + response.authResponse.userID,
        function (response) {
          if (response && !response.error) {
            console.log(response)
            document.getElementById('fb').innerHTML = 'Thank you for Logging in with Facebook!'
            document.getElementById('username').value = response.name
          }
        }
      );
    } ;
    this.onFailure = ( () => {
      document.getElementById('fb').innerHTML = 'Please try logging in again. #learningstill'
    });
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailure = this.onFailure.bind(this);
  }

  componentDidMount() {
    // This is the meat of the component
    // create a script tag, load FB SDK
    // then after script is loaded, set related behavior
    // If you have other components that rely on the FB SDK
    // I recommend extracting this into its own module
    let self = this;
    let scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.src = "http://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.4&appId=149079708982817";
    scriptTag.addEventListener('load', function (e) {
      self.FB = window.FB;
      // I don't like exposing the SDK to global scope
      console.log(self.FB)

      // This subscribe the callback when login status change
      // Full list of events is here
      // https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/v2.9
      self.FB.Event.subscribe('auth.statusChange', self.onStatusChange.bind(self));
    });
    document.body.appendChild(scriptTag);
  }

  onStatusChange(response) {
    if (response.status === 'connected') {
      // I have a afterLogin optional callback
      // which takes care of ads landing, invitation or any other custom behavior
      this.onSuccess(response);
    } else {
      this.onFailure();
    }
  }

  render() {
    return (
      <div>
        <div
        className="fb-login-button"
        data-width="250"
        data-max-rows="1"
        data-size="large"
        data-button-type="continue_with"
        data-show-faces="false"
        data-auto-logout-link="false"
        data-use-continue-as="false"
        data-scope="public_profile"
      >
      </div>
      <p id="fb"></p>
    </div>
    );
  }
}
