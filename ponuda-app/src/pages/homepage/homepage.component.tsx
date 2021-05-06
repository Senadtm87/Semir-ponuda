import * as React from "react";
import { RouteComponentProps } from "react-router";

import { Product } from "../../components/product/product.component";
import {Products} from "../../products";

interface IProductRouteProps{
    category?:string;
}

interface IHomepageProps  extends RouteComponentProps<IProductRouteProps>{

}

interface IHomepageState {

}

class Homepage extends React.Component<IHomepageProps, IHomepageState>{


    constructor(props: IHomepageProps) {
        super(props);
        this.state = {};
    }





    render() {


        return <div style={{margin:"10px 20px"}}>
            <h1>Ponuda</h1>
           <div style={{display:"flex", flexDirection:"row", flexWrap:"wrap"}}>
         { Products.map((item)=>{
                return   <Product src={item.imageUrl} description={item.description} />;
          })
        }
              
       




            </div>
        </div>
    }


}

export default Homepage