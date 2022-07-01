interface PlayersResponseData {
    id: string;
    type: string;
    attributes: {
        firstName: string;
        lastName: string;
        position: string;
        team: string;
        age: number;
    }
}

export type { PlayersResponseData };