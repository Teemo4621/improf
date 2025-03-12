import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import Cookies from "js-cookie"

import AxiosClient from "../helpers/AxiosClient"

export default function Callback() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        const code = searchParams.get("code")

        const fetchGetUserinfo = async () => {
            try {
                const { data } = await AxiosClient.post("/auth/discord", { code: code })
                Cookies.set("auth.token", data.data.access_token, { path: "/" })
                Cookies.set("auth.refresh_token", data.data.refresh_token, { path: "/" })
                navigate("/create")
            } catch (e) {
                window.alert(e)
                navigate("/login")
            }
        }

        fetchGetUserinfo()
    }, [])

    return (
        <div>callback</div>
    )
}