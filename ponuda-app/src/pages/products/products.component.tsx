import * as React from "react";

interface IProductsPageProps {

}

interface IProductsPageState {

}

class ProductsPage extends React.Component<IProductsPageProps, IProductsPageState>{

    /**
     *
     */
    constructor(props: IProductsPageProps) {
        super(props);
        this.state = {};
    }

    render() {

        return <h1>Products page</h1>
    }

}


export default ProductsPage;