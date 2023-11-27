import { format } from "date-fns";
import { Card, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import Avatar from "./Avatar";


function ReviewCard({ review }) {

    return (
        <Col md='12' className="review-card" style={{ marginBottom: 16 }}>
            <Avatar name={review.user.name} />
            <Card className="review-info shadow">
                <div className="review-comment">
                    <h5>{review.user.name}</h5>
                    <p>{review.comment}</p>
                </div>
                <div className="review-rate">
                    <div style={{ color: 'yellow', width: 100 }}>{new Array(review.rate).fill(0).map((q, key) => <i key={key} style={{ marginLeft: 3 }} className="fa fa-star" aria-hidden="true"></i>)}</div>
                    <p>{format(new Date(review.updatedAt), "dd/MM/yyyy")}</p>
                </div>
            </Card>
        </Col>
    );
}

export default ReviewCard;

