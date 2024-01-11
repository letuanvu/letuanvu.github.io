const root = ReactDOM.createRoot(document.getElementById('root'));

const PlayerNumberDefine = () => {
    const [playerNum, setPlayerNum] = React.useState(localStorage.getItem('playerNum') || 5);

    const setStore = () => {
        localStorage.setItem('playerNum', playerNum);
        if (localStorage.getItem('playerNum') !== null) {
            localStorage.setItem('step', 1);
            root.render(<PlayerNameDefine/>);
        }
    }

    const setState = (e) => {
        setPlayerNum(e.target.value);
    }

    return (
        <div className="sm:col-span-2">
            <label className="block text-sm font-semibold leading-6 text-black">Player Number</label>
            <div class="mt-2.5">
                <input type="number" onChange={setState} value={playerNum}
                       className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset shadow-blue-500 ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"/>
            </div>

            <div>
                <button type="button" onClick={setStore}
                        className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 mt-5">Next
                </button>
            </div>
        </div>
    );
}

const InputName = ({label, id, listPlayer, setListPlayer} = props) => {
    const [playerName, setPlayerName] = React.useState("");

    const handleChange = (e) => {
        setPlayerName(e.target.value);
    }

    const handleBlue = () => {
        listPlayer[id] = playerName;
        setListPlayer(listPlayer);
    }

    return (
        <div className="mt-2.5">
            <label className="mb-2.5 block text-sm font-semibold leading-6 text-black">{label}'s name</label>
            <input type="text" onChange={handleChange} onBlur={handleBlue} value={playerName}
                   className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset shadow-blue-500 ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"/>
        </div>
    )
}

const PlayerNameDefine = () => {
    const [listPlayer, setListPlayer] = React.useState(localStorage.getItem('listPlayer') || {});
    const [error, setError] = React.useState("");

    const handleClick = () => {
        if (Object.values(listPlayer).length !== parseInt(localStorage.getItem('playerNum')) || Object.values(listPlayer).includes("")) {
            setError("Please fill all the field!");
        } else {
            setError("");
            localStorage.setItem('listPlayer', JSON.stringify(listPlayer));
            localStorage.setItem('step', "2");
            root.render(<Calculator/>);
        }
    }

    const generateInput = () => {
        let input = [];
        for (let i = 1; i <= localStorage.getItem('playerNum'); i++) {
            input.push(<InputName label={"Player " + i} id={"player" + i} setListPlayer={setListPlayer}
                                  listPlayer={listPlayer}/>);
        }
        return input;
    }

    return (
        <div>
            {generateInput()}
            {error !== "" && <div className="mt-2.5"><p className="text-red-500">{error}</p></div>}
            <div>
                <button type="button" onClick={handleClick}
                        className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 mt-5">Start
                </button>
            </div>
        </div>
    )
}

const InputScore = ({label, id, hashScore, setHashScore} = props) => {
    const [playerScore, setPlayerScore] = React.useState(hashScore[id] || "");
    const isWinner = React.useMemo(() => {
        return hashScore["winner"] === id;
    }, [hashScore["winner"]]);

    const handleChange = (e) => {
        setPlayerScore(parseInt(e.target.value));
    }

    const handleBlue = () => {
        let update = playerScore;
        if (playerScore < 0) {
            update = playerScore;
            setPlayerScore(playerScore);
        } else {
            update = playerScore * -1;
            setPlayerScore(playerScore * -1);
        }
        let deepCopy = JSON.parse(JSON.stringify(hashScore));
        deepCopy[id] = update;
        setHashScore(deepCopy);
    }

    React.useEffect(() => {
        if (hashScore["winner"] === id) {
            handleWinner();
        }
    }, [hashScore])

    const handleWinner = () => {
        setPlayerScore(0);
        let deepCopy = JSON.parse(JSON.stringify(hashScore));
        let sumScore = 0;
        for (const playerId in deepCopy) {
            if (playerId !== id && playerId !== "winner") {
                sumScore += parseInt(deepCopy[playerId]);
            }
        }
        sumScore = sumScore * -1;
        deepCopy["winner"] = id;
        setPlayerScore(sumScore);
        deepCopy[id] = sumScore;
        setHashScore(deepCopy);
    }

    return (
        <div className="mt-2.5">
            <label className="mb-2.5 block text-sm font-semibold leading-6 text-black">{label}</label>
            <div className="grid grid-cols-12">
                <div className="col-span-9">
                    <input type="number" onChange={handleChange} readOnly={isWinner} onBlur={handleBlue}
                           disabled={isWinner}
                           value={playerScore}
                           className="block w-11/12 rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset shadow-blue-500 ring-blue-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"/>
                </div>
                <div className="col-span-3">
                    <button type="button" onClick={handleWinner}
                            className={isWinner ? "flex w-full justify-center rounded-md px-5 mt-0.5 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-green-500 hover:bg-green-400 focus-visible:outline-green-500" : "flex w-full justify-center rounded-md px-5 mt-0.5 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 bg-gray-700"}>Winner
                    </button>
                </div>
            </div>
        </div>
    )
}

