const main = document.querySelector(".main");
const title = document.querySelector(".skill-title");
const contain = document.querySelector(".grid-container");
const mid = document.querySelectorAll(".middle");
const road = document.querySelector(".road");
const listContainers = document.querySelectorAll(".lists");


let roadmapData = {};
let skill = {};
let name = "mongoDB";


async function loadData(key) {
    try {
        const response = await fetch('./data.json');
        roadmapData = await response.json();
        skill = roadmapData[key]; // Now it's assigned to global `skill`
        console.log(skill); // Works
        useSkillData();     // You can now use it elsewhere
        addEle();
        generateHTML();
        enableGridToggle();

        setTimeout(() => {
            toggleListsOnly();
            updateRoadHeight();
        }, 0);
    } catch (error) {
        console.error('Error:', error);
    }
}

function useSkillData() {
    console.log("Accessing from another function:", skill.levels.length);
    console.log(skill.levels[1].title);
    title.innerText = skill.title;
}

const addEle = () => {

    for (let i = 1; i <= skill.levels.length; i++) {
        let ele = document.createElement("div");
        ele.classList.add("grid-line");
        contain.appendChild(ele);
    }

    const gridLines = document.querySelectorAll(".grid-line");

    gridLines.forEach((gridLine) => {
        for (i = 1; i <= 3; i++) {
            let div = document.createElement("div");
            div.classList.add("grid-item");
            if (i === 1) {
                div.classList.add("left");
            } else if (i === 2) {
                div.classList.add("middle");
            } else {
                div.classList.add("right");
            }
            gridLine.appendChild(div);
        }
    })

    const left = document.querySelectorAll(".left");
    const right = document.querySelectorAll(".right");
    gridLines.forEach((gridLine, index) => {
        if (index % 2 === 0) {
            right[index].innerHTML = `<h2>${skill.levels[index].title}</h2>`;
            right[index].classList.add("yes");
        } else {
            left[index].innerHTML = `<h2>${skill.levels[index].title}</h2>`;
            left[index].classList.add("yes");
        }
    })

    const mids = document.querySelectorAll(".middle");

    mids.forEach((mid, index) => {
        mid.innerHTML = `<h1 class="click">${index + 1}</h1>`
    })



}
function updateRoadHeight() {
    setTimeout(() => {
        const height = contain.offsetHeight;
        main.style.height = `${height + 70}px`;
        road.style.height = `${height + 70}px`;
        console.log(height);
        console.log("Updated height:", height); // For debugging
    }, 300); // try 300ms instead of 0
}


window.requestAnimationFrame(() => {
    setTimeout(() => {
        updateRoadHeight();
    }, 0);
});

// level.topics.forEach(topic => {
//     if (typeof topic === "string") {
//         const li = document.createElement('li');
//         li.textContent = topic;
//         ul.appendChild(li);
//     } else if (typeof topic === "object") {
//         for (let key in topic) {
//             const li = document.createElement('li');
//             li.innerHTML = `<strong>${key}</strong>`;
//             const subUl = document.createElement('ul');
//             topic[key].forEach(subTopic => {
//                 const subLi = document.createElement('li');
//                 subLi.textContent = subTopic;
//                 subUl.appendChild(subLi);
//             });
//             li.appendChild(subUl);
//             ul.appendChild(li);
//         }
//     }
// })

