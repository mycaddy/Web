import React, { useEffect, useState } from 'react';
import { Avatar, Checkbox, Icon, IconButton, Typography } from '@material-ui/core';
import { FuseUtils, FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import ReactTable from "react-table";
import { useQuery } from "react-apollo-hooks";
import countries from '../../../../../@fake-db/db/countries.json'
// import * as Actions from './store/actions';
import CountryMultiSelectMenu from './CountryMultiSelectMenu';

const testData = [
  {
    'id': '5725a680b3249760ea21de52',
    'name': 'Abbott',
    'lastName': 'Keitch',
    'avatar': 'assets/images/avatars/Abbott.jpg',
    'nickname': 'Royalguard',
    'company': 'Saois',
    'jobTitle': 'Digital Archivist',
    'email': 'abbott@withinpixels.com',
    'phone': '+1-202-555-0175',
    'address': '933 8th Street Stamford, CT 06902',
    'birthday': undefined,
    'notes': ''
  },
  {
    'id': '5725a680606588342058356d',
    'name': 'Arnold',
    'lastName': 'Matlock',
    'avatar': 'assets/images/avatars/Arnold.jpg',
    'nickname': 'Wanderer',
    'company': 'Laotcone',
    'jobTitle': 'Graphic Artist',
    'email': 'arnold@withinpixels.com',
    'phone': '+1-202-555-0141',
    'address': '906 Valley Road Michigan City, IN 46360',
    'birthday': undefined,
    'notes': ''
  },
  {
    'id': '5725a68009e20d0a9e9acf2a',
    'name': 'Barrera',
    'lastName': 'Bradbury',
    'avatar': 'assets/images/avatars/Barrera.jpg',
    'nickname': 'Jackal',
    'company': 'Unizim',
    'jobTitle': 'Graphic Designer',
    'email': 'barrera@withinpixels.com',
    'phone': '+1-202-555-0196',
    'address': '183 River Street Passaic, NJ 07055',
    'birthday': undefined,
    'notes': ''
  },
]

const country_data = countries.map((country,index) => ({
  id: index,
  id_number: index,
  iso_numeric: country.ISO3166_1_numeric,
  iso_alpha_2: country.ISO3166_1_Alpha_2,
  iso_alpha_3: country.ISO3166_1_Alpha_3,
  name_en: country.display_name,
  name_kr: '',
  dial_number: country.Dial 
}))




function CountryList(props) {
  
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    setFilteredData(country_data)
  }, [])

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
            Header: () => (
              (
                <CountryMultiSelectMenu />
              )
            ),
            accessor: "name_en",
            Cell: row => (
              <Avatar className="mr-8" alt={row.original.name} src={row.value} />
            ),
            className: "justify-center",
            width: 64,
            sortable: false
          },
          {
            Header: "Name",
            accessor: "name_en",
            filterable: true,
            className: "font-bold"
          },
          {
            Header: "ISO3166_1_numeric",
            accessor: "iso_numeric",
            filterable: true,
            className: "font-bold"
          },
          {
            Header: "ISO3166_1_Alpha_2",
            accessor: "iso_alpha_2",
            filterable: true
          },
          {
            Header: "ISO3166_1_Alpha_3",
            accessor: "iso_alpha_3",
            filterable: true
          },
          {
            Header: "DIAL",
            accessor: "dial_number",
            filterable: true
          },
          {
            Header: "",
            width: 128,
            Cell: row => (
              <div className="flex items-center">
                <IconButton
                  onClick={(ev) => {
                    ev.stopPropagation();
                    // dispatch(Actions.toggleStarredContact(row.original.id))
                  }}
                >
                  (<Icon>star_border</Icon>)
                </IconButton>
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
