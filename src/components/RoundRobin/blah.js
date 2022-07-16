const entries = {
    "entries": {
        "items": []
    }
};

function playerSeed(member, seed) {
    return {
        id: seed,
        memberId: member.id,
        name: member.name,
        ratingInfo: {
            rating: Number(member.ecfRapid)
        }
    }
}

const preparedSeeding =  (entryInfo) => {

    let seedSetter = 0;

    return entryInfo
    .sort((a, b) => Number(b.member.ecfRapid) - Number(a.member.ecfRapid))
    .map(entry => {
        if(seedSetter === 6) seedSetter = 0;
        seedSetter++; 
        return playerSeed(entry.member, seedSetter);
    })
}


export const logData = () => preparedSeeding(entries.entries.items);
