import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Card, Button, UncontrolledTooltip } from "reactstrap";
import { deactivateDiscount } from "services/discount";
import { useDispatch } from "react-redux";
import { actions } from "store/AlertSlice"
import Loading from "components/Loading";

const DiscountTicket = ({ discount, onClick }) => {
    const dispatch = useDispatch();
    const [hover, setHover] = useState(false)
    const [hide, setHide] = useState(false)
    const [loading, setLoading] = useState(false);
    const [dHomestay, setDHomestay] = useState([])
    useEffect(() => {
        if (discount) setDHomestay(discount.homestays.map(homestay => homestay?.name))
    }, [])
    const deactivate = async (id) => {
        setLoading(true)
        const res = await deactivateDiscount(id)
        if (res.status < 400) {
            dispatch(
                actions.createAlert({
                    message: "Deactivated!",
                    type: "success"
                })
            );
            setHide(true)
        } else {
            dispatch(
                actions.createAlert({
                    message: "Error occur",
                    type: "error"
                })
            );

        }
        setLoading(false)
    }
    return (
        discount ?
            (loading ? <Loading /> : <Card className="discount-ticket card-lift--hover shadow border-0"
                onMouseLeave={() => setHover(false)}
                onMouseOver={() => setHover(true)}>
                <div className="ticket-detail">
                    <h2 style={{ width: 'fit-content', cursor: 'pointer', fontWeight: 'bolder' }}>{discount.name}</h2>
                    <div>start: {format(new Date(discount.checkin), "dd/MM/yyyy")}</div>
                    <div>end: {format(new Date(discount.checkout), "dd/MM/yyyy")}</div>
                    <div>quantity: {discount.quantity}</div>
                    <div>used: {discount.used}</div>
                    <div>Homestays: {dHomestay.map((homestayName, key) => <span key={key}>{homestayName}, </span>)}</div>
                    <h6 className={`discount-active ${discount.active && !hide ? 'active' : 'inactive'}`}>{discount.active ? 'Active' : 'Deactivated'}</h6>
                </div>
                <div className="ticket-percent">
                    <h1>{discount.percentage}%</h1>
                </div>
                {discount.active && !hide && <div className={`deactive-btn${hover ? ' active' : ''}`}><Button color="primary" onClick={() => deactivate(discount._id)}>Deactive</Button></div>}
            </Card>) :
            <>
                <UncontrolledTooltip
                    delay={0}
                    placement="bottom"
                    target="add-homestay"
                >
                    Add discount
                </UncontrolledTooltip>
                <Card onClick={onClick} id='add-homestay' className="discount-ticket add-discount slide-container card-lift--hover shadow border-0">
                    <i className='fa fa-plus'></i>
                </Card>
            </>
    )
}

export default DiscountTicket