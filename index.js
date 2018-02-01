"use strict";



const hmtl = [
    `<div id="div01" class="class01 class02">`,
        `<section id="mainSection" class="main-sec">`,
            `<label for="nameInput">Name: </label>`,
            `<input id="nameInput" type="text" placeholder="Your name here">`,
        `</section>`,
        `<section id="listSection" class="list-sec">`,
            `<ul class="my-list">`,
                `<li>Text01</li>`,
                `<li>Text02</li>`,
                `<li>Text03</li>`,
            `</ul>`,
        `</section>`,
    `</div>`
];


/**
 * @summary Receives an array of 
 * @param {Array.<string>} html 
 */
function htmlparser(html) {
    /*****************************************************
     *                  AXIOMS
     * 1. Each attribute has an equal "=" sign
     * 2. The value of each attribute is between quotes "" and has
     * 
     *****************************************************/
    const tagReg = /<\w+/;
    html.forEach(el => {
        const elem = document.createElement(el.match(tagReg));
    });
}