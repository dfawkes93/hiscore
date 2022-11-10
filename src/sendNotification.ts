const NTFY_BASE = "https://ntfy.sh/";
const NTFY_TOPIC = "21cs_hi_test";

const sendNotification = (player: string, game: string, score: number) =>
    fetch(NTFY_BASE + NTFY_TOPIC, {
        method: "POST",
        headers: {
            Title: `New hiscore entered on ${game}`,
            Action: "view, Check it out, https://hiscore.eggy.moe/",
        },
        body: `🕹️ ${player} got ${score} on ${game}. 🕹️`,
    });

export default sendNotification;
