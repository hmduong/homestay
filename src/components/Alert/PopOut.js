import { useEffect, useState } from "react";
import { UncontrolledAlert } from "reactstrap";

const PopOut = ({ alert }) => {
    const [show, setShow] = useState(true)
    useEffect(() => {
        setTimeout(() => {
            setShow(false)
        }, 3000)
    }, [])

    const color = alert.type === "success" ? "success" : "warning";
    const icon = alert.type === "success" ? "fa-check-circle" : "fa-exclamation-triangle";
    const head = alert.type === "success" ? "Success" : "Error";

    return (
        show ? <>
            <UncontrolledAlert className="popout" color={color} fade={false}>
                <span className="alert-inner--icon">
                    <i className={'fa ' + icon} />
                </span>{" "}
                <span className="alert-inner--text">
                    <strong>{head}!</strong> {alert.message}
                </span>
            </UncontrolledAlert>
        </> : null
    )
};

export default PopOut;