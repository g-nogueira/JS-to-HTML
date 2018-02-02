"use strict";

//count = 0;
const html = 
    `<div id="div01" class="class01 class02">
    <section id="mainSection" class="main-sec">
    <div id="div">
    <label for="nameInput">Name: </label>
    <input id="nameInput" type="text" placeholder="Your name here">
    </div>
    </section>
    <section id="listSection" class="list-sec">
    <ul class="my-list">
    <li>Text01</li>
    <li>Text02</li>
    <li>Text03</li>
    </ul>
    </section>
    </div>`
;

// const div = document.createElement('div');
// div.innerHTML = html;
// htmlparser(html);

/**
 * @summary Receives an array of 
 * @param {Array.<string>} html 
 */

function htmlparser(html) {
    let tempParent = {};
    // let nodes = html.map(el => new Object({el:el}));
    let nodes = html.slice();


    childNodesRecursion(nodes)
    function childNodesRecursion(list) {

        for (let i = 0; i < list.length; i++) {

            if (getChildNodes(list, i).length > 0) {
                list[i] = {
                    el: list[i],
                    children: getChildNodes(list, i)
                };
                list.splice(i + 1, list[i].children.length + 1);

                /** Init Recursion: going down recursion tree **
                 * 
                 * htmlparser(list[i].children)👇
                 * htmlparser(list[i].children.children)👇
                 * htmlparser(list[i].children.children.children)👇
                 * htmlparser(list[i].children.children.children.children)👇
                 * ... And so on ...
                 */
                childNodesRecursion(list[i].children);

                /** After Recursion: going up recursion tree **
                 * 
                 * htmlparser(list[i].children)👆
                 * htmlparser(list[i].children.children)👆
                 * htmlparser(list[i].children.children.children)👆
                 * htmlparser(list[i].children.children.children.children)👆
                 */
                list[i].el = (() => {
                    let elem = describeElementString(list[i].el);
                    const tag = document.createElement(elem.tag);
                    elem.attributes.forEach(attr => tag.setAttribute(attr.name, attr.value));
                    return tag;
                })();
                list[i].children.forEach((el, z) => {
                    let elem = {};
                    if (typeof el === 'string') {
                        elem = describeElementString(el);
                        const tag = document.createElement(elem.tag);
                        elem.attributes.forEach(attr => tag.setAttribute(attr.name, attr.value));
                        // let elem = describeElementString(typeof el === 'string' ? el : el.el);
                        list[i].el.appendChild(tag);
                    } else list[i].el.appendChild(el.el);
                });
                delete list[i].children;
            }
        }
    }

    const testing = document.getElementById('li01');
    describeElementString(html[9]);
    describeElementString(html[8]);
}

function describeElementString(string) {
    const tagRegex = /[^</]\w+/;
    const attributesRegex = {
        allAttributes: /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g,
        attribName: /(\S+)(?==["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?)/g,
        attribValue: /["']{1}((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']{1}/g
    };
    const element = {
        tag: string.match(tagRegex)[0],
        attributes: (string.match(attributesRegex.allAttributes) ? string.match(attributesRegex.allAttributes) : []).map(el => {
            return {
                name: el.match(attributesRegex.attribName)[0],
                value: el.match(attributesRegex.attribValue)[0].match(/(\w+\s?)+/g)[0]
            };
        })
    };

    return element;
}

function closeTagIndex(nodes, nodeIndex) {
    const node = describeElementString(nodes[nodeIndex]);
    const sameTag = new RegExp(`<${node.tag}`, 'g');
    const closingTag = new RegExp(`</${node.tag}`, 'g');
    let tagCount = 0, closeTagIndex = 0;


    for (let z = nodeIndex + 1; z < nodes.length; z++) {
        tagCount = sameTag.exec(nodes[z]) ? tagCount + 1 : tagCount;
        const isClosing = (new RegExp(`</${node.tag}`, 'g')).exec(nodes[z]);
        if (isClosing && tagCount == 0) {
            return z;
        }
        tagCount = ((new RegExp(`</${node.tag}`, 'g')).exec(nodes[z]) && tagCount !== 0) ? tagCount - 1 : tagCount;
    }

    return [];
}

//It suposes that one node that has closing and opening tag in the same line does not have children
function getChildNodes(nodesList, parentNodeIndex) {
    const closeIndex = closeTagIndex(nodesList, parentNodeIndex);
    const node = describeElementString(nodesList[parentNodeIndex]);
    //It suposes that one node that has closing and opening tag in the same line does not have children
    if (((new RegExp(`<${node.tag}`, 'g')).test(nodesList[parentNodeIndex]) && (new RegExp(`</${node.tag}`, 'g')).test(nodesList[parentNodeIndex]))) {
        return [];
    }
    return nodesList.slice(parentNodeIndex + 1, closeIndex);
}