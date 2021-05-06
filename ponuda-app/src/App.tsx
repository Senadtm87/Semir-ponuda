import * as React from 'react';
import { Switch, Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import TopMenu from './components/top-menu/top-menu.compoent';
import Homepage from './pages/homepage/homepage.component';
import { auth } from "./firebase/firebase.utils";
import ProductsPage from './pages/products/products.component';



interface IAppState {
  currentUser?: IUser;
}
export interface IUser {
  displayName: string | null;
  email: string | null;
}

class App extends React.Component<{}, IAppState>{
  unsubscribeFromAuth: any = null;
  constructor(props: any) {
    super(props);
    this.state = {
      currentUser: undefined
    };
  }

  componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(user => {
      // console.log(user);
      if (user) {
        this.setState({ currentUser: { displayName: user!.displayName, email: user!.email } });
      } else {
        this.setState({ currentUser: undefined });
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  isAuth(): boolean {
    const { currentUser } = this.state;    

    return currentUser !== undefined;
  }

  render() {
    const { currentUser } = this.state;

    return <div>
      <Router>
        <Switch>
          <div>
            <TopMenu currentUser={currentUser} />

            {currentUser && <Route exact path="/products" component={ProductsPage} />}
            <Route exact path="/" component={Homepage} />
            <Route render={() => {
              return <Redirect to="/" />
            }} />
          </div>
        </Switch>
      </Router>


    </div>
  }

}

export default App;
