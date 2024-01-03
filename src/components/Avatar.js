import { useState } from "react"
import { Button, UncontrolledTooltip } from "reactstrap"

const Avatar = ({ namee, onclick }) => {
    const [hover, setHover] = useState(false)
    return (
        <>
            <Button
                id='avatar-btn'
                className="btn-neutral btn-icon circle-btn avatar-btn"
                color="default"
                onClick={onclick}
                onMouseLeave={() => setHover(false)}
                onMouseOver={() => setHover(true)}
            >
                <span className="nav-link-inner--text">
                    {namee.toUpperCase()[0]}
                </span>
            </Button>
            {hover && <UncontrolledTooltip
                delay={0}
                placement="bottom"
                target="avatar-btn"
            >
                {namee}
            </UncontrolledTooltip>}
        </>
    )
}

export default Avatar