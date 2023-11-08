import { useSelector } from "react-redux";
import PopOut from "./PopOut";

const Alert = () => {
    const { alerts } = useSelector(state => state.notifications);

    return (
        <>
            <div className="alerter">
                {alerts.map((alert, index) => <PopOut key={index} alert={alert} />)}
            </div>
        </>
    )
};

export default Alert;