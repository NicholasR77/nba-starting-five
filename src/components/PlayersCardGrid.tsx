import { Fragment, useState } from 'react';

// MUI
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

// Types
import { Player } from '../types/Player';

export default function PlayersCardGrid(props: { currentFive: Player[], setCurrentFive: any }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentPlayer, setCurrentPlayer] = useState<null | string>(null);
    const open = Boolean(anchorEl);

    // Set the current player to id of the player from the player card
    // Set the anchor as the player card
    const handleClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
        setCurrentPlayer(id);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Remove the player from the current five
    // Reset current player
    // Close the remove dropdown
    const handleRemove = () => {
        const filteredFive = props.currentFive.filter((player: Player) => player.id !== currentPlayer);
        props.setCurrentFive(filteredFive);
        setCurrentPlayer(null);
        handleClose();
    };

    const currentFiveCards = props.currentFive.map((player) => {
        let { id, firstName, lastName, age, team, position, value } = player;

        return (
            <Fragment key={id}>
                <Grid item xs={4}>
                    <Card>
                        <CardHeader 
                            action={
                                <IconButton 
                                    aria-label="settings" 
                                    onClick={(e) => handleClick(e, id)}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                            }
                            title={`${value} points`}
                        />
                        <CardContent>
                            <h2>{position} | {firstName} {lastName}</h2>
                            <p>Team: {team}</p>
                            <p>Age: {age}</p>
                        </CardContent>
                    </Card>
                </Grid>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleRemove}>
                        <RemoveCircleOutlineIcon style={{ 'paddingRight': '5px' }}/> 
                        Remove
                    </MenuItem>
                </Menu>
            </Fragment>
        )
    });

    return (
        <Fragment>
            <Grid container spacing={2} justifyContent='center'>
                {currentFiveCards}
            </Grid>
        </Fragment>
       
    )
}