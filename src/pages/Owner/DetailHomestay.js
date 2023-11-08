import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Slide } from "react-slideshow-image";
import { CardImg } from "reactstrap";
import { getHomestay } from "services/homestayManagementService";

const DetailHomestay = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const { id } = useParams()
    const imgLink = (id, idx = 0) => `http://localhost:3333/homestays/${id}/images?index=${idx}`;

    useEffect(() => {
        const fetchData = async () => {
            const data = await getHomestay(id);
            console.log(data.data);
            setData(data.data);
            setLoading(false)
        };
        fetchData();
    }, []);
    return (loading ? <></> : <div className="detail-homestay">
        <Slide className="slide">{data.homestay.images.length > 0 ?
            data.homestay.images.map((img, idx) => <CardImg
                key={idx}
                className="each-slide"
                alt="..."
                src={imgLink(data.homestay._id, idx)}
            />)
            : <CardImg
                className="each-slide"
                alt="..."
                src={require('assets/img/theme/team-1-800x800.jpg')}
            />}
        </Slide>
        <div className="homestay-info">
            <h2 style={{ width: 'fit-content', cursor: 'pointer', fontWeight: 'bolder' }}>{data.homestay.name}</h2>
            <div>address: {data.homestay.address}</div>
            <div>people: {data.homestay.people}</div>
            <div>pool: {data.homestay.pool ? 'Yes' : 'No'}</div>
            <div>rate: {data.homestay.rate}</div>
            <div>bookings: {data.homestay.bookingNumber}</div>
            <div>Price: {data.homestay.price}</div>
            <div>City: {data.homestay.city}</div>
            <div>Owner: {data.owner.name}</div>
        </div>
    </div>)
}
export default DetailHomestay