import { Card, CardImg, UncontrolledTooltip } from "reactstrap";
import { Slide } from "react-slideshow-image";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
const HomestayCard = ({ homestay, onClick, newBooking }) => {
  const { t, i18n } = useTranslation();
  const [cookies, setCookie, removeCookie] = useCookies(["role"]);
  const navigate = useNavigate();
  const imgLink = (id, idx = 0) =>
    `http://localhost:3333/homestays/${id}/images?index=${idx}`;
  const detail = () => {
    const url =
      cookies.role === "homestay owner"
        ? `/owner/homestay/${homestay._id}`
        : `/homestay/${homestay._id}`;
    navigate(url);
  };
  return homestay ? (
    <Card
      onClick={detail}
      className="homestay-card slide-container card-lift--hover shadow border-0"
    >
      <Slide>
        {homestay.images.length > 0 ? (
          homestay.images.map((img, idx) => (
            <CardImg
              key={idx}
              className="each-slide"
              alt="..."
              src={imgLink(homestay._id, idx)}
            />
          ))
        ) : (
          <CardImg
            className="each-slide"
            alt="..."
            src={require("assets/img/theme/team-1-800x800.jpg")}
          />
        )}
      </Slide>
      <div className="card-overlay">
        <div className="card-price">{homestay.price}$</div>
        <div className="card-rate">
          {new Array(5).fill(0).map((q, key) => (
            <i
              key={key}
              className={
                Math.round(homestay.rate) > key ? "fa fa-star" : "fa fa-star-o"
              }
              aria-hidden="true"
            ></i>
          ))}
        </div>
      </div>
      <div className="card-detail">
        <h2
          style={{
            width: "fit-content",
            cursor: "pointer",
            fontWeight: "bolder",
          }}
        >
          {homestay.name}
          {newBooking && (
            <i
              style={{ color: "#fb6340", fontSize: 16 }}
              className="fa fa-circle"
              aria-hidden="true"
            ></i>
          )}
        </h2>
        <div>
          {t("address")}: {homestay.address}
        </div>
        <div>
          {t("slot")}: {homestay.people}
        </div>
        <div>
          {t("pool")}: {homestay.pool ? "Yes" : "No"}
        </div>
        <div>
          {t("homestay.bookings.title")}: {homestay.bookingNumber}
        </div>
      </div>
    </Card>
  ) : (
    <>
      <UncontrolledTooltip delay={0} placement="bottom" target="add-homestay">
        Create new homestay
      </UncontrolledTooltip>
      <Card
        onClick={onClick}
        id="add-homestay"
        className="homestay-card add-homestay slide-container card-lift--hover shadow border-0"
      >
        <i className="fa fa-plus"></i>
      </Card>
    </>
  );
};

export default HomestayCard;
