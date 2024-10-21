import React from 'react';
import { Table } from 'react-bootstrap';
import './styles.scss';

type TableProps = {
  data: any[];
  columns: any[];
};

const DataTable: React.FC<TableProps> = ({ data, columns }) => {
  return (
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
          {data.map((item, index) => (
            <tr key={index}>
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
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;
