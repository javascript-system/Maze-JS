document.addEventListener("DOMContentLoaded", () => {
    const btnPlay = document.getElementById("btn_play");
    const btnPlayTp = document.getElementById("btn_play_tp");
    const btnDoc = document.getElementById("btn-doc");
    const btnCrdts = document.getElementById("btn_credits");
    const navigate = (target) => {
        window.location.href = `./${target}`;
    };

    btnPlay.addEventListener("click", () => navigate("game/play.html"));
    btnPlayTp.addEventListener("click", (e) => {
        e.preventDefault();
        navigate("game/play.html");
    });
    
    btnDoc.addEventListener("click", (e) => {
        e.preventDefault();
        navigate("pages/documentation/index.html");
    });

    btnCrdts.addEventListener("click", (e) => {
        e.preventDefault();
        navigate("pages/credits/index.html");
    });
});