const Calculator = () => {
    const [listScore, setListScore] = React.useState(JSON.parse(localStorage.getItem('listScore')) || []);
    const [hashScore, setHashScore] = React.useState({});
    const [error, setError] = React.useState("");
    const listPlayer = JSON.parse(localStorage.getItem('listPlayer'));

    const generateInput = () => {
        let input = [];
        for (let i = 1; i <= localStorage.getItem('playerNum'); i++) {
            input.push(<InputScore label={listPlayer["player" + i] + "'s score"} id={"player" + i}
                                   setHashScore={setHashScore}
                                   hashScore={hashScore}/>);
        }
        return input;
    }

    const handleClick = () => {
        if (Object.values(hashScore).length < parseInt(localStorage.getItem('playerNum')) || Object.values(hashScore).includes("")) {
            setError("Please fill all the field!");
        } else {
            setError("");
            setListScore(listScore.concat([hashScore]));
            window.location.reload();
        }
    }

    React.useEffect(() => {
        localStorage.setItem('listScore', JSON.stringify(listScore));
    }, [listScore])

    const handleReset = () => {
        localStorage.clear();
        window.location.reload();
    }

    return (
        <div>
            <div className="mb-10">
                <button type="button" onClick={handleReset}
                        className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 mt-5">Reset to Start
                </button>
            </div>
            <table className="table-auto w-full mb-10">
                <thead>
                <tr>
                    <th className="px-4 py-2"></th>
                    {Object.values(listPlayer).map((playerName) => {
                        return (
                            <th className="px-4 py-2">{playerName}</th>
                        )
                    })}
                </tr>
                </thead>
                <tbody>
                {listScore.map((score, index) => {
                    return (
                        <tr>
                            <td className="border px-4 py-2">{index + 1}</td>
                            {Object.keys(listPlayer).map((playerId) => {
                                return (
                                    <td className="border px-4 py-2">{score[playerId]}</td>
                                )
                            })}
                        </tr>
                    )
                })}
                <tr>
                    <td className="border px-4 py-2">Total</td>
                    {Object.keys(listPlayer).map((playerId) => {
                        let sumScore = 0;
                        listScore.forEach((score) => {
                            sumScore += parseInt(score[playerId]);
                        })
                        return (
                            <td className="border px-4 py-2">{sumScore}</td>
                        )
                    })}
                </tr>
                </tbody>
            </table>

            {generateInput()}
            {error !== "" && <div className="mt-2.5"><p className="text-red-500">{error}</p></div>}
            <div>
                <button type="button" onClick={handleClick}
                        className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 mt-5">Next
                    Game
                </button>
            </div>
        </div>
    )
}

if (localStorage.getItem('playerNum') === null || localStorage.getItem('step') === null) {
    root.render(<PlayerNumberDefine/>);
} else if (localStorage.getItem('step') == "1" && localStorage.getItem('playerNum') != null) {
    root.render(<PlayerNameDefine/>);
} else if (localStorage.getItem('step') == "2" && localStorage.getItem('listPlayer') != null) {
    root.render(<Calculator/>);
} else {
    root.render(<PlayerNumberDefine/>);
}
