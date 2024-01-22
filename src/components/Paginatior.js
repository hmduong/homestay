import { useState } from "react"
import { Col, Pagination, PaginationItem, PaginationLink, Row } from "reactstrap"

const Paginatior = ({ refe = "#", numOfPage = 1, page, pagiCallback = () => { } }) => {

    const pagiHandler = (idx) => {
        if (idx > 0 && idx <= numOfPage) {
            pagiCallback(idx)
        }
    }

    return (
        <Col md={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination>
                <PaginationItem>
                    <PaginationLink
                        first
                        href={refe}
                        onClick={() => pagiHandler(1)}
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        href={refe}
                        previous
                        onClick={() => pagiHandler(page - 1)}
                    />
                </PaginationItem>
                {
                    Array.from({ length: numOfPage }, (_, index) =>
                        <PaginationItem
                            active={index + 1 === page}>
                            <PaginationLink
                                href={refe}
                                onClick={() => pagiHandler(index + 1)}>
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>)
                }
                <PaginationItem>
                    <PaginationLink
                        href={refe}
                        next
                        onClick={() => pagiHandler(page + 1)}
                    />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink
                        href={refe}
                        last
                        onClick={() => pagiHandler(numOfPage)}
                    />
                </PaginationItem>
            </Pagination>
        </Col>
    )
}

export default Paginatior