function generateHTML() {
    const containers = document.querySelectorAll(".yes");

    containers.forEach((container, index) => {
        const level = skill.levels[index];
        if (!level) return;

        const div = document.createElement('div');
        const box = document.createElement('div');
        box.classList.add('box');
        const ul = document.createElement('ul');

        level.topics.forEach(topic => {
            if (typeof topic === "string") {
                const li = document.createElement('li');
                li.classList.add('topic');

                const label = document.createElement('label');
                label.className = 'container';
                label.innerHTML = '<input type="checkbox"><div class="checkmark"></div>';

                const span = document.createElement('span');
                span.textContent = topic;

                li.appendChild(label);
                li.appendChild(span);

                ul.appendChild(li);
                ul.classList.add("lists");
            } else if (typeof topic === "object") {
                for (let key in topic) {
                    const li = document.createElement('li');
                    li.classList.add('long');
                    li.innerHTML = `<strong>${key}</strong>`;
                    const subUl = document.createElement('ul');

                    // Case 1: topic[key] is an array ✅
                    if (Array.isArray(topic[key])) {
                        topic[key].forEach(subTopic => {
                            const subLi = document.createElement('li');
                            subLi.classList.add('topic');

                            const label = document.createElement('label');
                            label.className = 'container';
                            label.innerHTML = '<input type="checkbox"><div class="checkmark"></div>';

                            const span = document.createElement('span');
                            span.textContent = subTopic;

                            subLi.appendChild(label);
                            subLi.appendChild(span);
                            subUl.appendChild(subLi);
                        });
                    }
                    // Case 2: topic[key] is an object ✅
                    else if (typeof topic[key] === "object") {
                        for (let subKey in topic[key]) {
                            const subSection = document.createElement('li');
                            subSection.innerHTML = `<strong>${subKey}</strong>`;
                            const subSubUl = document.createElement('ul');

                            topic[key][subKey].forEach(subTopic => {
                                const subLi = document.createElement('li');
                                subLi.classList.add('topic');

                                const label = document.createElement('label');
                                label.className = 'container';
                                label.innerHTML = '<input type="checkbox"><div class="checkmark"></div>';

                                const span = document.createElement('span');
                                span.textContent = subTopic;

                                subLi.appendChild(label);
                                subLi.appendChild(span);
                                subSubUl.appendChild(subLi);
                            });

                            subSection.appendChild(subSubUl);
                            subUl.appendChild(subSection);
                        }
                    }
                    // Case 3: Not an array or object
                    else {
                        const simpleLi = document.createElement('li');
                        simpleLi.textContent = topic[key];
                        subUl.appendChild(simpleLi);
                    }

                    li.appendChild(subUl);
                    ul.appendChild(li);
                    ul.classList.add("lists");
                }
            }


        });

        div.appendChild(ul);
        container.append(box);
        container.appendChild(div);
    });
}


function enableGridToggle() {
    const buttons = document.querySelectorAll('.click');
    const boxes = document.querySelectorAll(".box");
    const listContainers = document.querySelectorAll(".lists");

    buttons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const gridLine = button.closest('.grid-line');
            const list = gridLine.querySelector('.lists');

            if (list && boxes[index]) {
                // Toggle display
                list.style.display = getComputedStyle(list).display === 'none' ? 'block' : 'none';
                boxes[index].style.display = getComputedStyle(boxes[index]).display === 'none' ? 'block' : 'none';

                // Adjust height
                const sty = getComputedStyle(listContainers[index]);
                boxes[index].style.height = `${(parseInt(sty.height) * 1)}px`;

                console.log(index);
                updateRoadHeight();
            }
        });
    });
}

window.addEventListener('DOMContentLoaded', enableGridToggle);





loadData(name);


// const existingTopics = heading.querySelectorAll('.topic');


// if (existingTopics.length > 0) {
//     // Toggle OFF: remove previously appended topics
//     existingTopics.forEach(topic => topic.remove());
//     //   boxs.forEach((box)=>{
//     //     box.style.height="auto";
//     //     console.log(boxs[index])
//     //     box.classList.add('display');
//     //   })
//     boxs[index].style.height = "auto";
//     boxs[index].classList.add('display');

//     const stl = getComputedStyle(gridContainer);
//     console.log(stl.height);

//     road.style.height = `1220px`;

// } else {
//     // Toggle ON: append topics
//     const stage = data.uiux.stages[index].topics;
//     for (let i = 0; i < stage.length; i++) {
//         const topic = document.createElement('p');
//         topic.setAttribute("data-progress", `${Math.round((100 / stage.length) * (i + 1))}`);
//         let tick = `<label class="container"><input type="checkbox"><div class="checkmark"></div></label>`;
//         topic.innerHTML = `<div class="ticking" data-label="${stage[i]}">${tick}</div>`;
//         topic.classList.add('topic'); // Add a class to track
//         heading.appendChild(topic);
//         // boxs.forEach((box)=>{
//         boxs[index].classList.remove('display');
//         // Adjust height dynamically
//         const sty = getComputedStyle(heading);
//         console.log(`${(parseInt(sty.height) * 0.65)}px`);
//         boxs[index].style.height = `${(parseInt(sty.height) * 0.80)}px`;
//         //   })
//     }
// }