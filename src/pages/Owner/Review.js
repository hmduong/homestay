import Loading from "components/Loading";
import ReviewCard from "components/ReviewCard";
import { useState, useEffect } from "react";
import { Container, Row } from "reactstrap";
import { getReviewsByHomestayId } from "services/review";
import { useTranslation } from "react-i18next";
import Paginatior from "components/Paginatior";

function Review({ homestay }) {
    const { t } = useTranslation();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagiTotal, setPagiTotal] = useState(0)
    const [page, setPage] = useState(1)
    const getData = async (limit, page) => {
        setLoading(true)
        const res = await getReviewsByHomestayId(homestay._id, limit, page);
        if (res.data.reviews) {
            setReviews(res.data.reviews);
            setPagiTotal(res.data.totalCount || 0)
            setPage(page)
        }
        setLoading(false)
    }

    const pagiCallback = async (idx) => {
        await getData(10, idx)
    }
    useEffect(() => {
        getData(10, 1);
    }, []);

    return (
        <>
            <Container style={{ marginTop: 24 }}>
                {loading ? <Loading /> :
                    <>
                        <h2>{t('homestay.reviews')}</h2>
                        <Row>
                            {reviews.length ? reviews.map(review => <ReviewCard key={review._id} review={review} />) : <div className="review-nodata">{t('homestay.reviewNodata')}</div>}
                            {reviews && reviews.length > 0 && <Paginatior refe="#searchResponse" numOfPage={pagiTotal} pagiCallback={pagiCallback} page={page} />}
                        </Row>
                    </>}
            </Container>
        </>
    );
}

export default Review;

