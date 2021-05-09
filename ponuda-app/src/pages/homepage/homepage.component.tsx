import * as React from "react";
import { RouteComponentProps } from "react-router";

import { Product } from "../../components/product/product.component";
import { firestore } from "../../firebase/firebase.utils";
import { IProduct } from "../products/products.component";

interface IProductRouteProps {
    category?: string;
}

interface IHomepageProps extends RouteComponentProps<IProductRouteProps> {

}

interface IHomepageState {
    products: IProduct[];
}

class Homepage extends React.Component<IHomepageProps, IHomepageState>{


    constructor(props: IHomepageProps) {
        super(props);
        this.state = { products: [] };
    }

    async componentDidMount() {
        await this.getProducts();
    }

    async getProducts() {
        try {
            await firestore.collection('products').get().then((querySnapshot) => {
                let products: IProduct[] = [];
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    products.push(doc.data() as IProduct);
                    // console.log(doc.id, " => ", doc.data());
                });
                products = products.sort((a, b) => a.order > b.order ? 1 : -1);

                this.setState({ products: products });
            });;
        } catch (error) {
            console.log("An error occurred while trying to get Products", error);
        }
    }

    render() {
        const { products } = this.state;

        return <div style={{ margin: "10px 20px" }}>
            <h1>U Ponudi su sljedeci artikli:</h1>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                {products.map((item) => {
                    return <Product productId={item.id} src={item.fileData} description={item.description} />;
                })
                }






            </div>
        </div>
    }


}

export default Homepage