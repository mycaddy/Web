import React from 'react';
import {Icon, IconButton, MenuItem, FormControl, Select} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import * as Actions from './store/actions';

function ClubToolbar(props)
{
    const dispatch = useDispatch();
    const orderBy = useSelector(({clubApp}) => clubApp.clubs.orderBy);
    const orderDescending = useSelector(({clubApp}) => clubApp.clubs.orderDescending);

    function handleOrderChange(ev)
    {
        dispatch(Actions.changeOrder(ev.target.value));
    }

    return (
        <div className="flex justify-between w-full">
            <div className="flex"/>
            <div className="flex items-center">
                <FormControl className="">
                    <Select
                        value={orderBy}
                        onChange={handleOrderChange}
                        displayEmpty
                        name="filter"
                        className=""
                    >
                        <MenuItem value="">
                            <em>Order by</em>
                        </MenuItem>
                        <MenuItem value="startDate">Start Date</MenuItem>
                        <MenuItem value="dueDate">Due Date</MenuItem>
                        <MenuItem value="title">Title</MenuItem>
                    </Select>
                </FormControl>
                <IconButton onClick={ev => dispatch(Actions.toggleOrderDescending())}>
                    <Icon style={{transform: orderDescending ? 'scaleY(-1)' : 'scaleY(1)'}}>
                        sort
                    </Icon>
                </IconButton>
            </div>
        </div>
    );
}

export default ClubToolbar;
