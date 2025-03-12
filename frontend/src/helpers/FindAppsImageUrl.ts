import { DiscordActivity } from "../types/discordStatus";

const findAppImage = (activity: DiscordActivity) => {
    if (activity.name.startsWith("Arena Breakout")) {
        return "https://cdn.discordapp.com/app-icons/1238113262969557002/0785baa7c08a9001079c329eb084b0ae.webp?size=160"
    } else if (activity.name.startsWith("VALORANT")) {
        return "https://cdn.discordapp.com/app-icons/700136079562375258/e55fc8259df1548328f977d302779ab7.webp?size=160"
    } else if (activity.name.startsWith("Terraria")) {
        return "https://cdn.discordapp.com/app-icons/356943499456937984/4c3c185abc0dfb4cb1ec5612de4d7366.webp?size=160"
    } else if (activity.name.startsWith("Overwatch")) {
        return "https://cdn.discordapp.com/app-icons/356875221078245376/d20f9f39f2eec584dcdbc7b206786124.webp?size=160"
    } else if (activity.name.startsWith("Genshin Impact")) {
        return "https://cdn.discordapp.com/app-assets/1261185993000747150/1269863139680194681.png?size=160"
    } else if (activity.name.startsWith("Honkai: Star Rail")) {
        return "https://cdn.discordapp.com/app-icons/1121201675240210523/444d067889922e42b0af99b13e5d5c72.webp?size=160"
    } else if (activity.name.startsWith("Grand Theft Auto V")) {
        return "https://cdn.discordapp.com/app-icons/356876176465199104/4628d9240d9f3fb68f98d55352fef553.webp?size=160"
    } else if (activity.name.startsWith("League of Legends") && activity?.application_id && activity?.application_id == "401518684763586560") {
        return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png?size=160`
    } else if (activity.name.startsWith("Visual Studio Code") && activity?.application_id && activity?.application_id == "383226320970055681") {
        return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png?size=160`
    }

    if (!activity.assets) {
        return ""
    }

    if (activity.assets.large_image.startsWith("mp:external/")) {
        return `https://media.discordapp.net/external/${activity.assets.large_image.replace("mp:external/", "")}`
    } else {
        return ""
    }

}

export default findAppImage