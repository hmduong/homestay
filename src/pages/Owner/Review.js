import Loading from "components/Loading";
import ReviewCard from "components/ReviewCard";
import { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import { getReviewsByHomestayId } from "services/review";

function Review({ homestay }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const getData = async () => {
        setLoading(true)
        const res = await getReviewsByHomestayId(homestay._id);
        if (res.data.reviews) {
            setReviews(res.data.reviews);
        }
        setLoading(false)
    }
    useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <Container style={{ minHeight: '300px', marginTop: 24 }}>
                {loading ? <Loading /> :
                    <>
                        <h2>Reviews</h2>
                        <Row>
                            {reviews?.map(review => <ReviewCard key={review._id} review={review} />)}
                        </Row>
                    </>}
            </Container>
        </>
    );
}

export default Review;

