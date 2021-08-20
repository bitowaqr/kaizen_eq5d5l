

// ds = descriptive system (object)

const ds = {

    // Domains
    domains: {
        "Mobility": [
            "I have no problems in walking about",
            "I have slight problems in walking about",
            "I have moderate problems in walking about",
            "I have severe problems in walking about",
            "I am unable to walk about"
        ],
        "Self-Care": [
            "I have no problems washing or dressing myself",
             "I have slight problems washing or dressing myself",
             "I have moderate problems washing or dressing myself",
             "I have severe problems washing or dressing myself",
            "I am unable to wash or dress myself"
        ],
        "Usual Activities": [
            "No problems with usual activities",
            "Slight problems with usual activities",
            "Moderate problems with usual activities",
            "Severe problems with usual activities",
            "Extreme problems with usual activities"
        ],
        "Pain/Discomfort": [
            "I have no pain or discomfort",
            "I have slight pain or discomfort",
            "I have moderate pain or discomfort",
            "I have severe pain or discomfort",
            "I have extreme pain or discomfort"

        ],
        "Anxiety/Depression": [
            "I am not anxious or depressed",
            "I am slightly anxious or depressed",
            "I am moderately anxious or depressed",
            "I am severely anxious or depressed",
            "I am extremely anxious or depressed"
        ]
    },

    lvlCols: ["lightgray","#EFEDF5","#BCBDDC","#9E9AC8","#807DBA","#6A51A3"],

    // Methods

    // return number of dims
    getLength: function () {
        return(Object.keys(this.domains).length)
    },

    // return levle string of given dim
    getDimLvl: function (i = 0, j = 0) {
        let dim_names = Object.keys(this.domains);
        let dim_lvl = this.domains[dim_names[i]];
        j = j < 0 ? 0 : j;

        j_adj = j >= dim_lvl.length-1 ? dim_lvl.length-1 : j;
        let res = dim_lvl[j_adj]
        return res
    },

    // return max lvl of dims (init creator)
    getDimLvlMax: function () {
        max_lvl = []
        Object.values(this.domains).forEach(val => {
            max_lvl.push(val.length-1)
        });

        return max_lvl;
    },

    // choices
    choice: [],
    
    registerChoice: function (val) {
        this.choice.push(val)
        // if (this.choice.length == 4) {
        if (this.choice.length == this.getDimLvlMax().reduce((a, b) => a + b, 0)) {
            
            let task_container = document.querySelector("#kaizen_task")
            task_container.style.display = "none"
            
            let completion_msg = document.querySelector("#completion_msg")
            completion_msg.style.display = "block"


            let print_res = document.querySelector("#print_res")

            res = [];
            for (let index = 0; index < this.choice.length; index++) {
                var step = Object.keys(ds.domains)[this.choice[index]-1];
                res.push(step);
            }
            
             dead_states_n = 0;
            this.dead_choices.forEach(element => {
                dead_states_n++;
            });


             print_res.innerHTML = "<hr><h2>Your path was:</h2>" + res.join(", ") +
                 "<br><hr> <h2>At which choice set became the state better than dead?</h2>" +
                 dead_states_n
            
            
        
            // container.style.display = "none";
            // alert("All done - thanks for participating!" + "\n\n Your choices:\n"  + this.choice)
        }
    },
    getChoices: function () {
        return this.choice
    },

    dead_choices: [],
    ongoing: true,
    registerDeadChoice: function (val) {
        this.dead_choices.push(val)
        if (val == 0) {
            this.ongoing = false
        } 
    },

    getDeadChoices: function () {
        return this.dead_choices
    }


}




// at page load, enter ds levels

// initial state A


window.addEventListener('DOMContentLoaded', () => {

    var A = ds.getDimLvlMax()

    // initial state A
    for (let i = 0; i < ds.getLength(); i++) {
        index = i + 1;
        let div = document.querySelector("#A"+index)
        div.innerHTML = ds.getDimLvl(i, A[i])
        div.style.backgroundColor = ds.lvlCols[A[i] + 1];
    }

    for (let i = 0; i < ds.getLength(); i++) {
        index = i + 1;
        let div = document.querySelector("#B"+index)
        div.innerHTML = ds.getDimLvl(i, A[i]-1)
        div.style.backgroundColor = ds.lvlCols[A[i]];
        div.setAttribute('data-dim', i);
        div.setAttribute('data-lvl', A[i] - 1);
        div.addEventListener("click", stateUpdate)
    }


    var better = document.querySelector("#better")
    better.addEventListener("click", deadUpdate)

    var worse = document.querySelector("#worse")
    worse.addEventListener("click", deadUpdate)


    var stateB = document.querySelector('#stateB');
    var dead_comparison = document.querySelector('#dead_comparison');
    var state_head = document.querySelector('#state_head');
    var dead_head = document.querySelector('#dead_head');
    // initial state B
});






