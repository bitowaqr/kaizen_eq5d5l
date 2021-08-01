


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

    lvlCols: ["#6A51A3","#807DBA","#9E9AC8","#BCBDDC","#EFEDF5", "lightgray"],

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

        if (this.choice.length == this.getDimLvlMax().reduce((a, b) => a + b, 0)) {
            alert("Yipee - all done!" + "\n\n Your choices:\n"  + this.choice)
        }

    },
    getChoices: function () {
        return this.choice
    }

}


// Collect user clicks
const res = {
    choices: [],
    registerChoice: function (val) {
        this.choice.push(val)
    },
    getChoices: function () {
        return this.choice
    }
}



// FADE ANIMATION
// add animation to clicked elemtn, either fade in our out
function addFadeAnimation(to, dur, appear = true) {

    to.animate([
        {
            opacity: appear ? '0' : '1',
            // fontSize: appear ? '98%' : '102%',
            transform: appear ? '' : 'scale(0.95, 0.95)',
            'color': appear ? 'white' : 'white'
        },
        {
            opacity: appear ? '1' : '0',
            'color': appear ? 'black' : 'white'
        }
    ],{
        duration: dur,
        iterations: 1
    })

}




// on click on child call parent
function callParent(event) {
        event.target.parentElement.click()
}




// onClick function to update state table
function stateUpdate(event, set_dur = 500) {

    // get id of clicked element
    const el = event.target;
    const id = el.id.split("_");

    // break if element doesnt have id yet
    if (Object.keys(id).length < 2) {
        return
    }

    // get parent and rm clickability
    el.removeEventListener('click', stateUpdate);
    el.firstChild.removeEventListener('click', stateUpdate);
    el.classList.remove("clickable");

    // update state A
    update_A = document.querySelector("#A" + id[1]);

    let dim = parseInt(el.firstChild.getAttribute('data-dim'));
    let lvl = parseInt(el.firstChild.getAttribute('data-lvl'));

    if (lvl > 0) {
        addFadeAnimation(to = el.firstChild, dur = set_dur / 2, appear = false)
    }


    addFadeAnimation(to = update_A.firstChild, dur = set_dur/2, appear = false)

    Promise.all(
        update_A.firstChild.getAnimations().map(
            function (animation) {
                return animation.finished
            }
        )
    ).then(
        () => {

            // let new A state appear
            // blink(update_A)
            addFadeAnimation(update_A.firstChild, dur = set_dur/2, appear = true);
            update_A.firstChild.innerHTML = ds.getDimLvl(dim, lvl);
            update_A.style.backgroundColor = ds.lvlCols[4-lvl];



            // let new B State level appear
            let new_lvl = ds.getDimLvl(dim, lvl - 1);
            el.firstChild.innerHTML = new_lvl
            el.style.backgroundColor = ds.lvlCols[4-lvl+1];

            if (lvl > 0) {
                addFadeAnimation(to = el.firstChild, dur = set_dur / 2, appear = true)
                el.firstChild.setAttribute('data-lvl', lvl - 1);
            }
            // if this is max lvl, do not re-enable click listener
            if (lvl > 0) {
                // needs to be redefined for some reason
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

    





}

// initial table state
var A = ds.getDimLvlMax()

window.addEventListener('DOMContentLoaded', () => {

    // Table INIT
    const main_table = document.querySelector("#main_table")


    for (let i = 0; i < ds.getLength(); i++) {

        var div = document.createElement("div")
        div.className = 't_row';

        // state A
        let cell_A = document.createElement("div");
        cell_A.className = 'cell_inner';
        let out_A = document.createElement("div");
        out_A.id = "A" + i;
        cell_A.innerHTML = ds.getDimLvl(i, A[i])
        out_A.className = 'cell_a';
        out_A.style.backgroundColor = ds.lvlCols[0];


        // state B
        let out_B = document.createElement("div");
        let cell_B = document.createElement("div");
        out_B.id = "B_" + i;
        cell_B.className = 'cell_inner';
        out_B.className = 'cell_a  clickable';
        out_B.style.backgroundColor = ds.lvlCols[1];
        cell_B.innerHTML = ds.getDimLvl(i, A[i]-1)
        cell_B.setAttribute('data-dim', i);
        cell_B.setAttribute('data-lvl', A[i] - 1);

        // this seems to be a stupid solution...
        // but otherwise parent doesnt register click on child?
        cell_B.addEventListener("click", callParent)
        out_B.append(cell_B);
        out_B.addEventListener("click", stateUpdate)



        // some styling
        out_A.style.borderLeft = "solid 1px"
        out_A.style.borderRight = "solid 1px"

        out_B.style.borderLeft = "solid 1px"
        out_B.style.borderRight = "solid 1px"



        if (i == 0) {
            out_A.style.borderTopRightRadius =
            out_A.style.borderTopLeftRadius =
            out_B.style.borderTopRightRadius =
            out_B.style.borderTopLeftRadius = "10px"

            out_A.style.borderTop = "solid 1px"
            out_B.style.borderTop = "solid 1px"
        }
        if (i == ds.getLength() - 1) {

            out_A.style.borderBottomRightRadius =
            out_A.style.borderBottomLeftRadius =
            out_B.style.borderBottomRightRadius =
            out_B.style.borderBottomLeftRadius = "10px"

            out_A.style.borderBottom = "solid 1px"
            out_B.style.borderBottom = "solid 1px"
        }


        // Table UPDATE
        out_A.append(cell_A);
        div.append(out_A);

        div.append(out_B);
        main_table.append(div)

    }

});