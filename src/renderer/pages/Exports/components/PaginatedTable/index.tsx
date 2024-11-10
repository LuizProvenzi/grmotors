import React, { useState } from 'react';
import { Table, Form, Row, Col } from 'react-bootstrap';
import './styles.scss';
import Icon from '../../../../components/Icon';
import Text from '../../../../components/Text';

type TableProps = {
  data: any[];
  columns: any[];
};

const PaginatedTable: React.FC<TableProps> = ({ data, columns }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 10;

  const filteredData = data.filter((item) =>
    columns.some((column) =>
      item[column.key]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    ),
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Row className="d-flex justify-content-between">
        <Col>
          <Row className="d-flex flex-wrap">
            <Col xs="12" md="auto" className="d-flex gap-2 mb-3 mb-md-0">
              <Form.Group className="mb-0 position-relative">
                <div className="input-icon">
                  <Icon size={14} name="RiSearchLine" />
                </div>
                <Form.Control
                  type="text"
                  placeholder="Pesquisar"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="input-custom input-color"
                />
              </Form.Group>
            </Col>
          </Row>
        </Col>

        <Col>
          <div className="d-flex gap-2 justify-content-end align-items-center">
            <div className="d-flex align-items-center">
              <Text className="f-2 gray-2">
                {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredData.length)}
              </Text>
              &nbsp;
              <Text className="f-2 gray-2">de</Text>
              &nbsp;
              <Text className="f-2 gray-2">{filteredData.length}</Text>
            </div>

            <div className="d-flex align-items-center">
              <Icon
                onClick={() => handlePageChange(currentPage - 1)}
                name="RiArrowDropLeftLine"
                size={30}
                disabled={currentPage === 1}
              />
              <Icon
                onClick={() => handlePageChange(currentPage + 1)}
                name="RiArrowDropRightLine"
                size={30}
                disabled={currentPage === totalPages}
              />
            </div>
          </div>
        </Col>
      </Row>

      <div className="table-responsive">
        <Table className="mt-3 custom-table">
          <thead>
            <tr className="background-table">
              {columns.map((column: any, index: number) => (
                <th
                  key={index}
                  className={index === columns.length - 1 ? 'last-index' : ''}
                >
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  {columns.map((column: any, colIndex: number) => (
                    <td
                      key={colIndex}
                      className={
                        colIndex === columns.length - 1 ? 'last-index' : ''
                      }
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default PaginatedTable;
