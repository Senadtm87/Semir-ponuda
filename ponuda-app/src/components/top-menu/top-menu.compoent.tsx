import * as React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IUser } from "../../App";
import { signInWithGoogle, auth } from "../../firebase/firebase.utils";


interface ITopMenuProps  {
    currentUser?: IUser;
}

class TopMenu extends React.Component<ITopMenuProps, {}>{



    render() {
        const { currentUser } = this.props;
        return <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">Semir ponuda</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" ></Navbar.Toggle>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Link to="/" className="nav-link">Pocetna</Link>
                    {currentUser && <Link to="/products" className="nav-link">Proizvodi</Link>}
                </Nav>
                <Nav className="ml-auto">
                    {!currentUser && <Nav.Link href="" onClick={signInWithGoogle}>Prijavi se</Nav.Link>}
                    {currentUser && <Navbar.Text > 👤 Zdravo, <span className="text-primary"> {currentUser.displayName} </span></Navbar.Text>}
                    {currentUser && <Nav.Link href="" onClick={() => {
                        auth.signOut();
                        window.location.href = "/";
                    }}>Odjavi se</Nav.Link>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    }
}


export default TopMenu;