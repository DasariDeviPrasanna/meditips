import { translations } from "./translations.js";

export function translatePage() {

    const language =
        localStorage.getItem("language") || "en";

    document.querySelectorAll("[data-i18n]")

        .forEach(element => {

            const key =
                element.dataset.i18n;

            if (
                translations[language] &&
                translations[language][key]
            ) {

                element.textContent =
                    translations[language][key];

            }

        });

}