function addFadeAnimation(to, dur, appear = true) {

    to.animate([
        {
            opacity: appear ? '0' : '1',
            // fontSize: appear ? '98%' : '102%',
            fontSize: appear ? '' : '18px',
            'color': appear ? 'black' : 'white'
        },
        {
            opacity: appear ? '1' : '0',
            fontSize: appear ? '' : '',
            'color': appear ? 'black' : 'white'
        }
    ],{
        duration: dur,
        iterations: 1
    })
    
}





function toggle(stateB, dead_comparison, ongoing) {

    if (stateB.style.display == "block" && ds.ongoing) {
        // toggle select improvement
        stateB.style.display = "none"
        dead_comparison.style.display = "block"
        state_head.style.display = "none"
        dead_head.style.display = "block"

        if (ds.dead_choices.length == 1) {
            let modal_note = document.querySelector("#note_the_difference")
            modal_note.style.display = "flex"
        }

    } else {
        // toggle select better or worse than dead
        stateB.style.display = "block"
        dead_comparison.style.display = "none"
        state_head.style.display = "block"
        dead_head.style.display = "none"
    }
    
}


function deadUpdate(event, set_dur = 700) {


    if (event.target == worse) {
        ds.registerDeadChoice(parseInt(1))
        addFadeAnimation(to = worse, dur = set_dur / 2, appear = false)
        
        Promise.all(
            worse.getAnimations().map(
                function (animation) {
                    return animation.finished
                }
            )
        ).then(
            () => {
                toggle(stateB, dead_comparison, ds.ongoing)
            }
        )


    } else {
        ds.registerDeadChoice(parseInt(0))
        addFadeAnimation(to = better, dur = set_dur / 2, appear = false)
        
        Promise.all(
            better.getAnimations().map(
                function (animation) {
                    return animation.finished
                }
            )
        ).then(
            () => {
                toggle(stateB, dead_comparison, ds.ongoing)
            }
        )
    }
}


// onClick function to update state table
function stateUpdate(event, set_dur = 700) {

    // get id of clicked element
    const el = event.target;
    const id = el.id.split("");

    // break if element doesnt have id yet
    if (Object.keys(id).length < 2) {
        return
    }

    // rm clickability
    el.removeEventListener('click', stateUpdate);
    el.classList.remove("clickable");

    // update state A
    update_A = document.querySelector("#A" + id[1]);

    // retrieve selected improvement
    let dim = parseInt(el.getAttribute('data-dim'));
    let lvl = parseInt(el.getAttribute('data-lvl'));
    
    // animate change in State A
    addFadeAnimation(to = update_A, dur = set_dur/2, appear = false)
    
    // animate click on improvement in state B
    if (lvl > 0) {
        addFadeAnimation(to = el, dur = set_dur / 2, appear = false)
    }
    
    // wait for animation
    Promise.all(
        update_A.getAnimations().map(
            function (animation) {
                return animation.finished
            }
        )
    ).then(
        () => {

            // let imrpvoement appear in state A
            addFadeAnimation(update_A, dur = set_dur/2, appear = true);
            update_A.innerHTML = ds.getDimLvl(dim, lvl);
            update_A.style.backgroundColor = ds.lvlCols[lvl+1];

            // let next possible improvement appear in State B
            let new_lvl = ds.getDimLvl(dim, lvl - 1);
            el.innerHTML = new_lvl
            el.style.backgroundColor = ds.lvlCols[lvl];

            // re-enable functionality of state B after animation
            if (lvl > 0) {
                addFadeAnimation(to = el, dur = set_dur / 2, appear = true)
                el.setAttribute('data-lvl', lvl - 1);
                el.classList.add("clickable");
                el.addEventListener("click", stateUpdate);
            } else {
                el.classList.add("unavailable")
            };

            ds.registerChoice(parseInt(id[1]))
            // console.log(ds.getChoices())
        }
    ).catch(error => {
        console.error(error.message)
      });


    // if best level is reached, rm clickable and listener

    Promise.all(
        update_A.getAnimations().map(
            function (animation) {
                return animation.finished
            }
        )
    ).then(
        () => {
            if (typeof stateB !== 'undefined') {
                toggle(stateB, dead_comparison, ds.ongoing)
            }
        }
    )

}




// other site utilities

function closeInfo() {
    info = document.querySelector(".info")
    info.style.display = "none"
    o = document.querySelector(".o")
    o.style.display = "block"
}
function openInfo() {
    o = document.querySelector(".o")
    o.style.display = "none"
    info = document.querySelector(".info")
    info.style.display = "block"
    
}

function rmModal() {
    modal_note = document.querySelector("#note_the_difference")
    modal_note.remove();
}
