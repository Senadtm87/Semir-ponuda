import * as  React from 'react';
import { Button, Form } from 'react-bootstrap';

import {signInWithGoogle} from "../../firebase/firebase.utils";

class Login extends React.Component<{}, {}>{


    render() {

        return <div className="cointainer">
            <div className="">
                <Form className="col-sm-12 d-flex flex-column" style={{maxWidth:"500px"}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />                      
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>                   
                    <Button variant="primary" type="button" onClick={signInWithGoogle}>
                        Login
        </Button>
                </Form>
            </div>
        </div>
    }
}

export default Login;