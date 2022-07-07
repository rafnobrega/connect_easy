import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import HomePage from './HomePage/HomePage';
import RegisterPage from './HomePage/AuthPages/RegisterPage/RegisterPage';
import LoginPage from './HomePage/AuthPages/LoginPage/LoginPage';
import './App.css';
import Scheduler from './Scheduler/Scheduler';
import Category from './Category/Category';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/register">
            <RegisterPage />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/calendar">
            <Scheduler />
          </Route>
          <Route exact path="/category">
            <Category />
          </Route>
          <Route path="/">
            <Redirect to="/dashboard" />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
