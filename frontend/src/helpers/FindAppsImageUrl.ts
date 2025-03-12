import { DiscordActivity } from "../types/discordStatus";

const findAppImage = (activity: DiscordActivity) => {
    if (activity.name.startsWith("Arena Breakout")) {
        return "https://cdn.discordapp.com/app-icons/1238113262969557002/0785baa7c08a9001079c329eb084b0ae.webp?size=160"
    } else if (activity.name.startsWith("VALORANT")) {
        return "https://cdn.discordapp.com/app-icons/700136079562375258/e55fc8259df1548328f977d302779ab7.webp?size=160"
    } else if (activity.name.startsWith("Terraria")) {
        return "https://cdn.discordapp.com/app-icons/356943499456937984/4c3c185abc0dfb4cb1ec5612de4d7366.webp?size=160"
    } else if (activity.name.startsWith("Overwatch")) {
        return "https://cdn.discordapp.com/app-icons/356875221078245376/d20f9f39f2eec584dcdbc7b206786124.webp?size=160&keep_aspect_ratio=false"
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