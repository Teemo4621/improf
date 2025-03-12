import CardProfile from '../components/CardProfile'
import { DatePicker, DatePickerProps, Form, Input, Radio, RadioChangeEvent } from 'antd'
import { CheckboxGroupProps } from 'antd/es/checkbox';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { FaFacebookF, FaTwitch, FaTwitter, FaYoutube } from 'react-icons/fa';
import Footer from '../components/Footer';
import { formData } from '../types/formData';
import AxiosClient from '../helpers/AxiosClient';
import { useUserContext } from '../contexts/UserContext';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

import dayjs from 'dayjs';

const options: CheckboxGroupProps<string>['options'] = [
    { label: 'ชาย', value: 'male' },
    { label: 'หญิง', value: 'female' },
    { label: 'ไม่ระบุ', value: 'other' },
];

const themColorOptions: CheckboxGroupProps<string>['options'] = [
    { label: 'เขียว', value: 'green' },
    { label: 'ฟ้า', value: 'blue' },
    { label: 'เเดง', value: 'red' },
    { label: 'ส้ม', value: 'orange' },
    { label: 'ม่วง', value: 'purple' },
    { label: 'ขาว', value: 'gray' },
];

function Edit() {
    const navigator = useNavigate()
    const messageApi = useNotification()

    const { user } = useUserContext();

    const [formData, setFormData] = useState<formData>(
        {
            user_id: Number(user?.id),
            name: '',
            status: '',
            birthdate: null,
            gender: 'other',
            about: '',
            profile_image_url: null,
            banner_image_url: null,
            theme: 'green',

            facebook_url: '',
            twitter_url: '',
            youtube_url: '',
            twitch_url: ''
        }
    )

    useEffect(() => {
        if (user?.username) {
            const handleFetchProfile = async () => {
                const res = await AxiosClient.get(`/profiles/${user.username}`)

                if (res.data || res.status == 200) {
                    setFormData({ ...res.data.data.profile, username: user.username })
                }
            }
            handleFetchProfile();
        }
    }, [user]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDatePickerChange: DatePickerProps['onChange'] = (_, dateStr) => {
        console.log('onChange:', dateStr);
        setFormData({ ...formData, birthdate: dateStr });
    };

    const handleInputRadioChangeGender = (e: RadioChangeEvent) => {
        const value = e.target.value;
        setFormData({ ...formData, gender: value });
    };

    const handleInputRadioChangeTheme = (e: RadioChangeEvent) => {
        const value = e.target.value;
        setFormData({ ...formData, theme: value });
    };

    const [previewProfileImageUrl, setPreviewProfileImageUrl] = useState<string | null>(null);
    const [previewBannerImageUrl, setPreviewBannerImageUrl] = useState<string | null>(null);

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setImage: React.Dispatch<React.SetStateAction<string | null>>,
        type: 'profile' | 'banner'
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setFormData((prev) => ({
                    ...prev,
                    [type === "profile" ? "profile_image_url" : "banner_image_url"]: file,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreatedProfile = async () => {
        messageApi.loading("Updating profile...").then(async () => {
            const formDataToSend = new FormData();

            formDataToSend.append("user_id", String(formData.user_id));
            if (formData.name) formDataToSend.append("name", formData.name);
            if (formData.status) formDataToSend.append("status", formData.status);
            if (formData.birthdate) formDataToSend.append("birthdate", `${formData.birthdate}`);
            if (formData.gender) formDataToSend.append("gender", formData.gender);
            if (formData.about) formDataToSend.append("about", formData.about);
            formDataToSend.append("facebook_url", formData.facebook_url || "");
            formDataToSend.append("twitter_url", formData.twitter_url || "");
            formDataToSend.append("youtube_url", formData.youtube_url || "");
            formDataToSend.append("twitch_url", formData.twitch_url || "");

            if (formData.profile_image_url instanceof File) {
                formDataToSend.append("profile_image", formData.profile_image_url, "profile.jpg");
            }
            if (formData.banner_image_url instanceof File) {
                formDataToSend.append("banner_image", formData.banner_image_url, "banner.jpg");
            }

            try {
                const res = await AxiosClient.post(`/profiles/update`, formDataToSend, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                if (res.data.success) {
                    messageApi.success("Update profile successfully!");
                    navigator(`/profile/@${user?.username}`)
                }
            } catch (error) {
                console.log(error)
                messageApi.error("Failed to update profile!");
            }
        })
    };

    return (
        <>
            <div className='grid grid-cols-1 lg:grid-cols-2 w-ful'>
                <div className="p-4 md:p-18 ">
                    <div className="mb-10">
                        <h1 className="text-4xl font-bold text-green-400 flex gap-2">สร้างโปรไฟล์ใหม่</h1>
                        <p className="text-gray-500">กรอกแบบฟอร์มด้านล่างนี้เพื่อสร้างโปรไฟล์ใหม่ ✨</p>
                    </div>
                    <Form>
                        <label className='text-xl text-white font-bold'>• ข้อมูลบัญชี</label>
                        <Form.Item style={{ marginBottom: "3.5rem", marginTop: "1rem" }}>
                            <div className="relative w-full h-[9rem]">
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png, image/jpg, image/gif"
                                    onChange={(e) => handleImageChange(e, setPreviewBannerImageUrl, "banner")}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {previewBannerImageUrl ? (
                                    <img src={previewBannerImageUrl} alt="Banner" className="w-full h-full object-cover p-1 border-2 border-dashed border-green-400 rounded-lg" />
                                ) : formData.banner_image_url ? (
                                    <img src={`${(import.meta.env.VITE_API_URL as string).replace("/api/v1", "")}${formData.banner_image_url as string}`} alt="Banner" className="w-full h-full object-cover p-1 border-2 border-dashed border-green-400 rounded-lg" />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center border-2 border-dashed border-green-400 rounded-lg`}>
                                        <span className="text-white text-xl">อัปโหลดแบนเนอร์</span>
                                    </div>
                                )}
                                <div className="absolute bottom-[-60px] left-[5rem] transform -translate-x-1/2 w-30 h-30">
                                    <input
                                        type="file"
                                        accept="image/jpeg, image/png, image/jpg, image/gif"
                                        onChange={(e) => handleImageChange(e, setPreviewProfileImageUrl, "profile")}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    {previewProfileImageUrl ? (
                                        <img src={previewProfileImageUrl} alt="Profile" className="w-full h-full object-cover bg-[#06080E] p-1 border-2 border-dashed border-green-400 rounded-full" />
                                    ) : formData.profile_image_url ? (
                                        <img src={`${(import.meta.env.VITE_API_URL as string).replace("/api/v1", "")}${formData.profile_image_url as string}`} alt="Banner" className="w-full h-full object-cover bg-[#06080E] p-1 border-2 border-dashed border-green-400 rounded-full" />
                                    ) : (
                                        <div className="w-full h-full flex flex-wrap items-center justify-center bg-[#06080E] border-2 border-dashed border-green-400 rounded-full">
                                            <span className="text-white">อัปโหลดโปรไฟล์</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Form.Item>
                        <Form.Item style={{ marginBottom: "10px" }}>
                            <label className='text-white text-lg'>ชื่อ</label>
                            <Input name="name" onChange={handleInputChange} value={formData.name} style={{ backgroundColor: "transparent", color: "white", padding: "8px", fontSize: "16px", borderRadius: "10px" }} className="create-input" type="text" placeholder="zemon" />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: "20px" }}>
                            <label className='text-white text-lg'>สถานะ</label>
                            <Input name="status" onChange={handleInputChange} value={formData.status} style={{ backgroundColor: "transparent", color: "white", padding: "8px", fontSize: "16px", borderRadius: "10px" }} className="create-input" type="text" placeholder="อยากนอนอ้วน" />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: "20px" }}>
                            <label className='text-white text-lg mr-2'>เพศ</label>
                            <Radio.Group name="gender" onChange={handleInputRadioChangeGender} value={formData.gender} style={{ backgroundColor: "transparent", color: "white" }} buttonStyle="solid" className="create-radio-group" options={options} optionType="button" />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: "20px" }}>
                            <label className='text-white text-lg'>เกี่ยวกับฉัน</label>
                            <TextArea name="about" onChange={handleInputChange} value={formData.about} style={{ backgroundColor: "transparent", color: "white" }} className="create-input" size="large" placeholder="ฉันอยากบินได้" />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: "3rem" }}>
                            <label className='text-white text-lg mr-2'>วัน/เดือน/ปีเกิด</label>
                            <DatePicker name="birthdate" value={formData.birthdate ? dayjs(formData.birthdate as string) : null} onChange={handleDatePickerChange} style={{ backgroundColor: "transparent", color: "white" }} className="create-input" type="date" placeholder="เป็นประชากรบนโลกตั้งแต่" needConfirm />
                        </Form.Item>
                        <label className='text-xl text-white font-bold'>• ข้อมูลโซเชียล</label>
                        <Form.Item style={{ marginBottom: "20px", marginTop: "1rem" }}>
                            <label className='text-white text-lg '>Facebook</label>
                            <Input name="facebook_url" onChange={handleInputChange} value={formData.facebook_url ?? ""} prefix={<FaFacebookF />} style={{ backgroundColor: "transparent", color: "white", padding: "8px", fontSize: "16px", borderRadius: "10px" }} className="create-input" type="text" placeholder="www.facebook.com/*****" />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: "20px" }}>
                            <label className='text-white text-lg'>YouTube</label>
                            <Input name="youtube_url" onChange={handleInputChange} value={formData.youtube_url ?? ""} prefix={<FaYoutube />} style={{ backgroundColor: "transparent", color: "white", padding: "8px", fontSize: "16px", borderRadius: "10px" }} className="create-input" type="text" placeholder="www.youtube.com/*****" />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: "20px" }}>
                            <label className='text-white text-lg'>Twitter</label>
                            <Input name="twitter_url" onChange={handleInputChange} value={formData.twitter_url ?? ""} prefix={<FaTwitter />} style={{ backgroundColor: "transparent", color: "white", padding: "8px", fontSize: "16px", borderRadius: "10px" }} className="create-input" type="text" placeholder="www.x.com/*****" />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: "3rem" }}>
                            <label className='text-white text-lg'>Twitch</label>
                            <Input name="twitch_url" onChange={handleInputChange} value={formData.twitch_url ?? ""} prefix={<FaTwitch />} style={{ backgroundColor: "transparent", color: "white", padding: "8px", fontSize: "16px", borderRadius: "10px" }} className="create-input" type="text" placeholder="www.twitch.tv/*****" />
                        </Form.Item>
                        <label className='text-xl text-white font-bold'>• รูปเเบบของโปรไฟล์</label>
                        <Form.Item>
                            <label className='text-white text-lg mr-2'>สีของโปรไฟล์</label>
                            <Radio.Group name="theme" onChange={handleInputRadioChangeTheme} value={formData.theme} style={{ backgroundColor: "transparent", color: "white" }} buttonStyle="solid" className="create-radio-group" options={themColorOptions} optionType="button" />
                        </Form.Item>
                        <Form.Item style={{ marginBottom: "10px", marginTop: "20px" }}>
                            <button onClick={handleCreatedProfile} className="w-full bg-green-400 hover:opacity-85 duration-150 text-white cursor-pointer font-bold py-2 px-4 rounded">
                                สร้างเลย
                            </button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="p-4 md:p-18">
                    <div className="mb-20">
                        <h1 className="text-4xl font-bold text-green-400 flex gap-2">โปรไฟล์ตัวอย่าง</h1>
                        <p className="text-gray-500">ใช่เพื่อเเสดงตัวอย่างโปรไฟล์จากข้อมูลที่ใส่ 🚀</p>
                    </div>
                    <CardProfile formData={formData} />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Edit