import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import useAxios from '../hooks/useAxios';

import ExampleStartingFive from '../partials/StartingFive.json';

const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First name', width: 200 },
    { field: 'lastName', headerName: 'Last name', width: 200 },
    { field: 'team', headerName: 'Team', width: 130 },
    { field: 'position', headerName: 'Position', width: 130 },
    { field: 'age', headerName: 'Age', type: 'number', width: 130 },
];

export default function AllPlayersTable() {
    const [ players, setPlayers ] = useState([]);

    const { response, loading, error } = useAxios({
        method: 'get',
        url: '/players',
        baseURL: 'http://127.0.0.1:3001'
    });

    useEffect(() => {
        if (response !== null) {
            setPlayers(response);
        }
    }, [response]);

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            { loading && <p>Loading...</p> }
            { !loading &&
                <DataGrid
                    rows={players}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    disableSelectionOnClick
                />
            }
      </Box>
    )
}