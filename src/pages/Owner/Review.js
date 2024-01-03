import Loading from "components/Loading";
import ReviewCard from "components/ReviewCard";
import { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import { getReviewsByHomestayId } from "services/review";
import { useTranslation } from "react-i18next";

function Review({ homestay }) {
    const { t } = useTranslation();
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
            <Container style={{ marginTop: 24 }}>
                {loading ? <Loading /> :
                    <>
                        <h2>{t('homestay.reviews')}</h2>
                        <Row>
                            {reviews.length ? reviews.map(review => <ReviewCard key={review._id} review={review} />) : <div className="review-nodata">{t('homestay.reviewNodata')}</div>}
                        </Row>
                    </>}
            </Container>
        </>
    );
}

export default Review;

