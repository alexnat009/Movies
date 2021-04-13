import React, { Component } from "react";
import Movies from "./components/movies";
import { Redirect, Route, Switch } from "react-router-dom";
import Customers from "./components/custorems";
import Rentals from "./components/rentals";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import MoviesForm from "./components/moviesForm";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <main className="container">
          <NavBar />
          <Switch>
            <Route path="/login" component={LoginForm}></Route>
            <Route path="/register" component={RegisterForm}></Route>
            <Route path="/movies/:id" component={MoviesForm}></Route>
            <Route path="/movies" component={Movies}></Route>
            <Route path="/rentals" component={Rentals}></Route>
            <Route path="/customers" component={Customers}></Route>
            <Route path="/not-found" component={NotFound}></Route>
            <Redirect from="/" exact to="/movies" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}
export default App;
