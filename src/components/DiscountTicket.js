import { useEffect } from "react";
import { Card, UncontrolledTooltip } from "reactstrap";
import {
    deactivateDiscount
} from "services/discount";

const DiscountTicket = ({ discount, onClick }) => {
    useEffect(() => {
        if (discount) discount.homestays = discount.homestays.map(homestay => homestay.name)
    }, [])
    const deactivate = async (id) => {
        const res = await deactivateDiscount(id)
        console.log(res.status === 200);
    }


    // const formatDate = (date) => {
    //     const format = `${
    //       date.getMonth() + 1
    //     }-${date.getDate()}-${date.getFullYear()}`;
    //     return new Date(format);
    //   };
    return (
        discount ?
            <Card className="discount-ticket card-lift--hover shadow border-0">
                <div className="ticket-detail">
                    <h2 style={{ width: 'fit-content', cursor: 'pointer', fontWeight: 'bolder' }}>{discount.name}</h2>
                    <div>checkin: {discount.checkin}</div>
                    <div>checkout: {discount.checkout}</div>
                    <div>quantity: {discount.quantity}</div>
                    <div>used: {discount.used}</div>
                    <div>Homestays: {discount.homestays.toString()}</div>
                    {discount.active ?
                        <button onClick={() => deactivate(discount._id)}>click</button>
                        : <div>active: {discount.active}</div>}
                </div>
                <div className="ticket-percent"><h1>{discount.percentage}%</h1></div>
            </Card> :
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