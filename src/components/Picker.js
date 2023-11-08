import React, { useState } from "react";
import { Col, Row } from "reactstrap";
export default function Picker({ refe }) {
    const [value, setValue] = useState(refe.isLeft)
    const isOnVisitor = (value) => {
        setValue(value)
        refe.isLeft = value
    }
    return (
        <Row className="my-4">
            <Col xs="6">
                <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                        className="custom-control-input"
                        id="customCheckLeft"
                        type="checkbox"
                        checked={value}
                        onChange={(e) => isOnVisitor(e.target.checked)}
                    />
                    <label
                        className="custom-control-label"
                        htmlFor="customCheckLeft"
                    >
                        <span>
                            {refe.leftName}
                        </span>
                    </label>
                </div>
            </Col>
            <Col xs="6">
                <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                        className="custom-control-input"
                        id="customCheckRight"
                        type="checkbox"
                        checked={!value}

                        onChange={(e) => isOnVisitor(!e.target.checked)}
                    />
                    <label
                        className="custom-control-label"
                        htmlFor="customCheckRight"
                    >
                        <span>
                            {refe.rightName}
                        </span>
                    </label>
                </div>
            </Col>
        </Row>
    )
}