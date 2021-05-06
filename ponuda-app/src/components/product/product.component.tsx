import * as React from "react";

interface IProductProps {
    description?: string;
    src: any;
}

export const Product: React.FunctionComponent<IProductProps> = (props) => {


    return   <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "10px", maxWidth:"500px", maxHeight:"500px" }}>
            <img src={props.src} alt="" style={{objectFit:"fill", maxHeight:"95%", maxWidth:"100%" }} />
            {props.description && <span style={{ fontWeight: "bold", fontSize: "18px" }}>{props.description}</span>}
        </div>
   
}

