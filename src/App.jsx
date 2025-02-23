import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "../src/components/Body";
import Login from "../src/components/Login";
import Profile from "../src/components/Profile";
import { store } from "../src/utils/store";
import { Provider } from "react-redux";
import Feed from "../src/components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/connections" element={<Connections />}></Route>
              <Route path="/requests" element={<Requests />}></Route>
            </Route>
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword/:token" element={<ResetPassword />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
