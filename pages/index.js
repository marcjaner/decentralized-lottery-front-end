import Head from "next/head"
import Image from "next/image"
import styles from "@/styles/Home.module.css"
// import HeaderManual from "../components/HeaderManual.jsx"
import Header from "../components/Header.js"
import LotteryEntrance from "../components/LotteryEntrance.js"

export default function Home() {
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Smart Contract Lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />

            <LotteryEntrance />
        </>
    )
}
