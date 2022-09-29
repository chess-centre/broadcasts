function swissMeta({ open, major, intermediate, minor }) {

    return {
        "name": "Ilkley Chess Festival",
        "eventId": "b8c5d9e4-5b8c-47b6-ab42-b8239931c480",
        "eventName": "Ilkley Chess Festival",
        "date": "2022-09-16",
        "settings": {
            "enableToggles": false,
            "type": "Swiss",
            "currentRound": 1,
            "showRoundTimeForRound": 1,
            "totalRounds": 5,
            "roundLive": false,
            "showAll": false,
            "showOpponentPairing": false,
            "showPreviousRound": false,
            "nextRoundTime": {
                "1": "07:00pm",
                "2": "09:00am",
                "3": "02:15pm",
                "4": "09:00am",
                "5": "02:15pm"
            },
            "prizeGiving": "06:30pm"
        },
        "players": [
            {
                "section": "one",
                "title": "Open",
                "icon": "fad fa-chess-king",
                "entries": open.entries
            },
            {
                "section": "two",
                "title": "Major",
                "icon": "fad fa-chess-queen",
                "entries": major.entries
            },
            {
                "section": "three",
                "title": "Intermediate",
                "icon": "fad fa-chess-bishop",
                "entries": intermediate.entries
            },
            {
                "section": "four",
                "title": "minor",
                "icon": "fad fa-chess-knight",
                "entries": minor.entries
            }
        ],
        "pairings": [
            {
                "section": "one",
                "name": "open",
                "pairings": [
                    {
                        "round": 1,
                        "pairings": open.pairings[0]
                    },
                    {
                        "round": 2,
                        "pairings": open.pairings[1]
                    },
                    {
                        "round": 3,
                        "pairings": open.pairings[2]
                    },
                    {
                        "round": 4,
                        "pairings": open.pairings[3]
                    },
                    {
                        "round": 5,
                        "pairings": open.pairings[4]
                    }]
            },
            {
                "section": "two",
                "name": "major",
                "pairings": [
                    {
                        "round": 1,
                        "pairings": major.pairings[0]
                    },
                    {
                        "round": 2,
                        "pairings": major.pairings[1]
                    },
                    {
                        "round": 3,
                        "pairings": major.pairings[2]
                    },
                    {
                        "round": 4,
                        "pairings": major.pairings[3]
                    },
                    {
                        "round": 5,
                        "pairings": major.pairings[4]
                    }]
            },
            {
                "section": "three",
                "name": "intermediate",
                "pairings": [
                    {
                        "round": 1,
                        "pairings": intermediate.pairings[0]
                    },
                    {
                        "round": 2,
                        "pairings": intermediate.pairings[1]
                    },
                    {
                        "round": 3,
                        "pairings": intermediate.pairings[2]
                    },
                    {
                        "round": 4,
                        "pairings": intermediate.pairings[3]
                    },
                    {
                        "round": 5,
                        "pairings": intermediate.pairings[4]
                    }]
            },
            {
                "section": "four",
                "name": "minor",
                "pairings": [
                    {
                        "round": 1,
                        "pairings": minor.pairings[0]
                    },
                    {
                        "round": 2,
                        "pairings": minor.pairings[1]
                    },
                    {
                        "round": 3,
                        "pairings": minor.pairings[2]
                    },
                    {
                        "round": 4,
                        "pairings": minor.pairings[3]
                    },
                    {
                        "round": 5,
                        "pairings": minor.pairings[4]
                    }]
            }
        ],
        "results": [
            {
                "section": "one",
                "scores": [
                    {
                        "round": 1,
                        "pairResults": open.scores[0]
                    },
                    {
                        "round": 2,
                        "pairResults": open.scores[1]
                    },
                    {
                        "round": 3,
                        "pairResults": open.scores[2]
                    },
                    {
                        "round": 4,
                        "pairResults": open.scores[3]
                    },
                    {
                        "round": 5,
                        "pairResults": open.scores[4]
                    }
                ]
            },
            {
                "section": "two",
                "scores": [
                    {
                        "round": 1,
                        "pairResults": major.scores[0]
                    },
                    {
                        "round": 2,
                        "pairResults": major.scores[1]
                    },
                    {
                        "round": 3,
                        "pairResults": major.scores[2]
                    },
                    {
                        "round": 4,
                        "pairResults": major.scores[3]
                    },
                    {
                        "round": 5,
                        "pairResults": major.scores[4]
                    }
                ]
            },
            {
                "section": "three",
                "scores": [
                    {
                        "round": 1,
                        "pairResults": intermediate.scores[0]
                    },
                    {
                        "round": 2,
                        "pairResults": intermediate.scores[1]
                    },
                    {
                        "round": 3,
                        "pairResults": intermediate.scores[2]
                    },
                    {
                        "round": 4,
                        "pairResults": intermediate.scores[3]
                    },
                    {
                        "round": 5,
                        "pairResults": intermediate.scores[4]
                    }
                ]
            },
            {
                "section": "four",
                "scores": [
                    {
                        "round": 1,
                        "pairResults": minor.scores[0]
                    },
                    {
                        "round": 2,
                        "pairResults": minor.scores[1]
                    },
                    {
                        "round": 3,
                        "pairResults": minor.scores[2]
                    },
                    {
                        "round": 4,
                        "pairResults": minor.scores[3]
                    },
                    {
                        "round": 5,
                        "pairResults": minor.scores[4]
                    }
                ]
            }
        ]
    }
}