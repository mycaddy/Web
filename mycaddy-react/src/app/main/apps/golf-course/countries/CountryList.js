import React, { useEffect, useState } from 'react';
import { Avatar, Checkbox, Icon, IconButton, Typography } from '@material-ui/core';
import { FuseUtils, FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import ReactTable from "react-table";

// import * as Actions from './store/actions';
import CountryMultiSelectMenu from './CountryMultiSelectMenu';

import { useQuery } from "react-apollo-hooks";
import { GET_COUNTRIES } from '../../../../apollo/queries'

function CountryList(props) {
  const [filteredData, setFilteredData] = useState(null);
  const { loading, error, data } = useQuery(GET_COUNTRIES, {
    variables: { orderBy: 'name_en_ASC' }
  }) 
  
  useEffect(() => {
    if (data.countries)
    {
      setFilteredData(data.countries.data)
    }  
    
  }, [data])

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no contacts!
        </Typography>
      </div>
    );
  }

  return (
    <FuseAnimate animation="transition.slideUpIn" delay={300}>
      <ReactTable
        className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
        getTrProps={(state, rowInfo, column) => {
          return {
            className: "cursor-pointer",
            onClick: (e, handleOriginal) => {
              if (rowInfo) {
                console.log('getTrProps!')
                // dispatch(Actions.openEditContactDialog(rowInfo.original));
              }
            }
          }
        }}
        data={filteredData}
        columns={[
          {
            Header: () => (
              <Checkbox
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onChange={(event) => {
                  // event.target.checked ? dispatch(Actions.selectAllContacts()) : dispatch(Actions.deSelectAllContacts());
                }}
                //checked={selectedContactIds.length === Object.keys(contacts).length && selectedContactIds.length > 0}
                //indeterminate={selectedContactIds.length !== Object.keys(contacts).length && selectedContactIds.length > 0}
              />
            ),
            accessor: "",
            Cell: row => {
              return (<Checkbox
                onClick={(event) => {
                  event.stopPropagation();
                }}
                //checked={selectedContactIds.includes(row.value.id)}
                onChange={() => console.log('Cell row click')}
              />
              )
            },
            className: "justify-center",
            sortable: false,
            width: 64
          },
          {
            Header: "Flag",
            accessor: "name_en",
            Cell: row => {
              // str.replace(/#/gi, ""); 
              const flagSrc = `assets/images/countries/${row.value.toLowerCase().replace(/ /gi, '-')}.svg`
              return (<Avatar className="mr-8" alt={row.value} src={flagSrc} />)
            },
            className: "justify-center",
            width: 64,
            sortable: false
          },
          {
            Header: "ID",
            accessor: "id_number",
            width: 64,
          },
          {
            Header: "Name",
            accessor: "name_en",
            className: "font-bold",
            width: 200,
          },
          {
            Header: "Alpha2",
            accessor: "iso_alpha_2",
            width: 64,
          },
          {
            Header: "Alpha3",
            accessor: "iso_alpha_3",
            width: 64,
          },
          {
            Header: "DIAL",
            accessor: "dial_number",
            width: 64,
          },
          {
            Header: "Numeric",
            accessor: "iso_numeric",
            width: 64,
          },
          {
            Header: "",
            width: 128,
            Cell: row => (
              <div className="flex items-center">
                <IconButton
                  onClick={(ev) => {
                    ev.stopPropagation();
                    // dispatch(Actions.removeContact(row.original.id));
                  }}
                >
                  <Icon>delete</Icon>
                </IconButton>
              </div>
            )
          }
        ]}
        defaultPageSize={10}
        noDataText="No contacts found"
      />
    </FuseAnimate>
  );
}

export default CountryList;
