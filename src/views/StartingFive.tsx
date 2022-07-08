import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

// MUI
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

// Custom Hooks
import useAxios from '../hooks/useAxios';
import useCompositionSerializer from '../hooks/useCompositionSerializer';

// Components
import PlayersCardGrid from '../components/PlayersCardGrid';
import AllPlayersTable from '../components/AllPlayersTable';

// Types
import { Player } from '../types/Player';
import { ConfigParamsInterface } from '../types/useAxios';

export default function StartingFive() {
    const [ currentFive, setCurrentFive ] = useState<Player[]>([]);
    const [ totalValue, setTotalValue ] = useState<number>(0);
    const [ submitted, setSubmitted ] = useState<boolean>(false);
    const [ requestSettings, setRequestSettings ] = useState<{} | ConfigParamsInterface>({});
    const [ alert, setAlert ] = useState<null | { type: string, message: string, location: string }>(null);
    const [ open, setOpen ] = useState<boolean>(false);
    const [ author, setAuthor ] = useState<string>('');

    const maxPlayers = 5;
    const maxValue = 15;
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { response, status, loading, error } = useAxios(requestSettings);
    const { playerIds } = useCompositionSerializer(currentFive);
    const navigate = useNavigate();

    // If we submit something, make a request with the submission
    useEffect(() => {
        if (!submitted) return;

        setRequestSettings({
            method: 'post',
            url: '/compositions',
            baseURL: 'http://127.0.0.1:3001',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ composition: { player_ids: playerIds, author } }),
        })
    }, [submitted])

    // Adjusting the total point value for starting five changes
    useEffect(() => {
        if (currentFive.length) {
            let tempTotal: number = 0;

            currentFive.forEach((player) => {
                tempTotal += player.value;
            });

            setTotalValue(tempTotal);
        } else {
            setTotalValue(0);
        }
    }, [currentFive]);

    // If we recieve a response back from the server, add that response status as an alert
    // If the response is successful navigate to the compositions
    useEffect(() => {
        if (!status) return;

        if (status === 201) {
            setAlert({ type: 'success', message: `Submitted successfully`, location: 'modal' })

            setTimeout(() => {
                navigate('/compositions');
            }, 2000);
        } else {
            setAlert({ type: 'danger', message: error, location: 'modal' })
        }
    }, [response]);

    const validNumberOfPlayers = () => {
        if (currentFive.length === 5) {
            setAlert(null);
            return true;
        } else {
            setAlert({ 
                type: 'warning', 
                message: `Not enough players selected. Please select ${maxPlayers} players before submitting.`, 
                location: 'body' 
            })
            return false;
        }
    }
    
    const handleOnClickSubmitStart = () => {
        if (validNumberOfPlayers()) handleOpen();
    };

    const handleOnClickSubmitFinish = () => {
        if (author) setSubmitted(true);
    };

    return (
        <Container>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Stack direction='row' justifyContent='space-between' alignItems='center' style={{ 'width': '100%', 'paddingBottom': '20px' }}>
                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        <h2>Your Starting Five</h2>
                        <Tooltip title={`Pick 5 NBA players whole total point value is less than or equal to ${maxValue}.`} style={{ paddingLeft: '5px' }}>
                            <HelpIcon />
                        </Tooltip>
                    </Stack>
                    <Button onClick={handleOnClickSubmitStart} variant='outlined' disabled={currentFive.length !== 5}>Submit Selected Players</Button>
                </Stack>
                { alert && alert.location === 'body' && 
                    <Alert severity={alert.type as any} style={{ 'marginBottom': '20px' }}>
                        {alert.message}
                    </Alert>
                }
                { !currentFive.length && <p>No players selected...</p> }
                { currentFive.length > 0 && <PlayersCardGrid currentFive={currentFive as Player[]} setCurrentFive={setCurrentFive}/> }
            </Box>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <h3>Available Points: {maxValue - totalValue}</h3>
            </Box>
            <Box sx={{ marginTop: 8 }}>
                <Divider />
            </Box>
            <Box
                sx={{
                    marginTop: 8,
                    marginBottom: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                <AllPlayersTable 
                    currentFive={currentFive as Player[]}
                    setCurrentFive={setCurrentFive}
                    totalValue={totalValue}
                    maxPlayers={maxPlayers}
                    maxValue={maxValue}
                />
            </Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                >
                <Box 
                    sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    { alert && alert.location === 'modal' &&
                        <Alert severity={alert.type as any} style={{ 'marginBottom': '20px' }}>
                            {alert.message}
                        </Alert>
                    }
                    <p>Please enter a username to submit your composition:</p>
                    <Stack direction='row' justifyContent='center' alignItems='center'>
                        <TextField id='outlined-basic' label='Username' variant='outlined' required onChange={(e) => { setAuthor(e.target.value) }} value={author} />
                        <Button onClick={handleOnClickSubmitFinish} variant='outlined' style={{ marginLeft: '10px' }}>Submit</Button>
                    </Stack>
                </Box>
            </Modal>
        </Container>
    )
}