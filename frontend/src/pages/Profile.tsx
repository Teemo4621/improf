import { FaRegEdit } from 'react-icons/fa'
import CardProfile from '../components/CardProfile'
import ProfileAlert from '../components/ProfileAlert'
import Footer from '../components/Footer'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AxiosClient from '../helpers/AxiosClient'
import { formData } from '../types/formData'
import { useUserContext } from '../contexts/UserContext'
import NotFound from './NotFound'
import MetaTags from '../components/MetaTags'

function Profile() {
    const navigator = useNavigate()

    const { username } = useParams()
    const [profile, setProfile] = useState<formData | null>(null) // Use null to indicate no profile
    const [profileNotFound, setProfileNotFound] = useState(false) // State to track if profile is not found
    const { user } = useUserContext()

    const usernameWithoutAt = username?.startsWith('@') ? username?.slice(1) : username;

    useEffect(() => {
        const handleFetchProfile = async () => {
            try {
                const res = await AxiosClient.get(`/profiles/${usernameWithoutAt}`)

                if (res.data && res.status === 200) {
                    setProfile({ ...res.data.data.profile, username: usernameWithoutAt })
                    setProfileNotFound(false)
                } else {
                    setProfileNotFound(true)
                }
            } catch (err) {
                setProfileNotFound(true)
            }
        }

        handleFetchProfile()
    }, [usernameWithoutAt])

    return (
        <>
            <MetaTags
                title={`${username}'s Profile | Improf`}
                description={`Check out ${username}'s dynamic profile on Improf!`}
                image={profile?.banner_image_url as string}
                name={username as string}
            />
            {user?.profile_created ? "" : <ProfileAlert />}
            <div className='container mx-auto'>
                {user?.username === usernameWithoutAt ? (
                    <div
                        className={`cursor-pointer duration-200 hover:opacity-85 hover:scale-105 flex justify-end mr-5 sm:mt-0 sm:mr-0 sm:absolute right-5 text-2xl text-white ${!user?.profile_created ? "top-15 mt-15" : "top-5 mt-5"}`}
                        onClick={() => { navigator("/edit") }}
                    >
                        <FaRegEdit />
                    </div>
                ) : ""}
                <div className='flex items-center justify-center min-h-screen'>
                    <div className='w-5/5 m-4 sm:m-0 md:w-4/5 lg:w-3/5 xl:w-3/6 2xl:w-2/5'>
                        {profileNotFound ? (
                            <NotFound />
                        ) : profile ? (
                            <CardProfile formData={profile} />
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Profile
