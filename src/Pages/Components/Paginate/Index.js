import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

const Paginate = ({ meta, links, reqNewPage }) => {

    if (meta === null) return null;

    return (
        <Pagination aria-label="Page navigation example">
            <PaginationItem>
                <PaginationLink onClick={e => reqNewPage(e, links.first)} first href="#" />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink onClick={e => reqNewPage(e, links.prev)} previous href="#" />
            </PaginationItem>
            {
                [...Array(meta.last_page)].map((a, i) => (
                    <PaginationItem>
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