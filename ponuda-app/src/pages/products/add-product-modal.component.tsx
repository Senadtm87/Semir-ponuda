import * as React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { firestore } from "../../firebase/firebase.utils";
import { IProduct } from "./products.component";


interface IAddProductModalProps {
    isVisible: boolean;
    productsCount: number;
    productId?: string;
    onConfirm: () => void;
    onHide: () => void;
}




const AddProductModal: React.FunctionComponent<IAddProductModalProps> = (props) => {

    const [data, setData] = React.useState<IProduct>();
    const [isEdit, setIsEdit] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (props.isVisible && props.productId) {
            setIsEdit(true);
            getProduct().then(product => setData(product));
        } else {
            setData(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isVisible]);

    const getProduct = async () => {
        try {
            console.log("Loading product with id:", props.productId);
            const product = (await firestore.doc(`products/${props.productId}`).get()).data() as IProduct;
            return product;
        } catch (error) {
            console.log("An error occurred while getting product", error);
        }
    }

    const handleDescriptionSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const description = e.target.value;
        setData({ ...data, description: description } as IProduct);
    }

    const saveData = async () => {
        try {
            console.log("Save data", data);
            if (data) {
                if (props.productId) {
                    //edit product
                    console.log("Editing data", data);
                    await firestore.doc(`products/${props.productId}`).set(data);
                } else {
                    //add product
                    const product = { ...data, order: props.productsCount + 1 };
                    const productId = new Date().getTime();
                    await firestore.doc(`products/${productId}`).set(product);
                }


                props.onConfirm();
            }
        } catch (error) {
            console.log("An error occurred while saving product:", error);
        }


    }

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const files = Array.from(e.target.files !== null ? e.target.files : []);
        console.log("files:", files);
        const file = files[0];
        if (!file) {
            setData({ ...data, filename: "", fileData: "" } as IProduct);
        } else {
            if (file.size > 1000000) {
                alert("Prevelika slika.");
                return;
            }

            setData({ ...data, filename: file.name, fileData: "" } as IProduct);
        }
        var reader = new FileReader();

        reader.onloadend = function () {
            console.log("image", reader.result);
            setData({ ...data, filename: file.name, fileData: reader.result, isDataLoaded: true } as IProduct);
        }

        if (file) {
            reader.readAsDataURL(file);
        }
    }
    console.log("data", data);
    return props.isVisible ? <Modal show={true} centered>
        <Modal.Header closeButton onHide={props.onHide}>
            <Modal.Title>Dodaj proizvod</Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Opis proizvoda</Form.Label>
                    <Form.Control type="text" placeholder="Opis" value={data && data.description ? data.description : ""} onChange={handleDescriptionSelected} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Slika</Form.Label>
                    <Form.Control type="file" title="Slika" accept=".jpg,.jpeg" onChange={handleFileSelected} />
                    {isEdit && data && <span>{data.filename}</span>}
                </Form.Group>


            </Form>
        </Modal.Body>

        <Modal.Footer>
            <Button variant="primary" disabled={isEdit ? false : !data || !data.isDataLoaded} onClick={saveData} type="button">Spasi</Button>
            <Button variant="secondary" type="button" onClick={props.onHide}>Zatvori</Button>

        </Modal.Footer>
    </Modal> : null;
}


export default AddProductModal;
