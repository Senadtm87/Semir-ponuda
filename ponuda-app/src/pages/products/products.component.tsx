import * as React from "react";
import { firestore } from "../../firebase/firebase.utils";
import AddProductModal from "./add-product-modal.component";
import UpArrow from "../../icons/up-arrow.svg";
import DownArrow from "../../icons/down-arrow.svg";
interface IProductsPageProps {

}

interface IProductsPageState {
    showAddModal: boolean;
    products: IProduct[];
    selectedProduct?: string;
    isRequestInProgress: boolean;
}

export interface IProduct {
    id: string;
    order: number;
    price: number;
    name: string;
    description: string;
    filename: string;
    fileData: string;
    isDataLoaded: boolean;

}
enum Direction {
    Up,
    Down
}

class ProductsPage extends React.Component<IProductsPageProps, IProductsPageState>{

    /**
     *
     */
    constructor(props: IProductsPageProps) {
        super(props);
        this.state = { showAddModal: false, products: [], isRequestInProgress: false };
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
                    const product = { ...doc.data(), id: doc.id } as IProduct;
                    products.push(product);
                    // console.log(doc.id, " => ", doc.data());
                });

                products = products.sort((a, b) => a.order > b.order ? 1 : -1);

                this.setState({ products: products });
            });;
        } catch (error) {
            console.log("An error occurred while trying to get Products", error);
        }
    }

    async deleteProduct(productId: string) {
        try {
            this.setState({ isRequestInProgress: true });
            await firestore.doc(`products/${productId}`).delete();
            await this.getProducts();

        } catch (error) {
            console.log("An error occurred while deleting product.", error);
        } finally {
            this.setState({ isRequestInProgress: false });
        }

    }

    async moveProduct(index: number, direction: Direction) {
        const { products } = this.state;
        this.setState({ isRequestInProgress: true });
        try {
            if (direction === Direction.Up) {
                if (index > 0) {
                    var previousProduct = products[index - 1];
                    previousProduct.order += 1;
                    var product = products[index];
                    product.order += -1;
                    await firestore.doc(`products/${previousProduct.id}`).set(previousProduct);
                    await firestore.doc(`products/${product.id}`).set(product);

                }
            } else {
                if (index < products.length) {
                    var nextProduct = products[index + 1];
                    nextProduct.order += -1;
                    var productDown = products[index];
                    productDown.order += 1;
                    await firestore.doc(`products/${nextProduct.id}`).set(nextProduct);
                    await firestore.doc(`products/${productDown.id}`).set(productDown);

                }
            }
        } catch (error) {
            console.log("An error occurred while trying to move product", error);
        } finally {
            this.setState({ isRequestInProgress: false });
        }



    }

    render() {
        const { showAddModal, products, selectedProduct, isRequestInProgress } = this.state;
        return <div className="px-5">
            <h1>Proizvodi</h1>
            <nav className="navbar navbar-light bg-light">
                <button type="button"
                    className="btn btn-sm btn-primary nav-item"
                    onClick={() => this.setState({ showAddModal: true, selectedProduct: undefined })}
                >Dodaj proizvod</button>
            </nav>

            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th scope="col">Order number</th>
                        <th scope="col">File name</th>
                        <th scope="col">Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product, index) => {
                            return <tr>
                                <td><img src={UpArrow}
                                    alt="up arrow"
                                    style={{ height: "15px", cursor: "pointer", marginRight: "10px", display: product.order === 1 ? "none" : undefined }}
                                    onClick={async () => { if (!isRequestInProgress) { await this.moveProduct(index, Direction.Up); await this.getProducts(); } }}
                                />
                                    <img src={DownArrow}
                                        alt="down arrow"
                                        style={{ height: "15px", cursor: "pointer", display: product.order === products.length ? "none" : undefined }}
                                        onClick={async () => { if (!isRequestInProgress) { await this.moveProduct(index, Direction.Down); await this.getProducts(); } }}
                                    />
                                </td>
                                <td>{product.order}</td>
                                <td>{product.filename}</td>
                                <td>{product.description}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary"
                                        onClick={() => { this.setState({ selectedProduct: product.id, showAddModal: true }); }} >Uredi</button>
                                    <button
                                        type="button"

                                        className="ml-2 btn btn-sm btn-danger"
                                        disabled={isRequestInProgress}
                                        onClick={async () => { await this.deleteProduct(product.id); }} >Obrisi</button>
                                </td>
                            </tr>
                        })
                    }


                </tbody>
            </table>


            <AddProductModal
                isVisible={showAddModal}
                productId={selectedProduct}
                productsCount={products.length}
                onConfirm={async () => { this.setState({ showAddModal: false }); await this.getProducts(); }}
                onHide={() => { this.setState({ showAddModal: false }) }} />
        </div>
    }

}


export default ProductsPage;