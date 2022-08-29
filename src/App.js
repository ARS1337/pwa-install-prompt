import React, { lazy, Suspense, useEffect, useState } from "react";
import "./App.css";
import "./App copy.css";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import { ServiceWorkerWindow } from "./ServiceWorkerWindow";
const Counter = lazy(() => import("./Counter"));
const Counter2 = lazy(() => import("./Counter2"));

const Main = () => {
  const [registration, setRegistration] = useState(null);
  const [swListener, setSwListener] = useState({});
  const [updateWaiting, setUpdateWaiting] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      let listener = new ServiceWorkerWindow();
      setSwListener(listener);
      listener.onupdateinstalling = (installingEvent) => {
        console.log("SW installed", installingEvent);
      };
      listener.onupdatewaiting = (waitingEvent) => {
        console.log("new update waiting", waitingEvent);
        setUpdateWaiting(true);
      };
      listener.onupdateready = (event) => {
        console.log("updateready event");
        window.location.reload();
      };
      navigator.serviceWorker.getRegistration().then((reg) => {
        listener.addRegistration(reg);
        setRegistration(reg);
        console.log("reg ", reg);
      });
    }
  }, []);

  const handleInstall=()=>{
    swListener.customInstall(registration.active)
  }

  return (
    <>
      <button onClick={handleInstall}>Install</button>
      <h1>Welcome to React Router!</h1>
      <Link to="Counter">Counter</Link>
      <br />
      <Link to="Counter2">Counter2</Link>
    </>
  );
};

function App() {
  return (
    <>
      <Suspense fallback={"loading..."}>
        <Routes>
          <Route
            element={
              <>
                <Main /> <Outlet />
              </>
            }
          >
            <Route path="/" element={<></>} />
            <Route path="/Counter" element={<Counter />} />
            <Route path="/Counter2" element={<Counter2 />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
