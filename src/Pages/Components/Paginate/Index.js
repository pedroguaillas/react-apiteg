import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const Paginate = ({ meta, links, reqNewPage }) => {

    if (meta === null || meta.last_page < 2) return null;

    return (
        <Pagination aria-label="Page navigation example">
            <PaginationItem>
                <PaginationLink onClick={e => reqNewPage(e, links.first)} first href="#" />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink onClick={e => reqNewPage(e, links.prev)} previous href="#" />
            </PaginationItem>
            {
                (meta.last_page > 10) ?
                    [...Array(meta.last_page)].map((a, i) => (
                        (i > meta.current_page - 5 && i < meta.current_page + 5) ?
                            <PaginationItem active={meta.current_page === (1 + i)}>
                                <PaginationLink onClick={e => reqNewPage(e, `${meta.path}?page=${(1 + i)}`)} href="#">
                                    {(1 + i)}
                                </PaginationLink>
                            </PaginationItem>
                            : null
                    ))
                    :
                    [...Array(meta.last_page)].map((a, i) => (
                        <PaginationItem active={meta.current_page === (1 + i)}>
                            <PaginationLink onClick={e => reqNewPage(e, `${meta.path}?page=${(1 + i)}`)} href="#">
                                {(1 + i)}
                            </PaginationLink>
                        </PaginationItem>
                    ))
            }
            <PaginationItem>
                <PaginationLink onClick={e => reqNewPage(e, links.next)} next href="#" />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink onClick={e => reqNewPage(e, links.last)} last href="#" />
            </PaginationItem>
        </Pagination>
    );
}

export default Paginate;