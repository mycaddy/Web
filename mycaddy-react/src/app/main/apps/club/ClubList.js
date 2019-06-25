import React, { useEffect, useState } from 'react';
import { List, Typography } from '@material-ui/core';
import { FuseUtils, FuseAnimate, FuseAnimateGroup } from '@fuse';
import { useSelector } from 'react-redux';
import _ from '@lodash';
import ClubListItem from './ClubListItem';

function ClubList(props) {
  const clubs = useSelector(({ clubApp }) => clubApp.clubs.entities);
  const searchText = useSelector(({ clubApp }) => clubApp.clubs.searchText);
  const orderBy = useSelector(({ clubApp }) => clubApp.clubs.orderBy);
  const orderDescending = useSelector(({ clubApp }) => clubApp.clubs.orderDescending);
  const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    function getFilteredArray(entities, searchText) {
      const arr = Object.keys(entities).map((id) => entities[id]);
      if (searchText.length === 0) {
        return arr;
      }
      return FuseUtils.filterArrayByString(arr, searchText);
    }

    if (clubs) {
      setFilteredData(_.orderBy(getFilteredArray(clubs, searchText), [orderBy], [orderDescending ? 'desc' : 'asc']));
    }
  }, [clubs, searchText, orderBy, orderDescending]);

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <FuseAnimate delay={100}>
        <div className="flex flex-1 items-center justify-center h-full">
          <Typography color="textSecondary" variant="h5">
            There are no clubs!
                    </Typography>
        </div>
      </FuseAnimate>
    );
  }

  return (
    <List className="p-0">
      <FuseAnimateGroup
        enter={{
          animation: "transition.slideUpBigIn"
        }}
      >
        {
          filteredData.map((club) => (
            <ClubListItem club={club} key={club.id} />
          )
          )
        }
      </FuseAnimateGroup>
    </List>
  );
}

export default ClubList;
