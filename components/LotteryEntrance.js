// have a function to enter the lottery
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress =
        chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: [],
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: [],
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: [],
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: [],
    })

    async function updateUI() {
        const o_entranceFeeFromCall = await getEntranceFee()
        if (o_entranceFeeFromCall) {
            const entranceFeeFromCall = o_entranceFeeFromCall.toString()
            setEntranceFee(entranceFeeFromCall)
        }

        const o_numPlayersFromCall = await getNumberOfPlayers()
        if (o_numPlayersFromCall) {
            const numberPlayersFromCall = o_numPlayersFromCall.toString()
            setNumPlayers(numberPlayersFromCall)
        }

        const o_recentWinnerFromCall = await getRecentWinner()
        if (o_recentWinnerFromCall) {
            const recentWinnerFromCall = o_recentWinnerFromCall
            setRecentWinner(recentWinnerFromCall)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            // try to read the raffle
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "transaction completed",
            title: "tx Notification",
            position: "topR",
            icon: "Bell",
        })
    }
    return (
        <div>
            {raffleAddress ? (
                <div className="p-5">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter raffle</div>
                        )}
                    </button>
                    <div>
                        Entrance fee:
                        {ethers.utils.formatUnits(
                            entranceFee,
                            "ether"
                        )} ETH <br></br> Number of players: {numPlayers}{" "}
                        <br></br>
                        Recent winner: {recentWinner}
                    </div>
                </div>
            ) : (
                <div>No raffle address detected</div>
            )}
        </div>
    )
}
