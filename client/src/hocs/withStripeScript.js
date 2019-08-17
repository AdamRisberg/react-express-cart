import React from "react";
import scriptLoader from "react-async-script";

const WithScript = scriptLoader("https://js.stripe.com/v3/")(StripeLoader);

function StripeLoader({ render }) {
  return render();
}

function withStripeScript(WrappedComponent) {
  return function StripeScriptLoader(props) {
    const [scriptLoaded, setScriptLoaded] = React.useState(false);

    return (
      <WithScript
        asyncScriptOnLoad={() => setScriptLoaded(true)}
        render={() => (
          <WrappedComponent scriptLoaded={scriptLoaded} {...props} />
        )}
      />
    );
  };
}

export default withStripeScript;
