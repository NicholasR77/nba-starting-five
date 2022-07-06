import { useEffect, useState } from "react";

import { Player } from '../types/Player';

const useCompositionSerializer = (players: Player[]) => {
    const [ playerIds, setPlayerIds ] = useState<string[]>([]);
    
    useEffect(() => {
        let tempPlayerIds: any[] = [];

        players.forEach((player) => {
            tempPlayerIds.push(player.id);
        });

        setPlayerIds(tempPlayerIds);

    }, [players]);

    // custom hook returns value
    return { playerIds };
};

export default useCompositionSerializer;