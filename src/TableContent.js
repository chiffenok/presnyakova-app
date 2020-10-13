import React, {Fragment} from 'react';
import { Table } from 'presnyakova-lib';

const TableContent = props => {
  const { oddsData, isLoading, error } = props;
  const headerData = [
    {
      title: 'Tier',
    },
    {
      title: 'Match',
    },
    {
      title: 'Winners',
    },
    {
      title: 'Amount',
    },
  ];

  if (error) {
    return <p>{error.message}</p>;
  }

  if (isLoading) {
    return <p>Loading ...</p>;
  }
  
  if (oddsData.length > 0) {
    return (
        <Fragment>
            <p>Results for chosen date:</p>
            <Table data={oddsData} dataThead={headerData} />
        </Fragment>
    ) 
  }

  return <p>Choose the date first.</p>
};

export default TableContent;
