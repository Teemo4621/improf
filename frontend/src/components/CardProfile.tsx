import { Modal } from "antd";
import { useEffect, useState } from "react";
import { FaFacebookF, FaTwitch, FaTwitter, FaYoutube } from "react-icons/fa";
import { formData } from "../types/formData";
import axios from "axios";
import { useUserContext } from "../contexts/UserContext";
import { DiscordResponse } from "../types/discordStatus";
import findAppImage from "../helpers/FindAppsImageUrl";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import GetTheme from "../helpers/GetTheme";

function calculateAge(birthdate: string | string[]) {
  const birth = new Date(birthdate.toString());
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

function formatDate(birthdate: string | string[]) {
  const months = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const date = new Date(birthdate.toString());
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

const formatUrl = (url: string) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
};

function CardProfile({ formData }: { formData: formData }) {
  const [profileImageSrc, setProfileImageSrc] = useState<string | null>(null);
  const [bannerImageSrc, setBannerImageSrc] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [openType, setOpenType] = useState<
    "profile" | "banner" | "about" | null
  >(null);

  const socialLinks = [
    { key: "facebook", url: formData.facebook_url, icon: <FaFacebookF /> },
    { key: "youtube", url: formData.youtube_url, icon: <FaYoutube /> },
    { key: "twitter", url: formData.twitter_url, icon: <FaTwitter /> },
    { key: "twitch", url: formData.twitch_url, icon: <FaTwitch /> },
  ];

  const { user } = useUserContext();

  const [activities, setActivities] = useState<DiscordResponse>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!formData.user_discord_id && !user) return;

    const fetchDiscordActivities = async () => {
      try {
        const res = await axios.get<DiscordResponse>(
          `https://api.lanyard.rest/v1/users/${formData.user_discord_id || user?.discord_id}`,
        );
        setActivities(res.data);
      } catch (error) {
        console.error("Error fetching Discord activities:", error);
      }
    };

    fetchDiscordActivities();
    const interval = setInterval(fetchDiscordActivities, 10000);

    return () => clearInterval(interval);
  }, [formData.user_discord_id, user]);

  useEffect(() => {
    setLoading(true);
    let profileUrl: string | null = null;
    let bannerUrl: string | null = null;

    if (formData.profile_image_url instanceof File) {
      profileUrl = URL.createObjectURL(formData.profile_image_url);
      setProfileImageSrc(profileUrl);
    } else {
      setProfileImageSrc(formData.profile_image_url);
    }

    if (formData.banner_image_url instanceof File) {
      bannerUrl = URL.createObjectURL(formData.banner_image_url);
      setBannerImageSrc(bannerUrl);
    } else {
      setBannerImageSrc(formData.banner_image_url);
    }
    setLoading(false);

    return () => {
      if (profileUrl) URL.revokeObjectURL(profileUrl);
      if (bannerUrl) URL.revokeObjectURL(bannerUrl);
    };
  }, [formData.profile_image_url, formData.banner_image_url]);

  const handleOpenModal = (type: "profile" | "banner" | "about") => {
    setOpenType(type);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setOpenType(null);
  };

  return loading ? (
    <></>
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`border-2 border-dashed ${GetTheme(formData.theme)} rounded-lg text-card-foreground w-full border-border/30 shadow-sm`}
    >
      <div className="relative w-full h-[9rem] p-2">
        {bannerImageSrc ? (
          <img
            src={
              bannerImageSrc.startsWith("/uploads/banners")
                ? `${(import.meta.env.VITE_API_URL as string).replace("/api/v1", "")}${bannerImageSrc}`
                : bannerImageSrc
            }
            alt="Banner"
            className={`w-full h-full object-cover p-1 border-2 border-dashed ${GetTheme(formData.theme)} rounded-lg cursor-pointer hover:opacity-90 duration-250`}
            onClick={() => handleOpenModal("banner")}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center border-2 border-dashed ${GetTheme(formData.theme)} rounded-lg`}
          >
            <span className="text-white text-xl"></span>
          </div>
        )}
        <div className="bg-[#06080E] rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-30 h-30">
          {profileImageSrc ? (
            <img
              src={
                profileImageSrc.startsWith("/uploads/profiles")
                  ? `${(import.meta.env.VITE_API_URL as string).replace("/api/v1", "")}${profileImageSrc}`
                  : profileImageSrc
              }
              alt="Profile"
              className={`w-full h-full object-cover p-1 border-2 border-dashed ${GetTheme(formData.theme)} rounded-full cursor-pointer hover:opacity-90 duration-250`}
              onClick={() => handleOpenModal("profile")}
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center bg-[#06080E] border-2 border-dashed ${GetTheme(formData.theme)} rounded-full`}
            >
              <span className="text-white"></span>
            </div>
          )}
        </div>
        {formData.status && (
          <div className="max-w-xs text-white py-1 px-2 ml-12 left-2/4 absolute -bottom-17 rounded-3xl border border-gray-400">
            <p className="whitespace-pre-wrap text-sm">{formData.status}</p>
          </div>
        )}
      </div>
      <div className="w-full p-4 transform duration-200">
        <div className="mt-12 grid grid-cols-2">
          <div className="">
            <h1 className="text-xl font-bold text-white">
              {formData.name || "name"}
            </h1>
            <p className="font-semibold text-sm text-gray-400">
              @{formData.username || "username"} •{" "}
              {formData.gender || "ไม่ระบุ"}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            {socialLinks
              .filter(({ url }) => url)
              .map(({ key, url, icon }) => (
                <a
                  key={key}
                  href={formatUrl(url!)}
                  className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] rounded-xl flex items-center justify-center text-white hover:scale-115 duration-250"
                >
                  {icon}
                </a>
              ))}
          </div>
        </div>
        <div className="mt-4 p-2 border-2 border-gray-400/50 rounded-lg">
          <label className="text-gray-400 font-semibold">เกี่ยวกับฉัน</label>
          {formData.about && formData.about.length > 50 ? (
            <p className="text-md text-white whitespace-pre-line">
              {formData.about.substring(0, 350)}...
              <span
                className="text-gray-400 ml-1 cursor-pointer duration-200 hover:opacity-80"
                onClick={() => handleOpenModal("about")}
              >
                อ่านเพิ่มเติม
              </span>
            </p>
          ) : (
            <p className="text-md text-white whitespace-pre-line">
              {formData.about || "อยากนอนอ้วน"}
            </p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-2 border-2 border-gray-400/50 rounded-lg">
            <label className="text-gray-400 font-semibold">
              เกิดมาบนโลกในวันที่
            </label>
            <p className="text-lg text-white whitespace-pre-line">
              {formData.birthdate
                ? `${formatDate(formData.birthdate)}`
                : "ไม่บอกหรอก"}
            </p>
          </div>
          <div className="p-2 border-2 border-gray-400/50 rounded-lg">
            <label className="text-gray-400 font-semibold">อายุ</label>
            <p className="text-lg text-white whitespace-pre-line">
              {formData.birthdate
                ? `${calculateAge(formData.birthdate)} ปี`
                : "ไม่บอกหรอก"}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Swiper
            spaceBetween={10} // ระยะห่างระหว่างแต่ละสไลด์
            slidesPerView="auto" // เลือกจำนวนสไลด์ที่แสดงในแต่ละครั้ง (สามารถเปลี่ยนเป็นตัวเลขเพื่อให้แสดงหลายๆ อันในครั้งเดียว)
            freeMode={true} // เปิดโหมดฟรีเลื่อน (เลื่อนแบบไม่ต้องไปที่สไลด์ถัดไป)
            grabCursor={true} // ให้ตัวชี้เมาส์จับได้เวลาสไลด์
            className="duration-200 hover:scale-102 hover:opacity-85 transform"
          >
            {activities?.data.activities.map((activity, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  onClick={() => {
                    if (activity.name === "Spotify") {
                      window.open(
                        `https://open.spotify.com/track/${activities.data.spotify.track_id}`,
                        "_blank",
                      );
                    }
                  }}
                  className={`min-w-[250px] p-2 border-2 border-gray-400/50 rounded-lg ${activity.name === "Spotify" ? "cursor-pointer" : ""}`}
                  initial={{ opacity: 0, x: -100 }} // เริ่มจากตำแหน่งซ้าย
                  animate={{ opacity: 1, x: 0 }} // เลื่อนมาที่ตำแหน่งเดิม
                  transition={{ duration: 1, delay: 0.3 }} // ใช้เวลา 1 วินาทีในการเลื่อน
                >
                  <label className="text-gray-400 font-semibold">
                    {activity.name === "Spotify"
                      ? `กำลังฟังเพลง • ${activity.name}`
                      : `กำลังเล่น • ${activity.name}`}
                  </label>
                  <div className="flex gap-4">
                    <div className="w-[90px] h-[90px] rounded-lg overflow-hidden">
                      <img
                        src={
                          activity.name === "Spotify"
                            ? activities.data.spotify.album_art_url
                            : findAppImage(activity)
                        }
                        alt="Song"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-lg text-white whitespace-pre-line font-bold">
                        {activity.name === "Spotify"
                          ? activities.data.spotify.song
                          : activity.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {activity.name === "Spotify"
                          ? activities.data.spotify.artist
                          : activity.details}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <Modal centered open={open} onCancel={handleCloseModal} footer={null}>
        {openType === "profile" ? (
          <div className="flex flex-col items-center justify-center">
            <img
              src={
                formData.profile_image_url
                  ? typeof formData.profile_image_url === "string"
                    ? formData.profile_image_url.startsWith("/uploads/profiles")
                      ? `${(import.meta.env.VITE_API_URL as string).replace("/api/v1", "")}${formData.profile_image_url}`
                      : formData.profile_image_url
                    : URL.createObjectURL(formData.profile_image_url)
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-80 h-80 object-cover rounded-full"
            />
          </div>
        ) : openType === "banner" ? (
          <div className="flex flex-col items-center justify-center">
            <img
              src={
                formData.banner_image_url
                  ? typeof formData.banner_image_url === "string"
                    ? formData.banner_image_url.startsWith("/uploads/banners")
                      ? `${(import.meta.env.VITE_API_URL as string).replace("/api/v1", "")}${formData.banner_image_url}`
                      : formData.banner_image_url
                    : URL.createObjectURL(formData.banner_image_url)
                  : "https://via.placeholder.com/150"
              }
              alt="Banner"
              className="w-full h-80 object-cover rounded-lg"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-lg">
            <p className="text-md text-white whitespace-pre-line">
              {formData.about || "อยากนอนอ้วน"}
            </p>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

export default CardProfile;
