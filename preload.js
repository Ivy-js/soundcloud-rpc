/* ******************************************************************************************************* */
/*                                                                                                         */
/*                                                              :::::::::::    :::     :::    :::   :::    */
/*   preload.js                                                 :+:        :+:     :+:    :+:   :+:        */
/*                                                             +:+        +:+     +:+     +:+ +:+          */
/*   By: Ivy <contact@1sheol.xyz>                             +#+        +#+     +:+      +#++:            */
/*                                                           +#+         +#+   +#+        +#+              */
/*   Created: 2024/11/09 17:21:53 by Ivy                    #+#         #+#+#+#         #+#                */
/*   Updated: 2024/12/09 21:07:00 by Ivy              ###########        ###           ###                 */
/*                                                                                                         */
/* ******************************************************************************************************* */

const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    setInterval(() => {
        const titleElement = document.querySelector('.playbackSoundBadge__titleLink'); 
        const artistElement = document.querySelector('.playbackSoundBadge__lightLink'); 
        const coverElement = document.querySelector('.playControls__soundBadge .image__full'); 
        const trackLinkElement = document.querySelector('.playControls__soundBadge a'); 

        if (titleElement && artistElement && coverElement && trackLinkElement) {
            const title = titleElement.textContent.trim();
            const artist = artistElement.textContent.trim();
            const cover = coverElement.style.backgroundImage
                .replace('url("', '')
                .replace('")', '');
            const trackLink = trackLinkElement.href; 

            ipcRenderer.send('update-rpc', { title, artist, cover, trackLink });
        } else {
            console.warn('Un ou plusieurs éléments manquent dans le DOM');
        }
    }, 1000); 
});
