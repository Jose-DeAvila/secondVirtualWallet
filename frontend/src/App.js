import './App.css';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import HomeComponent from './components/homeComponent';
import SignInComponent from './components/signInComponent';
import SignUpComponent from './components/signUpComponent';
import InitComponent from './components/initComponent';

function App() {
  return (
      <Router>
        <Route path="/" exact={true} component={HomeComponent}/>
        <Route path="/login" exact={true} component={SignInComponent} />
        <Route path="/register" exact={true} component={SignUpComponent} />
        <Route path="/inicio" exact={true} component={InitComponent} />
      </Router>
  );
}

export default App;
