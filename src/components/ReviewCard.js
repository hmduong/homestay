import { format } from "date-fns";
import { Card, Col, Modal, Button } from "reactstrap";
import Avatar from "./Avatar";
import { useState } from "react";
import { useTranslation } from "react-i18next";


function ReviewCard({ review }) {
    const [show, setShow] = useState(false);
    const { t } = useTranslation();

    const detail = () => {
        console.log(review);
        setShow(true)
    }

    return (
        <Col md='12' className="review-card" style={{ marginBottom: 16 }}>
            <Avatar namee={review.user.name} />
            <Card className="review-info shadow" onClick={detail}>
                <div className="review-comment">
                    <h5>{review.user.name}</h5>
                    <p>{review.comment}</p>
                </div>
                <div className="review-rate">
                    <div style={{ color: 'yellow', width: 100 }}>{new Array(review.rate).fill(0).map((q, key) => <i key={key} style={{ marginLeft: 3 }} className="fa fa-star" aria-hidden="true"></i>)}</div>
                    <p>{format(new Date(review.updatedAt), "dd/MM/yyyy")}</p>
                </div>
            </Card>
            <Modal
                className="modal-dialog-centered"
                isOpen={show}
                toggle={() => setShow(false)}
            >
                <div className="modal-header">
                    <h6 className="modal-title" id="modal-title-default">
                        {t('homestay.detailReview')} {review.user.name}
                    </h6>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setShow(false)}
                    >
                        <span>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    {t('rate')}: <div style={{ color: 'yellow', width: 100 }}>{new Array(review.rate).fill(0).map((q, key) => <i key={key} style={{ marginLeft: 3 }} className="fa fa-star" aria-hidden="true"></i>)}</div>
                    {t('homestay.comment')}: <p style={{ paddingBottom: 0 }}>{review.comment}</p>
                    {t('time')}: <p style={{ paddingBottom: 0 }}>{format(new Date(review.updatedAt), "dd/MM/yyyy")}</p>
                </div>
                <div className="modal-footer">
                    <Button color="primary" type="button" className="ml-auto" onClick={() => setShow(false)}>
                        {t('ok')}
                    </Button>
                </div>
            </Modal>
        </Col>
    );
}

export default ReviewCard;

