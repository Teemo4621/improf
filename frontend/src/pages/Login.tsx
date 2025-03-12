import { Button } from 'antd';
import { BsDiscord } from 'react-icons/bs';
import AxiosClient from '../helpers/AxiosClient';

export default function Login() {

  const fetchRedirectSignupDiscord = async () => {
    console.log("test")
    const { data } = await AxiosClient.post("/auth/discord")
    window.location.href = data.data.url;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-white font-bold text-2xl mb-4">
        เข้าสู่ระบบก่อนเข้าใช้งาน
      </div>
      <Button size="large" className="duration-150 hover:scale-105" type="primary" onClick={fetchRedirectSignupDiscord}>
        <BsDiscord className="text-2xl" />
        เข้าสู่ระบบด้วย Discord
      </Button>
    </div>
  );
}
